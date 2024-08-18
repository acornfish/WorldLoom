import '/global.js'
import '../libs/jquery.min.js'

$(".submit-button").on("click", () => {
    let projectName = $("#project-name-input").val()
    let projectDescription = $("#project-description-input").val()
    let ApiCall = new XMLHttpRequest()

    ApiCall.open("POST", "/api/createProject")
    ApiCall.setRequestHeader("Content-Type", "application/json");
    ApiCall.send(JSON.stringify({
        Name: projectName,
        Description: projectDescription
    }))

    ApiCall.onload = () => {
        if (ApiCall.responseText == "Sucess") {
            localStorage.setItem("CurrentProject", projectName)
            window.location = "/"
     
        } else {
            window.showToast("Failed to create project","danger", 3000)
        }


    }

})