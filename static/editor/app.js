import "../libs/quill.js"
import "../libs/jquery.min.js"
import "/global.js"

var sectionNames = ["MainText", "SideSections", "Settings"]

var selectedTab = 0;
var lastTab = 0;

const urlParams = new URLSearchParams(window.location.search);

const SEPERATOR = "%*%-%"

const articleData = {
    MainText: '{"ops":[{"insert":"\\n"}]}',
    SideText: '{"ops":[{"insert":"\\n"}]}',
    Settings: SEPERATOR,
    Description: ""
}

var mainTextQuill, sideTextQuill;

function handleQuillLinks(value) {
    if (value) {
        var href = prompt('Name:');
        if (href.startsWith("manuscript:")){
            this.quill.format('link', `/index.html?ref=${encodeURIComponent(href.split(':')[1])}&type=manuscript`);
        } else if (href.startsWith("map:")){
            this.quill.format('link', `/index.html?ref=${encodeURIComponent((href.split(':')[1]))}&type=map`);
        } else {
            this.quill.format('link', `/index.html?ref=${encodeURIComponent((href.split(':')[1]))}&type=article`);
        } 
    } else {
        this.quill.format('link', false);
    }   

}

let quillTopbar = [
    [{
        'header': [1, 2, false]
    }],
    ['bold', 'italic', 'underline'],
    ["link", 'image'],
    [{
        'list': 'ordered'
    }, {
        'list': 'bullet'
    },{ 'color': [] }]
]

let saveFunctions = [() => {
        //Main text
        articleData["MainText"] = JSON.stringify(mainTextQuill.getContents())
    },
    () => {
        //Side text
        articleData["SideText"] = JSON.stringify(sideTextQuill.getContents())
    },
    () => {
        //Settings
        let image = $(".image-selector-button").css("background-image").slice(5, -2);
        articleData["Settings"] = $("#articleName").val() + SEPERATOR + image.slice(window.location.origin.length);
    }
]

let initaliztionFunctions = [() => {
        //Main text
        if ($(".image-selector").children().length < 1) { // to check if already initalized
            mainTextQuill = new Quill('#mainText-editor', {
                theme: 'snow',
                modules: {
                    toolbar: {
                        container: quillTopbar,
                        handlers: {
                            link: handleQuillLinks,
                        }
                    }
                },

            });
            mainTextQuill.root.setAttribute('spellcheck', false)
        }
        mainTextQuill.setContents(JSON.parse(articleData["MainText"]))
    },
    () => {
        //Side text
        if ($(".image-selector").children().length < 1) { // to check if already initalized
            sideTextQuill = new Quill('#sideSections-editor', {
                theme: 'snow',
                modules: {
                    toolbar: {
                        container: quillTopbar,
                        handlers: {
                            link: handleQuillLinks,
                        }
                    }
                },

            });
            sideTextQuill.root.setAttribute('spellcheck', false)
        }

        sideTextQuill.setContents(JSON.parse(articleData["SideText"]))
    },
    () => {
        //Settings
        let [name, image] = articleData["Settings"].split(SEPERATOR);
        $.get(`/temps/image-selector.html`, function (data) {
            if ($(".image-selector").children().length < 1) {
                $(".image-selector").append(data)
            }
            $(".image-selector-button").css("background-image",
                `url('${image == "" ? "/resources/default.svg" : image}')`)
        })
        $("#articleName").val(name);

    }
]

function setTabHtml(x) {
    let subTabs = $(".sub-tab")

    subTabs.removeClass("active-tab")
    subTabs.eq(selectedTab).addClass("active-tab")

}

function saveArticle() {
    saveFunctions.forEach(x => x());

    let MainText = articleData["MainText"] ?? ""
    let SideText = articleData["SideText"] ?? ""
    let image = articleData["Settings"] !== null ? (articleData["Settings"]).split(SEPERATOR)[1] :
        "/resources/default.svg"
    let ArticleName = (articleData["Settings"] ?? SEPERATOR).split(SEPERATOR)[0]
    let description = $("#article-description").val() ?? ""

    let lastArticle = (!sessionStorage.getItem("Article")) ? undefined : sessionStorage.getItem("Article");
    ArticleName = ArticleName == "" ? "Article" : ArticleName
    if ((!sessionStorage.getItem("Article"))) {
        retrieveArticle(localStorage.getItem("CurrentProject"), ArticleName).then(() => {
            window.showToast("Article with the same name exists", "danger", 3000)
        }).catch(() => {
            articleSaveRequest(localStorage.getItem("CurrentProject"), ArticleName, MainText, SideText, image,
                description, lastArticle).then(() => {
                    urlParams.delete("new")
                    setTimeout(() => {window.location = "/editor"}, 1000)
                }).catch((e) => {
                    console.log(e);
                })
            window.showToast("Successfuly saved article", "success", 3000)
            sessionStorage.setItem("Article", ArticleName)
            setCurrentArticle()
            
        })
    } else {
        articleSaveRequest(localStorage.getItem("CurrentProject"), ArticleName, MainText, SideText, image, description,
            lastArticle)
        window.showToast("Successfuly saved article", "success", 3000)
        sessionStorage.setItem("Article", ArticleName)
        setCurrentArticle()
    }
}

