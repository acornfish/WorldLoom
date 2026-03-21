import { r as reactExports, u as useTheme, j as jsxRuntimeExports, W as WLSelect, e as exportProject, L as LS_PROJECT_NAME } from "./index-BGqFm7i_.js";
function exportAsHtmlButton() {
  exportProject(localStorage.getItem(LS_PROJECT_NAME));
}
function SettingsPage() {
  const textAnalyticsOptions = [
    { value: "english", label: "English (Dale-Chall wordlist)" },
    { value: "english2", label: "English (Oxford wordlist)" },
    { value: "russian", label: "Russian" },
    { value: "turkish", label: "Turkish" }
  ];
  const [AnalyticsLanguage, SetAnalyticsLanguage] = reactExports.useState(localStorage.getItem("TextAnalyticsLanguage"));
  const { Theme, SetTheme } = useTheme();
  reactExports.useEffect(() => {
    localStorage.setItem("TextAnalyticsLanguage", AnalyticsLanguage);
  }, [AnalyticsLanguage]);
  const changeTheme = () => {
    SetTheme(Theme === "light" ? "dark" : "light");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-container", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "theme-selector-label", children: "Theme: " }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { id: "theme-selector", onClick: changeTheme, children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: Theme == "dark" ? "fa-solid fa-moon fa-2xl" : "fa-solid fa-sun fa-2xl" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Export" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "export-html-button", onClick: exportAsHtmlButton, children: "Export as HTML" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Text Analytics Language" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-analytics-language-container", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      WLSelect,
      {
        className: "text-analytics-language",
        defaultValue: textAnalyticsOptions.find((x) => {
          return x.value == localStorage.getItem("TextAnalyticsLanguage");
        }),
        options: textAnalyticsOptions,
        onChange: (x) => SetAnalyticsLanguage(x.value)
      }
    ) })
  ] }) });
}
export {
  SettingsPage as default
};
