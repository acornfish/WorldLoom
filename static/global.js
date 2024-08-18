import '../libs/jquery.min.js'


document.documentElement.style.setProperty('--navbar-pages', '4');

var isChangeProjectPopupOpen = false;

document.title = "Story Lab"

function ChangeProject() {
    waitForElm(".change-project-popup").then(x => {
        x.setAttribute("style", `visibility: ${isChangeProjectPopupOpen ? "visible" : "hidden"};`)
    });
    isChangeProjectPopupOpen = !isChangeProjectPopupOpen;
}

function waitForElm(selector) {
    return new Promise((resolve, reject) => {
        const el = document.querySelector(selector);
        if (el) {
            resolve(el);
        }

        new MutationObserver((mutationRecords, observer) => {
                Array.from(document.querySelectorAll(selector)).forEach(element => {
                    resolve(element);
                    observer.disconnect();
                });
            })
            .observe(document.documentElement, {
                childList: true,
                subtree: true
            });
    });
}

window.addEventListener('load', function () {
    window.DOMContentLoaded = true;
});



async function InitilalizeProjectSelector() {
    let selectContainer = await waitForElm(".select-container");
    let select = await waitForElm(".select");
    let input = await waitForElm("#project-select-input");

    while (select == null) select = waitForElm(".select");

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
    setTimeout(() => {
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
window.WaitForElm = waitForElm;
window.showToast = showToast;