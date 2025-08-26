
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

const FS = require("fs");
const Path = require("node:path");
const { FgBlue, FgGreen, FgRed, Reset, Underscore } = require("./Colors");
const {LogManager} = require("./LogManager");
const { existsSync } = require("node:fs");
const { cwd } = require("node:process");

class DirectoryManager {
  static createDirectory(path, onFailMessage, onSuccessAction = null) {
    if (!FS.existsSync(path)) {
      LogManager.log(`${FgBlue}Creating ${path} ${Reset}`);
      FS.mkdirSync(path, (err) => {
        LogManager.error(
          `${FgRed}Failed creating ${onFailMessage}.${Reset} Exiting...`
        );
        process.exit();
      });
      if (onSuccessAction) onSuccessAction();
    }
  }

  static  directoryExists(path){
      return FS.existsSync(path)
  }
}

class FileManager {
  static templates = {};
  static outputDir = Path.join(cwd(), "files", "output");

  static writeFileToOutput(filename, content) {
    try {
      FS.writeFileSync(Path.join(FileManager.outputDir, filename), content, {
        encoding: "utf8",
      });
    } catch (e) {
      LogManager.error(e);
      throw new Error("Cannot write " + filename + " to output.");
    }
  }

  static copyResourcesToOutput(project) {
    let files = this.fetchAllfiles(Path.join(cwd(), "templates"));
    for (let file of files) {
      if (file.endsWith(".css")) {
        FS.cpSync(
          file,
          Path.join(FileManager.outputDir, Path.basename(file)),
          {
            force: true,
          }
        );
      }
    }

    FS.cpSync(
      Path.join(".", "files", "resources", project),
      Path.join(FileManager.outputDir, "resources"),
      {
        force: true,
        recursive: true,
      }
    );   
    
    FS.cpSync(
      Path.join(".", "templates", "resources"),
      Path.join(FileManager.outputDir, "resources"),
      {
        force: true,
        recursive: true,
      }
    );
  }

  static fetchAllfiles (fullPath) {
    let files = [];
    FS.readdirSync(fullPath).forEach(file => {
        const absolutePath = Path.join(fullPath, file);
        if (FS.statSync(absolutePath).isDirectory()) {
            const filesFromNestedFolder = this.fetchAllfiles(absolutePath);
            filesFromNestedFolder.forEach(file => {
                files.push(file);
            })
        } else return files.push(absolutePath);
    });
    return files
}


  static fetchTemplate(tempName) {
    if (templates[tempName]) return templates[tempName];
    let decoder = new TextDecoder("utf8");
    try {
      let res = decoder.decode(
        FS.readFileSync(Path.join(".", "templates", tempName) + ".html")
      );
      templates[tempName] = res;
      return res;
    } catch {
      throw new Error("Template " + tempName + " not found");
    }
  }

  static writeFile(path, content) {
    try {
      FS.writeFileSync(path, content);
    } catch (err){
      LogManager.error(`${FgRed}Failed to write to ${path}: ${err} ${Reset}`);
    }
  }

  static readFile(path) {
    try {
      return FS.readFileSync(path);
    } catch (err){
      LogManager.error(`${FgRed}Failed to read from ${path}: ${err} ${Reset}`);
    }
    return "";
  }

  static deleteFSNode(path){
    if(!FS.existsSync(path)) {
      LogManager.error(`${FgRed}Failed to delete ${path}: Doesn't exist ${Reset}`);
      return false
    }
    try{
      if (FS.lstatSync(path).isDirectory()) {
        FS.rmdirSync(path, {recursive: true})
        return true
      }
      FS.rmSync(path)
    }catch(err){
      LogManager.error(`${FgRed}Failed to delete ${path}: ${err} ${Reset}`);
      return false
    }
    return true
  }

  static writeToDataDirectory(directory="articles", projectName , filename, content){
    let path = Path.join("files", directory, encodeURIComponent(projectName), filename)
    this.writeFile(path, content)
    return path
  }

  static readFromDataDirectory(directory="articles", projectName , filename){
    let path = Path.join("files", directory, encodeURIComponent(projectName), filename)
    let content = this.readFile(path).toString()
    return content
  }

  static deleteInDataDirectory(directory="articles", projectName , filename){
    let path = Path.join("files", directory, encodeURIComponent(projectName), filename)
    return this.deleteFSNode(path)
  }
  
  static existsInDataDirectory(directory="articles", projectName , filename){
    let path = Path.join("files", directory, encodeURIComponent(projectName), filename)
    return FS.existsSync(path)
  }

  static writeImportantFile(file = "database", content = "") {
    switch (file.toLocaleLowerCase()) {
      case "database":
        this.writeFile("files/db.json", content);
        break;
    }
  }

  static readImportantFile(file = "database") {
    switch (file.toLocaleLowerCase()) {
      case "database":
        let content;

        //create the database file if it doesnt already exist
        if(existsSync("files/db.json")){
          content = this.readFile("files/db.json");
        }else{
          this.writeFile("files/db.json", '')
        }

        if (content == "") {
          return '{"projects": []}';
        }

        try{
          JSON.parse(content)
        }catch{
          return '{"projects": []}';
        }

        return content;
      default:
        throw new Error("Predefined file " + file + "does not exist");
    }
  }

  static copyFile(src, dst) {
    try {
      FS.cpSync(src, dst, {
        force: true,
      });
    } catch (err) {
      LogManager.error(
        `${FgRed} Failed to copy file ${src} to ${dst}: ${err}${Reset}`
      );
    }
  }
}

exports.DirectoryManager = DirectoryManager;
exports.FileManager = FileManager;
exports.FS = FS;
