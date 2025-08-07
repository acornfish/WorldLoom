const { cwd } = require("process");
const {
    FileManager,
    DirectoryManager,
} = require("./FileManager")
const Path = require("path")
const Archiver = require("archiver")
const {
    QuillDeltaToHtmlConverter,
    InsertDataQuill
} = require("quill-delta-to-html")

var uidToPathTable = {}
var uidToNameTable = {}

exports.createMainPage = function (project, articles, manuscripts, mapNames) {
        if(DirectoryManager.directoryExists(FileManager.outputDir)){
            FileManager.deleteFSNode(FileManager.outputDir)
        }
        DirectoryManager.createDirectory(
            FileManager.outputDir,
            "Output directory");

        let articleList = ""
        let manuscriptList = ""
        let mapList = ""

        let articleTree = buildTree(articles)
        let manuscriptTree = buildTree(manuscripts)
        
        for (const child of articleTree[0]["children"]){
            if(child["type"] != "default"){
                articleList += `<li><a href="articles/${
                    encodeURIComponent(encodeURIComponent(child["text"]))
                }.html">${child["text"]}</a></li>`
            }else{
                articleList += `<li><a href="articles/${
                    encodeURIComponent(encodeURIComponent(child["text"]))
                }/index.html">${child["text"]}</a></li>`
            
            }
        }   
        
        for (const child of manuscriptTree[0]["children"]){
            if(child["type"] != "default"){
                manuscripts += `<li><a href="articles/${
                    encodeURIComponent(encodeURIComponent(child["text"]))
                }.html">${child["text"]}</a></li>`
            }else{
                manuscripts += `<li><a href="articles/${
                    encodeURIComponent(encodeURIComponent(child["text"]))
                }/index.html">${child["text"]}</a></li>`
            
            }
        }

        let outputIndex = fetchTemplate("index");
        outputIndex = outputIndex
            .replaceAll("${projectName}", project)
            .replaceAll("${articleList}", articleList)
            .replaceAll("${ManuscriptList}", manuscriptList)
            .replaceAll("${mapList}", mapList)

        FileManager.writeFileToOutput("index.html", outputIndex);
}

exports.copyStyleFiles = function (project) {
    FileManager.copyResourcesToOutput(project)
}

