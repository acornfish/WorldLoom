import { useEffect } from "react";
import RichTextEditor from "../components/richTextEditor";
import Tree, { enforceUniqueNodeNames } from "../components/Tree";
import '../styles/manuscripts.css'
import { getManuscriptTree, LS_PROJECT_NAME, setManuscriptTree, deleteScene, setScene, getScene } from "../utils/api";
import { WLuid } from "../utils/uid";
import { useState } from "react";
import $ from 'jquery';
import showToast from "../utils/toast";
window.jQuery = $;

function getTree (){
    return getManuscriptTree(localStorage.getItem(LS_PROJECT_NAME))
}

const handleDeleteNode = (setUid) => (ul) => function (e, data) {
    if(data.node.id == "root") return
    if(data.node.type === "file"){
        deleteScene(localStorage.getItem(LS_PROJECT_NAME), data.node.data.uid)
    }

    setManuscriptTree(localStorage.getItem(LS_PROJECT_NAME) ,ul.jstree(true).get_json("#", {flat: true}));
}

const handleRenameNode = (setUid) => (ul) => function (e, data) {
    if(data.node.id == "root") return
    enforceUniqueNodeNames($(e.currentTarget).jstree(true),data.node);

    //for tooltips
    ul.jstree().get_node(data.node).a_attr.href = data.node.text;

    setManuscriptTree(localStorage.getItem(LS_PROJECT_NAME) ,ul.jstree().get_json("#", {flat:true}))
}

const handleDoubleClick =  (setUid) => (ul) => function (event) {
(async () => {
    let nodeHtml = $(event.target).closest("li");
    let node = ul.jstree(true).get_node(nodeHtml);
    if(node.id == "root") return
    if (node.type === "file") {
        setUid(node.data.uid)
    }
})()
}

const handleCreateNode = (setUid) => (ul) => function (e, data) {
    data.node.data = {
        uid: WLuid()
    }
    if(data.node.type === "file"){
        setScene(localStorage.getItem(LS_PROJECT_NAME), data.node.data.uid, "", "", "")
    }

    setManuscriptTree(localStorage.getItem(LS_PROJECT_NAME) ,ul.jstree(true).get_json("#", {flat: true}));
}

const saveScene = async (uid, sceneText, synposisText, notesText) => {
    await setScene(localStorage.getItem(LS_PROJECT_NAME), uid, sceneText, synposisText, notesText)
    showToast("Scene Updated!", "success", 1000)
}


export default function ManuscriptsPage (){
    const [uid, setUid] = useState()
    const [sceneText, setSceneText] = useState({ops:[]})
    const [synposisText, setSynposisText] = useState("")
    const [notesText, setNotesText] = useState("")


    useEffect(() =>  {
    (async () => {
    try{
        const res = await getScene(localStorage.getItem(LS_PROJECT_NAME), uid)
        const data = JSON.parse(res)
        setSceneText(data.scene)
        setSynposisText(data.synopsis)
        setNotesText(data.notes)
        showToast("Scene Loaded!", "success", 1000)
    }catch(err){
        console.error(err)
    }
    })()
    }, [uid])


    return (
        <>
        <div className="explorer-container">
            <Tree id="tree"
                getTree={getTree}
                handleDeleteNode={  handleDeleteNode(setUid)}
                handleRenameNode={  handleRenameNode(setUid)}
                handleDoubleClick={handleDoubleClick(setUid)}
                handleCreateNode={  handleCreateNode(setUid)}
            ></Tree>
        </div>  

        <div className="text-editor-container">
            <RichTextEditor style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
            }}
            value={
                sceneText
            }
            setValue={
                setSceneText
            }
            >
            </RichTextEditor>
        </div>

        <div className="sidebar-container">
            <div className="resize-button"><i className="fa-solid fa-grip-lines-vertical"></i></div>
            <div className="synopsis-container">
                <h2 for="synopsis-editor">Synopsis</h2>
                <textarea value={synposisText} onChange={e => {setSynposisText(e.target.value)}} name="synopsis-editor" id="synopsis-editor"></textarea>
            </div>

            <div className="notes-container">
                <h2 for="notes-editor">Notes</h2>
                <textarea value={notesText} onChange={e => {setNotesText(e.target.value)}} name="notes-editor" id="notes-editor"></textarea>
                <button id="save-scene" onClick={() => {saveScene(uid, sceneText, synposisText, notesText)}}>Save</button>
            </div>
        </div>

        <div className="statistics-popup">
            <h3 className="readability-index"></h3>
        </div>
        </>
    )
}