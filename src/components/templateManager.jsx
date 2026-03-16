import { useState } from 'react';
import '../styles/templateManager.css'
import { exportTemplates, getTemplateList, importTemplates, LS_PROJECT_NAME} from '../utils/api';
import { useEffect } from 'react';


function exportTemplatesButton (setMassExportText){
    exportTemplates(localStorage.getItem(LS_PROJECT_NAME)).then(
        (x) => {setMassExportText(x)},
        (x) => {console.error(x)});
}

function importTemplatesButton (massImportText){
    importTemplates(localStorage.getItem(LS_PROJECT_NAME), massImportText);
}

function onTemplateChange(e){
    let newTemplate = e.target.value
    sessionStorage.setItem("TemplateName", newTemplate)
}

function onTemplateEdit(){
    window.location = '/templateCreator'
}


function TemplateManager(){
    const [massImportPopupActive, setMassImportPopupActive] = useState(false);
    const [massExportPopupActive, setMassExportPopupActive] = useState(false);

    const [massImportText, setMassImportText] = useState("");
    const [massExportText, setMassExportText] = useState("");

    const [templateList, setTemplateList] = useState([])

    useEffect(() => {
        getTemplateList(localStorage.getItem(LS_PROJECT_NAME)).then(
            (x)=>{setTemplateList(JSON.parse(x))}, console.error);
    }, [])

    return (
        <>
            <div className="templates-container-outer">
                <span className="container-label">Templates</span>
                <div className="templates-container">
                    <button className="template-mass-import-open" onClick={() => {setMassImportPopupActive(true)}}><i className="fa-solid fa-download"></i></button>
                    <button className="template-mass-export-open" onClick={() => {setMassExportPopupActive(true)}}><i className="fa-solid fa-upload"></i></button>
                    <div className="templates-list">
                        {
                            templateList.map((val, ind) => (
                                <label className="template-selector"
                                    onDoubleClick={onTemplateEdit}>
                                    <input type="radio" name="template" value={val} key={ind} 
                                    onChange={onTemplateChange}
                                    /><span><i>{val}</i></span>
                                </label>
                            ))
                        }

                        <label className="template-selector new-template">
                            <input type="button" value="1" onClick={() => {
                                sessionStorage.removeItem("TemplateName", "")
                                window.location = '/templateCreator'
                                }}></input><span><i className="fa-solid fa-plus fa-2xl"></i></span>
                        </label>
                    </div>
                </div>
            </div>
            
            <div className="template-mass-import" style={{
                display: massImportPopupActive ? "block" : "none"
            }}>
                <button className="template-mass-exchange-close-button" onClick={() => {setMassImportPopupActive(false)}}>X</button>
                <textarea name="templates" id="template-mass-import-textarea" onChange={(x) => {setMassImportText(x.currentTarget.value)}}></textarea>
                <button className="template-mass-import-button" onClick={() => {importTemplatesButton(massImportText); window.location.reload()}}>Import</button>            
            </div>
            
            <div className="template-mass-export" style={{
                display: massExportPopupActive ? "block" : "none"
            }}>
                <button className="template-mass-exchange-close-button" onClick={() => {setMassExportPopupActive(false)}}>X</button>           
                <textarea name="templates" id="template-mass-export-textarea" value={massExportText} readOnly></textarea>
                <button className="template-mass-export-button" onClick={() => {exportTemplatesButton(setMassExportText)}}>Export</button>            
            </div>
        </>
    )
}


export default TemplateManager;

