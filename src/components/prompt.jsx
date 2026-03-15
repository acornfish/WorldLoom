import RichTextEditor from './richTextEditor'
import '../styles/prompt.css'
import { useState } from 'react'
import { useImperativeHandle } from 'react'

export const PromptTypes = {
    Number: "Number",
    ShortText: "Short Text",
    RichText: "Rich Text",
    Reference: "Reference"
}

/**
 * @param {Object} props
 * @param {string} props.promptType
 * @param {string} props.promptName
 * @param {import('react').RefObject<{ getContents: () => any }>} props.getContents
 * @returns {import('react').ReactElement}
 */
export default function ArticlePrompt({ promptType, promptName, getContents }) {
    const [value, setValue] = useState()

    useImperativeHandle(getContents, () => value)
    return (
        <>
            <div className='seperator'></div>
            <div className='prompt-container'>
                <h3 className="prompt-label">{promptName}</h3>
                {
                      (promptType == PromptTypes.Number) ?    (<NumberPrompt    promptName={promptName} value={value} setValue={setValue}></NumberPrompt>) 
                    : (promptType == PromptTypes.ShortText) ? (<ShortTextPrompt promptName={promptName} value={value} setValue={setValue}></ShortTextPrompt>)
                    : (promptType == PromptTypes.RichText) ?  (<RichTextEditor  promptName={promptName} value={value} setValue={setValue}></RichTextEditor>)
                    : (promptType == PromptTypes.Reference) ? (<ReferencePrompt promptName={promptName} value={value} setValue={setValue}></ReferencePrompt>)
                    :                                         (<div className='seperator'></div>)
                }
            </div>
        </>    
    )
}

function NumberPrompt ({promptName, value, setValue, get}){
    return (
        <input type="number" className="number-prompt prompt" name={promptName} onChange={(e) => setValue(e.target.value)} defaultValue={value}/>
    )
}

function ShortTextPrompt ({promptName, value, setValue}){
    return (
        <input type="text" class="text-prompt prompt" name={promptName} onChange={(e) => setValue(e.target.value)} defaultValue={value}/>
    )
}

function ReferencePrompt ({promptName, value, setValue}){
    return (
        <select name={promptName} class="reference-prompt prompt" multiple="multiple"></select>
    )
}

