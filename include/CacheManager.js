/*
    Worldloom
    Copyright (C) 2025 Ege Açıkgöz

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, version 3 of the License.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/    

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