exports.exportArticles = function (project, articles, templates, resources) {
    let articleOutputDir = Path.join(FileManager.outputDir, "articles")
    
    let traverseArticleTree = (currentNode, currentPath) => {
        let newPath;
        //process this one
        if(currentNode.type == "default"){
            //its a folder
            if(!(currentNode.id == "root")){
                newPath = Path.join(currentPath, encodeURIComponent(currentNode["text"]))
                DirectoryManager.createDirectory(newPath)    

                let template = fetchTemplate("subdirIndex")
                let children = ""

                currentNode["children"].forEach(child => {
                    children += `
                        <li class="${child.type}"><a href="${
                            child.type === "default"
                            ? encodeURIComponent(encodeURIComponent(child["text"])) + "/index.html"
                            : encodeURIComponent(encodeURIComponent(child["text"])) + ".html"}">${child["text"]}</a></li>
                    `
                })

                let content = template.replace("${name}", currentNode["text"]).replace("${files}", children)

                FileManager.writeFile(Path.join(newPath, "index.html"), content)
            }

            //traverse children
            currentNode["children"].forEach((child) => traverseArticleTree(child, 
                (currentNode.id == "root") ? currentPath : newPath
            ));
        }else{
            //its a file, yuppy
            newPath = Path.join(currentPath, encodeURIComponent(currentNode["text"]) + ".html")
            let content = ""
            let template = fetchTemplate("article")
            let data = JSON.parse(
                FileManager.readFromDataDirectory("articles", project, currentNode["data"]["uid"])
            )

            if(!(data?.data)){
                //This means article is created but not initalized. 
                //Its intended behaviour if article is created in dashboard but not saved in 
                //the article editor
                return
            }

            let articleDataTemplate = templates.find(t=> {
                return t["name"] == data["data"]["settings"]["templateName"]
            });

            if(articleDataTemplate == undefined){
                console.log(`Article named ${currentNode["text"]} doesn't have a template`)
                return
            }

            let banner;
            if(data["data"]["design"]["banner"]){
                banner = resources.findResourceOutput(data["data"]["design"]["banner"], project)
            }
            content = buildArticle(template, data["name"], data["data"], articleDataTemplate, banner)

            FileManager.writeFile(newPath, content)
        }
        
    }

    DirectoryManager.createDirectory(
        articleOutputDir,
        "Output article directory");

    let tree = buildTree(articles)
    createUidToPathTable(tree)
    traverseArticleTree(tree[0], articleOutputDir)
}
exports.exportManuscripts = function (project, manuscripts) {
    let manuscriptOutputDir = Path.join(FileManager.outputDir, "manuscripts")

    DirectoryManager.createDirectory(
        manuscriptOutputDir,
        "Output article directory");

    let traverseTree = (currentNode, currentPath) => {
        let newPath;
        if(currentNode.type == "default"){
            //its a folder
            if(!(currentNode.id == "root")){
                newPath = Path.join(currentPath, encodeURIComponent(currentNode["text"]))
                DirectoryManager.createDirectory(newPath)    

                let template = fetchTemplate("subdirIndex")
                let children = ""

                currentNode["children"].forEach(child => {
                    children += `
                        <li class="${child.type}"><a href="${
                            child.type === "default"
                            ? encodeURIComponent(encodeURIComponent(child["text"])) + "/index.html"
                            : encodeURIComponent(encodeURIComponent(child["text"])) + ".html"}">${child["text"]}</a></li>
                    `
                })

                let content = template.replace("${name}", currentNode["text"]).replace("${files}", children)

                FileManager.writeFile(Path.join(newPath, "index.html"), content)
            }
            //traverse children
            currentNode["children"].forEach((child) => traverseTree(child, 
                (currentNode.id == "root") ? currentPath : newPath
            ));
        }else {
            newPath = Path.join(currentPath, encodeURIComponent(currentNode["text"]) + ".html")
            let template = fetchTemplate("manuscript")
            let data = JSON.parse(
                FileManager.readFromDataDirectory("manuscripts", project, currentNode["data"]["uid"])
            )

            let content = buildScene(template, currentNode["text"], data);

            FileManager.writeFile(newPath, content)
        }
    }

    let tree = buildTree(manuscripts)
    traverseTree(tree[0], manuscriptOutputDir)
}

exports.exportTimeline  = function (project, timeline){
    let template = fetchTemplate("timeline")

    let output = template.replace("${timelineData}", JSON.stringify(timeline[0]))

    FileManager.writeFile(Path.join(FileManager.outputDir, "timeline.html"), output)
}

exports.extract = function (project, res){
    let outputDir = Path.join(cwd(), "files", "output")

    const archive = Archiver('zip', {
        zlib: {
            level: 9
        }
    });

    res.writeHead(200, {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="' + project + '.zip"'
    });

    archive.on('data', (chunk) => {
        res.write(chunk);
    });

    archive.on('finish', () => {
        res.end()
        FileManager.deleteFSNode(outputDir)
    });

    archive.directory(outputDir, false)

    archive.finalize()
}

function buildTree(flatList) {
    const idToNode = {};
    const rootNodes = [];

    flatList.forEach(node => {
        idToNode[node.id] = { ...node, children: [] };
    });

    flatList.forEach(node => {
        if (node.parent === "#" || node.parent === null) {
            rootNodes.push(idToNode[node.id]);
        } else {
            const parent = idToNode[node.parent];
            if (parent) {
                parent.children.push(idToNode[node.id]);
            } else {
                console.warn(`Parent not found: ${node.parent}`);
            }
        }
    });

    return rootNodes;
}

