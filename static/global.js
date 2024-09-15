import '../libs/jquery.min.js'


document.documentElement.style.setProperty('--navbar-pages', '4');

var isChangeProjectPopupOpen = false;

document.title = "World Loom"

function ChangeProject() {
    window.waitForElm(".change-project-popup").then(x => {
        x.setAttribute("style", `visibility: ${isChangeProjectPopupOpen ? "visible" : "hidden"};`)
    });
    isChangeProjectPopupOpen = !isChangeProjectPopupOpen;
}



window.addEventListener('load', function () {
    window.DOMContentLoaded = true;
});



async function InitilalizeProjectSelector() {
    let selectContainer = await window.waitForElm(".select-container");
    let select = await window.waitForElm(".select");
    let input = await window.waitForElm("#project-select-input");

    while (select == null) select = window.waitForElm(".select");

    select.onclick = () => {
        selectContainer.classList.toggle("active");
    };

    const apiCall = new XMLHttpRequest();

    apiCall.open("GET", "/api/retrieveProjects", true);
    apiCall.onload = function () {
        if (apiCall.status === 200) {
            let projects = JSON.parse(apiCall.responseText);

            if (projects.length === 0 && !window.location.pathname.startsWith("/createProject")) {
                window.location = '/createProject'

            }
            projects.forEach(e => {
                $(".option-container").append(`
                    <div class="option">
                        <label>${e}</label>
                    </div>
                `)
            })


            let options = document.querySelectorAll(".select-container .option");
            if (localStorage.getItem("CurrentProject") === null) {
                if (projects.length > 0) {
                    localStorage.setItem("CurrentProject", projects[0])
                }
            }

            options.forEach((e) => {
                e.addEventListener("click", () => {
                    input.value = e.children[0].innerHTML;
                    selectContainer.classList.remove("active");
                    options.forEach((e) => {
                        e.classList.remove("selected");
                    });
                    e.classList.add("selected");
                    localStorage.setItem("CurrentProject", e.children[0].innerHTML)
                });
                if (e.children[0].innerHTML === localStorage.getItem("CurrentProject")) {
                    e.classList.add("selected");
                    $("#project-select-input").val(e.children[0].innerHTML);
                }
            });

        } else {
            console.error("Error retrieving projects:", apiCall.statusText);
        }

    };
    apiCall.send();
}



const showToast = (
    message = "Sample Message",
    toastType = "info",
    duration = 5000) => {

    let icon = {
        success: '<i class="fa-solid fa-check"></i>',
        danger: '<i class="fa-solid fa-circle-exclamation"></i>',
        warning: '<i class="fa-solid fa-triangle-exclamation"></i>',
        info: '<i class="fa-solid fa-circle-question"></i>',
    };

    if (
        !Object.keys(icon).includes(toastType))
        toastType = "info";

    let box = document.createElement("div");
    box.classList.add(
        "toast", `toast-${toastType}`);
    box.innerHTML = ` <div class="toast-content-wrapper">
                      <div class="toast-icon">
                      ${icon[toastType]}
                      </div>
                      <div class="toast-message">${message}</div>
                      <div class="toast-progress"></div>
                      </div>`;
    duration = duration || 5000;
    box.querySelector(".toast-progress").style.animationDuration =
        `${duration / 1000}s`;

    let toastAlready =
        document.body.querySelector(".toast");
    if (toastAlready) {
        toastAlready.remove();
    }

    document.body.appendChild(box)
};



$.get("/temps/navbar.html", function (data) {
    $(".navbar").replaceWith(data);
    $("body").append($(`
        <div class="image-selector-container-outer">
            <div class="close-button" onclick="OpenImageSelector(false)"></div>
            <div class="image-selector-container"></div>
        </div>        
    `))
    setTimeout(() => {
        $(".Navbar .collapse-switch").get(0).addEventListener("click", (e) => {
            if (e.target.parentElement.getAttribute("collapsed") == "") {
                e.target.parentElement.removeAttribute("collapsed")
            } else {
                e.target.parentElement.setAttribute("collapsed", "")
            }
        })
        InitilalizeProjectSelector()
    }, 1000)
});

var shiftKeyDown = false;

document.addEventListener('keyup', (event) => {
    if (event.key == "Shift") window.shiftKeyDown = false;
})
document.addEventListener('keydown', (event) => {
    if (event.key == "Shift") window.shiftKeyDown = true;
})


setTimeout(() => {
    $("#loading-screen").fadeOut()
}, 500)


window.ChangeProject = ChangeProject;
window.showToast = showToast;


window.uid = function () {
    return (Date.now().toString(36) + Math.random().toString(36)).substring(0, 16).padStart(16, 0);
}