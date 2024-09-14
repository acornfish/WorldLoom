const FgRed = "\x1b[31m"
const FgGreen = "\x1b[32m"
const FgBlue = "\x1b[34m"
const Underscore = "\x1b[4m"
const Reset = "\x1b[0m"

const Process = require("process");
const FS = require("fs");
const Path = require('node:path');
const {
    QuillDeltaToHtmlConverter
} = require("quill-delta-to-html")
const Archiver = require("archiver")

process.chdir(__dirname);
const outputDir = Path.join(__dirname, "files", "output");

try {
    var Express = require("express");
} catch {
    console.log(`${FgRed}Required node modules are not installed.\n${Reset}Please run the start script `)
    process.exit(-1);
}


if (!FS.existsSync("./files")) {
    console.log(`${FgBlue}File storage directory did not exist. Creating...${Reset}`)
    FS.mkdirSync(process.cwd() + "/files", (err) => {
        console.log(`${FgRed}Failed creating file storage directory.${Reset} Exiting...`)
        process.exit()
    })
}
if (!FS.existsSync("./files/resources")) {
    console.log(`${FgBlue}Resource storage directory did not exist. Creating...${Reset}`)
    FS.mkdirSync(process.cwd() + "/files/resources", (err) => {
        console.log(`${FgRed}Failed creating resource storage directory.${Reset} Exiting...`)
        process.exit()
    })
    FS.copyFileSync("default.svg", "files/resources/default.svg")
}
if (!FS.existsSync("./files/manuscripts")) {
    console.log(`${FgBlue}Manuscript storage directory did not exist. Creating...${Reset}`)
    FS.mkdirSync(process.cwd() + "/files/manuscripts", (err) => {
        console.log(`${FgRed}Failed creating resource storage directory.${Reset} Exiting...`)
        process.exit()
    })
}
const PORT = 2012
const app = Express();

const deltaToHTMLConfig = {}

app.use(Express.static("./static"));
app.use(Express.static("./files"));
app.use(Express.json());
app.use(Express.text());
app.use((req, res, next) => { 
    const date = new Date().toISOString();
    const endpoint = req.url;
    const statusCode = res.statusCode;
  
    console.log(`[${date}] - ${endpoint} - ${statusCode}`);
  
    next();
  }
)

app.listen(PORT, '127.0.0.1', function () {
    console.log(
        `${FgGreen}StoryLab is running.\nAcess the application at ${Reset}${Underscore}http://127.0.0.1:${PORT}`
    );
})

var dbFile = {
    projects: []
};

const fetchAllfiles = (fullPath) => {
    let files = [];
    FS.readdirSync(fullPath).forEach(file => {
        const absolutePath = Path.join(fullPath, file);
        if (FS.statSync(absolutePath).isDirectory()) {
            const filesFromNestedFolder = fetchAllfiles(absolutePath);
            filesFromNestedFolder.forEach(file => {
                files.push(file);
            })
        } else return files.push(absolutePath);
    });
    return files
}

let templates = {}

function fetchTemplate(tempName) {
    if (templates[tempName]) return templates[tempName];
    let decoder = new TextDecoder("utf8");
    try {
        let res = decoder.decode(FS.readFileSync(Path.join(".", "templates", tempName) + ".html"));
        templates[tempName] = res;
        return res;
    } catch {
        throw new Error("Template " + tempName + " not found")
    }
}

function copyCssFilesToOutput() {
    let files = fetchAllfiles("./templates");
    for (let file of files) {
        if (file.endsWith(".css")) {
            FS.cpSync(Path.join(__dirname, file), Path.join(outputDir, Path.basename(file)), {
                force: true
            })
        }
    }
}

function copyResourcesToOutput() {
    FS.cpSync(Path.join(".", "files", "resources"), Path.join(outputDir, "resources"), {
        force: true,
        recursive: true
    })
}

function writeFileToOutput(filename, content) {
    try {
        FS.writeFileSync(Path.join(outputDir, filename), content, {
            encoding: "utf8"
        })
    } catch (e) {
        console.log(e)
        throw new Error("Cannot write " + filename + " to output.")
    }
}


function convertDeltaToHTML(delta) {
    return (new QuillDeltaToHtmlConverter(delta["ops"], deltaToHTMLConfig)).convert()
}

