const {
    FileManager
} = require("./FileManager");
const {
    LogManager
} = require("./LogManager")
const crypto = require("crypto")

class Project {
    constructor(name, description = "") {
        this.name = name;
        this.description = description;

        const jstreeBase = (type) => [{
            "id": "root",
            "text": type,
            "icon": true,
            "li_attr": {
                "id": "root"
            },
            "a_attr": {
                "href": "#"
            },
            "data": {},
            "parent": "#",
            "type": "default"
        }]

        this.articles = jstreeBase("Articles");
        this.manuscripts = jstreeBase("Manuscripts");
        this.resources = [];
        this.timeline = [];
        this.templates = [];
    }
}

class DatabaseManager {
    #projects

    constructor() {
        this.#projects = [];
        this.#projects = JSON.parse(FileManager.readImportantFile("database"))["projects"]
        this.saveState()
    }

    saveState() {
        FileManager.writeImportantFile("database", JSON.stringify({
            projects: this.#projects
        }));
    }

    setSubdir(projectName, subDir, content) {
        this.#projects[this.findProjectIndex(projectName)][subDir] = content;
    }

    getSubdir(projectName, subDir) {
        return this.#projects[this.findProjectIndex(projectName)][subDir];
    }

    setWithIndex(projectName, subDir, index, content) {
        this.#projects[this.findProjectIndex(projectName)][subDir][index] = content;
    }

    removeWithIndex(projectName, subDir, index) {

        this.#projects[this.findProjectIndex(projectName)][subDir].splice(index, 1)
    }

    getWithIndex(projectName, subDir, index) {
        return this.#projects[this.findProjectIndex(projectName)][subDir][index];
    }

    setWithID(projectName, subDir, id, content) {
        this.#projects[this.findProjectIndex(projectName)][subDir].forEach(
            (element, index, array) => {
                if (element.id == id) {
                    array[index] = content;
                }
            }
        );
    }

    indexOf(projectName, subDir, callback) {
        let ret;
        this.#projects[this.findProjectIndex(projectName)][subDir].forEach(
            callback
        );
        return ret;
    }

    findProjectIndex(projectName) {
        let index = this.#projects.findIndex((project) => {
            return project.name === projectName;
        });

        if (index == -1) {
            LogManager.error(`Project ${projectName} not found`);
            return -1;
        }
        return index;
    }

    checkProjectExists(projectName) {
        return this.findProjectIndex(projectName) !== -1;
    }

    appendToSubdir(projectName, subDir, obj) {
        this.#projects[this.findProjectIndex(projectName)][subDir].push(obj)
        return this.#projects[this.findProjectIndex(projectName)][subDir].length
    }


    addNewProject(project) {
        this.#projects.push(project);
        this.saveState()
    }

    getProjectList() {
        return this.#projects.map(project => project.name);
    }
}

class ResourceManager {
    /** 
     * @type {DatabaseManager}
     */
    #db

    /**
     * Manages resources in a DatabaseManager
     * Doesn't affect the filesystem on its own
     */
    constructor(db) {
        this.#db = db
    }

    addResource(path, hash, project) {
        let index = this.findResource(hash, project)
        if (index == -1) {
            //resource doesn't yet exist in database. Add it and return the index 
            return this.#db.appendToSubdir(project, "resources", {
                path,
                hash
            })
        } else {
            //resource already exists in database. Return the current index
            return index
        }
    }

    findResource(hash, project) {
        let hashes = this.#db.getSubdir(project, "resources")

        return hashes.findIndex((t) => {
            return t["hash"] == hash
        })
    }

    findResourcePath(hash, project) {
        let index = this.findResource(hash, project)
        if (index == -1) {
            return false
        } else {
            return this.#db.getSubdir(project, "resources")[index]["path"]
        }
    }

    findResourceOutput(hash, project) {
        let index = this.findResource(hash, project)
        if (index == -1) {
            return false
        } else {
            const Path = require("path")
            return Path.join("/resources", encodeURIComponent(encodeURIComponent(project)),
                Path.basename(this.#db.getSubdir(project, "resources")[index]["path"]))
        }
    }

    removeResource(hash, project) {
        let index = this.findResource(hash, project)
        if (index == -1) {
            return false
        } else {
            let path = this.#db.getSubdir(project, "resources")[index]["path"]
            this.#db.removeWithIndex(project, "resources", index)
            return path
        }
    }
}

function differenceArr(first, second) {
    return first.filter(x => !second.includes(x));
}


exports.DatabaseManager = DatabaseManager;
exports.ResourceManager = ResourceManager;
exports.Project = Project
exports.uid = () => {
    return (Date.now().toString(36) + Math.random()).replace(/\D/g, '').substring(0, 16).padStart(16, 0);
}
exports.hash = (data) => {
    return crypto.createHash("md5").update(data).digest("hex")
}

exports.updateArticleRefWeb = (project, uid, article, templates, articleOld) => {
    let content = article?.data?.content;
    let contentOld = articleOld?.data?.content;
    let template = templates.find(t => t.name === article.data.settings.templateName);

    if (!template) return;

    for (let prompt of template.template) {
        if (prompt.type === "Reference" && prompt.crossRefT) {
            try {
                // Handle new references
                if (JSON.stringify(content[prompt.promptName]) !== JSON.stringify([":@null"])) {
                    for (let refId of content[prompt.promptName]) {
                        if(refId == ":@null"){
                            continue
                        }
                        let idOfReference = refId.slice(2); // remove ":@"
                        let data = FileManager.readFromDataDirectory("articles", project, idOfReference);
                        let parsed = JSON.parse(data);

                        let crossRef = parsed.data.content[prompt.crossRefT] || [];
                        if (!crossRef.includes(":@" + uid)) {
                            crossRef.push(":@" + uid);
                            parsed.data.content[prompt.crossRefT] = crossRef;
                            FileManager.writeToDataDirectory("articles", project, idOfReference, JSON.stringify(parsed));
                        }
                    }
                }

                
                
                // Handle old references (remove back-references)
                if (contentOld && JSON.stringify(contentOld[prompt.promptName]) !== JSON.stringify(content[prompt.promptName])) {
                    let removed = differenceArr( contentOld[prompt.promptName], content[prompt.promptName] )
                    for (let oldRefId of removed || []) {
                        let idOfOldReference = oldRefId.slice(2);
                        let data = FileManager.readFromDataDirectory("articles", project, idOfOldReference);
                        let parsed = JSON.parse(data);
                        let crossRef = parsed.data.content[prompt.crossRefT] || [];
                        parsed.data.content[prompt.crossRefT] = crossRef.filter(e => e !== ":@" + uid);
                        if (parsed.data.content[prompt.crossRefT].length === 0) {
                            parsed.data.content[prompt.crossRefT] = [":@null"];
                        }
                        FileManager.writeToDataDirectory("articles", project, idOfOldReference, JSON.stringify(parsed));
                    }

                }

            } catch (err) {
                console.error(`Error updating references for article ${uid}:`, err);
            }
        }
    }
}
