import { useState } from "react"
import WLSelect from "../../components/WLSelect"
import { useEffect } from "react"
import { getTemplateList, LS_PROJECT_NAME } from "../../utils/api"
import { useRef } from "react"

export default function SettingsTab ({selectedTab, getSettingsRef, defaultTemplate}){
    const [templateList, setTemplateList] = useState([])
    const templateSelectRef = useRef()
    const index = 3

    getSettingsRef.current = async () => {
        return {templateName: templateSelectRef.current.getValue()[0].value}
    }

    function onChange (e){
        sessionStorage.setItem("TemplateName", e.value)
        if(confirm("This action will cause unsaved data to be lost. Proceed?")){
            sessionStorage.setItem("ArticleRestructureFlag", 1)
            window.location.reload()
        }
    }

    useEffect(() => {
        (async () => {
          let res = await getTemplateList(localStorage.getItem(LS_PROJECT_NAME))
          if(res.startsWith("Fail")){
            console.error("Couldn't fetch template list")
          }else {
            setTemplateList(JSON.parse(res))
          }
        })();        
    }, [])

    return (
        <div className={"tab settings-tab " + (selectedTab==index?"active-tab":"")}  index={index}>
          <form>
            <h2>Template</h2>
            <div id="type-selector-container">
              <WLSelect
                options={templateList?.map((t,i) => {return {value: t, label:t}})}
                onChange={onChange}
                value={{value: defaultTemplate, label:defaultTemplate}}
                ref={templateSelectRef}
                ></WLSelect>
            </div>
          </form>
        </div> 
    )
}