function encodeScene(scene, synopsis, notes) {
    const encoder = new TextEncoder();

    const sceneBytes = encoder.encode(scene);
    const synopsisBytes = encoder.encode(synopsis);
    const notesBytes = encoder.encode(notes);

    const headerBytes = new Uint8Array(12);
    headerBytes.set([
        sceneBytes.length >> 24, (sceneBytes.length >> 16) & 0xFF, (sceneBytes.length >> 8) & 0xFF, sceneBytes
        .length & 0xFF,
        synopsisBytes.length >> 24, (synopsisBytes.length >> 16) & 0xFF, (synopsisBytes.length >> 8) & 0xFF,
        synopsisBytes.length & 0xFF,
        notesBytes.length >> 24, (notesBytes.length >> 16) & 0xFF, (notesBytes.length >> 8) & 0xFF, notesBytes
        .length & 0xFF,
    ]);

    const fileData = new Uint8Array(headerBytes.length + sceneBytes.length + synopsisBytes.length + notesBytes.length);
    fileData.set(headerBytes);
    fileData.set(sceneBytes, headerBytes.length);
    fileData.set(synopsisBytes, headerBytes.length + sceneBytes.length);
    fileData.set(notesBytes, headerBytes.length + sceneBytes.length + synopsisBytes.length);

    return fileData;
}

function parseScene(fileData) {
    const dataView = new DataView(fileData);

    const sceneLength = dataView.getUint32(0);
    const synopsisLength = dataView.getUint32(4);
    const notesLength = dataView.getUint32(8);

    const sceneOffset = 12;
    const synopsisOffset = sceneOffset + sceneLength;
    const notesOffset = synopsisOffset + synopsisLength;

    const decoder = new TextDecoder();

    const scene = decoder.decode(fileData.slice(sceneOffset, sceneOffset + sceneLength));
    const synopsis = decoder.decode(fileData.slice(synopsisOffset, synopsisOffset + synopsisLength));
    const notes = decoder.decode(fileData.slice(notesOffset, notesOffset + notesLength));

    return {
        scene,
        synopsis,
        notes
    };
}

function traverseManuscriptTree(tree, currentPath = "./") {
    let files = []
    for (let child of tree) {
        if (child["type"] == "default") {
            //a folder
            files = files.concat(traverseManuscriptTree(child["children"], Path.join(currentPath, child["text"])))
        } else {
            let path = Path.join("files", "manuscripts", (child["data"]["uid"]))
            let sceneContents = FS.readFileSync(path, {
                encoding: 'utf8',
                flag: 'r'
            });
            let encoded = new TextEncoder().encode(sceneContents)
            files.push({
                content: parseScene(encoded.buffer),
                path: currentPath.slice("Root/".length),
                name: child["text"]
            });
        }
    }
    return files;
}

