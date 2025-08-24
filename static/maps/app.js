
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

function setMapListButtonEvent(){
    $(".map-list-ul button:not(.add-new-map)").on("click", (event) => {
        let buttons = $(".map-list-ul button")
        buttons.removeClass("map-list-li-active")
        const selectedButton = $(event.currentTarget)
        selectedButton.addClass("map-list-li-active")

        let mapName = selectedButton.text()

        $("#map-name-field").val(mapName)
    })    
}

function drawMap (imageData) {
    $(".map-render-image").attr("src", imageData)
}

$("#map-list-button").on('click', (event) => {
    if(!isMapListMenuActive){
        $(".map-list-menu").show()
        event.currentTarget.classList.add("map-list-button-active")
    }else{
        $(".map-list-menu").hide()
        event.currentTarget.classList.remove("map-list-button-active")
    }

    isMapListMenuActive = !isMapListMenuActive
})

$(".map-list-ul .add-new-map").on("click", (event) => {
    let buttons = $(".map-list-ul button")
    buttons.removeClass("map-list-li-active")

    event.currentTarget.parentNode.insertBefore($(`
        <li><button class="map-list-li-active">newMap</button></li>
    `).get(0), event.currentTarget)
    setMapListButtonEvent();
})

$("#map-image-field").on("change", (event) => {
    let file = event.target.files[0]

    const reader = new FileReader();

    reader.onload = function(e) {
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
    if(mapPositionData.isDragging ){
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
    mapPositionData.isDragging  = false
})

$("#map-image-field-button").on("click", (event) => {
    $("#map-image-field").trigger("click")
})

setMapListButtonEvent();

