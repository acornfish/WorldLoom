const Process = require("process");
const Path = require("path");

try {
    var Express = require("express");
} catch {
    //console.log is used because LogManager is not yet initalized at this point
    
    console.log(`${FgRed}Required node modules are not installed.\n${Reset}Please run the start script `)
    process.exit(-1);
}

const {
    JSDOM
} = require("jsdom")

const Multer = require("multer")

const {
    DirectoryManager,
    FileManager,
    FS
} = require("./include/FileManager")
const {
    DatabaseManager,
    Project,
    ResourceManager,
    hash
} = require("./include/DatabaseManager")
const {
    FgBlue,
    FgGreen,
    FgRed,
    Reset,
    Underscore
} = require("./include/Colors")
const {
    LogManager
} = require("./include/LogManager");
const { json } = require("stream/consumers");

process.chdir(__dirname);

//Create Directories
{
    DirectoryManager.createDirectory(
        "./files",
        "File storage directory");

    DirectoryManager.createDirectory(
        "./files/resources",
        "Resource storage directory",
        () => {
            FileManager.copyFile("templates/resources/default.svg", "files/resources/default.svg")
        });

    DirectoryManager.createDirectory(
        "./files/manuscripts",
        "Manuscript storage directory");

    DirectoryManager.createDirectory(
        "./files/articles",
        "Article storage directory");

    DirectoryManager.createDirectory(
        "./files/timelines",
        "Timeline storage directory");
}

var db = new DatabaseManager()
var resources = new ResourceManager(db);

//Manage Multer
{
    var storage = (Multer.diskStorage({
        destination: function (req, file, cb) {
            let fileData = JSON.parse(atob(decodeURIComponent(req.headers["x-file-data"])))
            let projectName = fileData["projectName"];
            const dir = Path.join('.', 'files/resources', projectName);

            DirectoryManager.createDirectory(dir, {
                recursive: true
            });

            file.fullPath = dir;

            cb(null, dir);
        },

        filename: function (req, file, cb) {
            let fileData = JSON.parse(atob(decodeURIComponent(req.headers["x-file-data"])))
            let projectName = fileData["projectName"];

            let id = file.hash
            let name = id + Path.extname(file.originalname)

            file.fullPath = Path.join(file.fullPath, name);
            file.id = id;

            cb(null, name);
        },
    }));

    /*
     * Ovverride the diskStorage _handleFile function
     * in order to hash the file before saving it
     * 
     */
    storage._handleFile = async function _handleFile(req, file, cb) {
            var that = this

            let buffer = []

            //consume the stream into buffer
            file.stream.on("data", (chunk) => {
                buffer.push(chunk)
            })

            //wait until entire stream is consumed
            await new Promise((resolve => {
                file.stream.on("end", () => {
                    resolve()
                })
            }))

            //concat all buffers into a singular one
            let resBuffer = Buffer.concat(buffer)

            //hash the content and put it into file descriptor
            file.hash = hash(resBuffer)

            that.getDestination(req, file, function (err, destination) {
                if (err) return cb(err)

                that.getFilename(req, file, function (err, filename) {
                    if (err) return cb(err)

                    var finalPath = Path.join(destination, filename)
                    var outStream = FS.createWriteStream(finalPath)

                    outStream.on('error', cb)
                    outStream.on('finish', function () {
                        cb(null, {
                            destination: destination,
                            filename: filename,
                            path: finalPath,
                            size: outStream.bytesWritten
                        })
                    })
                    outStream.end(resBuffer)
                })
            })
        }
}

const PORT = 1930
const HOST = "127.0.0.1"

const app = Express();

var upload = Multer({
    storage: storage
})
app.use(Express.static("./static"));
app.use(Express.static("./files"));
app.use(Express.json({
    limit: '10mb'
}));
app.use(Express.text({ type: 'text/plain' }));

app.listen(PORT, HOST, function () {
    LogManager.log(
        `${FgGreen}World Loom is running.\nAcess the application at ${Reset}${Underscore}http://${HOST}:${PORT}`
    );
})