function exportProject(project, res) {
    let projectIndex = dbFile.projects.findIndex(x => {
        return x["Name"] == project;
    })

    try {
        FS.rmSync(outputDir, {
            recursive: true
        });
    } catch (err) {}

    FS.mkdirSync(outputDir);
    FS.mkdirSync(Path.join(outputDir, "articles"));
    FS.mkdirSync(Path.join(outputDir, "maps"));

    copyCssFilesToOutput();
    copyResourcesToOutput();

    //articles 
    let articleTemplate = fetchTemplate("article");
    let articles = dbFile.projects[projectIndex]["Articles"];

    for (let article of articles) {
        let outputArticle = articleTemplate;
        outputArticle = outputArticle
            .replaceAll("${title}", article["Name"])
            .replaceAll("${maintext}", convertDeltaToHTML(JSON.parse(article["MainText"])))
            .replaceAll("${sidetext}", convertDeltaToHTML(JSON.parse(article["SideText"])))
            .replaceAll("${image}", article["image"])
            .replaceAll("${description}", article["Description"])
        writeFileToOutput(`articles/${article["Name"]}.html`, outputArticle)
    }

    //maps
    let mapTemplate = fetchTemplate("map");
    let maps = dbFile.projects[projectIndex]["Maps"];

    for (let map of maps) {
        let outputMap = mapTemplate;
        outputMap = outputMap
            .replaceAll("${mapName}", map["Name"])
            .replaceAll("${mapData}", JSON.stringify(map));
        writeFileToOutput(`maps/${map["Name"]}.html`, outputMap)
    }

    //manuscripts
    let manuscriptTemplate = fetchTemplate("manuscript");
    let manuscriptsTree = dbFile.projects[projectIndex]["Manuscript"];
    let parsedManuscripts = (traverseManuscriptTree(manuscriptsTree))
    for (let manuscript of parsedManuscripts) {
        let outputManuscript = manuscriptTemplate;
        outputManuscript = outputManuscript
            .replaceAll("${scriptName}", manuscript["name"])
            .replaceAll("${scriptSynopsis}", manuscript["content"]["synopsis"])
            .replaceAll("${scriptText}", convertDeltaToHTML(JSON.parse(manuscript["content"]["scene"])))
        let dirName = Path.join(outputDir, "manuscripts", manuscript["path"]);
        FS.mkdir(dirName, {
            recursive: true
        }, (err) => {
            if (err) {
                console.error('Error creating directories:', err);
                return;
            }

            FS.writeFile(Path.join(dirName, manuscript["name"]) + ".html", outputManuscript, (err) => {
                if (err) {
                    console.error('Error creating file:', err);
                    return;
                }

            });
        });
    }


    //finish
    const archive = Archiver('zip', {
        zlib: {
            level: 9
        } 
    });

    res.writeHead(200, { 'Content-Type': 'application/zip', 'Content-Disposition': 'attachment; filename="' + project + '.zip"' });

    archive.on('data', (chunk) => {
        res.write(chunk);
    });
    
    archive.on('finish', () => {
        res.end()
    });

    archive.directory(outputDir, false)

    archive.finalize()

}

app.post("/api/createProject", (req, res) => {
    let projectName = req.body["Name"];
    let projectDescription = req.body["Description"];

    console.log("Creating project: " + projectName);
    if (typeof projectName == "undefined") {
        res.status(200).send("Fail: Project name is undefined");
        return;
    }

    if (dbFile.projects.some((x) => {
            return x["name"] === projectName
        })) {
        res.status(200).send(`Fail: Project with ${projectName} already exists`);
        return;
    }

    if (typeof projectDescription == "undefined") {
        projectDescription = "";
    }

    dbFile.projects.push({
        Name: projectName,
        Description: projectDescription,
        Articles: [],
        Maps: [],
        Manuscript: [{
            "id": 1,
            "text": "Root",
            "children": []
        }],
        Timeline: {
            events: [],
            settings: {
                numberOfRows: 10,
                scrollSpeed: 6,
                defaultStartTime: 0
            }
        }
    });

    res.status(200).send("Sucess");
})

app.post("/api/exit", onExit);

app.post("/api/save", (req, res) => {
    try {
        FS.writeFileSync("./files/db.json", JSON.stringify(dbFile));
    } catch (err) {
        res.status(200).send("Fail: Can't write to database");
        return;
    }
    res.status(200).send(dbFile.projects);

})


app.post("/api/importDatabase", (req, res) => {
    try {
        dbFile = JSON.parse(req.body)
    } catch {
        res.status(406).send("Fail: Data is not json")
        return;
    }
    try {
        FS.writeFileSync("./files/db.json", JSON.stringify(dbFile));
    } catch (err) {
        res.status(406).send("Fail: Can't write to database");
        return;
    }
    res.status(200).send(dbFile.projects);

})




