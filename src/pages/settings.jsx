import { useState } from "react"
import "../styles/settingsPage.css"
import { useEffect } from "react";
import '../utils/api'
import { useTheme } from "../hooks/themeProvider";
import { exportDatabaseZIP, exportProject, ImportDatabaseZIP, LS_PROJECT_NAME } from "../utils/api";
import WLSelect from "../components/WLSelect";
import { useRef } from "react";
import showToast from "../utils/toast";

function exportAsHtmlButton(){
    exportProject(localStorage.getItem(LS_PROJECT_NAME))
}

function exportDatabaseButton(){
    exportDatabaseZIP();
}

const importDatabaseButton = (trueInput) => function importDatabaseButton(){
    trueInput.current.showPicker()
}

const importDatabaseChange = async (e) => {
    const file = e.target.files[0];
    
    if (!file) return;
    
    if (file.type !== "application/zip" && !file.name.endsWith(".zip")) {
        alert("Please select a ZIP file");
        return;
    }
    

    const fileContentUint8 = new Uint8Array(await file.arrayBuffer())

    try {
        await ImportDatabaseZIP(Array.from(fileContentUint8))
        showToast("Imported Successfully!", "success", 1000)
    }catch (err){
        showToast(err, "danger", 1500)
    }
}

function SettingsPage (){
    const textAnalyticsOptions = [
        {value: "english", label: "English (Dale-Chall wordlist)"},
        {value: "english2", label: "English (Oxford wordlist)"},
        {value: "russian", label: "Russian"},
        {value: "turkish", label: "Turkish"},
    ]

    const [AnalyticsLanguage, SetAnalyticsLanguage] = useState(localStorage.getItem("TextAnalyticsLanguage"))
    const {Theme, SetTheme} = useTheme();
    const fileUploadInputRef = useRef();

    
    useEffect(() => {
        localStorage.setItem("TextAnalyticsLanguage", AnalyticsLanguage)
    }, [AnalyticsLanguage]);

    const changeTheme = () => {
        SetTheme(Theme === "light" ? "dark" : "light");
    }

    return (
        <>
            <div className="settings-container">
                <span className="theme-selector-label">Theme: </span>
                <button id="theme-selector" onClick={changeTheme} >
                    <i className={Theme == "dark" ? "fa-solid fa-moon fa-2xl" : "fa-solid fa-sun fa-2xl"}></i>
                </button>
                <h2>Text Analytics Language</h2>
               <br></br>
               <div className="text-analytics-language-container">
                <WLSelect
                    className="text-analytics-language"
                    defaultValue={textAnalyticsOptions.find(x => {
                        return (x.value == localStorage.getItem("TextAnalyticsLanguage"))
                    })}
                    options={textAnalyticsOptions}
                    onChange={x => SetAnalyticsLanguage(x.value)}></WLSelect>
               </div>

                <h2>Export</h2>
               <br></br>
               <button className="export-html-button" onClick={exportAsHtmlButton}>Export as HTML (.zip)</button>
               <br></br>
               <button className="export-html-button" onClick={exportDatabaseButton}>Export Database Folder (.zip)</button>
               <h2>WARNING: This will wipeout your current database!</h2>
               <input type="file" accept=".zip" style={{display: "none"}} ref={fileUploadInputRef} onChange={importDatabaseChange}/>
               <button className="export-html-button" onClick={importDatabaseButton(fileUploadInputRef)}>Import Database Folder (.zip)</button>
            </div>
        </>
    )
}

export default SettingsPage;
