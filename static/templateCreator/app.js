import "../libs/jquery.min.js"

const promptTemplate = `
        <div class="prompt-data-container">
            <div class="prompt-first-container">
                <h2>Name</h2>   
                <button class="control-button remove-button"><i class="fa-solid fa-xmark"></i></button>
                <button class="control-button up-button"><i class="fa-solid fa-arrow-up"></i></button>
                <button class="control-button down-button"><i class="fa-solid fa-arrow-down"></i></button>
            </div>
            <input type="text" name="prompt-name" class="prompt-name" placeholder="Name">
            <h2>Type</h2>
            <select name="prompt-type" class="prompt-type">
                <option value="Short Text">Short Text</option>
                <option value="Rich Text">Rich Text</option>
                <option value="Number">Number</option>
                <option value="Reference">Reference</option>
            </select> 
            <h2 class="reference-type-label">Reference Type</h2>
            <select name="reference-type" class="reference-type"></select>
            <h2 class="cross-reference-label">Cross Reference (Optional)</h2>
            <select name="cross-reference" class="cross-reference"></select>
        </div>
`

var templates = getTemplateList();


function modifyTemplate(name, template, callback, oldname) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/modifyTemplate", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            callback(xhr.status, xhr.responseText);
        }
    };

    const body = JSON.stringify({
        project: localStorage.getItem("CurrentProject"),
        name: name,
        template: template,
        oldName: oldname
    });

    xhr.send(body);
}


function getTemplateList() {
    return new Promise(async (resolve, reject) => {
        await window.waitForVariable("CurrentProject")

        const xhr = new XMLHttpRequest();
        xhr.open("GET", `/api/getTemplateList?project=${localStorage.getItem("CurrentProject")}`, true);

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    try {
                        const data = JSON.parse(xhr.responseText);
                        resolve(data);
                    } catch (e) {
                        reject(e);
                    }
                } else {
                    reject(xhr.status);
                }
            }
        };

        xhr.send();
    });
}


