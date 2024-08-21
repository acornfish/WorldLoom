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
window.switchTheme(false)