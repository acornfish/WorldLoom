import '/global.js'
import '../libs/jquery.min.js'

function fetchMaps(project) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `/api/retrieveMaps?Project=${project}`, true);

        xhr.onload = function () {
            if (this.status === 200) {
                try {
                    const response = (this.responseText);
                    if (typeof response === 'string' && response.startsWith('Fail:')) {
                        reject(response);
                    } else {
                        resolve(JSON.parse(response));
                    }
                } catch (error) {
                    reject(error);
                }
            } else {
                reject(`Error: Status ${this.status}`);
            }
        };

        xhr.onerror = function () {
            reject('Network Error');
        };

        xhr.send();
    });
}


fetchMaps(localStorage.getItem("CurrentProject"))
    .then(mapsData => {
        let list = $(".maps-list")
        mapsData.forEach(x => {
            list.html(`
                    <li>
                        <a href="/map" onclick="sessionStorage.setItem('Map', '${x["Name"]}')">${x["Name"]}</a>
                        <button class="remove-map"><i class="fa-solid fa-trash-can"></i></button>
                    </li>
            ` + list.html())
        })
        $(".new-map").on("click", (e) => {
            ["MainText", "Settings", "SideSections", "Article", "description"].forEach(x => {
                localStorage.removeItem(x);
                sessionStorage.removeItem(x);
            })
            window.location = "/map?new=1"
        });

        $(".remove-map").on("click", (e) => {
            e.stopPropagation();

            let title = (e).currentTarget.parentElement.getElementsByTagName("a")[0].innerText;
            if (window.shiftKeyDown || confirm("Are you sure that you want to delete the map " + title + "?")) {
                removeMap(localStorage.getItem("CurrentProject"), title)
                setTimeout((e) => (e).currentTarget.parentElement.remove(), 100, e);
                return;
            }
        })


    })
    .catch(error => {
        console.error(error);
    });

    function removeMap(projectName, mapName) {
        const xhr = new XMLHttpRequest();
      
        xhr.open("POST", "/api/removeMap");
        xhr.setRequestHeader("Content-Type", "application/json");
      
        const data = JSON.stringify({ Name: mapName, Project: projectName }); 
      
        xhr.onload = function () {
          if (xhr.status === 200) {
            console.log(xhr.responseText);
          } else {
            console.error("Error:", xhr.responseText);
          }
        };
      
        xhr.onerror = function () {
          console.error("Request failed");
        };
      
        xhr.send(data);
      }
      

["MainText", "Settings", "SideSections", "Article", "description", "Map"].forEach(x => {
    localStorage.removeItem(x);
    sessionStorage.removeItem(x);
})