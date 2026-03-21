import { useState } from "react"
import WLSelect from "./WLSelect"
import { useEffect } from "react"
import {getProjectList, LS_PROJECT_NAME} from '../utils/api'

export default function ChangeProjectPopup ({style}){
    const [projectList, setProjectList] = useState([])
 
    useEffect(() => {
        (async () => {
            try{
                const res = await getProjectList();
                setProjectList(JSON.parse(res))
            }catch(err){
                console.error(err)
            }

        })()
    },[])

    return (
        <div className="change-project-popup" style={style}>
            <div className="popup-window">
                <h2 className="popup-header">Select project</h2>
                <WLSelect
                    className="change-project-select"
                    options={
                        projectList.map((t,i)=>({value:t,label:t}))
                    }
                    onChange={(e) => {
                        localStorage.setItem(LS_PROJECT_NAME, e.value)
                        window.location.reload()
                    }}
                    defaultValue = {{value: localStorage.getItem(LS_PROJECT_NAME), label: localStorage.getItem(LS_PROJECT_NAME)}}
                ></WLSelect>
                <input type="button" className="create-new-project" id="create-new-project" value="Create new" onClick={() => {window.location = '/createProject'}}></input>
            </div>
        </div>
    )
}