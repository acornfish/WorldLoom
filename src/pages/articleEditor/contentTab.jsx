import { useState, useRef, useEffect } from "react";
import ArticlePrompt, { PromptTypes } from "../../components/prompt";
import { fetchArticle, LS_PROJECT_NAME } from "../../utils/api";

export default function ContentTab({selectedTab, templateData, saveFunction, priorArticleData}){
  const index = 1;
  const promptsGET = useRef([])
  const promptsSET = useRef([])
  const templateRef = useRef(templateData)
  const [promptVersion, setPromptVersion] = useState(0)

  //Don't question it. I am going mad
  useEffect(() => {
    templateRef.current = templateData
  }, [templateData])

  useEffect(() => {
    for(let i=0;i<templateRef.current.length;i++){
      setPromptVersion(e=>e+1)
      promptsSET.current[i] = priorArticleData[templateRef.current[i].promptName] ?? ("")
    }
  }, [priorArticleData, templateData])

  saveFunction.current = async () => {
    const contentsObj = {}
    
    promptsGET.current.forEach((x,i) => {
      contentsObj[templateRef.current[i].promptName] = x
    })

    return contentsObj
  }

  return (
    <div className={"tab content-tab " + (selectedTab==index?"active-tab":"")} index={index}>
      {
        templateData.map((t,i) => {
          return (
              <ArticlePrompt 
                promptName={t.promptName} 
                promptType={t.type} 
                key={i} 
                getContents={(el) => {promptsGET.current[i] = el}}
                priorContentVal={promptsSET.current[i]}
                referenceType={t.rtype}
                
                ></ArticlePrompt>
            )
          }
        )
      }
    </div>
  )
}