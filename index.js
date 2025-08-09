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
    hash,
    updateArticleRefWeb
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
const ExportManager = require("./include/ExportManager")
const {
    json
} = require("stream/consumers");
const { truncateSync } = require("fs");

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


//Don't cache. its not worth it to make exceptions
app.disable('etag');
app.use((req, res, next) => {
    delete req.headers['if-modified-since'];
    delete req.headers['if-none-match'];
    res.setHeader('Surrogate-Control', 'no-store');
    res.setHeader(
        'Cache-Control',
        'no-store, no-cache, must-revalidate, proxy-revalidate'
    );
    res.setHeader('Expires', '0');
    next();
})


app.use(Express.static("./static"));
app.use(Express.static("./files"));
app.use(Express.json({
    limit: '10mb'
}));
app.use(Express.text({
    type: 'text/plain'
}));

app.listen(PORT, HOST, function () {
    LogManager.log(
        `${FgGreen}World Loom is running.\nAccess the application at ${Reset}${Underscore}http://${HOST}:${PORT}`
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
    let referencebles = []
    if (!type) {
        for (let template of templates) {
            for (let i = 0; i < template["inheritors"]?.length; i++) {
                let article = articles.find(x => x["data"]["uid"] == template["inheritors"][i])
                if (!article) continue;
                referencebles.push({
                    text: article["text"],
                    uid: article["data"]["uid"]
                });
            }
        }
        res.status(200).send([{
            text: "",
            uid: null
        }].concat(referencebles))
        return
    }

    let template = templates.find(x => x["name"] == type)

    if (!template) {
        res.status(406).send("Fail: template doesn't exist")
        return
    }

    if (!template["inheritors"]) {
        res.status(200).send(referencebles)
        return
    }

    for (let i = 0; i < template["inheritors"]?.length; i++) {
        let article = articles.find(x => x["data"]["uid"] == template["inheritors"][i])
        if (!article) continue;
        referencebles.push({
            text: article["text"],
            uid: article["data"]["uid"]
        });
    }
    res.status(200).send([{
        text: "",
        uid: null
    }].concat(referencebles))
})

app.get("/api/fetchArticle", (req, res) => {
    let projectName = (req.query["project"])
    let uid = req.query["uid"]

    if (projectName == null || !db.checkProjectExists(projectName)) {
        res.status(406).send("Fail: project name is null or project is non-existent")
        return
    }

    let content = FileManager.readFromDataDirectory("articles", projectName, uid)

    if (JSON.parse(content)["data"]) {
        res.send(content)
    } else {
        res.status(406).send("Fail: Not initalized yet")
    }

})

app.get("/api/retrieveTimeline", (req, res) => {
    let projectName = (req.query["project"])

    if (projectName == null || !db.checkProjectExists(projectName)) {
        res.status(406).send("Fail: project name is null or project is non-existent")
        return
    }

    let content = db.getSubdir(projectName, "timeline")
    if(content.length == 0){
        res.send({
            events: [],
            settings: {
                scrollSpeed: 6,
                defaultStartTime: 0,
                numberOfRows: 12
            }
        })
    }
    res.send(content[0])
})

app.post("/api/saveTimeline", (req, res) => {
    let projectName = (req.body["project"])
    let data = (req.body["data"])

    if (projectName == null || !db.checkProjectExists(projectName)) {
        res.status(406).send("Fail: project name is null or project is non-existent")
        return
    }

    db.setSubdir(projectName, "timeline", [data])
    res.send("Success")
})

app.get("/api/fetchScene", (req, res) => {
    let projectName = (req.query["project"])
    let uid = req.query["uid"]

    if (projectName == null || !db.checkProjectExists(projectName)) {
        res.status(406).send("Fail: project name is null or project is non-existent")
        return
    }

    let content = FileManager.readFromDataDirectory("manuscripts", projectName, uid)

    if (JSON.parse(content)["data"]) {
        res.send(content)
    } else {
        res.status(406).send("Fail: Not initalized yet")
    }

})

app.get("/api/deleteScene", (req, res) => {
    let projectName = (req.query["project"])
    let uid = req.query["uid"]

    if (projectName == null || !db.checkProjectExists(projectName)) {
        res.status(406).send("Fail: project name is null or project is non-existent")
        return
    }

    let content = FileManager.deleteFSNode(
        Path.join("manuscripts", projectName, uid)
    )

    res.send(content)

})

app.post("/api/setScene", (req, res) => {
    let projectName = (req.body["project"])
    let uid = req.body["uid"]
    let scene = req.body["scene"]
    let synopsis = req.body["synopsis"]
    let notes = req.body["notes"]
    
    if (projectName == null || !db.checkProjectExists(projectName)) {
        res.status(406).send("Fail: project name is null or project is non-existent")
        return
    }
    
    try{
        FileManager.writeToDataDirectory(
            "manuscripts", projectName, uid, JSON.stringify({
                scene, 
                synopsis, 
                notes
                })
        )    
    }catch{
        res.status(406).send("Fail: Something went wrong along the way")
        return
    }

    res.status(200).send("Sucess")
})

app.get("/api/getScene", (req, res) => {
    let projectName = (req.query["project"])
    let uid = req.query["uid"]

    if (projectName == null || !db.checkProjectExists(projectName)) {
        res.status(406).send("Fail: project name is null or project is non-existent")
        return
    }

    let content = "";
    try{
        content = FileManager.readFromDataDirectory(
            "manuscripts", projectName, uid
        )

        if(!content){
            res.status(406).send("Fail: couldn't read " + uid)
            return
        }
    } catch {
        res.status(406).send("Fail: couldn't read " + uid)
        return
    }

    res.status(200).send(content)
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
            let fileContent = (FileManager.readFromDataDirectory("articles", projectName, uid))
            let prior = JSON.parse(fileContent)
            let posterior = structuredClone(prior)
            posterior.data = data

            // Update inheritor caches for templates
            let templates = db.getSubdir(projectName, "templates")
            let templateIndex = templates.findIndex((x) => x["name"] == data["settings"]["templateName"])
            if (templateIndex == -1) {
                res.status(406).send("Fail: template doesn't exist")
                return
            }

            if (!templates[templateIndex]["inheritors"]) {
                templates[templateIndex]["inheritors"] = [uid]
            }

            if (templates[templateIndex]["inheritors"].findIndex(x => x == uid) == -1) {
                templates[templateIndex]["inheritors"].push(uid)
            }
            db.setWithIndex(projectName, "templates", templateIndex, templates[templateIndex])

            FileManager.writeToDataDirectory("articles", projectName, uid, JSON.stringify(posterior))

            // Update the cross reference on the other articles
            updateArticleRefWeb(projectName, uid, posterior, templates, prior)
            break;
        case "delete":
            FileManager.deleteInDataDirectory("articles", projectName, uid)
            break;
        case "imageUpdate":
            if(db.indexOf(projectName, "articles", (el => el?.data?.uid === uid)) != -1){
                let fileContent = (FileManager.readFromDataDirectory("articles", projectName, uid))
                let prior = JSON.parse(fileContent)
                let posterior = structuredClone(prior)
                posterior.data.design = data; 
                FileManager.writeToDataDirectory("articles", projectName, uid, JSON.stringify(posterior))
            }
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

app.post("/api/setManuscriptTree", (req, res) => {
    let projectName = req.body["project"]
    let tree = req.body["tree"]

    db.setSubdir(projectName, "manuscripts", tree)

    res.status(200).send("Success")
})

app.post("/api/retrieveScene", (req, res) => {
    let projectName = req.body["project"]
    let name = req.body["name"]

    db.setSubdir(projectName, "manuscripts", tree)

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

app.get("/api/getManuscriptTree", (req, res) => {
    let projectName = req.query["project"]

    if (projectName == undefined) {
        res.status(406).send("Fail")
        return
    }
    res.status(200).send(db.getSubdir(projectName, "manuscripts"))
})

app.post('/api/filepond/upload', upload.single("filepond"), function (req, res, next) {
    let fileData = JSON.parse(atob(decodeURIComponent(req.headers["x-file-data"])))
    let projectName = decodeURIComponent(fileData["projectName"]);

    if (!db.checkProjectExists(projectName)) {
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
    if (path) {
        //actually exists. can remove the path
        let success = FileManager.deleteFSNode(path)
        if (success) {
            res.status(200).send(path);
        } else {
            res.status(503).send("Can't delete " + path);
        }
    } else {
        res.status(503).send("Doesn't exist");
    }
})

app.post('/api/filepond/load', (req, res) => {
    let id = req.body
    let fileData = JSON.parse(atob(decodeURIComponent(req.headers["x-file-data"])))
    let projectName = decodeURIComponent(fileData["projectName"]);

    let path = resources.findResourcePath(id, projectName);
    if(path){
        let content = FileManager.readFile(path)
        res.setHeader('Content-Disposition', 'inline');
        res.status(200).send(content);
    }else{
        res.status(406).send("Fail: File doesn't exist");
    }

});

app.get("/api/getProjectList", (req, res) => {
    res.status(200).send(JSON.stringify(db.getProjectList()))
})

app.post("/api/modifyTemplate", (req, res) => {
    let project = req.body["project"]
    let name = req.body["name"]
    let oldname = req.body["oldName"]
    let template = req.body["template"]

    if (!db.checkProjectExists(project)) {
        res.status(404).send("Fail: project does not exist")
        return
    }

    const deleteBranch = () => {
        let index = templates.findIndex((x) => x["name"] == oldname)
        let oldTemp = templates[index].template
        console.log(templates[index].inheritors)

        for(let inheritor of templates[index].inheritors){
            let prior = JSON.parse(FileManager.readFromDataDirectory("articles", project, inheritor))
            prior.data.settings.templateName = ""
            FileManager.writeToDataDirectory("articles", project, inheritor, JSON.stringify(prior))
        }

        for (let i = 0; i < oldTemp.length; i++) {
            let prompt = oldTemp[i]
            if (prompt.type === 'Reference' && prompt.crossRefT) {
                let referenceTempIndexOld = templates?.findIndex(x => x.name == prompt.rtype)
                referenceTempIndexOld = referenceTempIndexOld === undefined ? -1 : referenceTempIndexOld
                if (referenceTempIndexOld !== -1) {
                    let referencePromptIndexOld = templates[referenceTempIndexOld]?.template.findIndex(x =>
                        x.promptName == prompt.crossRefT) ?? -1
                    templates[referenceTempIndexOld].template[referencePromptIndexOld].rtype = ""
                    templates[referenceTempIndexOld].template[referencePromptIndexOld].crossRefT = ""
                }
            }
        }

    }

    const appendBranch = () => {
        for (let i = 0; i < template.length; i++) {
            let prompt = template[i]
            if (prompt.type === 'Reference' && prompt.crossRefT) {
                //add new references
                let referenceTempIndex = templates.findIndex(x => x.name == prompt.rtype)
                let referencePromptIndex = templates[referenceTempIndex]?.template.findIndex(x => x
                    .promptName == prompt.crossRefT) ?? -1
                //if the referenced thing doesn't exist then dont reference it
                if (referenceTempIndex === -1 || referencePromptIndex === -1) {
                    template[i].rtype = ""
                    template[i].crossRefT = ""
                    continue
                }
                templates[referenceTempIndex].template[referencePromptIndex].rtype = name
                templates[referenceTempIndex].template[referencePromptIndex].crossRefT = prompt.promptName
            }
        }
    }

    let templates = db.getSubdir(project, "templates")

    let index = templates.findIndex((x) => x["name"] == oldname)
    if (oldname && index !== -1) {
        if (name) {
            // Overwrite
            deleteBranch()
            templates[index].name = name
            templates[index].template = template
            appendBranch()
        } else {
            // Delete
            let index = templates.findIndex((x) => x["name"] == oldname)
            deleteBranch()
            if (index != -1) {
                templates.splice(index, 1);
            }
        }
    } else {
        if (name) {
            // Append
            appendBranch()
            if (!templates.find(t => t.name === name)) {
                templates.push({
                    name,
                    template,
                    inheritors: []
                })
            } else {
                res.status(406).send("Fail: name already exists but oldname does not")
                return
            }
        } else {
            // Fail
            res.status(406).send("Fail: neither name nor oldname exists")
            return
        }
    }
    db.setSubdir(project, "templates", templates)

    res.status(200).send("Accepted")
})

app.get("/api/getTemplateList", (req, res) => {
    let project = req.query["project"]

    if (!db.checkProjectExists(project)) {
        res.status(404).send("Fail: project does not exist")
        return
    }

    let templates = db.getSubdir(project, "templates")

    res.status(200).send(templates.map(x => x.name))
})

app.get("/api/exportProject", (req, res) => {
    let project = req.query["project"]

    if (!db.checkProjectExists(project)) {
        res.status(404).send("Fail: project does not exist")
        return
    }

    let articles = db.getSubdir(project, "articles")
    let manuscripts = db.getSubdir(project, "manuscripts")

    ExportManager.createMainPage(project, articles, manuscripts, [])
    ExportManager.copyStyleFiles(project)
    ExportManager.exportArticles(project,
        articles,
        db.getSubdir(project, "templates"),
        resources)
    ExportManager.exportTimeline(project, db.getSubdir(project, "timeline"))
    ExportManager.exportManuscripts(project, db.getSubdir(project, "manuscripts"))
    ExportManager.extract(project, res);
})

app.get("/api/exportTemplates", (req, res) => {
    let project = req.query["project"]

    if (!db.checkProjectExists(project)) {
        res.status(404).send("Fail: project does not exist")
        return
    }

    let templates = db.getSubdir(project, "templates")

    res.status(200).send(templates)
})

app.post("/api/importTemplates", (req, res) => {
    let project = req.body["project"]
    let templates = req.body["templates"]

    if (!db.checkProjectExists(project)) {
        res.status(404).send("Fail: project does not exist")
        return
    }

    db.setSubdir(project, "templates", JSON.parse(templates))

    res.status(200).send(templates)
})


app.get("/api/getTemplate", (req, res) => {
    let project = req.query["project"]
    let name = req.query["name"]

    if (!db.checkProjectExists(project)) {
        res.status(404).send("Fail: project does not exist")
        return
    }

    let templates = db.getSubdir(project, "templates")
    let template = templates.find((x) => x["name"] == name)

    if (!template) {
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