app.post("/api/saveArticle", (req, res) => {
    let articleName = req.body["Name"];
    let mainText = req.body["MainText"] ?? "";
    let description = req.body["Description"] ?? "";
    let sideText = req.body["SideText"] ?? "";
    let image = req.body["Image"] ?? "";
    let project = req.body["Project"];
    let replaceArticle = req.body["ReplaceArticle"];

    if (typeof articleName == "undefined") {
        res.status(200).send("Fail: Article name is undefined");
        return;
    }

    if (typeof project == "undefined") {
        res.status(200).send("Fail: Project name is undefined");
        return;
    }
    if (dbFile.projects.some((x) => {
            return x["Name"] == project;
        })) {
        let index = dbFile.projects.findIndex((x) => {
            return x["Name"] == project;
        })
        if (typeof replaceArticle == "undefined") {
            dbFile.projects[index]["Articles"].push({
                Name: articleName,
                MainText: mainText,
                SideText: sideText,
                image: image,
                Description: description
            });
        } else {
            let articleIndex = dbFile.projects[index]["Articles"].findIndex(x => {
                return x["Name"] === replaceArticle
            });
            dbFile.projects[index]["Articles"][articleIndex].MainText = mainText === "" ? dbFile.projects[index]
                [
                    "Articles"
                ][index].MainText : mainText;
            dbFile.projects[index]["Articles"][articleIndex].SideText = sideText === "" ? dbFile.projects[index]
                [
                    "Articles"
                ][index].SideText : sideText;
            dbFile.projects[index]["Articles"][articleIndex].image = image == {} ? dbFile.projects[index][
                "Articles"
            ][index].image : image;
            dbFile.projects[index]["Articles"][articleIndex].Name = articleName === "" ? dbFile.projects[index][
                "Articles"
            ][index].Name : articleName;
            dbFile.projects[index]["Articles"][articleIndex].Description = description === "" ? dbFile.projects[
                index][
                "Articles"
            ][index].Description : description;
        }


        res.status(200).send("Sucess");
        return;
    } else {
        res.status(200).send("Fail: Mentioned project does not exist");
        return
    }

})

app.post("/api/saveManuscript", (req, res) => {
    const project = req.body["Project"];
    const manuScriptTree = req.body["Data"]

    if (typeof project == "undefined") {
        res.status(200).send("Fail: Project name is undefined");
        return;
    }
    let projectIndex = dbFile.projects.findIndex((x) => {
        return x["Name"] == project;
    })

    if (projectIndex === -1) {
        res.status(200).send("Fail: Specified project does not exist");
        return;
    }


    dbFile.projects[projectIndex]["Manuscript"] = manuScriptTree;
    res.status(200).send("Sucess")
})

app.post("/api/saveTimeline", (req, res) => {
    const project = req.body["Project"];
    const timeline = req.body["Data"]
    console.log(timeline["settings"])

    if (typeof project == "undefined") {
        res.status(200).send("Fail: Project name is undefined");
        return;
    }
    let projectIndex = dbFile.projects.findIndex((x) => {
        return x["Name"] == project;
    })

    if (projectIndex === -1) {
        res.status(200).send("Fail: Specified project does not exist");
        return;
    }


    dbFile.projects[projectIndex]["Timeline"] = timeline;
    res.status(200).send("Sucess")
})

app.get("/api/retrieveManuscript", (req, res) => {
    let project = req.query["Project"];

    if (typeof project === "undefined" || dbFile.projects.every((x) => {
            return x["Name"] != project;
        })) {
        res.status(200).send("Fail: Specified project does not exist");
        return;
    } else {
        res.status(200).send(JSON.stringify(dbFile.projects.find((x) => {
            return x["Name"] == project;
        })["Manuscript"]));
    }
})


app.get("/api/retrieveTimeline", (req, res) => {
    let project = req.query["Project"];

    if (typeof project === "undefined" || dbFile.projects.every((x) => {
            return x["Name"] != project;
        })) {
        res.status(200).send("Fail: Specified project does not exist");
        return;
    } else {
        res.status(200).send(JSON.stringify(dbFile.projects.find((x) => {
            return x["Name"] == project;
        })["Timeline"]));
    }
})

app.post("/api/removeMap", (req, res) => {
    const name = req.body["Name"];
    const project = req.body["Project"];

    if (typeof project == "undefined") {
        res.status(200).send("Fail: Project name is undefined");
        return;
    }

    let projectIndex = dbFile.projects.findIndex((x) => {
        return x["Name"] == project;
    })

    if (projectIndex === -1) {
        res.status(200).send("Fail: Specified project does not exist");
        return;

    }

    let mapIndex = dbFile.projects[projectIndex]["Maps"].findIndex((x) => {
        return x["Name"] == name;
    })

    dbFile.projects[projectIndex]["Maps"].splice(mapIndex, 1)
})