function getTemplate(callback, name) {
    const xhr = new XMLHttpRequest();
    
    xhr.open("GET", `/api/getTemplate?project=${localStorage.getItem("CurrentProject")}&name=${name ?? sessionStorage.getItem("TemplateName")}`, true);

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


function findPromptIndex(element){
    var parent = element.parentNode;
    var index = Array.prototype.indexOf.call(parent.children, element);
    return index
}
  

window.addNewPromptTemplate = function (){
    templates.then(x => {
        let container = $(".container")
        let newp = $("#new-prompt")        

        let newButtonContent = newp.get(0).outerHTML

        newp.remove()

        container.append(promptTemplate)
        
        let rt = $(".prompt-data-container .reference-type").last()
        rt.append(
            `
                <option value=""></option>
            `
        )  
        x.forEach(name => {
            rt.append(
                `
                    <option value="${name}">${name}</option>
                `
            )  
        })
                
        let refPrompt = $(".prompt-data-container .reference-type").last()
        getTemplate((status, template) => {
            if(status == 200){
                let crossRef = ($(refPrompt).siblings(".cross-reference"))
                crossRef.append(
                    `
                        <option value=""> </option>
                    `
                )  
                template.forEach(pr => {
                    if(pr.type == "Reference"){
                        crossRef.append(
                            `
                                <option value="${pr.promptName}">${pr.promptName}</option>
                            `
                        )  
                    }
                })
            }
        }, refPrompt.val())

        
        $(".prompt-data-container .reference-type").last().on("change", (e) => {
            let crossRef = ($(e.currentTarget).siblings(".cross-reference"))
            crossRef.html("")
            
            getTemplate((status, template) => {
                if(status == 200){
                    let crossRef = ($(refPrompt).siblings(".cross-reference"))
                    crossRef.append(
                        `
                            <option value=""> </option>
                        `
                    )  
                    template.forEach(pr => {
                        if(pr.type == "Reference"){
                            crossRef.append(
                                `
                                    <option value="${pr.promptName}">${pr.promptName}</option>
                                `
                            )  
                        }
                    })
                }
            }, $(e.currentTarget).val())
        })  

        $(".prompt-data-container .remove-button").last().on("click", (e) => {
            e.currentTarget.parentElement.parentElement.remove()
        })     

        $(".prompt-data-container .up-button").last().on("click", (e) => {
            let el = e.currentTarget.parentElement.parentElement
            if(findPromptIndex(el) > 0){
                $(el).insertBefore($(el).prev())
            }
        })    
    
        $(".prompt-data-container .down-button").last().on("click", (e) => {
            let el = e.currentTarget.parentElement.parentElement
            if(findPromptIndex(el) < el.parentNode.children.length-2){
                $(el).insertAfter($(el).next())
            }
        })

        container.append(newButtonContent)  
    })
}


$(() => {
    //initalization
    getTemplate((status, template) => {
        if(status != 200) {
            return
        }

        let name = sessionStorage.getItem("TemplateName")
        $(".template-name-prompt").val(name)
        
        template.forEach(promptC => {
            templates.then(x => {
                let container = $(".container")
                let newp = $("#new-prompt")        


                let newButtonContent = newp.get(0).outerHTML

                newp.remove()

                container.append(promptTemplate)
                let promptContainer = container.children().last()
                
                let rt = $(".prompt-data-container .reference-type").last()
                rt.append(
                    `
                        <option value=""></option>
                    `
                )  
                x.forEach(name => {
                    rt.append(
                        `
                            <option value="${name}">${name}</option>
                        `
                    )

                    promptContainer.children("input[type=text]").val(promptC["promptName"])
                    promptContainer.children(".prompt-type").val(promptC["type"])
                    promptContainer.children(".reference-type").val(promptC["rtype"])
                })

                                
                let refPrompt = $(".prompt-data-container .reference-type").last()
                getTemplate((status, template) => {
                    if(status == 200){
                        let crossRef = ($(refPrompt).siblings(".cross-reference"))
                        crossRef.append(
                            `
                                <option value=""> </option>
                            `
                        )  
                        template.forEach(pr => {
                            if(pr.type == "Reference"){
                                crossRef.append(
                                    `
                                        <option value="${pr.promptName}">${pr.promptName}</option>
                                    `
                                )  
                            }
                        })
                        promptContainer.children(".cross-reference").val(promptC["crossRefT"])
                    }
                }, refPrompt.val())
            

                $(".prompt-data-container .reference-type").last().on("change", (e) => {
                    let crossRef = ($(e.currentTarget).siblings(".cross-reference"))
                    crossRef.html("")

                    getTemplate((status, template) => {
                        if(status == 200){
                            crossRef.append(
                                `
                                    <option value=""> </option>
                                `
                            )  
                            template.forEach(pr => {
                                if(pr.type == "Reference"){
                                    crossRef.append(
                                        `
                                            <option value="${pr.promptName}">${pr.promptName}</option>
                                        `
                                    )  
                                }
                            })
                        }
                    }, $(e.currentTarget).val())
                })  


                $(".prompt-data-container .remove-button").last().on("click", (e) => {
                    e.currentTarget.parentElement.parentElement.remove()
                })  

                $(".prompt-data-container .up-button").last().on("click", (e) => {
                    let el = e.currentTarget.parentElement.parentElement
                    if(findPromptIndex(el) > 0){
                        $(el).insertBefore($(el).prev())
                    }
                })    
            
                $(".prompt-data-container .down-button").last().on("click", (e) => {
                    let el = e.currentTarget.parentElement.parentElement
                    if(findPromptIndex(el) < el.parentNode.children.length-2){
                        $(el).insertAfter($(el).next())
                    }
                })

                container.append(newButtonContent)
            })
            
        })
        
    })

    $(".template-save-button").on("click", (e) => {
        let contents = []
        let templateName = $(".template-name-prompt").val()

        if(templateName == ""){
            if(!confirm("Template name is empty. Continuing will delete the article")){
                return
            }
        }
    
        $(".prompt-data-container").toArray().forEach(el => {
            let promptName = $(el).children("input[type=text]").val()
            let type = $(el).children(".prompt-type").val()
            let rtype = $(el).children(".reference-type").val()
            let crossRefT = $(el).children(".cross-reference").val()
    
            contents.push({promptName,type,rtype,crossRefT})
        })
    
        modifyTemplate(templateName, contents, (status) => {
            if(status == 200){
                window.showToast(`Save Successful`, "success", 1500);
                sessionStorage.setItem("TemplateName", templateName)
                window.location.reload()
            }else{
                window.showToast(`Save failed`, "danger", 1500);
            }
        }, sessionStorage.getItem("TemplateName"))
    })
  
    $(".template-delete-button").on("click", (e) => {
        if(confirm("Are you sure you want to delete this template? This can't be reversed and articles using this template will cause issues")){
            modifyTemplate("", "", (status) => {
                if(status == 200){
                    window.location = '/dashboard'
                    sessionStorage.setItem("TemplateName", "")
                }else{
                    window.showToast(`Deleting failed`, "danger", 1500);
                }
            }, sessionStorage.getItem("TemplateName"))
        }
    })

})