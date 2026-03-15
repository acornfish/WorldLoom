import RichTextEditor from './richTextEditor'
import '../styles/prompt.css'
import { useState } from 'react'
import { useImperativeHandle } from 'react'
import { fetchReferenceables, LS_PROJECT_NAME } from '../utils/api'
import { useEffect } from 'react'
import WLSelect from './WLSelect'

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
export default function ArticlePrompt({ promptType, promptName, getContents, referenceType }) {
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
                    : (promptType == PromptTypes.Reference) ? (<ReferencePrompt promptName={promptName} value={value} setValue={setValue} referenceType={referenceType}></ReferencePrompt>)
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

function ReferencePrompt ({promptName, referenceType, value, setValue}){
    const [referenceables, setReferenceables] = useState([])

    useEffect(() => {
        (async () => {
            let res = await fetchReferenceables(localStorage.getItem(LS_PROJECT_NAME), referenceType)
            if(res.startsWith("Fail")){
                console.warn("Referenceables of type" + referenceType + "couldn't be found") 
            }else {
                setReferenceables(JSON.parse(res))
            }
        })()
    },[])

    return (
        <WLSelect name={promptName} class="reference-prompt prompt" multiple="multiple" 
        options={referenceables?.map((t,i) => {return {value: t.uid, label: t.text}})}
        onChange={setValue}
        isMulti={true}
        >
        </WLSelect>
    )
}

