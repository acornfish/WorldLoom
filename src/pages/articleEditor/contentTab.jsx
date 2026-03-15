import { useState, useRef, useEffect } from "react";
import ArticlePrompt from "../../components/prompt";

export default function ContentTab({selectedTab, templateData, saveFunction}){
  const index = 1;
  const prompts = useRef([])
  const templateRef = useRef(templateData)

  //Don't question it. I am going mad
  useEffect(() => {
    templateRef.current = templateData
  }, [templateData])

  saveFunction.current = () => {
    const contentsObj = {}
    prompts.current.forEach((x,i) => {
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
                getContents={(el) => prompts.current[i] = el}></ArticlePrompt>
            )
          }
        )
      }
    </div>
  )
}