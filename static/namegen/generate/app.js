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

import "../../libs/jquery.min.js"
import '/global.js'

function fetchGeneratorList(count, onSuccess, onError) {
    const url = new URL("/api/getNamegen", window.location.origin);
    url.searchParams.set("type", new URLSearchParams(window.location.search).get("type"))
    url.searchParams.set("count", count)


    const xhr = new XMLHttpRequest();
    xhr.open("GET", url.toString(), true);
    xhr.responseType = "json";

    xhr.onload = () => {
        if (xhr.status === 200) {
            onSuccess(xhr.response);
            console.log(xhr.response)
        } else {
            onError(`Error ${xhr.status}: ${xhr.statusText}`);
        }
    };

    xhr.onerror = () => {
        onError("Network Error or CORS issue");
    };

    xhr.send(); 
}

let batchSizeElement = document.getElementsByClassName("batch-size-input")[0]
let namesListElement = document.getElementsByClassName("names-list")[0]
document.getElementsByClassName("generate-batch")[0].addEventListener("click", (event) => {
    fetchGeneratorList(batchSizeElement.value, (data) => {
        namesListElement.innerHTML = 0;
        namesListElement.innerHTML = data.map(x => `
            <span>${x}<span/>    
        `).join('<br/>');
    }, () => {})
})