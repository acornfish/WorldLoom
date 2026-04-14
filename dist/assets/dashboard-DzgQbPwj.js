import { r as reactExports, g as getTemplateList, L as LS_PROJECT_NAME, j as jsxRuntimeExports, i as importTemplates, b as exportTemplates, m as modifyArticle, s as setArticleTree, c as getArticleTree } from "./index-BqlWqb_l.js";
import { T as Tree, j as jQuery, e as enforceUniqueNodeNames } from "./Tree-D9dKbqE7.js";
import { W as WLuid } from "./uid-CgJ15W9t.js";
function exportTemplatesButton(setMassExportText) {
  exportTemplates(localStorage.getItem(LS_PROJECT_NAME)).then(
    (x) => {
      setMassExportText(x);
    },
    (x) => {
      console.error(x);
    }
  );
}
function importTemplatesButton(massImportText) {
  importTemplates(localStorage.getItem(LS_PROJECT_NAME), massImportText).then(() => {
    window.location.reload();
  });
}
function onTemplateChange(e) {
  let newTemplate = e.target.value;
  sessionStorage.setItem("TemplateName", newTemplate);
}
function onTemplateEdit() {
  window.location = "/templateCreator";
}
function TemplateManager() {
  const [massImportPopupActive, setMassImportPopupActive] = reactExports.useState(false);
  const [massExportPopupActive, setMassExportPopupActive] = reactExports.useState(false);
  const [massImportText, setMassImportText] = reactExports.useState("");
  const [massExportText, setMassExportText] = reactExports.useState("");
  const [templateList, setTemplateList] = reactExports.useState([]);
  reactExports.useEffect(() => {
    getTemplateList(localStorage.getItem(LS_PROJECT_NAME)).then(
      (x) => {
        setTemplateList(JSON.parse(x));
      },
      console.error
    );
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "templates-container-outer", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "container-label", children: "Templates" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "templates-container", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "template-mass-import-open", onClick: () => {
          setMassImportPopupActive(true);
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fa-solid fa-download" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "template-mass-export-open", onClick: () => {
          setMassExportPopupActive(true);
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fa-solid fa-upload" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "templates-list", children: [
          templateList.map((val, ind) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "label",
            {
              className: "template-selector",
              onDoubleClick: onTemplateEdit,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "radio",
                    name: "template",
                    value: val,
                    onChange: onTemplateChange
                  },
                  ind
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", { children: val }) })
              ]
            }
          )),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "template-selector new-template", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "button", value: "1", onClick: () => {
              sessionStorage.removeItem("TemplateName", "");
              window.location = "/templateCreator";
            } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fa-solid fa-plus fa-2xl" }) })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "template-mass-import", style: {
      display: massImportPopupActive ? "block" : "none"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "template-mass-exchange-close-button", onClick: () => {
        setMassImportPopupActive(false);
      }, children: "X" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { name: "templates", id: "template-mass-import-textarea", onChange: (x) => {
        setMassImportText(x.currentTarget.value);
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "template-mass-import-button", onClick: () => {
        importTemplatesButton(massImportText);
      }, children: "Import" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "template-mass-export", style: {
      display: massExportPopupActive ? "block" : "none"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "template-mass-exchange-close-button", onClick: () => {
        setMassExportPopupActive(false);
      }, children: "X" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { name: "templates", id: "template-mass-export-textarea", value: massExportText, readOnly: true }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "template-mass-export-button", onClick: () => {
        exportTemplatesButton(setMassExportText);
      }, children: "Export" })
    ] })
  ] });
}
window.jQuery = jQuery;
function DashboardPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "article-tree", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "container-label", children: "Articles (Right click menu)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Tree,
        {
          getTree,
          handleCreateNode,
          handleDeleteNode,
          handleRenameNode,
          handleDoubleClick
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "template-manager", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TemplateManager, {}) })
  ] });
}
function getTree() {
  return getArticleTree(localStorage.getItem(LS_PROJECT_NAME));
}
const handleDeleteNode = (ul) => function(e, data) {
  if (data.node.id == "root") return;
  if (data.node.type === "file") {
    modifyArticle(localStorage.getItem(LS_PROJECT_NAME), "delete", data.node.data.uid, {});
  }
  setArticleTree(localStorage.getItem(LS_PROJECT_NAME), ul.jstree(true).get_json("#", { flat: true }));
};
const handleRenameNode = (ul) => function(e, data) {
  if (data.node.id == "root") return;
  enforceUniqueNodeNames(jQuery(e.currentTarget).jstree(true), data.node);
  ul.jstree().get_node(data.node).a_attr.href = data.node.text;
  modifyArticle(localStorage.getItem(LS_PROJECT_NAME), "create", data.node.data.uid, {
    name: data.node.text
  });
  setArticleTree(localStorage.getItem(LS_PROJECT_NAME), ul.jstree().get_json("#", { flat: true }));
};
const handleDoubleClick = (ul) => function(event) {
  let nodeHtml = jQuery(event.target).closest("li");
  let node = ul.jstree(true).get_node(nodeHtml);
  if (node.id == "root") return;
  if (node.type === "file") {
    sessionStorage.setItem("Article", node.data.uid);
    window.location = "/article";
  }
};
const handleCreateNode = (ul) => function(e, data) {
  data.node.data = {
    uid: WLuid()
  };
  if (data.node.type === "file") {
    modifyArticle(localStorage.getItem(LS_PROJECT_NAME), "create", data.node.data.uid, {
      name: data.node.text
    });
  }
  console.log(e);
  setArticleTree(localStorage.getItem(LS_PROJECT_NAME), ul.jstree(true).get_json("#", { flat: true }));
};
export {
  DashboardPage as default
};
