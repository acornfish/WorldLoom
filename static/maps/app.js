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

import "../libs/jquery.min.js"
import '/global.js'
import "../libs/dist/jstree.js"

var isMapListMenuActive = false
var currentImage = ""
var pins = []

function setMapListButtonEvent() {
    $(".map-list-ul button:not(.add-new-map)").on("click", (event) => {
        let buttons = $(".map-list-ul button")
        buttons.removeClass("map-list-li-active")
        const selectedButton = $(event.currentTarget)
        selectedButton.addClass("map-list-li-active")

        let mapName = selectedButton.text()

        $("#map-name-field").val(mapName)
        sessionStorage.setItem("uid", selectedButton.attr("uid"))
        selectMap();
    })
}

function saveMapData(uid, image, name, pins) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/setMapData");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onload = function () {
        if (xhr.status === 200) {
            window.showToast(`Save Successful`, "success", 1000);
            setTimeout(() => {
                window.location.reload()
            }, 1000);
        } else {
            window.showToast(`Error while saving`, "danger", 2000);
            console.error("Save failed:", xhr.status, xhr.responseText);
        }
    };

    xhr.send(JSON.stringify({
        project: localStorage.getItem("CurrentProject"),
        uid,
        image,
        name,
        pins
    }));
}

function retrieveMapData(uid) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `/api/retrieveMapData?project=${encodeURIComponent(localStorage.getItem("CurrentProject"))}&uid=${encodeURIComponent(uid)}`);

    return new Promise((resolve, reject) => {
        xhr.onload = function () {
            if (xhr.status === 200) {
                resolve(JSON.parse(xhr.responseText))
            } else {
                reject(xhr.responseText);
                console.error("Retrieve failed:", xhr.status, xhr.responseText);
            }
        };

        xhr.send();
    })

}

function retrieveMapList() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `/api/retrieveMapList?project=${encodeURIComponent(localStorage.getItem("CurrentProject"))}`);
    return new Promise ((resolve, reject) => {
        xhr.onload = function () {
            if (xhr.status === 200) {
              try {
                const mapsList = JSON.parse(xhr.responseText);
                resolve(mapsList)
              } catch (err) {
                console.error("Failed to parse response:", xhr.responseText);
                reject("Fail")
              }
            } else {
              console.error("Retrieve failed:", xhr.status, xhr.responseText);
            }
          };
        
          xhr.send();
    })
}
  
function drawMap(imageData) {
    currentImage = imageData
    $(".map-render-image").attr("src", imageData)
}

function selectMap(){
    if(sessionStorage.getItem("uid")) {
        retrieveMapData(sessionStorage.getItem("uid")).then(data => {
            currentImage = data.image || ""
            $("#map-name-field").val(data.name)
            pins = data.pins
            drawMap(currentImage)
        }).catch(data => {
            currentImage = ""
            $("#map-name-field").val("")
            pins = []
            drawMap(currentImage) 
        })
    }    
}

retrieveMapList().then(maps => {
    $(".map-list-ul").find("[uid]").parent().remove()
    for(let map of maps){
        let buttons = $(".map-list-ul button")
        buttons.removeClass("map-list-li-active")
    
        $(`
            <li><button class="map-list-li-active" uid=${map.uid}>${map.name}</button></li>
        `).insertBefore($(".map-list-ul .add-new-map"))
    
        $("#map-name-field").val(map.name)
        setMapListButtonEvent();
        sessionStorage.setItem("uid", map.uid)
    }
   selectMap();
})

$("#map-list-button").on('click', (event) => {
    if (!isMapListMenuActive) {
        retrieveMapList().then(maps => {
            $(".map-list-ul").find("[uid]").parent().remove()
            for(let map of maps){
                let buttons = $(".map-list-ul button")
                buttons.removeClass("map-list-li-active")
            
                $(`
                    <li><button class="map-list-li-active" uid=${map.uid}>${map.name}</button></li>
                `).insertBefore($(".map-list-ul .add-new-map"))
            
                $("#map-name-field").val(map.name)
                setMapListButtonEvent();
                sessionStorage.setItem("uid", map.uid)
            }
            
            $(".map-list-menu").show()
            event.currentTarget.classList.add("map-list-button-active")
            isMapListMenuActive = !isMapListMenuActive
        })
    } else {
        $(".map-list-menu").hide()
        event.currentTarget.classList.remove("map-list-button-active")
        isMapListMenuActive = !isMapListMenuActive

    }
})

$(".map-list-ul .add-new-map").on("click", (event) => {
    let buttons = $(".map-list-ul button")
    buttons.removeClass("map-list-li-active")

    const uid = window.uid()
    event.currentTarget.parentNode.insertBefore($(`
        <li><button class="map-list-li-active" uid=${uid}></button></li>
    `).get(0), event.currentTarget)

    sessionStorage.setItem("uid", uid)
    setMapListButtonEvent();
    selectMap()
})

$("#map-image-field").on("change", (event) => {
    let file = event.target.files[0]

    const reader = new FileReader();

    reader.onload = function (e) {
        const content = e.target.result;
        drawMap(content)
    };

    reader.readAsDataURL(file);
})

const mapPositionData = {
    lastLeft: 0,
    lastTop: 0,
    totalLeft: 0,
    totalTop: 0,
    isDragging: false
}

//make map draggable
$(".map-render-image").on("mousedown", (event) => {
    let mapElem = $(".map-render-image")
    mapPositionData.lastLeft = event.clientX
    mapPositionData.lastTop = event.clientY
    mapPositionData.isDragging = true;
})

$(document).on("mousemove", (event) => {
    let mapElem = $(".map-render-image")
    let diffX = (event.clientX - mapPositionData.lastLeft)
    let diffY = (event.clientY - mapPositionData.lastTop)
    if (mapPositionData.isDragging) {
        mapPositionData.lastLeft = event.clientX
        mapPositionData.lastTop = event.clientY

        mapPositionData.totalLeft += diffX
        mapPositionData.totalTop += diffY

        mapElem.attr("style", `
            top: ${mapPositionData.totalTop}px;
            left: ${mapPositionData.totalLeft}px;
        `)
    }
})

$(document).on("mouseup", (event) => {
    mapPositionData.isDragging = false
})

$("#map-image-field-button").on("click", (event) => {
    $("#map-image-field").trigger("click")
})


$("#map-save-button").on("click", event => {
    let name = $("#map-name-field").val()

    saveMapData(sessionStorage.getItem("uid"), currentImage, name, pins)
})

setMapListButtonEvent();