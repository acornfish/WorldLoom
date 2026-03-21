import { useRef, useEffect } from 'react';
import {createContext, useContext, useState} from 'react'
import { fetchReferenceables, LS_PROJECT_NAME } from '../utils/api';
import '../styles/inlineReferencePrompt.css'

const referencePopupContext = createContext();

export function ReferencePopupProvider({children}){
    const [isOpen, setIsOpen] = useState(false)
    const [currentType, setCurrentType] = useState(null)
    const selectObj = useRef()
    const getReferenceRef = useRef();
    const [options, setOptions] = useState([]);


    function openPopup(type){
        setIsOpen(true)

        setCurrentType(type);

        return new Promise(resolve => {
            getReferenceRef.current = resolve
        })
    }

    function acceptReference (e){
        if(getReferenceRef.current){
            getReferenceRef.current(JSON.stringify({
                id: selectObj.current.value,
                text: options[selectObj.current.selectedIndex].text}))
            getReferenceRef.current = null
            
        }
        setIsOpen(false)
    }


    useEffect(() => {
        async function load() {
            const res = await fetchReferenceables(
                localStorage.getItem(LS_PROJECT_NAME),
                currentType
            );

            try{
                const parsed = JSON.parse(res);
                setOptions(parsed);
            }catch {
                console.error("Cannot parse the json result. Did you forget to bind the api again, ***** idiot?")
            }
        }

        load();
    }, [currentType]);


    return (
        <referencePopupContext.Provider value={openPopup}>
            {children}
            <div className="reference-inline-popup" style={{display:isOpen?"block":"none"}}>
              <div id="inline-reference-container">
                <select name="reference" id="inline-reference" style={{width: "100%"}} ref={selectObj}>
                    {
                        options.map(opt => 
                            (<option value={opt.uid}>{opt.text}</option>)
                        )
                    }
                </select>
              </div>
              <button onClick={acceptReference}>Accept</button>
            </div>
        </referencePopupContext.Provider>
    )
}
export const useReferencePopup = () => useContext(referencePopupContext)