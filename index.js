
const FgRed = "\x1b[31m"
const FgGreen = "\x1b[32m"
const FgBlue = "\x1b[34m"
const Underscore = "\x1b[4m"
const Reset = "\x1b[0m"

const Process = require("process");
const FS = require("fs");
const Path = require('node:path');    

process.chdir(__dirname);

try{
    var Express = require("express");
}catch{
    console.log(`${FgRed}Required node modules are not installed.\n${Reset}Please run the start script `)
    process.exit(-1);
}


if(!FS.existsSync("./files")){
    console.log(`${FgBlue}File storage directory did not exist. Creating...${Reset}`)
    FS.mkdirSync(process.cwd() + "/files", (err) => {
        console.log(`${FgRed}Failed creating file storage directory.${Reset} Exiting...`)
        process.exit()
    })
    FS.mkdirSync(process.cwd() + "/files/resources",(err) => {
        console.log(`${FgRed}Failed creating resource storage directory.${Reset} Exiting...`)
        process.exit()
    })
}
if(!FS.existsSync("./files/resources")){
    console.log(`${FgBlue}Resource storage directory did not exist. Creating...${Reset}`)
    FS.mkdirSync(process.cwd() + "/files/resources",(err) => {
        console.log(`${FgRed}Failed creating resource storage directory.${Reset} Exiting...`)
        process.exit()
    })
}

const PORT = 2012
const app = Express();

app.use(Express.static("./static"));
app.use(Express.static("./files"));
app.use(Express.json());

app.listen(PORT, '127.0.0.1', function () {
    console.log(`${FgGreen}StoryLab is running.\nAcess the application at ${Reset}${Underscore}http://127.0.0.1:${PORT}`);
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
        Maps: []
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
    res.status(200).send("Sucess");

})

app.post("/api/createArticle", (req, res) => {
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

app.post("/api/createMap", (req, res) => {
    const map = req.body["MapResource"];
    const name = req.body["Name"];
    const description = req.body["Description"];
    const replaceMap = req.body["ReplaceName"];
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
        return x["Name"] == replaceMap;
    })

    if(mapIndex === -1){
        dbFile.projects[projectIndex]["Maps"].push({
            Name: name,
            MapResource: map,
            Pins: [],
            Description: description
        });
    }else{
        dbFile.projects[projectIndex]["Maps"][replaceMap] = {
            Name: name,
            MapResource: map,
            Pins:  dbFile.projects[projectIndex]["Maps"][replaceMap]["Pins"],
            Description: description
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
        dbFile.projects[projectIndex]["Maps"][MapIndex]["Pins"] = JSON.parse(pins);
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