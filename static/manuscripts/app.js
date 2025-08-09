import '/global.js'
import "../libs/jquery.min.js"
import "../libs/dist/jstree.js"
import "../libs/quill.js"
import "../libs/select2.min.js"

var lastSelectedSceneID = ""
const urlParams = new URLSearchParams(window.location.search);
const JSTreeTypes = {
            "#": {
                "max_children": 1,
                "max_depth": 9,
                "valid_children": ["root"]
            },
            "root": {
                "icon": "fa-solid fa-book",
                "valid_children": ["default", "file"]
            },
            "default": {
                "valid_children": ["default", "file"]
            },
            "file": {
                "icon": "fa-solid fa-file",
                "valid_children": []
            }
        }
const JSTreePlugins = [
    "contextmenu", "dnd", "search",
    "types", "wholerow", "unique"
]
        

const QuillTextFormat = Quill.import('formats/bold');
const customIcons = Quill.import('ui/icons');
customIcons['articleReference'] = '<i class="fa-solid fa-link" style="color: var(--text-color);"></i>';
class ArticleReferenceBlot extends QuillTextFormat {
    static blotName = 'articleReference';
    static tagName = 'a';
    static className = 'quill-article-reference';

    static create(value) {
        let node = super.create();
        node.classList.add('quill-button-link');
        node.value = value.text
        node.setAttribute(
            'onclick',
            `openArticleReference("${value.id}");return false`
        ); 
        node.setAttribute(
            'id',
            `${value.id}`
        ); 
        node.setAttribute(
            'type',
            `button`
        );
        return node;
    }

    static formats(node) {
        let content = {
            id: node.getAttribute('id'),
            text: node.innerText
        };

        return content
    }

}


function retrieveManuscriptTree() {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open("GET", `/api/getManuscriptTree?project=${encodeURIComponent(localStorage.getItem("CurrentProject"))}`);

        xhr.onload = function () {
            if (xhr.status === 200) {
                try {
                    const manuscriptData = JSON.parse(xhr.responseText);
                    resolve(manuscriptData);
                } catch (error) {
                    reject(new Error("Error parsing JSON response"));
                }
            } else {
                reject(new Error(`Error retrieving manuscript: ${xhr.status} - ${xhr.statusText}`));
            }
        };

        xhr.onerror = function (error) {
            reject(new Error(`Error sending request: ${error.message}`));
        };

        xhr.send();
    });
}

function saveManuscriptTree() {
    const xhr = new XMLHttpRequest();

    xhr.open("POST", "/api/setManuscriptTree");

    xhr.setRequestHeader("Content-Type", "application/json");

    const data = {
        project: localStorage.getItem("CurrentProject"),
        tree: $('#tree').jstree(true).get_json("#", {flat: true})
    };

    const jsonData = JSON.stringify(data);

    xhr.onload = function () {
        if (xhr.status === 200) {

        } else {
            console.error("Error saving manuscript: ", xhr.responseText);
        }
    };

    xhr.onerror = function (error) {
        console.error("Error sending request:", error);
    };

    xhr.send(jsonData);
}

function retrieveScene(sceneName) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", `/api/getScene?project=${encodeURIComponent(localStorage.getItem("CurrentProject"))}&uid=${encodeURIComponent(sceneName)}`, true);

        xhr.onload = () => {
            if (xhr.status === 200) {
                resolve(xhr.response);
            } else {
                reject(new Error(`Failed to retrieve scene: ${xhr.status}`));
            }
        };

        xhr.onerror = () => {
            reject(new Error("Network error occurred"));
        };

        xhr.send();
    });
}

function deleteScene(sceneName) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/deleteScene", true);

    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.log("Scene deleted successfully!");
            } else {
                console.error("Failed to delete scene:", xhr.responseText);
            }
        }
    };

    xhr.send(JSON.stringify({
        name: sceneName
    }));
}
const handleArticleReferences = async (value) => {
    let selectorPopup = $(".reference-inline-popup")
    let quill = document.quill;
    let range = quill.getSelection();
    if (!range.length) {
        return
    }
    selectorPopup.show()
    let val = await new Promise((resolve, reject) => {
        $(".reference-inline-popup button").one("click", (e) => {
            let element = $("#inline-reference")
            resolve({
                id: element.val(),
                text: element.select2('data')[0].text
            })
            $(".reference-inline-popup").hide()
            $(".reference-inline-popup button").off("click")
        })
    })

    if (val) {
        quill.formatText(range.index, range.length, 'articleReference', val);
        quill.setSelection(range.index + range.length);
        quill.format('articleReference', false);
        selectorPopup.hide()    
    }

}

function fetchReferenceables(type, callback) {
    const xhr = new XMLHttpRequest();
    const url =
        `/api/fetchReferenceables?project=${encodeURIComponent(localStorage.getItem("CurrentProject"))}&type=${encodeURIComponent(type)}`;

    xhr.open("GET", url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                let data
                try {
                    data = JSON.parse(xhr.responseText);
                } catch (parseErr) {
                    callback(xhr.status, null);
                    return
                }
                callback(xhr.status, data);
            } else {
                callback(xhr.status, null);
            }
        }
    };
    xhr.send();
}
window.openArticleReference = function (id){
    if(confirm("Are you sure you want to leave this article? Unsaved Changes will be lost!")){
        sessionStorage.setItem("Article", id);
        window.location.reload()
    }
}

