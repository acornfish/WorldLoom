import { r as reactExports, k as getScene, L as LS_PROJECT_NAME, j as jsxRuntimeExports, l as getManuscriptTree, n as setScene, o as setManuscriptTree, p as deleteScene } from "./index-CnPIfOL0.js";
import { R as RichTextEditor } from "./richTextEditor-DPtOcj4q.js";
import { T as Tree, j as jQuery, e as enforceUniqueNodeNames } from "./Tree-BO7Gl1HM.js";
import { W as WLuid } from "./uid-CgJ15W9t.js";
import { s as showToast } from "./toast-BelPYyVA.js";
window.jQuery = jQuery;
function getTree() {
  return getManuscriptTree(localStorage.getItem(LS_PROJECT_NAME));
}
const handleDeleteNode = (setUid) => (ul) => function(e, data) {
  if (data.node.id == "root") return;
  if (data.node.type === "file") {
    deleteScene(localStorage.getItem(LS_PROJECT_NAME), data.node.data.uid);
  }
  setManuscriptTree(localStorage.getItem(LS_PROJECT_NAME), ul.jstree(true).get_json("#", { flat: true }));
};
const handleRenameNode = (setUid) => (ul) => function(e, data) {
  if (data.node.id == "root") return;
  enforceUniqueNodeNames(jQuery(e.currentTarget).jstree(true), data.node);
  ul.jstree().get_node(data.node).a_attr.href = data.node.text;
  setManuscriptTree(localStorage.getItem(LS_PROJECT_NAME), ul.jstree().get_json("#", { flat: true }));
};
const handleDoubleClick = (setUid) => (ul) => function(event) {
  (async () => {
    let nodeHtml = jQuery(event.target).closest("li");
    let node = ul.jstree(true).get_node(nodeHtml);
    if (node.id == "root") return;
    if (node.type === "file") {
      setUid(node.data.uid);
    }
  })();
};
const handleCreateNode = (setUid) => (ul) => function(e, data) {
  data.node.data = {
    uid: WLuid()
  };
  if (data.node.type === "file") {
    setScene(localStorage.getItem(LS_PROJECT_NAME), data.node.data.uid, "", "", "");
  }
  setManuscriptTree(localStorage.getItem(LS_PROJECT_NAME), ul.jstree(true).get_json("#", { flat: true }));
};
const saveScene = async (uid, sceneText, synposisText, notesText) => {
  await setScene(localStorage.getItem(LS_PROJECT_NAME), uid, sceneText, synposisText, notesText);
  showToast("Scene Updated!", "success", 1e3);
};
function ManuscriptsPage() {
  const [uid, setUid] = reactExports.useState();
  const [sceneText, setSceneText] = reactExports.useState({ ops: [] });
  const [synposisText, setSynposisText] = reactExports.useState("");
  const [notesText, setNotesText] = reactExports.useState("");
  reactExports.useEffect(() => {
    (async () => {
      try {
        const res = await getScene(localStorage.getItem(LS_PROJECT_NAME), uid);
        const data = JSON.parse(res);
        setSceneText(data.scene);
        setSynposisText(data.synopsis);
        setNotesText(data.notes);
        showToast("Scene Loaded!", "success", 1e3);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [uid]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "explorer-container", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Tree,
      {
        id: "tree",
        getTree,
        handleDeleteNode: handleDeleteNode(),
        handleRenameNode: handleRenameNode(),
        handleDoubleClick: handleDoubleClick(setUid),
        handleCreateNode: handleCreateNode()
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-editor-container", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      RichTextEditor,
      {
        style: {
          height: "100%",
          display: "flex",
          flexDirection: "column"
        },
        value: sceneText,
        setValue: setSceneText
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sidebar-container", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "resize-button", children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fa-solid fa-grip-lines-vertical" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "synopsis-container", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { for: "synopsis-editor", children: "Synopsis" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: synposisText, onChange: (e) => {
          setSynposisText(e.target.value);
        }, name: "synopsis-editor", id: "synopsis-editor" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "notes-container", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { for: "notes-editor", children: "Notes" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: notesText, onChange: (e) => {
          setNotesText(e.target.value);
        }, name: "notes-editor", id: "notes-editor" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { id: "save-scene", onClick: () => {
          saveScene(uid, sceneText, synposisText, notesText);
        }, children: "Save" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "statistics-popup", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "readability-index" }) })
  ] });
}
export {
  ManuscriptsPage as default
};
