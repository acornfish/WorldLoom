import {createContext, useContext, useState} from 'react'

const ThemeContext = createContext()

var darkTheme = {
    'menu-color': '#444444',
    'menu-color-darkened': '#404040',
    'background-color': '#b8b8b8',
    'text-color': '#dddddd',
    'accent': '#C02942',
    'menu-color-red-transistion': '#4b3b3e',
    'link-color': '#ff4d6b',
}

var lightTheme = {
    'menu-color-darkened': '#f5f5f5',
    'menu-color': '#ffffff',
    'background-color': '#b8b8b8',
    'text-color': '#333333',
    'accent': '#ff617b',
    'menu-color-red-transistion': '#b08890',
    'link-color': '#114d6b',
}

function updateCss(theme){
    const root = document.documentElement;
    let keys = Object.keys(theme === "light" ? lightTheme : darkTheme)
    for(let i=0;i<keys.length;i++){
        root.style.setProperty("--" + keys[i], theme === "light" ? lightTheme[keys[i]] : darkTheme[keys[i]])
    }
}

export function ThemeProvider({children}) {
    const [Theme, SetThemeRaw] = useState( localStorage.getItem("Theme") ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
    const SetTheme = (theme) => {
        SetThemeRaw(theme);
        localStorage.setItem("Theme", theme);
        updateCss(theme);
    }
    
    //Initalization 
    updateCss(Theme);


    return (
    <ThemeContext.Provider value={{Theme, SetTheme}}>
        {children}
    </ThemeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => useContext(ThemeContext);

