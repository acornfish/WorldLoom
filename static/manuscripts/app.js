import '/global.js'
import "../libs/jquery.min.js"
import "../libs/dist/jstree.js"
import "../libs/quill.js"

var lastSelectedSceneID = ""

function retrieveManuscript() {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open("GET", `/api/retrieveManuscript?Project=${localStorage.getItem("CurrentProject")}`);

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

function retrieveScene(sceneName) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", `/api/retrieveScene?name=${sceneName}`, true);

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
  
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          console.log("Scene deleted successfully!");
        } else {
          console.error("Failed to delete scene:", xhr.responseText);
        }
      }
    };
  
    xhr.send(JSON.stringify({ name: sceneName }));
  }
  

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
                }]
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
            }
        }
    },

});

retrieveManuscript().then(x => {
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
        "types": {
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
        },
        "plugins": [
            "contextmenu", "dnd", "search",
            "types", "wholerow", "unique"
        ]
    }).on('select_node.jstree', function (e, data) {
        if (data.node.type == "file") {
            lastSelectedSceneID = data.node.data.uid;
            retrieveScene(lastSelectedSceneID).then(scene => {
                if (scene.startsWith("Fail")) {
                    console.error(scene);
                    return
                }

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
            deleteScene( data.node.data.uid )
            lastSelectedSceneID = ""
        }
    });

})


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


function saveState() {
    let treeSerialized = $('#tree').jstree(true).get_json();
    saveManuscriptTree(localStorage.getItem("CurrentProject"), treeSerialized)
}

function saveManuscriptTree(project, manuscriptTree) {
    const xhr = new XMLHttpRequest();

    xhr.open("POST", "/api/saveManuscript");

    xhr.setRequestHeader("Content-Type", "application/json");

    const data = {
        Project: project,
        Data: manuscriptTree,
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

function saveScene(update = true) {
    saveState();
    if (lastSelectedSceneID == "") {
        window.showToast("No scene is selected", "warning", 2000)
        return
    }
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/saveScene", true);

    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onload = function () {
        if (xhr.status == 200) {
            if (xhr.responseText.startsWith("Fail")) {
                window.showToast("Failed to save scene", "danger", 3000)
            }else{
                window.showToast("Sucessfuly saved the scene", "success", 2000)
            }
        }
    };

    if (!update) {
        xhr.send(JSON.stringify({
            name: lastSelectedSceneID,
            scene: '{"ops":[{"insert":""}]}',
            synopsis: "",
            notes: ""
        }))
        return;
    }
    let scene = document.quill.getContents();
    let synopsis = $("#synopsis-editor").val()
    let notes = $("#notes-editor").val()

    xhr.send(JSON.stringify({
        name: lastSelectedSceneID,
        scene: JSON.stringify(scene),
        synopsis,
        notes
    }));
}

window.saveScene = saveScene;