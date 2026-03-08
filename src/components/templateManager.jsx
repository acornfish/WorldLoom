import '../styles/templateManager.css'

function TemplateManager(){
    return (
        <>
            <div className="templates-container-outer">
                <span className="container-label">Templates</span>
                <div className="templates-container">
                    <button className="template-mass-import-open"><i className="fa-solid fa-download"></i></button>
                    <button className="template-mass-export-open"><i className="fa-solid fa-upload"></i></button>
                    <div className="templates-list">
                        <label className="template-selector new-template">
                            <input type="button" value="1" onClick={() => {window.location = '/templateCreator'}}></input><span><i className="fa-solid fa-plus fa-2xl"></i></span>
                        </label>
                    </div>
                </div>
            </div>
            
            <div className="template-mass-import">
                <button className="template-mass-exchange-close-button">X</button>
                <textarea name="templates" id="template-mass-import-textarea"></textarea>
                <button className="template-mass-import-button">Import</button>            
            </div>
            
            <div className="template-mass-export">
                <button className="template-mass-exchange-close-button">X</button>           
                <textarea name="templates" id="template-mass-export-textarea"></textarea>
                <button className="template-mass-export-button">Export</button>            
            </div>
        </>
    )
}

export default TemplateManager;

