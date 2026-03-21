const { DatabaseManager } = require("./DatabaseManager")
const { FileManager } = require("./FileManager")
const QuillDelta = require("quill-delta")
const Delta = QuillDelta.default;

/**
 * 
 * @param {DatabaseManager} db 
 */
module.exports.fixQuillReferences = (db) => {
    const projectList = db.getProjectList()
    const depthReducerF = (project, article, data) => {
        const keys = Object.keys(data.data.content)
        for(let key of keys){
            if(data.data.content[key]["ops"]){
                //its a quill delta! (hopefully)
                const deltaObj = new Delta(data.data.content[key])
                for(let i=0;i<deltaObj.ops.length;i++){
                    if(deltaObj.ops[i]?.attributes?.articleReference &&
                        !(typeof deltaObj.ops[i]?.attributes?.articleReference === "string")
                    ){
                        const newState = JSON.stringify(deltaObj.ops[i]?.attributes?.articleReference);
                        data.data.content[key].ops[i].attributes.articleReference = newState;
                        FileManager.writeToDataDirectory("articles", project, article, JSON.stringify(data));
                    }
                }
            }
        }
    }

    for(let project of projectList){
        let articles = db.getSubdir(project, "articles")
        for(let article of articles.map(x => x.data.uid)){
            if (article){
                let data = FileManager.readFromDataDirectory("articles", project, article)        
                try {
                    let parsed = JSON.parse(data)
                    if(parsed?.data?.content){
                        depthReducerF(project, article, parsed)
                    }
                }catch(err){
                    console.error(err)
                }
            }
        }
    }
}

module.exports.fixReferencePrompts = (db) => {
    const projectList = db.getProjectList()
    const depthReducerF = (project, article, data) => {
        const keys = Object.keys(data.data.content)
        for(let key of keys){
            if(Array.isArray(data.data.content[key]) && data.data.content[key].length){
                data.data.content[key] = data.data.content[key].map(x => {
                    let val = ""
                    val = x;
                    if(x.startsWith(":@")){
                        val = x.slice(2)
                    }
                    if(val != "null") return val
                }).filter(function( element ) {
                    return element !== undefined;
                });
                FileManager.writeToDataDirectory("articles", project, article, JSON.stringify(data));
            }
        }
    }
     
    for(let project of projectList){
        let articles = db.getSubdir(project, "articles")
        for(let article of articles.map(x => x.data.uid)){
            if (article){
                let data = FileManager.readFromDataDirectory("articles", project, article)        
                try {
                    let parsed = JSON.parse(data)
                    if(parsed?.data?.content){
                        depthReducerF(project, article, parsed)
                    }
                }catch(err){
                    console.error(err)
                }
            }
        }
    }
} 

module.exports.fixManuscriptReferences = (db) => {
    const depthReducerF = (project, manuscript, scene, parsed) => {
        const deltaObj = new Delta(scene)
        for(let i=0;i<deltaObj.ops.length;i++){
            if(deltaObj.ops[i]?.attributes?.articleReference &&
                !(typeof deltaObj.ops[i]?.attributes?.articleReference === "string")
            ){
                console.log(deltaObj.ops[i]?.attributes?.articleReference)
                const newState = JSON.stringify(deltaObj.ops[i]?.attributes?.articleReference);
                scene.ops[i].attributes.articleReference = newState;
                parsed.scene = scene;
                FileManager.writeToDataDirectory("manuscripts", project, manuscript, JSON.stringify(parsed));
            }
        }
    }   
    const projectList = db.getProjectList()

    for(let project of projectList){
        let manuscripts = db.getSubdir(project, "manuscripts")
        for(let manuscript of manuscripts.map(x => x.data.uid)){
            if (manuscript){
                let data = FileManager.readFromDataDirectory("manuscripts", project, manuscript)        
                try {
                    let parsed = JSON.parse(data)
                    if(parsed?.scene){
                        depthReducerF(project, manuscript, parsed.scene, parsed)
                    }
                }catch(err){
                    console.error(err)
                }
            }
        }
    }
}