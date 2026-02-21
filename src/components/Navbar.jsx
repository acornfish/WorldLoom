import React, {useState} from "react";
import { useNavigate } from "react-router-dom";

function Navbar (){
    var [navbarCollapsed, setNavbarCollapsed]  = useState(true);
    const navigate = useNavigate()

    return (
        <div className="Navbar" collapsed={navbarCollapsed?".":undefined}>
            <div className="NavbarButtons">
                <div>
                    <button onClick={() => {navigate('/dashboard')}}><i className="fa-solid fa-table-columns fa-lg"></i></button>
                    <span className="tooltip">Dashboard</span>
                </div>
                <div>
                    <button onClick={() => {window.location = '/maps'}}><i className="fa-solid fa-map fa-lg"></i></button>
                    <span className="tooltip">Maps</span>
                </div>
                <div>
                    <button onClick={() => {window.location = '/manuscripts'}}><i className="fa-solid fa-book fa-lg"></i></button>
                    <span className="tooltip">Manuscripts</span>
                </div> 
                <div>
                    <button onClick={() => {window.location = '/timelines'}}><i className="fa-solid fa-timeline fa-lg"></i></button>
                    <span className="tooltip">Timelines</span>
                </div> 
                <div>
                    <button onClick={() => {window.location = '/namegen'}}><i className="fa-solid fa-signature fa-lg"></i></button>
                    <span className="tooltip">Name Generator</span>
                </div>
                <div>
                    <button onClick={() => {window.location = '/settings'}}><i className="fa-solid fa-gear fa-lg"></i></button>
                    <span className="tooltip">Settings</span>
                </div>
                <div>
                    <span className="tooltip">Change Project</span>
                </div> 

            </div>

            <div className="collapse-switch" onClick={() => setNavbarCollapsed(prev => !prev)}></div>
        </div>
    )
}

export default Navbar;