//Log (almost) every request
app.use((req, res, next) => {
    const date = new Date().toISOString();
    const endpoint = req.url;
    const statusCode = res.statusCode;

    LogManager.log(`[${date}] - ${endpoint} - ${statusCode}`);

    next();
})


app.post("/api/createProject", (req, res) => {
    let projectName = req.body["Name"];
    let projectDescription = req.body["Description"];

    LogManager.log("Creating project: " + projectName);
    if (typeof projectName == "undefined") {
        res.status(406).send("Fail: Project name is undefined");
        return;
    }

    if (db.checkProjectExists(projectName)) {
        res.status(406).send(`Fail: Project with ${projectName} already exists`);
        return;
    }

    if (typeof projectDescription == "undefined") {
        projectDescription = "";
    }

    db.addNewProject(new Project(projectName, projectDescription))

    //create directories
    try {
        DirectoryManager.createDirectory("files/articles/" + encodeURIComponent(projectName))
        DirectoryManager.createDirectory("files/manuscripts/" + encodeURIComponent(projectName))
        DirectoryManager.createDirectory("files/resources/" + encodeURIComponent(projectName))
        DirectoryManager.createDirectory("files/timelines/" + encodeURIComponent(projectName))
    } catch (err) {
        LogManager.error(`${FgRed} failed to create project directories: ${err}`)
        res.status(503).send("Fail: " + err)
        return
    }


    res.status(200).send("Success");
    return
})

app.post("/api/exit", onExit);

app.post("/api/save", (req, res) => {
    try {
        db.saveState()
    } catch (err) {
        res.status(500).send("Fail: Can't write to database");
    }
    res.status(200).send("Success");
    return;

})

app.get("/api/fetchReferenceables", (req, res) => {
    let projectName = (req.query["project"])
    let type = req.query["type"]
    
    let articles = db.getSubdir(projectName, "articles")
    let templates = db.getSubdir(projectName, "templates")

    let template = templates.find(x => x["name"] == type)
    let referencebles = []

    if(!template) {
        res.status(406).send("Fail: template doesn't exist")
    }

    if(!template["inheritors"]){
        res.status(200).send(referencebles)
        return
    }

    for(let i=0;i<template["inheritors"]?.length; i++){
        let article = articles.find(x => x["data"]["uid"] == template["inheritors"][i])
        if(!article) continue;
        referenceables.push({ text: article["text"], uid: article["data"]["uid"]});
    }
    res.status(200).send(referencebles)
})

app.get("/api/fetchArticle", (req, res) => {
    let projectName = (req.query["project"])
    let uid = req.query["uid"]

    if (projectName == null || !db.checkProjectExists(projectName)) {
        res.status(406).send("Fail: project name is null or project is non-existent")
        return
    }

    let content = FileManager.readFromDataDirectory("articles", projectName, uid)

    if(JSON.parse(content)["data"]){
        res.send(content)
    }else {
        res.status(406).send("Fail: Not initalized yet")
    }

})

app.post("/api/modifyArticle", (req, res) => {
    let projectName = req.body["project"]
    let operation = req.body["operation"]
    let data = req.body["data"]
    let uid = req.body["uid"]

    if (projectName == null || !db.checkProjectExists(projectName)) {
        res.status(406).send("Fail: project name is null or project is non-existent")
        return
    }

    switch (operation) {
        case "create":
            FileManager.writeToDataDirectory("articles", projectName, uid, JSON.stringify(data))
            break;
        case "modify":
            let prior = JSON.parse(FileManager.readFromDataDirectory("articles", projectName, uid))
            prior.data = data

            let templates = db.getSubdir(projectName, "templates")
            let templateIndex = templates.findIndex((x) => x["name"] == data["settings"]["templateName"])
            if(templateIndex == -1){
                res.status(406).send("Fail: template doesn't exist")
                return
            }

            if(!templates[templateIndex]["inheritors"]){
                templates[templateIndex]["inheritors"] = [uid]
            }

            if(templates[templateIndex]["inheritors"].findIndex(x => x == uid) == -1){
                templates[templateIndex]["inheritors"].push(uid)
            }
            db.setWithIndex(projectName, "templates", templateIndex, templates[templateIndex])

            FileManager.writeToDataDirectory("articles", projectName, uid, JSON.stringify(prior))
            break;
        case "delete":
            FileManager.deleteInDataDirectory("articles", projectName, uid)
            break;
        default:
            res.status(406).send("Invalid operation");
            return;
    }
    res.status(200).send("Success")
})