app.post("/api/updateMap", (req, res) => {
    const name = req.body["Name"];
    const description = req.body["Description"];
    const replaceMap = req.body["ReplaceName"];
    const project = req.body["Project"];
    const layers = req.body["Layers"];

    if (typeof project == "undefined") {
        res.status(200).send("Fail: Project name is undefined");
        return;
    }
    let projectIndex = dbFile.projects.findIndex((x) => {
        return x["Name"] == project;
    })
    if (projectIndex === -1) {
        res.status(200).send("Fail: Specified project does not exist");
        return;

    }
    let mapIndex = dbFile.projects[projectIndex]["Maps"].findIndex((x) => {
        return x["Name"] == replaceMap;
    })

    if (mapIndex === -1) {
        dbFile.projects[projectIndex]["Maps"].push({
            Name: name,
            Pins: [],
            Description: description,
            Layers: layers
        });
    } else {
        dbFile.projects[projectIndex]["Maps"][mapIndex] = {
            Name: name,
            Pins: dbFile.projects[projectIndex]["Maps"][mapIndex]["Pins"] ?? [],
            Description: description,
            Layers: layers
        }
    }


    res.status(200).send("Sucess");

})

app.post("/api/setPins", (req, res) => {
    const map = req.body["MapName"];
    const project = req.body["Project"];
    const pins = req.body["Pins"];


    if (typeof project == "undefined") {
        res.status(200).send("Fail: Project name is undefined");
        return;
    }
    let projectIndex = dbFile.projects.findIndex((x) => {
        return x["Name"] == project;
    })
    if (projectIndex == -1) {
        res.status(200).send("Fail: Specified project does not exist");
        return;
    }
    let MapIndex = dbFile.projects[projectIndex]["Maps"].findIndex(x => {
        return x["Name"] == map;
    })
    if (MapIndex == -1) {
        res.status(200).send("Fail: Specified map does not exist");
        return;
    } else {
        dbFile.projects[projectIndex]["Maps"][MapIndex]["Pins"] = (pins);
        res.status(200).send("Sucess");
        return;
    }


})


app.post("/api/retrievePins", (req, res) => {
    const map = req.body["MapName"];
    const project = req.body["Project"];


    if (typeof project == "undefined") {
        res.status(200).send("Fail: Project name is undefined");
        return;
    }
    let projectIndex = dbFile.projects.findIndex((x) => {
        return x["Name"] == project
    });
    if (projectIndex == -1) {
        res.status(200).send("Fail: Specified project does not exist");
        return;
    }
    let MapIndex = dbFile.projects[projectIndex]["Maps"].findIndex(x => {
        return x["Name"] == map;
    })
    if (MapIndex == -1) {
        res.status(200).send("Fail: Specified map does not exist");
        return;
    } else {
        res.status(200).send(dbFile.projects[projectIndex]["Maps"][MapIndex]["Pins"]);
        return;
    }
})


app.get("/api/retrieveMaps", (req, res) => {
    let project = req.query["Project"];

    if (typeof project === "undefined" || dbFile.projects.every((x) => {
            return x["Name"] != project;
        })) {
        res.status(200).send("Fail: Specified project does not exist");
        return;
    } else {
        res.status(200).send(JSON.stringify(dbFile.projects.find((x) => {
            return x["Name"] == project;
        })["Maps"]));
    }
})
app.get("/api/retrieveMap", (req, res) => {
    let project = req.query["Project"];
    let name = req.query["Name"];

    if (typeof project === "undefined" || dbFile.projects.every((x) => {
            return x["Name"] != project;
        })) {
        res.status(200).send("Fail: Specified project does not exist");
        return;
    } else {
        let articles = dbFile.projects.find((x) => {
            return x["Name"] === project
        })["Maps"];

        if (articles.find((x) => {
                return x["Name"] === name
            }) === undefined) {
            res.status(200).send("Fail: Specified map does not exist")
            return;
        }
        res.status(200).send(JSON.stringify(articles.find((x) => {
            return x["Name"] === name
        })))
    }
})


app.get("/api/retrieveArticles", (req, res) => {
    let project = req.query["Project"]

    if (typeof project === "undefined" || dbFile.projects.every((x) => {
            return x["Name"] != project
        })) {
        res.status(200).send("Fail: Specified project does not exist")
        return
    } else {
        res.status(200).send(JSON.stringify(dbFile.projects.find((x) => {
            return x["Name"] == project
        })["Articles"]))
    }
})

