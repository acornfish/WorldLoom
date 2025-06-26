const {FileManager, DirectoryManager} = require("./FileManager")
const Path = require("node:path");
const {LogManager} = require("./LogManager")

class FileCache{
    constructor(directory, filename, content){
        this.directory = directory
        this.filename = filename
        this.content = content
    }
}

class CacheManager{
    constructor(){
        this.items = []
    }

    flush(){
        this.items.forEach(file => {
            let path = Path.join(file.directory, encodeURIComponent(file.filename))
            FileManager.writeFile(path, file.content)  
        })
    }

    add(item) {
        if (!this.items.some(e => e.directory === item.directory && e.filename === item.filename)) { 
            this.items.push(item);
        }
    }

    checkFor(directory, filename){
        let index = this.items.findIndex(i => i.directory === directory && i.filename === filename) 

        if(index == -1){
            return null
        }else {
            return index
        }
    }

    modify(index, file){
        this.items[index] = file;
    }

    refreshContent(index){
        //implement this
    }

    values() {
        return this.items;
    }
}

exports.CacheManager = CacheManager
exports.FileCache = FileCache