function convertDeltaToHTML(delta) {
    if (!delta) return ""

    for(let i=0;i<delta.ops.length;i++){
        if(!delta.ops[i].attributes) continue;
        let ref = delta.ops[i].attributes["articleReference"]
        if(ref){
            let id = ref["id"]
            let text = ref["text"]
            delete delta.ops[i].attributes.articleReference;
            delta.ops[i].attributes.link = uidToPathTable[id];
            delta.ops[i].insert = text;
        }
    }
    let converter = new QuillDeltaToHtmlConverter(delta["ops"], {
        linkTarget: ""
    })
    return converter.convert()
}

function buildScene(template, name, data){
    return template.replaceAll("${scriptName}", name).replaceAll("${scriptSynopsis}", data["synopsis"]).replaceAll("${scriptText}", data["scene"])
}

function buildArticle(htmlTemplate, name, data, template, banner){
    let shortText = "<div><h3>${Name}: </h3><p>${content}</p></div>"
    let reference = "<div><h3>${Name}: </h3><ul>${list}</ul></div>"
    let referenceInner = "<div><a href='${link}'>${content}</a><ul></div>"
    let number = "<div><h3>${Name}: </h3><p>${content}</p></div>"
    let richText = "<div><h3>${Name}: </h3><div class='rich-text'>${content}</div></div>"
    
    if(!(data["content"])){
        return htmlTemplate.replaceAll("\$\{[^}]*\}", "")
    }

    //TODO: replace by stored indexes
    let articleDocument = htmlTemplate
    .replace(/\$\{banner\}/g, banner|| "")
    .replace(/\$\{title\}/g, name || "");

    let dataDocument = ""
    for (const prompt of template["template"]){
        switch (prompt["type"]){
            case "Short Text":
                dataDocument += shortText.replace("${Name}", prompt["promptName"])
                .replace("${content}", data["content"][prompt["promptName"]]);
                break;
            case "Rich Text":
                dataDocument += richText.replace("${Name}", prompt["promptName"])
                .replace("${content}", convertDeltaToHTML(data["content"][prompt["promptName"]]));
                break;
            case "Number": 
                dataDocument += number.replace("${Name}", prompt["promptName"])
                                .replace("${content}", data["content"][prompt["promptName"]]);
                break;
            case "Reference": 
                let ref = (data["content"][prompt["promptName"]])
                let res = "";

                for(let re of ref){
                    if(re == ":@null"){
                        continue
                    }
                    let link = "/"
                    let name = ""
                    if(re.startsWith(":@")){
                        link = uidToPathTable[re.slice(2, re.length)]
                        name = uidToNameTable[re.slice(2, re.length)]
                    }    
                    res += referenceInner
                    .replace("${content}", name)
                    .replace("${link}", link);
                }
                
                dataDocument += reference.replace("${list}", res).replace("${Name}", prompt["promptName"]);
                break;
        }
    }
    

    return articleDocument.replace("${maintext}", dataDocument)
}

let templates = {}

function fetchTemplate(tempName) {
    if (templates[tempName]) return templates[tempName];
    let decoder = new TextDecoder("utf8");
    try {
        let res = decoder.decode(FileManager.readFile(Path.join(cwd(), "templates", tempName) + ".html"));
        templates[tempName] = res;
        return res;
    } catch {
        throw new Error("Template " + tempName + " not found")
    }
}

function createUidToPathTable (tree){
    uidToPathTable = {}
    uidToNameTable = {}

    const recurse = (node, currentPath) => {
        if(node.type == "default"){
            node.children.forEach(child => {
                recurse(child, Path.join(currentPath, encodeURIComponent(encodeURIComponent(node["text"]))))
            });
        }else{
            uidToPathTable[node.data.uid] = Path.join(currentPath, encodeURIComponent(encodeURIComponent(node["text"]) + ".html"))
            uidToNameTable[node.data.uid] = node["text"]
        }

    }

    tree[0].children.forEach(x => {
        recurse(x, "/articles")
    })

}
