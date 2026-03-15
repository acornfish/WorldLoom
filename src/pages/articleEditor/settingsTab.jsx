import { useState } from "react"
import WLSelect from "../../components/WLSelect"
import { useEffect } from "react"
import { useImperativeHandle } from "react"

export default function SettingsTab ({selectedTab, templateList, getSettingsRef, defaultTemplate}){
    const [selectedTemplate, setSelectedTemplate] = useState(defaultTemplate)
    const index = 3

    getSettingsRef.current = async () => {
        return {templateName: selectedTemplate}
    }

    useEffect(() => {
        setSelectedTemplate(defaultTemplate)
    }, [defaultTemplate])

    function onChange (e){
        setSelectedTemplate(e.value);
        sessionStorage.setItem("TemplateName", e.value)
        if(confirm("This action will cause unsaved data to be lost. Proceed?")){
            sessionStorage.setItem("ArticleRestructureFlag", 1)
            window.location.reload()
        }
    }

    return (
        <div className={"tab settings-tab " + (selectedTab==index?"active-tab":"")}  index={index}>
          <form>
            <h2>Template</h2>
            <div id="type-selector-container">
              <WLSelect
                options={templateList?.map((t,i) => {return {value: t, label:t}})}
                onChange={onChange}
                defaultValue={{value: selectedTemplate, label:selectedTemplate}}
                ></WLSelect>
            </div>
          </form>
        </div> 
    )
}
