import { useState } from 'react';
import '../styles/templateManager.css'
import { exportTemplates, importTemplates, LS_PROJECT_NAME} from '../utils/api';

function exportTemplatesButton (setMassExportText){
    exportTemplates(localStorage.getItem(LS_PROJECT_NAME)).then(
        (x) => {setMassExportText(x)},
        (x) => {console.error(x)});
}

function importTemplatesButton (massImportText){
    importTemplates(localStorage.getItem(LS_PROJECT_NAME), massImportText);
}

function TemplateManager(){
    const [massImportPopupActive, setMassImportPopupActive] = useState(false);
    const [massExportPopupActive, setMassExportPopupActive] = useState(false);

    const [massImportText, setMassImportText] = useState("");
    const [massExportText, setMassExportText] = useState("");

    return (
        <>
            <div className="templates-container-outer">
                <span className="container-label">Templates</span>
                <div className="templates-container">
                    <button className="template-mass-import-open" onClick={() => {setMassImportPopupActive(true)}}><i className="fa-solid fa-download"></i></button>
                    <button className="template-mass-export-open" onClick={() => {setMassExportPopupActive(true)}}><i className="fa-solid fa-upload"></i></button>
                    <div className="templates-list">
                        <label className="template-selector new-template">
                            <input type="button" value="1" onClick={() => {window.location = '/templateCreator'}}></input><span><i className="fa-solid fa-plus fa-2xl"></i></span>
                        </label>
                    </div>
                </div>
            </div>
            
            <div className="template-mass-import" style={{
                display: massImportPopupActive ? "block" : "none"
            }}>
                <button className="template-mass-exchange-close-button" onClick={() => {setMassImportPopupActive(false)}}>X</button>
                <textarea name="templates" id="template-mass-import-textarea" onChange={(x) => {setMassImportText(x.currentTarget.value)}}></textarea>
                <button className="template-mass-import-button" onClick={() => {importTemplatesButton(massImportText)}}>Import</button>            
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