fetchReferenceables("", (status, data) => {
    if (status == 200) {
        let element = $("#inline-reference")
        data.forEach(opt => {
            element.append(`
                <option value="${opt.uid}">${opt.text}</option>
                `)
        });
        element.select2()
    }

})

document.quill = new Quill('#text-editor', {
    theme: 'snow',
    modules: {
        toolbar: {
            container: [
                [{
                    'header': [1, 2, false]
                }],
                ['bold', 'italic', 'underline'],
                ["link", 'image'],
                [{
                    'list': 'ordered'
                }, {
                    'list': 'bullet'
                }],
                [
                    'articleReference'
                ]
            ],
            handlers: {
                link: function (value) {
                    if (value) {
                        var href = prompt('Name:');
                        if (!href.startsWith("manuscript:")) {
                            this.quill.format('link', `Articles/${href}`);
                        } else {
                            this.quill.format('link', `Manuscripts/${href}`);
                        }
                    } else {
                        this.quill.format('link', false);
                    }

                },
                articleReference: handleArticleReferences,

            }
        }
    },

});

retrieveManuscriptTree().then(x => {
    window.JSTreeState = x;
    $('#tree').jstree({
        "core": {
            "animation": 0,
            "check_callback": true,
            'themes': {
                'name': 'proton',
                'responsive': true
            },
            'data': window.JSTreeState
        },
        "types": JSTreeTypes,
        "plugins": JSTreePlugins
    }).on('select_node.jstree', function (e, data) {
        if (data.node.type == "file") {
            lastSelectedSceneID = data.node.data.uid;
            window.showToast("Loading scene", "info", 1000)


            document.quill.setContents(null)
            $("#synopsis-editor").val("")
            $("#notes-editor").val("")

            retrieveScene(lastSelectedSceneID).then(scene => {
                window.showToast("Loaded scene", "success", 1000)
                let sceneParsed = (JSON.parse(scene))

                document.quill.setContents(JSON.parse(sceneParsed["scene"]))
                $("#synopsis-editor").val(sceneParsed["synopsis"])
                $("#notes-editor").val(sceneParsed["notes"])
            })
        } else {
            return;
        }
    }).on("create_node.jstree", (e, data) => {
        data.node.data = {
            uid: window.uid()
        }
        lastSelectedSceneID = data.node.data.uid;
        saveScene(false)
    }).on("delete_node.jstree", (e, data) => {
        if (lastSelectedSceneID = data.node.data.uid) {
            deleteScene(data.node.data.uid)
            lastSelectedSceneID = ""
        }
    }).on('loaded.jstree', (e, data) => {
        if (urlParams.get("ref")) {
            $("#tree").jstree().deselect_all(true);
            selectNodeFromPath(urlParams.get("ref"))
        }
    });

})

function selectNodeFromPath(pathString) {
    var pathArray = (pathString).split('/');
    pathArray.unshift("Root")

    var currentNodeId = '#';

    for (var i = 0; i < pathArray.length; i++) {
        var childNodes = $('#tree').jstree('get_children_dom', currentNodeId);

        var matchingChildNode = null;
        for (var j = 0; j < childNodes.length; j++) {
            var childNode = childNodes[j];
            var childNodeText = $('#tree').jstree('get_text', childNode);
            if (childNodeText === pathArray[i]) {
                matchingChildNode = childNode;
                break;
            }
        }

        if (matchingChildNode) {
            currentNodeId = matchingChildNode;
        } else {
            window.showToast("Invalid path", "warning", 3000)
            return;
        }
    }

    $('#tree').jstree('select_node', currentNodeId);
}


const resizeable = (containerName) => {
    const sb = $(containerName)
    const sb_resize = $(containerName + " .resize-button")
    let startWidth = sb.width()

    sb_resize.on("mousedown", (e) => {
        sb.attr("resizing", true)
    })

    $(document).on("mousemove", (e) => {
        if (sb.attr("resizing") == "true") {
            sb.css("width", `${$(document).width()-e.pageX}`)
        }
    })

    $(document).on("mouseup", (e) => {
        sb.attr("resizing", false)
    })
}

$(() => {
    resizeable(".sidebar-container");
})



function saveScene(update = true) {
    saveManuscriptTree();
    
    if (lastSelectedSceneID == "") {
        window.showToast("No scene is selected", "warning", 2000)
        return
    }

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/setScene", true);

    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onload = function () {
        if (xhr.status == 200) {
            if (xhr.responseText.startsWith("Fail")) {
                window.showToast("Failed to save scene", "danger", 3000)
            } else {
                window.showToast("Sucessfuly saved the scene", "success", 2000)
            }
        }
    };

    if (!update) {
        xhr.send(JSON.stringify({
            name: lastSelectedSceneID,
            scene: '{"ops":[{"insert":""}]}',
            synopsis: "",
            notes: "",
        }))
        return;
    }
    let scene = document.quill.getContents();
    let synopsis = $("#synopsis-editor").val()
    let notes = $("#notes-editor").val()

    xhr.send(JSON.stringify({
        project: localStorage.getItem("CurrentProject"),
        uid: lastSelectedSceneID,
        scene: JSON.stringify(scene),
        synopsis,
        notes,
    }));
}



window.saveScene = saveScene;