function articleSaveRequest(project, name, mainText, sideText, image, description, replaceArticle) {
    const apiCall = new XMLHttpRequest();
    apiCall.open('POST', '/api/saveArticle');
    apiCall.setRequestHeader('Content-Type', 'application/json');
    return new Promise((resolve,reject) => {
        let timeout = setTimeout(reject, 5000); 
        apiCall.onload = function () {
            if (!apiCall.responseText.startsWith("Fail")) {
                console.log(apiCall.responseText);
                clearTimeout(timeout);
                resolve(apiCall.responseText ?? "");
            } else {
                console.error('Article save failed. Returned status of ' + apiCall.status);
                reject(apiCall.responseText)
            }
        };
        
        
        const data = {
            Project: project,
            Name: name,
            MainText: mainText,
            SideText: sideText,
            Image: image,
            Description: description
        };
    
        if (typeof replaceArticle !== "undefined") {
            data.ReplaceArticle = replaceArticle
        }
        apiCall.send(JSON.stringify(data))
    })
}


const changeTab = (x) => {
    lastTab = selectedTab;
    selectedTab = sectionNames.indexOf(x);

    switch (x) {
        case "MainText":
            setTabHtml(x);
            break;
        case "SideSections":
            setTabHtml(x);
            break;
        case "Settings":
            setTabHtml(x)
            break;
        default:
            break;
    }
}

function retrieveArticle(project, name) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `/api/retrieveArticle?Project=${project}&Name=${name}`, true);

        xhr.onload = () => {
            if (xhr.status === 200) {
                if (xhr.responseText.startsWith("Fail")) {
                    reject
                }
                const response = (xhr.responseText);
                if (typeof response === 'string' && response.startsWith('Fail:')) {
                    reject(new Error(response));
                } else {
                    resolve(JSON.parse(response));
                }
            } else {
                reject(new Error(`Fail: Returned status of ${xhr.status}`));
            }
        };

        xhr.onerror = () => {
            reject(new Error('Fail: '));
        };

        xhr.send();
    });
}


function setCurrentArticle() {
    if (sessionStorage.getItem("Article") !== "") {
        retrieveArticle(localStorage.getItem("CurrentProject"), sessionStorage.getItem("Article")).then(x => {

            if (typeof x["MainText"] !== 'undefined') articleData["MainText"] = x["MainText"]
            if (typeof x["image"] !== 'undefined') articleData["Settings"] = x["Name"] + SEPERATOR + x["image"]
            if (typeof x["SideText"] !== 'undefined') articleData["SideText"] = x["SideText"]
            if (typeof x["Description"] !== 'undefined') articleData["Description"] = x["Description"];
            $(".article-image").attr("src", (articleData["Settings"] ?? SEPERATOR +
                '/resources/default.svg').split(SEPERATOR)[1])
            $("#article-description").val(articleData["Description"] ?? "")
            $(".article-title").html(x["Name"])

            initaliztionFunctions.forEach(x => x())

            console.log(articleData)
        })
    } else {
        initaliztionFunctions.forEach(x => x())
    }
}

var sections = document.getElementsByClassName("topbar-section")

for (let i = 0; i < sections.length; i++) {
    sections[i].addEventListener("click", () => {
        sections[selectedTab].removeAttribute("selected");
        sections[i].setAttribute("selected", "");
        lastTab = selectedTab;
        selectedTab = i;
        changeTab(sectionNames[i])
    })
}

//initalization
setCurrentArticle()

if (urlParams.get("new") !== null) {
    $(".topbar-section:eq(2)").click()
} else {
    changeTab("MainText")
}


//TODO: do this every update
let articleTitle = document.querySelector(".article-title")
if (articleTitle.scrollWidth > articleTitle.clientWidth) {
    articleTitle.parentElement.setAttribute("class", "article-title-container tooltip-target");
    articleTitle.parentElement.innerHTML += ` 
                <div class="tooltip">
                    <div class="tooltip-text">${articleTitle.innerHTML}</div>
                </div>
    `
}


window.saveArticle = saveArticle;
window.c = () => {
    //debug function
    return (selectedTab)
}