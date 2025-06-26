window.waitForElm = (selector) => {
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
};


window.switchTheme = (shouldSwitch = true) => {
    const setVariables = vars => Object.entries(vars).forEach(v => document.documentElement.style.setProperty(v[0],
        v[1]));

    var darkTheme = {
        '--menu-color': '#444444',
        '--menu-color-darkened': '#404040',
        '--background-color': '#b8b8b8',
        '--text-color': '#dddddd',
        '--accent': '#C02942',
        '--menu-color-red-transistion': '#4b3b3e',
        '--link-color': '#ff4d6b',
    }

    var lightTheme = {
        '--menu-color-darkened': '#f5f5f5',
        '--menu-color': '#ffffff',
        '--background-color': '#b8b8b8',
        '--text-color': '#333333',
        '--accent': '#C02942',
        '--menu-color-red-transistion': '#b08890',
        '--link-color': '#114d6b',
    }

    let theme = localStorage.getItem("Theme") === "light";
    if (shouldSwitch) localStorage.setItem("Theme", theme ? "dark" : "light")
    theme = localStorage.getItem("Theme") === "light"
    setVariables(theme ? lightTheme : darkTheme)

    window.waitForElm("#theme-selector").then(() => {
        let themeSelector = document.getElementById("theme-selector");
        themeSelector.children[0].classList.remove(theme ? "fa-moon" : "fa-sun")
        themeSelector.children[0].classList.add(theme ? "fa-sun" : "fa-moon")
    })
}

window.validateNumberInput = (input, min, max) => {
    const value = input.value.trim();

    if (value === '' || !/^\d+$/.test(value)) {
        input.value = input.oldValue ?? 1;
        return false;
    }
    console.log(input.oldValue)
    if (value < min || value > max) {
        input.value = value < min ? min : max;
        window.showToast(`Please enter a number between ${min} and ${max}.`, "warning", 2000);
        return false;
    }

    input.oldValue = value;
    return true;
}

window.clampNumber = (num, min, max) => {return Math.min(max, Math.max(num, min))}

window.saveData = () =>  {
    const url = "/api/save"; 

    $.ajax({
        url,
        type: "POST",
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("Error saving data:", textStatus, errorThrown);
        }
    });
}

window.waitForVariable = async (varName) => {
    let timeLimit = 3000
    while(localStorage.getItem(varName) == null){
        if(timeLimit < 0) return
        timeLimit -= 200
        await new Promise ((resolve) => setTimeout(resolve, 200))
    }
}

window.switchTheme(false)