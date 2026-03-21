import React from "react";
import TemplateManager from '../components/templateManager'
import Tree, {enforceUniqueNodeNames} from "../components/Tree";
import '../styles/dashboard.css'
import { getArticleTree, LS_PROJECT_NAME, modifyArticle, setArticleTree } from "../utils/api";
import { WLuid } from "../utils/uid";
import $ from 'jquery';
window.jQuery = $;

export default function DashboardPage (){
    return (
        <>
            <div className="article-tree">
                <span className="container-label">Articles (Right click menu)</span>
                <Tree
                    getTree = {getTree}
                    handleCreateNode = {handleCreateNode}
                    handleDeleteNode={handleDeleteNode}
                    handleRenameNode={handleRenameNode}
                    handleDoubleClick={handleDoubleClick}

                ></Tree>
            </div>
            <div className="template-manager">
                <TemplateManager></TemplateManager>
            </div>
        </>
    )
}

function getTree (){
    return getArticleTree(localStorage.getItem(LS_PROJECT_NAME))
}

const handleDeleteNode = (ul) => function (e, data) {
    if(data.node.id == "root") return
    if(data.node.type === "file"){
        modifyArticle(localStorage.getItem(LS_PROJECT_NAME), "delete", data.node.data.uid, {})
    }

    setArticleTree(localStorage.getItem(LS_PROJECT_NAME) ,ul.jstree(true).get_json("#", {flat: true}));
}

const handleRenameNode = (ul) => function (e, data) {
    if(data.node.id == "root") return
    enforceUniqueNodeNames($(e.currentTarget).jstree(true),data.node);

    //for tooltips
    ul.jstree().get_node(data.node).a_attr.href = data.node.text;

    modifyArticle(localStorage.getItem(LS_PROJECT_NAME), "create", data.node.data.uid, {
        name: data.node.text
    })

    setArticleTree(localStorage.getItem(LS_PROJECT_NAME) ,ul.jstree().get_json("#", {flat:true}))
}

// Function to handle the 'dblclick.jstree' event
const handleDoubleClick = (ul) => function (event) {
    let nodeHtml = $(event.target).closest("li");
    let node = ul.jstree(true).get_node(nodeHtml);
    if(node.id == "root") return
    if (node.type === "file") {
        sessionStorage.setItem("Article", node.data.uid);
        window.location = "/article";
    }
}

const handleCreateNode = (ul) => function (e, data) {
    data.node.data = {
        uid: WLuid()
    }
    if(data.node.type === "file"){
        modifyArticle(localStorage.getItem(LS_PROJECT_NAME), "create", data.node.data.uid, {
            name: data.node.text
        })
    }

    console.log(e)

    setArticleTree(localStorage.getItem(LS_PROJECT_NAME) ,ul.jstree(true).get_json("#", {flat: true}));
}