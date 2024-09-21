import '/global.js'
import "../libs/jquery.min.js"
import "../libs/dist/jstree.js"
import {articleSaveRequest, removeArticle, retrieveArticle} from "../editor/articleManagement.js"

const ARTICLE_JSTREE = "#article-tree ul"

const urlParams = new URLSearchParams(window.location.search);

retrieveArticleTree().then(articleTree => {
    $(ARTICLE_JSTREE).jstree({
        "core": {
            "animation": 0,
            "check_callback": true,
            'themes': {
                'name': 'proton',
                'responsive': true
            },
            'data': articleTree
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

        } else {
            return;
        }
    }).on("create_node.jstree", (e, data) => {
        saveArticleTree()
    }).on("delete_node.jstree", (e, data) => {
        if(data.node.type != "default"){
            removeArticle(localStorage.getItem("CurrentProject"), data.node.text)
        }
        saveArticleTree()
    }).on('loaded.jstree', (e, data) => {
        $(ARTICLE_JSTREE).jstree().deselect_all(true);
        $(ARTICLE_JSTREE).jstree().close_all(true);
    }).on("rename_node.jstree", (e, data) => {
        enforceUniqueNodeNames(data.node)
        if(data.node.type != "default"){
            retrieveArticle(localStorage.getItem("CurrentProject"), data.old).then(() => {
                articleSaveRequest(localStorage.getItem("CurrentProject"), data.text, "","", "", "",data.old)
            }).catch(() => {
                articleSaveRequest(localStorage.getItem("CurrentProject"), data.text, "","", "", "")
            })
        }

        //for tooltips
        $(ARTICLE_JSTREE).jstree().get_node(data.node).a_attr.href = data.node.text
        saveArticleTree()
    }).on("dblclick.jstree", function (event) {
        var nodeHtml = $(event.target).closest("li");
        var node = $(ARTICLE_JSTREE).jstree(true).get_node(nodeHtml);
        if(node.type == "file"){
            sessionStorage.setItem("Article", node.text)
            window.location = "/editor"
        }
    });
})

async function retrieveArticleTree() {
    try {
        const response = await fetch(`/api/retrieveArticleTree?Project=${localStorage.getItem("CurrentProject")}`);
        if (!response.ok) {
            throw new Error(`Failed to retrieve article tree: ${response.status}`);
        }
        let responseData = (await response.text());
        if (responseData.startsWith("Fail")) {
            throw new Error(`Failed to retrieve article tree: ${responseData}`);
        }
        const data = JSON.parse(responseData);
        return (data)
    } catch (error) {
        console.error(error);
        return undefined;
    }
}
async function saveArticleTree() {
    try {
        const response = await fetch('/api/saveArticleTree', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
                Project: localStorage.getItem("CurrentProject"),
                Data: $(ARTICLE_JSTREE).jstree(true).get_json()
            }) 
        });

        if (!response.ok) {
            throw new Error(`Failed to save article tree: ${response.status}`);
        }

        const data = await response.text(); 
        console.log(data);
    } catch (error) {
        console.error(error);
    }
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
