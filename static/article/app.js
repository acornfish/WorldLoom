import "../libs/quill.js"
import "../libs/quill.imageUploader.min.js"
import "../libs/jquery.min.js"
import "../libs/select2.min.js"
import "../libs/filepond.js"
import "../libs/filepond.jquery.js"
import "../libs/filepond-plugin-image-preview.js"
import "../libs/filepond-plugin-file-validate-type.js"
import "/global.js"


var imageIDS = {}

const filePondConfig = (proj, type) => {
    return {
        instantUpload: false,
        acceptedFileTypes: ['image/*'],
        server: {
            process: {
                url: '/api/filepond/upload',
                method: 'POST',
                headers: {
                    //form data is not available when processing with multer so I have to pack 
                    //these here
                    'x-file-data': encodeURIComponent(btoa(JSON.stringify({
                        projectName: encodeURIComponent(proj),
                        type: type
                    })))
                },
                onload: (response) => {
                    imageIDS[type] = response
                }
            },
            load: {
                url: '/api/filepond/load',
                method: 'POST',
                headers: {
                    //form data is not available when processing with multer so I have to pack 
                    //these here
                    'x-file-data': encodeURIComponent(btoa(JSON.stringify({
                        projectName: encodeURIComponent(proj),
                        type: type
                    })))
                }
            },
            revert: {
                url: '/api/filepond/remove',
                headers: {
                    //form data is not available when processing with multer so I have to pack 
                    //these here
                    'x-file-data': encodeURIComponent(btoa(JSON.stringify({
                        projectName: encodeURIComponent(proj),
                        type: type
                    })))
                },
                onload: (response) => {
                    imageIDS[type] = null
                }
            }

        }
    }
}


let richtexts = []
var globTemplate = []

const Inline = Quill.import('blots/inline');
const customIcons = Quill.import('ui/icons');

customIcons['articleReference'] = '<i class="fa-solid fa-link" style="color: var(--text-color);"></i>';
class ArticleReferenceBlot extends Inline {
  static create(value) {
    let node = super.create();
    node.setAttribute('href', value.href || '#');
    node.setAttribute('data-js-action', value.action || '');
    node.classList.add('quill-button-link');
    node.innerText = value.text ?? 'Reference';
    return node;
  }

  static formats(node) {
    return {
      href: node.getAttribute('href'),
      action: node.getAttribute('data-js-action'),
      text: node.innerText
    };
  }

  format(name, value) {
    if (name === 'href' || name === 'action' || name === 'text') {
      if (value) {
        if (name === 'text') {
          this.domNode.innerText = value;
        } else {
          this.domNode.setAttribute(
            name === 'action' ? 'data-js-action' : name,
            value
          );
        }
      } else {
        this.domNode.removeAttribute(
          name === 'action' ? 'data-js-action' : name
        );
      }
    } else {
      super.format(name, value);
    }
  }
}

ArticleReferenceBlot.blotName = 'articleReference';
ArticleReferenceBlot.tagName = 'button'; 
ArticleReferenceBlot.className = 'quill-article-reference';

function quillFactory(parent) {
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
        }, {
            'color': []
        }],
        [
            'articleReference'
        ]
    ]

    //TODO: rewrite this
    const handleArticleReferences = (value) => {
        const href = prompt('Enter URL');
        const action = prompt('Enter JS action (optional)');
        const text = prompt('Button text');
        if (href && text) {
          let range = quill.getSelection();
          if (range) {
            quill.formatText(range.index, range.length, 'articleReference', {
              href,
              action,
              text
            });
          }
        }
    }

    let quillContainer = document.createElement("div")
    let quillTextarea = document.createElement("div")
    quillContainer.appendChild(quillTextarea)

    let id = window.domid()

    quillTextarea.setAttribute("id", id)
    quillContainer.classList.add("prompt")
    quillContainer.classList.add("richtext-prompt")

    parent.append(quillContainer)

    let quill = new Quill(`#${id}`, {
        theme: 'snow',
        modules: {
            toolbar: {
                container: quillTopbar,
                handlers: {
                    articleReference: handleArticleReferences,
                }
            }
        },

    })

    richtexts.push(quill)

    return quill
}

function modifyArticle(dataObj) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/modifyArticle", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                window.showToast(`Save Successful`, "success", 2000);
                return true
            } else {
                window.showToast(`Error while saving`, "danger", 2000);
                console.error("Error:", xhr.status, xhr.responseText);
            }
        }
    };

    const payload = {
        project: (localStorage.getItem("CurrentProject")),
        operation: "modify",
        data: dataObj,
        uid: sessionStorage.getItem("Article")
    };

    xhr.send(JSON.stringify(payload));
}


async function getTemplateList(callback) {
    await window.waitForVariable("CurrentProject")

    const xhr = new XMLHttpRequest();
    xhr.open("GET", `/api/getTemplateList?project=${localStorage.getItem("CurrentProject")}`, true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            let data = null;

            try {
                data = JSON.parse(xhr.responseText);
            } catch (e) {
                return callback(xhr.status, null);
            }
            callback(xhr.status, data);
        }
    };

    xhr.send();
}



