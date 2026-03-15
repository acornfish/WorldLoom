import { useState } from 'react'
import '../styles/articleEditor.css'
import ArticlePrompt, { PromptTypes } from '../components/prompt'
import { getTemplate,modifyArticle , LS_PROJECT_NAME, getTemplateList, fetchArticle } from '../utils/api'
import { useEffect } from 'react'
import { useRef } from 'react'
import ContentTab from './articleEditor/contentTab.jsx'
import DesignTab from './articleEditor/designTab.jsx'
import SettingsTab from './articleEditor/settingsTab.jsx'

export default function ArticleEditor (){
    const [selectedTab, setSelectedTab] = useState(1)
    const [templateData, setTemplateData] = useState([])
    const [templateList, setTemplateList] = useState([])
    const [selectedTemplate, setSelectedTemplate] = useState("")
    const [articleData, setArticleData] = useState("")
    const selectedTemplateRef = useRef([selectedTemplate, setSelectedTemplate])

    const contentsFetchFunction = useRef(()=>{console.warn("Content fetch function is undefined")})
    const desginFetchFunction = useRef(() => {console.warn("Design fetch function is undefined")})
    const settingsFetchFunction = useRef(()=>{console.warn("Settings fetch function is undefined")})

    function saveFunction(){
      let contents = contentsFetchFunction.current()
      let design = desginFetchFunction.current()
      let settings = settingsFetchFunction.current()

      modifyArticle(localStorage.getItem(LS_PROJECT_NAME), "modify", localStorage.getItem("Article"), {
        contents,
        design,
        settings
      })
    }

    useEffect(() => {
        if(selectedTemplate) window.sessionStorage.setItem("TemplateName", selectedTemplate);
        (async () => {
          let res = await getTemplate(localStorage.getItem(LS_PROJECT_NAME), selectedTemplate)
          if(res.startsWith("Fail")){
            console.error("Couldn't fetch template")
          }else {
            setTemplateData(JSON.parse(res))
          }
        })();
    }, [selectedTemplate]);

    useEffect(() => {
        (async () => {
          let res = await getTemplateList(localStorage.getItem(LS_PROJECT_NAME))
          if(res.startsWith("Fail")){
            console.error("Couldn't fetch template list")
          }else {
            setTemplateList(JSON.parse(res))
          }
        })();

        (async () => {
          if(sessionStorage.getItem("Article")){
            let res = await fetchArticle(localStorage.getItem(LS_PROJECT_NAME), sessionStorage.getItem("Article"))
            if(res.startsWith("Fail")){
              console.error("Couldn't fetch article")
            }else {
              let data = JSON.parse(res).data
              setArticleData(data)
              setSelectedTemplate(data.settings.templateName)
            }
          }{
            setArticleData({
              contents: {},
              settings: {
                templateName: sessionStorage.getItem("templateName")
              },
              design: {}
            })
          }
        })();
    }, [])

    return (
        <div className="body-container">
            <div className="topbar">
              <div className={"topbar-section clickable " + (selectedTab == 1?"selected-section":"")} 
                onClick={() => {setSelectedTab(1)}}>Content</div>
              <div className={"topbar-section clickable " + (selectedTab == 2?"selected-section":"")} 
                onClick={() => {setSelectedTab(2)}}>Design</div>
              <div className={"topbar-section clickable " + (selectedTab == 3?"selected-section":"")} 
                onClick={() => {setSelectedTab(3)}}>Settings</div>
            </div>
            
            <div className="editor-panel">
              <ContentTab selectedTab={selectedTab} templateData={templateData} saveFunction={contentsFetchFunction}></ContentTab>
              <DesignTab selectedTab={selectedTab}></DesignTab>
              <SettingsTab selectedTab={selectedTab} templateList={templateList} selectedTemplateRef={selectedTemplateRef}></SettingsTab>
            </div>
            <input type="button" className="save-button" value="Save" onClick={saveFunction}></input>
        </div>
    )
}

