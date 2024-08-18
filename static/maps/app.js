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
                <button class="card">
                    <div class="remove-map"><i class="fa-solid fa-trash-can"></i></div>
                    <div class="card-title"><h2>${x["Name"]}</h2></div>
                    <img src="${x["MapResource"]}" alt="">
                    <div class="card-text"><p>${x["Description"]}</p></div>
                </button>
            ` + list.html())
        })

        $(".remove-map").on("click", (e) => {
            e.stopPropagation();

            let title = (e).currentTarget.parentElement.getElementsByTagName("h2")[0].innerText;
            if (window.shiftKeyDown || confirm("Are you sure that you want to delete the map " + title +
                    "?")) {
                //removeArticle(localStorage.getItem("CurrentProject"), title)
                setTimeout((e) => (e).currentTarget.parentElement.remove(), 100, e);
                return;
            }
        })

        $(".maps-list").children().on("click", (x) => {
            localStorage.setItem("Map", x.originalEvent.currentTarget.querySelector(".card-title").innerText)
            window.location = "/map"
        })
    })
    .catch(error => {
        console.error(error);
    });


["MainText", "Settings", "SideSections", "Article", "description"].forEach(x => {
    localStorage.removeItem(x);
})