function fetchArticle(onSuccess, onError) {
    const url = new URL("/api/fetchArticle", window.location.origin);
    url.searchParams.set("project", (localStorage.getItem("CurrentProject")));
    url.searchParams.set("uid", sessionStorage.getItem("Article"));

    const xhr = new XMLHttpRequest();
    xhr.open("GET", url.toString(), true);
    xhr.responseType = "json";

    xhr.onload = () => {
        if (xhr.status === 200) {
            onSuccess(xhr.response);
        } else {
            onError(`Error ${xhr.status}: ${xhr.statusText}`);
        }
    };

    xhr.onerror = () => {
        onError("Network Error or CORS issue");
    };

    xhr.send(); // no body allowed for GET
}

function fetchReferenceables(type, callback) {
    const xhr = new XMLHttpRequest();
    const url =
        `/api/fetchReferenceables?project=${encodeURIComponent(localStorage.getItem("CurrentProject"))}&type=${encodeURIComponent(type)}`;

    xhr.open("GET", url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                try {
                    const data = JSON.parse(xhr.responseText);
                    callback(xhr.status, data);
                } catch (parseErr) {
                    callback(xhr.status, null);
                }
            } else {
                callback(xhr.status, null);
            }
        }
    };
    xhr.send();
}

function getTemplate(callback) {
    const xhr = new XMLHttpRequest();

    xhr.open("GET",
        `/api/getTemplate?project=${localStorage.getItem("CurrentProject")}&name=${localStorage.getItem("TemplateName")}`,
        true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            let data = null;
            try {
                data = JSON.parse(xhr.responseText);
            } catch (e) {
                return callback(xhr.status, null);
            }
            callback(xhr.status, data);
        }
    };

    xhr.send();
}


class ContentTab {
    constructor() {
        //create the form and fill it
        this.form = $(document.createElement("form"))
        $(".content-tab").append(this.form)
    }

    addPrompts(template, content) {
        template.forEach(p => {
            //Create a container 
            let containerElement = $(`<div class="prompt-container"></div>`)
            this.form.append(containerElement)

            //Add prompt title
            let titleElement = $(`<h3 class="prompt-label">${p.promptName}</h3>`)
            containerElement.append(titleElement)

            if (p.type === "Number") {
                let element = $(`<input type="number" class="number-prompt prompt" name=${p.promptName}>`)
                element.on("keydown", (event) => {
                    //prevent writing if text is something else than Ctrl, backspace, delete or a number
                    if (!(event.key == "Backspace" || event.key == "Delete" ||
                            (event.ctrlKey && event.key != "v")) &&
                        isNaN(parseInt(event.key))) {
                        event.preventDefault()
                    }
                })
                containerElement.append(element)
                if (content) {
                    element.val(content[p.promptName])
                }
            } else if (p.type === "Rich Text") {
                quillFactory(containerElement)
                if (content) {
                    richtexts[richtexts.length - 1].setContents(content[p.promptName])
                }
            } else if (p.type === "Short Text") {
                let element = $(`<input type="text" class="text-prompt prompt" name=${p.promptName}>`)
                containerElement.append(element)
                if (content) {
                    element.val(content[p.promptName])
                }
            } else if (p.type == "Reference") {
                let element = $(`<select name="${p.promptName}"  class="reference-prompt prompt"></select>`)
                containerElement.append(element)
                if (p.rtype) {
                    fetchReferenceables(p.rtype, (status, data) => {
                        if (status == 200) {
                            data.forEach(opt => {
                                element.append(`
                                    <option value="${opt.uid}">${opt.text}</option>
                                `)
                            });
                        }
                    })
                }
                element.select2()
            }
            globTemplate = template
        })
    }

    async fetchContent() {
        //Fetch references to input elements
        //richtexts are tracked seperately
        let textPrompts = this.form.find(".text-prompt")
        let numberPrompts = this.form.find(".number-prompt")
        let referencePrompts = this.form.find(".reference-prompt")

        //Track the last fetched input in category
        let textPromptCounter = 0,
            numberPromptCounter = 0,
            referencePromptCounter = 0,
            richtextPromptCounter = 0

        //Initalize the object to store article
        let articleData = {}

        //loop over the definitions in template and fetch all content
        globTemplate.forEach(promptDefinition => {
            if (promptDefinition.type === "Number") {
                let current = (numberPrompts.eq(numberPromptCounter))
                articleData[promptDefinition.promptName] = (current.val())
                numberPromptCounter++

            } else if (promptDefinition.type === "Short Text") {
                let current = (textPrompts.eq(textPromptCounter))
                articleData[promptDefinition.promptName] = (current.val())
                textPromptCounter++

            } else if (promptDefinition.type === "Reference") {
                let current = (referencePrompts.eq(referencePromptCounter))
                articleData[promptDefinition.promptName] = ":@" + (current.val())
                referencePromptCounter++

            } else if (promptDefinition.type === "Rich Text") {
                let current = (richtexts.at(referencePromptCounter))
                articleData[promptDefinition.promptName] = (current.getContents())
                richtextPromptCounter++

            }
        })

        return articleData
    }

