import { useState } from 'react'
import '../styles/articleEditor.css'
import ArticlePrompt, { PromptTypes } from '../components/prompt'

export default function ArticleEditor (){
    const [selectedTab, setSelectedTab] = useState(1)

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
              <div className="tab content-tab" index="1" style={{display: selectedTab==1?"block":"none"}}>
                <ArticlePrompt promptType={PromptTypes.Number} promptName="fp"></ArticlePrompt>
                <ArticlePrompt promptType={PromptTypes.Number} promptName="fp"></ArticlePrompt>
                <ArticlePrompt promptType={PromptTypes.Number} promptName="fp"></ArticlePrompt>
              </div>
              <div className="tab design-tab" index="2" style={{display: selectedTab==2?"block":"none"}}>
              </div>
              <div className="tab settings-tab" index="3" style={{display: selectedTab==3?"block":"none"}}>
                <form>
                  <h2>Template</h2>
                  <div id="type-selector-container">
                    <select name="type" id="type-selector" style={{width: "100%"}}> 
                    </select>
                  </div>
                </form>
              </div> 
            </div>
            <input type="button" className="save-button" value="Save"></input>
            <div className="reference-inline-popup">
              <div id="inline-reference-container">
                <select name="reference" id="inline-reference"  style={{width: "100%"}}></select>
              </div>
              <button>Accept</button>
            </div>
        </div>
    )
}