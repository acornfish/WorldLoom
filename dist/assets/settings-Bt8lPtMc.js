import { r as reactExports, u as useTheme, j as jsxRuntimeExports, W as WLSelect, e as exportProject, L as LS_PROJECT_NAME, a as exportDatabaseZIP, I as ImportDatabaseZIP } from "./index-BqlWqb_l.js";
import { s as showToast } from "./toast-BelPYyVA.js";
function exportAsHtmlButton() {
  exportProject(localStorage.getItem(LS_PROJECT_NAME));
}
function exportDatabaseButton() {
  exportDatabaseZIP();
}
const importDatabaseButton = (trueInput) => function importDatabaseButton2() {
  trueInput.current.showPicker();
};
const importDatabaseChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  if (file.type !== "application/zip" && !file.name.endsWith(".zip")) {
    alert("Please select a ZIP file");
    return;
  }
  const fileContentUint8 = new Uint8Array(await file.arrayBuffer());
  try {
    await ImportDatabaseZIP(Array.from(fileContentUint8));
    showToast("Imported Successfully!", "success", 1e3);
  } catch (err) {
    showToast(err, "danger", 1500);
  }
};
function SettingsPage() {
  const textAnalyticsOptions = [
    { value: "english", label: "English (Dale-Chall wordlist)" },
    { value: "english2", label: "English (Oxford wordlist)" },
    { value: "russian", label: "Russian" },
    { value: "turkish", label: "Turkish" }
  ];
  const [AnalyticsLanguage, SetAnalyticsLanguage] = reactExports.useState(localStorage.getItem("TextAnalyticsLanguage"));
  const { Theme, SetTheme } = useTheme();
  const fileUploadInputRef = reactExports.useRef();
  reactExports.useEffect(() => {
    localStorage.setItem("TextAnalyticsLanguage", AnalyticsLanguage);
  }, [AnalyticsLanguage]);
  const changeTheme = () => {
    SetTheme(Theme === "light" ? "dark" : "light");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-container", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "theme-selector-label", children: "Theme: " }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { id: "theme-selector", onClick: changeTheme, children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: Theme == "dark" ? "fa-solid fa-moon fa-2xl" : "fa-solid fa-sun fa-2xl" }) }),
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
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Export" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "export-html-button", onClick: exportAsHtmlButton, children: "Export as HTML (.zip)" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "export-html-button", onClick: exportDatabaseButton, children: "Export Database Folder (.zip)" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "WARNING: This will wipeout your current database!" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: ".zip", style: { display: "none" }, ref: fileUploadInputRef, onChange: importDatabaseChange }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "export-html-button", onClick: importDatabaseButton(fileUploadInputRef), children: "Import Database Folder (.zip)" })
  ] }) });
}
export {
  SettingsPage as default
};