    activate() {}
    deactivate() {}
}

class DesignTab {
    constructor() {
        //turn normal inputs into filepond inputs
        $(".thumbnail-prompt").filepond(filePondConfig(
            localStorage.getItem("CurrentProject"),
            "thumbnail"
        ))

        $(".banner-prompt").filepond(filePondConfig(
            localStorage.getItem("CurrentProject"),
            "banner"
        ));

        $(".thumbnail-prompt").on('FilePond:removefile', (e) => {
            $('.thumbnail-prompt').filepond("removeFile", imageIDS["thumbnail"], {
                revert: true
            })
            imageIDS["thumbnail"] = null
        });

        $(".banner-prompt").on('FilePond:removefile', (e) => {
            $('.banner-prompt').filepond("removeFile", imageIDS["banner"], {
                revert: true
            })
            imageIDS["banner"] = null

        });

        //listen for upload event
        $('.thumbnail-prompt').on('FilePond:processfiles', function (e) {
            console.log('file added event', e);
        });

        $('.banner-prompt').on('FilePond:processfiles', function (e) {
            console.log('file added event', e);
        });

    }


    async fetchContent() {
        await $('.thumbnail-prompt').filepond("processFiles")
        await $('.banner-prompt').filepond("processFiles")

        return imageIDS
    }

    setContent(thumbnail, banner) {
        imageIDS["thumbnail"] = thumbnail
        imageIDS["banner"] = banner

        if (thumbnail) {
            $(".thumbnail-prompt").filepond("addFile", thumbnail, {
                type: 'local'
            })
        }
        if (banner) {
            $(".banner-prompt").filepond("addFile", banner, {
                type: 'local'
            })
        }
    }

    activate() {}
    deactivate() {}
}

class SettingsTab {
    constructor() {}
    async fetchContent() {
        return {
            templateName: localStorage.getItem("TemplateName")
        }
    }
    activate() {}
    deactivate() {}
}

var activeTab = 0 // Content Design Settings
const tabs = [new ContentTab(), new DesignTab(), new SettingsTab()]

function setTab(index) {
    tabs[activeTab].deactivate()
    $(".topbar-section").removeClass("selected-section")
    $(".tab").removeClass("active-tab")

    activeTab = index

    tabs[activeTab].activate()
    $(".topbar-section").eq(activeTab).addClass("selected-section")
    $(".tab").eq(activeTab).addClass("active-tab")
}

$(".topbar-section").on("click", (e) => {
    setTab(parseInt(e.currentTarget.getAttribute("index")))
})


//initalization
//Setup libraries
$.fn.filepond.registerPlugin(FilePondPluginImagePreview);
$.fn.filepond.registerPlugin(FilePondPluginFileValidateType);
Quill.register(ArticleReferenceBlot)



$(() => {
    getTemplateList((status, data) => {
        if (status == 200) {
            data.forEach(x => {
                $("#type-selector").append(`
                        <option value="${x}">${x}</option>
                    `)
            })

            $("#type-selector").select2({
                width: "resolve"
            })

            $('#type-selector').on('select2:select', function (e) {
                localStorage.setItem("TemplateName", e.params.data.text)
                window.location.reload()
            });

        }
    })



    //fetch existing article and do nothing if no article exists
    fetchArticle(
        (data) => {
            //sucess
            if (data["data"]["settings"]["templateName"]) {
                localStorage.setItem("TemplateName", data["data"]["settings"]["templateName"])
            }

            tabs[1].setContent(data["data"]["design"]["thumbnail"], data["data"]["design"]["banner"])

            getTemplate((status, temp) => {
                if (status == 200) {
                    tabs[0].addPrompts(temp, data["data"]["content"])
                    $("#type-selector").val(localStorage.getItem("TemplateName"))
                    $("#type-selector").trigger("change")
                } else {
                    window.showToast(`Couldn't fetch template`, "danger", 2000);
                }
            })

        },
        () => {
            //failure 
            getTemplate((status, temp) => {
                if (status == 200) {
                    tabs[0].addPrompts(temp, null)
                    $("#type-selector").val(localStorage.getItem("TemplateName"))
                    $("#type-selector").trigger("change")
                } else {
                    window.showToast(`Couldn't fetch template`, "danger", 2000);
                }
            })
        }
    )


    //Set the event listeners for save button
    let saveButton = $(".save-button")
    saveButton.on("click", async () => {
        saveButton.attr("disabled", "1")
        let content = await tabs[0].fetchContent()
        let design = await tabs[1].fetchContent()
        let settings = await tabs[2].fetchContent()

        //Modify the article on backend 
        modifyArticle({
            content,
            design,
            settings
        });
        saveButton.removeAttr("disabled")
    })

    //Switch to content tab as initial state
    setTab(0)

})