import { useState } from "react"
import WLSelect from "../../components/WLSelect"
import { useEffect } from "react"

export default function SettingsTab ({selectedTab, templateList, selectedTemplateRef}){
    const [selectedTemplate, setSelectedTemplate] = selectedTemplateRef.current
    const index = 3

    useEffect(()=>{
        sessionStorage.setItem("TemplateName", selectedTemplate)
    }, [selectedTemplate])

    return (
        <div className={"tab settings-tab " + (selectedTab==index?"active-tab":"")}  index={index}>
          <form>
            <h2>Template</h2>
            <div id="type-selector-container">
              <WLSelect
                options={templateList?.map((t,i) => {return {value: t, label:t}})}
                onChange={(e) => {setSelectedTemplate(e.value)}}
                defaultValue={{value:selectedTemplate, label:selectedTemplate}}
                ></WLSelect>
            </div>
          </form>
        </div> 
    )
}
