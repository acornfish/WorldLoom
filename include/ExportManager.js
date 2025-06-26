const {
    FileManager,
    DirectoryManager
} = require("./FileManager")

exports.createMainPage = function (articleNames) {
        FileManager.deleteFSNode("./files/output")
        DirectoryManager.createDirectory(
            "./files/output",
            "Output directory");

        let articleList = []
        articleNames.forEach(article => {
            
        });


        let outputIndex = fetchTemplate("index");
        outputIndex = outputIndex
            .replaceAll("${projectName}", project)
            .replaceAll("${articleList}", articleList)
            .replaceAll("${ManuscriptList}", manuscriptList)
            .replaceAll("${mapList}", mapList)

}

exports.exportArticles = function () {
    DirectoryManager.createDirectory(
        "./files/articles",
        "Output article directory");
}

let templates = {}

function fetchTemplate(tempName) {
    if (templates[tempName]) return templates[tempName];
    let decoder = new TextDecoder("utf8");
    try {
        let res = decoder.decode(FileManager.readFile(Path.join(".", "templates", tempName) + ".html"));
        templates[tempName] = res;
        return res;
    } catch {
        throw new Error("Template " + tempName + " not found")
    }
}