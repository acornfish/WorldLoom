const { FileManager } = require("./FileManager");
const {LogManager} = require("./LogManager")
const crypto = require("crypto")

class Project {
  constructor(name, description = "") {
    this.name = name;
    this.description = description;
    this.articles = [{"id":"root","text":"Articles","icon":true,"li_attr":{"id":"root"},"a_attr":{"href":"#"},"data":{},"parent":"#","type":"default"}];
    this.manuscripts = [];
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
    FileManager.writeImportantFile("database", JSON.stringify({projects: this.#projects}));
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

  getWithID(projectName, subDir, id) {
    let ret;
    this.#projects[this.findProjectIndex(projectName)][subDir].forEach(
      (element, index, array) => {
        if (element.id == id) {
          ret = array[index];
        }
      }
    );
    return ret;
  }

  indexOf(projectName, subDir, id) {
    let ret;
    this.#projects[this.findProjectIndex(projectName)][subDir].forEach(
      (element, index, array) => {
        if (element.id == id) {
          ret = index;
        }
      }
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

  checkProjectExists(projectName){
    return this.findProjectIndex(projectName) !== -1;
  }

  appendToSubdir(projectName, subDir, obj) {
    this.#projects[this.findProjectIndex(projectName)][subDir].push(obj)
    return this.#projects[this.findProjectIndex(projectName)][subDir].length
  }


  addNewProject(project){
    this.#projects.push(project);
    this.saveState()
  }

  getProjectList(){
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
  constructor(db){
    this.#db = db
  }

  addResource(path, hash, project) {
    let index = this.findResource(hash, project)
    if(index == -1){
      //resource doesn't yet exist in database. Add it and return the index 
      return this.#db.appendToSubdir(project, "resources", {
        path,
        hash
      })
    }else {
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
    if(index == -1){
      return false
    }else{
      return this.#db.getSubdir(project,"resources")[index]["path"]
    }    
  }

  removeResource(hash, project){
    let index = this.findResource(hash, project)
    if(index == -1){
      return false
    }else{
      this.#db.removeWithIndex(project, "resources", index)
      return this.#db.getSubdir(project,"resources")[index]["path"]
    }
  }
}

exports.DatabaseManager = DatabaseManager;
exports.ResourceManager = ResourceManager;
exports.Project = Project
exports.uid = () => {
    return (Date.now().toString(36) + Math.random()).replace(/\D/g,'').substring(0, 16).padStart(16, 0);
}
exports.hash = (data) => {
  return crypto.createHash("md5").update(data).digest("hex")
}
