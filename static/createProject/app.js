
/*
    Worldloom
    Copyright (C) 2025 Ege Açıkgöz

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, version 3 of the License.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/    


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
        if (ApiCall.responseText == "Success") {
            localStorage.setItem("CurrentProject", projectName)
            window.location = "/"
     
        } else {
            window.showToast("Failed to create project","danger", 3000)
        }
    }

})