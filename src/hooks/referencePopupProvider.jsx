import {createContext, useContext, useState} from 'react'

const referencePopupContext = createContext();

export function ReferencePopupProvider({children}){
    const [currentReference, setCurrentReference] = useState(null)
    const [isOpen, setIsOpen] = useState(false)

    return (
        <referencePopupContext.Provider value={[{isOpen, setIsOpen}, {currentReference, setCurrentReference}]}>
            {children}
        </referencePopupContext.Provider>
    )
}
export const useReferencePopup = () => useContext(referencePopupContext)