import { useState } from "react"
import "../styles/settingsPage.css"
import Select from 'react-select'
import { useEffect } from "react";
import '../utils/api'
import { useTheme } from "../hooks/themeProvider";
import { exportProject, LS_PROJECT_NAME } from "../utils/api";

function exportAsHtmlButton(){
    exportProject(localStorage.getItem(LS_PROJECT_NAME))
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

                <h2>Export</h2>
               <br></br>
               <button className="export-html-button" onClick={exportAsHtmlButton}>Export as HTML</button>
                <h2>Text Analytics Language</h2>
               <br></br>
               <div className="text-anaylitcs-language-container">
                <Select className="text-analytics-language"
                    defaultValue={textAnalyticsOptions.find(x => {
                        return (x.value == localStorage.getItem("TextAnalyticsLanguage"))
                    })}
                    options={textAnalyticsOptions}
                    onChange={x => SetAnalyticsLanguage(x.value)}
                >
               </Select>
               </div>
            </div>
        </>
    )
}

export default SettingsPage;
