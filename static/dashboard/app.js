import "../libs/jquery.min.js"
import '/global.js'
import "../libs/dist/jstree.js"

const ARTICLE_JSTREE = "#article-tree ul"

const urlParams = new URLSearchParams(window.location.search);

const template_selector_template = `
    <label class="template-selector">
        <input type="radio" name="template" value="1"><span><i>;name!</i></span>
    </label>
`

$(() => {
    sessionStorage.removeItem("TemplateName")

    getArticleTree().then((articleTree) => {
        $(ARTICLE_JSTREE).jstree({
            "core": {
                "animation": 0,
                "check_callback": true,
                "themes": {
                    "name": "proton",
                    "responsive": true,
                },
                "data": articleTree,
            },
            "types": {
                "#": {
                    "max_children": 1,
                    "max_depth": 9,
                    "valid_children": ["root"],
                },
                "root": {
                    "icon": "fa-solid fa-book",
                    "valid_children": ["default", "file"],
                },
                "default": {
                    "valid_children": ["default", "file"],
                },
                "file": {
                    "icon": "fa-solid fa-file",
                    "valid_children": [],
                },
            },
            "plugins": [
                "contextmenu",
                "dnd",
                "search",
                "types",
                "wholerow",
                "unique",
            ],
        })
            .on("select_node.jstree", handleSelectNode)
            .on("create_node.jstree", handleCreateNode)
            .on("delete_node.jstree", handleDeleteNode)
            .on("loaded.jstree", handleTreeLoaded)
            .on("rename_node.jstree", handleRenameNode)
            .on("dblclick.jstree", handleDoubleClick);
    });


    getTemplateList((status, templates) => {
        let container = $(".templates-list")
        let elements = ""

        if(status != 200){
            window.showToast(`Template loading failed`, "danger", 1500);
        }

        templates.forEach(temp => {
            elements += template_selector_template.replace(";name!", temp)
        })

        container.html(elements + container.html())

        container.find("input[type='radio']").eq(0).attr("checked", "1")
        sessionStorage.setItem("TemplateName", templates[0])

        $(".template-selector").on("click", (e) => {
            let name = ($(e.currentTarget).children("span").text())
            sessionStorage.setItem("TemplateName", name)
        })

        $(".template-selector").on("dblclick", (e) => {
            let name = ($(e.currentTarget).children("span").text())
            sessionStorage.setItem("TemplateName", name)
            window.location = '/templateCreator'
        })
    })
})


// Function to handle the 'select_node.jstree' event
function handleSelectNode(e, data) {
    if(data.node.id == "root") return
    if (data.node.type === "file") {
        // Logic for handling file selection
    } else {
        return;
    }
}

// Function to handle the 'create_node.jstree' event
function handleCreateNode(e, data) {
    data.node.data = {
        uid: window.uid()
    }
    if(data.node.type === "file"){
        modifyArticle("create", data.node.data.uid, {
            name: data.node.text
        })
    }

    setArticleTree($(ARTICLE_JSTREE).jstree(true).get_json("#", {flat: true}));
}

// Function to handle the 'delete_node.jstree' event
function handleDeleteNode(e, data) {
    if(data.node.id == "root") return
    if(data.node.type === "file"){
        modifyArticle("delete", data.node.data.uid, {})
    }
    setArticleTree($(ARTICLE_JSTREE).jstree(true).get_json("#", {flat: true}));
}

// Function to handle the 'loaded.jstree' event
function handleTreeLoaded(e, data) {
    $(ARTICLE_JSTREE).jstree().deselect_all(true);
    $(ARTICLE_JSTREE).jstree().close_all(true);
}

// Function to handle the 'rename_node.jstree' event
function handleRenameNode(e, data) {
    if(data.node.id == "root") return
    enforceUniqueNodeNames(data.node);

    //for tooltips
    $(ARTICLE_JSTREE).jstree().get_node(data.node).a_attr.href = data.node.text;

    modifyArticle("create", data.node.data.uid, {
        name: data.node.text
    })

    setArticleTree($(ARTICLE_JSTREE).jstree().get_json("#", {flat:true}))
}

// Function to handle the 'dblclick.jstree' event
function handleDoubleClick(event) {
    let nodeHtml = $(event.target).closest("li");
    let node = $(ARTICLE_JSTREE).jstree(true).get_node(nodeHtml);
    console.log(node)
    if(node.id == "root") return
    if (node.type === "file") {
        sessionStorage.setItem("Article", node.data.uid);
        window.location = "/article";
    }
}

function modifyArticle(operation, uid, data) {
    const xhr = new XMLHttpRequest();
    const url = "/api/modifyArticle";

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            console.log("Success:", xhr.responseText);
        } else {
            console.error("Error:", xhr.status, xhr.statusText, xhr.responseText);
        }
    };

    const payload = {
        project: localStorage.getItem("CurrentProject"),
        operation: operation,
        uid: uid,
        data: data,
    };

    xhr.send(JSON.stringify(payload));
}


function enforceUniqueNodeNames(node) {
    let newNodeName = node.text;
    let jst = $(ARTICLE_JSTREE).jstree(true)
    
    let root = jst.get_node("#")
    const traverseTree = (_node) => {
        let count = 0;
        while(_node.children.length > count){
            let child = jst.get_node(_node.children[count])
            traverseTree(child)
            if(child.text == newNodeName && child != node){
                jst.set_text(node, `(${jst.get_node(node.parent).text}) ${node.text}`)
            } 
            count++;
        }
    }    

    traverseTree(root)
    node.text = newNodeName;
}

// Function to send a POST request to set the article tree using Promises
function setArticleTree(tree) {
    //delete node states for space optimization
    for(let i=0;i<tree.length;i++){
      delete tree[i].state
    }

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/setArticleTree", true);
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve(xhr.responseText);
                } else {
                    reject(new Error(`Request failed with status ${xhr.status}`));
                }
            }
        };

        const data = JSON.stringify({
            project: localStorage.getItem("CurrentProject"),
            tree: tree
        });

        xhr.send(data);
    });
}

async function getArticleTree() {
    await window.waitForVariable("CurrentProject")   

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        xhr.open("GET", 
                `/api/getArticleTree?project=${localStorage.getItem("CurrentProject")}`,
                 true);
        
                 xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    reject(new Error(`Request failed with status ${xhr.status}`));
                }
            }
        };

        xhr.send();
    });
}


async function getTemplateList(callback) {
    await window.waitForVariable("CurrentProject")   

    const xhr = new XMLHttpRequest();
    xhr.open("GET", `/api/getTemplateList?project=${localStorage.getItem("CurrentProject")}`, true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            let data = null;
            
            try {
                data = JSON.parse(xhr.responseText);
            } catch (e) {
                return callback(xhr.status, null);
            }
            callback(xhr.status, data);
        }
    };

    xhr.send();
}