app.get("/api/retrieveArticle", (req, res) => {
    let project = req.query["Project"]
    let name = req.query["Name"]

    if (typeof project === "undefined" || dbFile.projects.every((x) => {
            return x["Name"] != project
        })) {
        res.status(200).send("Fail: Specified project does not exist")
        return
    } else {
        let articles = dbFile.projects.find((x) => {
            return x["Name"] === project
        })["Articles"]

        if (articles.find((x) => {
                return x["Name"] === name
            }) === undefined) {
            res.status(200).send("Fail: Specified article does not exist")
            return
        }
        res.status(200).send(JSON.stringify(articles.find((x) => {
            return x["Name"] === name
        })))
    }
})

app.get("/api/removeArticle", (req, res) => {
    let project = req.query["Project"]
    let name = req.query["Name"]

    if (typeof project === "undefined" || dbFile.projects.every((x) => {
            return x["Name"] != project
        })) {
        res.status(200).send("Fail: Specified project does not exist")
        return
    } else {
        let projectIndex = dbFile.projects.findIndex((x) => {
            return x["Name"] === project
        })
        let articles = dbFile.projects[projectIndex]["Articles"]

        if (articles.find((x) => {
                return x["Name"] === name
            }) === undefined) {
            res.status(200).send("Fail: Specified article does not exist")
        }
        let index = articles.findIndex((x) => {
            return x["Name"] === name
        })
        dbFile.projects[projectIndex]["Articles"].splice(index, 1)


        res.status(200).send("Success")
    }
})

app.get("/api/retrieveProjects", (req, res) => {
    let list = []
    dbFile.projects.forEach(x => {
        list.push(x["Name"])
    })
    res.status(200).send(list)
})

app.get("/api/retrieveImageList", (req, res) => {
    let rawList = fetchAllfiles("./files/resources")
    let list = []
    rawList.forEach(str => {
        if ([".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"].some(y => str.endsWith(y))) {
            list.push(str.slice("files".length))
        }
    })
    res.status(200).send(list)
})

app.get("/api/retrieveScene", (req, res) => {
    let sceneName = req.query["name"];
    if (FS.existsSync(`./files/manuscripts/${sceneName}`)) {
        let sceneContents = FS.readFileSync(`./files/manuscripts/${sceneName}`, {
            encoding: 'utf8',
            flag: 'r'
        });
        let encoded = new TextEncoder().encode(sceneContents)
        res.status(200).send(parseScene(encoded.buffer));
    } else {
        res.status(200).send("Fail: Scene does not exist")
        return;
    }
})

app.get("/api/exportProject", (req, res) => {
    let project = req.query["Project"]
    if (typeof project === "undefined" || dbFile.projects.every((x) => {
            return x["Name"] != project
        })) {
        res.status(404).send("Fail: Specified project does not exist")
        return
    } else {
        try {
            exportProject(project,res)
        } catch (e) {
            res.status(406).send("Fail: " + e)
            return;
        }
    }
})


app.post("/api/saveScene", (req, res) => {
    let sceneName = req.body["name"];
    let scene = req.body["scene"];
    let synopsis = req.body["synopsis"];
    let notes = req.body["notes"];
    try {
        FS.writeFileSync(`./files/manuscripts/${sceneName}`, encodeScene(scene, synopsis, notes), {
            encoding: 'utf8',
            flag: 'w'
        });
        res.status(200).send("Success")
    } catch {
        res.status(200).send("Fail: failure when saving scene")
    }
})
app.post("/api/deleteScene", (req, res) => {
    let sceneName = req.body["name"];

    try {
        FS.unlink(`./files/manuscripts/${sceneName}`);
    } catch {
        res.status(200).send("Fail: failure when deleting scene")
    }
})


if (FS.existsSync("./files/db.json")) {
    try {
        dbFile = JSON.parse(FS.readFileSync('./files/db.json'))
    } catch (err) {
        console.log('Error reading file:', err)
    }
} else {
    try {
        FS.writeFileSync("./files/db.json", JSON.stringify(dbFile))
    } catch (err) {
        console.error('Error creating file:', err)
    }
}

function onExit() {
    FS.writeFileSync("./files/db.json", JSON.stringify(dbFile))
    Process.exit(0)
}


Process.on("SIGINT", onExit);
Process.on("SIGTERM", onExit);