app.post("/api/setArticleTree", (req, res) => {
    let projectName = req.body["project"]
    let tree = req.body["tree"]

    db.setSubdir(projectName, "articles", tree)

    res.status(200).send("Success")
})

app.get("/api/getArticleTree", (req, res) => {
    let projectName = req.query["project"]

    if (projectName == undefined) {
        res.status(406).send("Fail")
        return
    }
    res.status(200).send(db.getSubdir(projectName, "articles"))
})

app.post('/api/filepond/upload', upload.single("filepond"), function (req, res, next) {
    let fileData = JSON.parse(atob(decodeURIComponent(req.headers["x-file-data"])))
    let projectName = decodeURIComponent(fileData["projectName"]);

    if(!db.checkProjectExists(projectName)){
        res.status(404).send("Fail: Project doesn't exist")
        return
    }

    resources.addResource(req.file.fullPath, req.file.id, projectName)
    res.status(200).send(req.file.id);
})

app.delete('/api/filepond/remove', (req, res) => {
    let id = req.body
    let fileData = JSON.parse(atob(decodeURIComponent(req.headers["x-file-data"])))
    let projectName = fileData["projectName"];

    let path = resources.removeResource(id, projectName)
    if (path){
        //actually exists. can remove the path
        let success = FileManager.deleteFSNode(path)
        if(success){
            res.status(200).send(path);
        }else {
        res.status(503).send("Can't delete " + path);
        }
    }else{
        res.status(503).send("Doesn't exist");
    }
})

app.post('/api/filepond/load', (req, res) => {
    let id = req.body
    let fileData = JSON.parse(atob(decodeURIComponent(req.headers["x-file-data"])))
    let projectName = decodeURIComponent(fileData["projectName"]);

    let path = resources.findResourcePath(id, projectName);
    let content = FileManager.readFile(path)
    
    res.setHeader('Content-Disposition', 'inline');
    res.status(200).send(content);
});

app.get("/api/getProjectList", (req, res) => {
    res.status(200).send(JSON.stringify(db.getProjectList()))
})

app.post("/api/modifyTemplate", (req, res) => {
    let project = req.body["project"]
    let name = req.body["name"]
    let template = req.body["template"]

    if(!db.checkProjectExists(project))
    {
        res.status(404).send("Fail: project does not exist")
        return
    }

    let templates = db.getSubdir(project, "templates")
    let index = templates.findIndex((x) => x["name"] == name)
    
    if(index == -1){
        db.appendToSubdir(project, "templates", {
            name, 
            template,
            inheritors: []
        })
    }else{
        let prev = db.getWithIndex(project, "templates", index)
        prev.name = name
        prev.template = template
        db.setWithIndex(project, "templates", index, prev)
    }


    res.status(200).send("Accepted")
})

app.get("/api/getTemplateList", (req,res) => {
    let project = req.query["project"]

    if(!db.checkProjectExists(project))
    {
        res.status(404).send("Fail: project does not exist")
        return
    }

    let templates = db.getSubdir(project, "templates")

    res.status(200).send(templates.map(x => x.name))
})


app.get("/api/getTemplate", (req,res) => {
    let project = req.query["project"]
    let name = req.query["name"]

    if(!db.checkProjectExists(project))
    {
        res.status(404).send("Fail: project does not exist")
        return
    }

    let templates = db.getSubdir(project, "templates")
    let template = templates.find((x) => x["name"] == name)

    if(!template){
        res.status(404).send("Fail: template does not exist")
        return
    }
    res.status(200).send(template["template"] ?? [])
})


app.use((req, res, next) => {
    res.status(404).send("Route not found");
})

function onExit() {
    db.saveState()
    LogManager.log(`${FgBlue}Server is shutting down${Reset}`)
    Process.exit(0)
}

Process.on("SIGINT", onExit);
Process.on("SIGTERM", onExit);