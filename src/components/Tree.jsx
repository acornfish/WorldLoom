import '../styles/articleTree.css'
import $ from 'jquery';
window.jQuery = $;
import { useEffect, useRef } from 'react';


const JstreeConfig = (data) => {return {
            "core": {
                "animation": 0,
                "check_callback": true,
                "themes": {
                    "name": "proton",
                    "responsive": true,
                },
                "data": data,
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
                //"dnd",
                "search",
                "types",
                "wholerow",
                "unique",
            ],
}}

const treeLoadedEvent = (ul) => function handleTreeLoaded(e, data) {
    $(ul).jstree().deselect_all(true);
    $(ul).jstree().close_all(true);
}

const handleSelectNode = (ul) => function (e, data) {
    if(data.node.id == "root") return
    if (data.node.type === "file") {
        // Logic for handling file selection
    } else {
        return;
    }
}


export default function Tree ({getTree, handleCreateNode, handleDeleteNode, handleRenameNode, handleDoubleClick}){
    const ulRef = useRef(null);

    useEffect(() => {
        $.getScript("/libs/dist/jstree.js", function (){
            const ul = $(ulRef.current);
            
            getTree().then(tree => {
                //default element
                if(typeof tree == "string" && tree != ""){
                    tree = JSON.parse(tree)
                }

                if(tree == null || tree == undefined || tree == "") tree = [{
                    "id": "root",
                    "text": "Articles",
                    "icon": true,
                    "li_attr": {
                        "id": "root"
                    },
                    "a_attr": {
                        "href": "#"
                    },
                    "data": {},
                    "parent": "#",
                    "type": "default"
                }];

                console.log(tree)

                ul.jstree(JstreeConfig(tree))            
                    .on("select_node.jstree", handleSelectNode(ul))
                    .on("create_node.jstree", handleCreateNode(ul))
                    .on("delete_node.jstree", handleDeleteNode(ul))
                    .on("loaded.jstree", treeLoadedEvent(ul))
                    .on("rename_node.jstree", handleRenameNode(ul))
                    .on("dblclick.jstree", handleDoubleClick(ul));
            })})
    }, [])

    return (
        <div className="tree-container-outer">
            <span className="container-label">Articles (Right click menu)</span>
            <div className="tree-container-controls">
                <button id="add-element"><i className="fa-solid fa-file-medical"></i></button>
                <button id="add-folder"><i className="fa-solid fa-folder-plus"></i></button>
            </div>
            <div className="tree-container" id="article-tree">
                <ul ref={ulRef}></ul>
            </div>
        </div>
    )
}



export function enforceUniqueNodeNames(jst, node) {
    let newNodeName = node.text;
    
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

