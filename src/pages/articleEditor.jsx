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
    const [articleData, setArticleData] = useState({contents: {},settings: {templateName: null},design: {}})

    const contentsFetchFunction = useRef(()=>{console.warn("Content fetch function is undefined")})
    const desginFetchFunction = useRef(() => {console.warn("Design fetch function is undefined")})
    const settingsFetchFunction = useRef(() => {console.warn("Settings fetch function is undefined")})

    async function saveFunction(){
      let contents = await contentsFetchFunction.current()
      let design = await desginFetchFunction.current()
      let settings = await settingsFetchFunction.current()

      modifyArticle(localStorage.getItem(LS_PROJECT_NAME), "modify", sessionStorage.getItem("Article"), {
        contents,
        design,
        settings
      })
    }

    useEffect(() => {
        if(articleData?.settings?.templateName){
          //Either a template update or a normal load
          if(sessionStorage.getItem("ArticleRestructureFlag") == 1){
            // Definitely a template update
            articleData.settings.templateName = sessionStorage.getItem("TemplateName")
            sessionStorage.setItem("ArticleRestructureFlag", 0)
          }else{
            // Definitely a normal load
            sessionStorage.setItem("TemplateName", articleData.settings.templateName)
          }
        }else {
          // Article creation
          articleData.settings.templateName = sessionStorage.getItem("TemplateName")
        }
        setSelectedTemplate(articleData.settings.templateName);

        (async () => {
          let res = await getTemplate(localStorage.getItem(LS_PROJECT_NAME), articleData.settings.templateName)
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
            try{
              let res = await fetchArticle(localStorage.getItem(LS_PROJECT_NAME), sessionStorage.getItem("Article"))

              let data = JSON.parse(res).data
              setArticleData(data)
              setSelectedTemplate(data.settings.templateName)
            }catch(err){
              if(err == "Fail: Not initalized yet"){
              
              }
            }
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
              <DesignTab selectedTab={selectedTab} getDesignRef={desginFetchFunction} imageIDs={articleData.design}></DesignTab>
              <SettingsTab selectedTab={selectedTab} templateList={templateList} getSettingsRef={settingsFetchFunction}
               defaultTemplate={sessionStorage.getItem("TemplateName")}>
               </SettingsTab>
            </div>
            <input type="button" className="save-button" value="Save" onClick={saveFunction}></input>
        </div>
    )
}

