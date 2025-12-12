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

function fetchGeneratorList(onSuccess, onError) {
    const url = new URL("/api/getNamegenList", window.location.origin);

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

    xhr.send(); 
}


document.addEventListener("DOMContentLoaded", () => {
    fetchGeneratorList((data) => {
        const generatorDOMTemplate = (type) => `
                <div class="generator-cell">
                    <button class="generator-button" onclick="window.location = '/namegen/generate?type=${type}'">${type}</button>
                </div>`

        const gridElement = document.getElementsByClassName("generators-grid")[0]
        for(let generator of data) {
            gridElement.innerHTML += generatorDOMTemplate(generator)
        }
    }, () => {})

    document.getElementsByClassName("search-button")[0].addEventListener("click", () => {
        let searchVal = document.getElementById("search-bar").value 
        const gridElement = document.getElementsByClassName("generators-grid")[0]
     
        gridElement.innerHTML = ""

        fetchGeneratorList((data) => {
            const generatorDOMTemplate = (type) => `
                    <div class="generator-cell">
                        <button class="generator-button" onclick="window.location = '/namegen/generate?type=${type}'">${type}</button>
                    </div>`
    
            for(let generator of data) {
                if(generator.includes(searchVal)){
                    gridElement.innerHTML += generatorDOMTemplate(generator)
                }
            }
        }, () => {})
    })

})