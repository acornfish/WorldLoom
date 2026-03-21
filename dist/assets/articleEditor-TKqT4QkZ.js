import { r as reactExports, j as jsxRuntimeExports, f as fetchReferenceables, L as LS_PROJECT_NAME, W as WLSelect, R as React, g as getTemplateList, c as getTemplate, d as fetchArticle, m as modifyArticle } from "./index-BGqFm7i_.js";
import { R as RichTextEditor, s as showToast } from "./richTextEditor-CcejcIqp.js";
import "./uid-CgJ15W9t.js";
const PromptTypes = {
  Number: "Number",
  ShortText: "Short Text",
  RichText: "Rich Text",
  Reference: "Reference"
};
function ArticlePrompt({ promptType, promptName, getContents, referenceType, priorContentVal }) {
  const [value, setValue] = reactExports.useState();
  reactExports.useImperativeHandle(getContents, () => {
    return value;
  }, [value]);
  reactExports.useEffect(() => {
    let next;
    if (promptType === PromptTypes.Reference) {
      if (typeof priorContentVal === "string") {
        try {
          next = JSON.parse(priorContentVal);
        } catch {
          next = [];
        }
      } else {
        next = priorContentVal ?? [];
      }
    } else {
      next = priorContentVal;
    }
    setValue((prev) => {
      if (JSON.stringify(prev) === JSON.stringify(next)) {
        return prev;
      }
      return next;
    });
  }, [priorContentVal, promptType]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "seperator" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "prompt-container", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "prompt-label", children: promptName }),
      promptType == PromptTypes.Number ? /* @__PURE__ */ jsxRuntimeExports.jsx(NumberPrompt, { promptName, value, setValue }) : promptType == PromptTypes.ShortText ? /* @__PURE__ */ jsxRuntimeExports.jsx(ShortTextPrompt, { promptName, value, setValue }) : promptType == PromptTypes.RichText ? /* @__PURE__ */ jsxRuntimeExports.jsx(RichTextEditor, { promptName, value, setValue }) : promptType == PromptTypes.Reference ? /* @__PURE__ */ jsxRuntimeExports.jsx(ReferencePrompt, { promptName, value, setValue, referenceType }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "seperator" })
    ] })
  ] });
}
function NumberPrompt({ promptName, value, setValue, get }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", className: "number-prompt prompt", name: promptName, onChange: (e) => setValue(e.target.value), defaultValue: value });
}
function ShortTextPrompt({ promptName, value, setValue }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", class: "text-prompt prompt", name: promptName, onChange: (e) => setValue(e.target.value), defaultValue: value });
}
function ReferencePrompt({ promptName, referenceType, value, setValue }) {
  const [referenceables, setReferenceables] = reactExports.useState([]);
  reactExports.useEffect(() => {
    (async () => {
      let res2 = await fetchReferenceables(localStorage.getItem(LS_PROJECT_NAME), referenceType);
      if (res2.startsWith("Fail")) {
        console.warn("Referenceables of type" + referenceType + "couldn't be found");
      } else {
        setReferenceables(JSON.parse(res2));
      }
    })();
    setValue([]);
  }, [referenceType]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    WLSelect,
    {
      name: promptName,
      class: "reference-prompt prompt",
      multiple: "multiple",
      options: referenceables?.map((t, i) => {
        return { value: t.uid, label: t.text };
      }),
      onChange: (x) => {
        let val = x.map((t) => t.value);
        setValue(val);
      },
      isMulti: true,
      value: Array.isArray(value) ? referenceables?.filter((t, i) => value?.find((e, j) => t?.uid == e)).map((t, i) => ({ value: t?.uid, label: t?.text })) : void 0
    }
  );
}
function ContentTab({ selectedTab, templateData, saveFunction, priorArticleData }) {
  const index = 1;
  const promptsGET = reactExports.useRef([]);
  const promptsSET = reactExports.useRef([]);
  const templateRef = reactExports.useRef(templateData);
  const [promptVersion, setPromptVersion] = reactExports.useState(0);
  reactExports.useEffect(() => {
    templateRef.current = templateData;
  }, [templateData]);
  reactExports.useEffect(() => {
    for (let i = 0; i < templateRef.current.length; i++) {
      setPromptVersion((e) => e + 1);
      promptsSET.current[i] = priorArticleData[templateRef.current[i].promptName] ?? "";
    }
  }, [priorArticleData, templateData]);
  saveFunction.current = async () => {
    const contentsObj = {};
    promptsGET.current.forEach((x, i) => {
      contentsObj[templateRef.current[i].promptName] = x;
    });
    return contentsObj;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tab content-tab " + (selectedTab == index ? "active-tab" : ""), index, children: templateData.map(
    (t, i) => {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        ArticlePrompt,
        {
          promptName: t.promptName,
          promptType: t.type,
          getContents: (el) => {
            promptsGET.current[i] = el;
          },
          priorContentVal: promptsSET.current[i],
          referenceType: t.rtype
        },
        i
      );
    }
  ) });
}
const isNode = (value) => value instanceof HTMLElement;
const createStore = (initialState, queries2 = [], actions2 = []) => {
  const state2 = {
    ...initialState
  };
  const actionQueue = [];
  const dispatchQueue = [];
  const getState = () => ({ ...state2 });
  const processActionQueue = () => {
    const queue = [...actionQueue];
    actionQueue.length = 0;
    return queue;
  };
  const processDispatchQueue = () => {
    const queue = [...dispatchQueue];
    dispatchQueue.length = 0;
    queue.forEach(({ type, data: data2 }) => {
      dispatch(type, data2);
    });
  };
  const dispatch = (type, data2, isBlocking) => {
    if (isBlocking && !document.hidden) {
      dispatchQueue.push({ type, data: data2 });
      return;
    }
    if (actionHandlers[type]) {
      actionHandlers[type](data2);
    }
    actionQueue.push({
      type,
      data: data2
    });
  };
  const query = (str, ...args) => queryHandles[str] ? queryHandles[str](...args) : null;
  const api = {
    getState,
    processActionQueue,
    processDispatchQueue,
    dispatch,
    query
  };
  let queryHandles = {};
  queries2.forEach((query2) => {
    queryHandles = {
      ...query2(state2),
      ...queryHandles
    };
  });
  let actionHandlers = {};
  actions2.forEach((action) => {
    actionHandlers = {
      ...action(dispatch, query, state2),
      ...actionHandlers
    };
  });
  return api;
};
const defineProperty = (obj, property, definition) => {
  if (typeof definition === "function") {
    obj[property] = definition;
    return;
  }
  Object.defineProperty(obj, property, { ...definition });
};
const forin = (obj, cb) => {
  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue;
    }
    cb(key, obj[key]);
  }
};
const createObject = (definition) => {
  const obj = {};
  forin(definition, (property) => {
    defineProperty(obj, property, definition[property]);
  });
  return obj;
};
const attr = (node, name2, value = null) => {
  if (value === null) {
    return node.getAttribute(name2) || node.hasAttribute(name2);
  }
  node.setAttribute(name2, value);
};
const ns = "http://www.w3.org/2000/svg";
const svgElements = ["svg", "path"];
const isSVGElement = (tag) => svgElements.includes(tag);
const createElement = (tag, className, attributes = {}) => {
  if (typeof className === "object") {
    attributes = className;
    className = null;
  }
  const element = isSVGElement(tag) ? document.createElementNS(ns, tag) : document.createElement(tag);
  if (className) {
    if (isSVGElement(tag)) {
      attr(element, "class", className);
    } else {
      element.className = className;
    }
  }
  forin(attributes, (name2, value) => {
    attr(element, name2, value);
  });
  return element;
};
const appendChild = (parent) => (child, index) => {
  if (typeof index !== "undefined" && parent.children[index]) {
    parent.insertBefore(child, parent.children[index]);
  } else {
    parent.appendChild(child);
  }
};
const appendChildView = (parent, childViews) => (view, index) => {
  if (typeof index !== "undefined") {
    childViews.splice(index, 0, view);
  } else {
    childViews.push(view);
  }
  return view;
};
const removeChildView = (parent, childViews) => (view) => {
  childViews.splice(childViews.indexOf(view), 1);
  if (view.element.parentNode) {
    parent.removeChild(view.element);
  }
  return view;
};
const IS_BROWSER = (() => typeof window !== "undefined" && typeof window.document !== "undefined")();
const isBrowser = () => IS_BROWSER;
const testElement = isBrowser() ? createElement("svg") : {};
const getChildCount = "children" in testElement ? (el) => el.children.length : (el) => el.childNodes.length;
const getViewRect = (elementRect, childViews, offset, scale) => {
  const left = offset[0] || elementRect.left;
  const top = offset[1] || elementRect.top;
  const right = left + elementRect.width;
  const bottom = top + elementRect.height * (scale[1] || 1);
  const rect = {
    // the rectangle of the element itself
    element: {
      ...elementRect
    },
    // the rectangle of the element expanded to contain its children, does not include any margins
    inner: {
      left: elementRect.left,
      top: elementRect.top,
      right: elementRect.right,
      bottom: elementRect.bottom
    },
    // the rectangle of the element expanded to contain its children including own margin and child margins
    // margins will be added after we've recalculated the size
    outer: {
      left,
      top,
      right,
      bottom
    }
  };
  childViews.filter((childView) => !childView.isRectIgnored()).map((childView) => childView.rect).forEach((childViewRect) => {
    expandRect(rect.inner, { ...childViewRect.inner });
    expandRect(rect.outer, { ...childViewRect.outer });
  });
  calculateRectSize(rect.inner);
  rect.outer.bottom += rect.element.marginBottom;
  rect.outer.right += rect.element.marginRight;
  calculateRectSize(rect.outer);
  return rect;
};
const expandRect = (parent, child) => {
  child.top += parent.top;
  child.right += parent.left;
  child.bottom += parent.top;
  child.left += parent.left;
  if (child.bottom > parent.bottom) {
    parent.bottom = child.bottom;
  }
  if (child.right > parent.right) {
    parent.right = child.right;
  }
};
const calculateRectSize = (rect) => {
  rect.width = rect.right - rect.left;
  rect.height = rect.bottom - rect.top;
};
const isNumber = (value) => typeof value === "number";
const thereYet = (position, destination, velocity, errorMargin = 1e-3) => {
  return Math.abs(position - destination) < errorMargin && Math.abs(velocity) < errorMargin;
};
const spring = (
  // default options
  ({ stiffness = 0.5, damping = 0.75, mass = 10 } = {}) => {
    let target = null;
    let position = null;
    let velocity = 0;
    let resting = false;
    const interpolate = (ts, skipToEndState) => {
      if (resting) return;
      if (!(isNumber(target) && isNumber(position))) {
        resting = true;
        velocity = 0;
        return;
      }
      const f = -(position - target) * stiffness;
      velocity += f / mass;
      position += velocity;
      velocity *= damping;
      if (thereYet(position, target, velocity) || skipToEndState) {
        position = target;
        velocity = 0;
        resting = true;
        api.onupdate(position);
        api.oncomplete(position);
      } else {
        api.onupdate(position);
      }
    };
    const setTarget = (value) => {
      if (isNumber(value) && !isNumber(position)) {
        position = value;
      }
      if (target === null) {
        target = value;
        position = value;
      }
      target = value;
      if (position === target || typeof target === "undefined") {
        resting = true;
        velocity = 0;
        api.onupdate(position);
        api.oncomplete(position);
        return;
      }
      resting = false;
    };
    const api = createObject({
      interpolate,
      target: {
        set: setTarget,
        get: () => target
      },
      resting: {
        get: () => resting
      },
      onupdate: (value) => {
      },
      oncomplete: (value) => {
      }
    });
    return api;
  }
);
const easeInOutQuad = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
const tween = (
  // default values
  ({ duration = 500, easing = easeInOutQuad, delay = 0 } = {}) => {
    let start = null;
    let t;
    let p;
    let resting = true;
    let reverse = false;
    let target = null;
    const interpolate = (ts, skipToEndState) => {
      if (resting || target === null) return;
      if (start === null) {
        start = ts;
      }
      if (ts - start < delay) return;
      t = ts - start - delay;
      if (t >= duration || skipToEndState) {
        t = 1;
        p = reverse ? 0 : 1;
        api.onupdate(p * target);
        api.oncomplete(p * target);
        resting = true;
      } else {
        p = t / duration;
        api.onupdate((t >= 0 ? easing(reverse ? 1 - p : p) : 0) * target);
      }
    };
    const api = createObject({
      interpolate,
      target: {
        get: () => reverse ? 0 : target,
        set: (value) => {
          if (target === null) {
            target = value;
            api.onupdate(value);
            api.oncomplete(value);
            return;
          }
          if (value < target) {
            target = 1;
            reverse = true;
          } else {
            reverse = false;
            target = value;
          }
          resting = false;
          start = null;
        }
      },
      resting: {
        get: () => resting
      },
      onupdate: (value) => {
      },
      oncomplete: (value) => {
      }
    });
    return api;
  }
);
const animator = {
  spring,
  tween
};
const createAnimator = (definition, category, property) => {
  const def = definition[category] && typeof definition[category][property] === "object" ? definition[category][property] : definition[category] || definition;
  const type = typeof def === "string" ? def : def.type;
  const props = typeof def === "object" ? { ...def } : {};
  return animator[type] ? animator[type](props) : null;
};
const addGetSet = (keys, obj, props, overwrite = false) => {
  obj = Array.isArray(obj) ? obj : [obj];
  obj.forEach((o) => {
    keys.forEach((key) => {
      let name2 = key;
      let getter = () => props[key];
      let setter = (value) => props[key] = value;
      if (typeof key === "object") {
        name2 = key.key;
        getter = key.getter || getter;
        setter = key.setter || setter;
      }
      if (o[name2] && !overwrite) {
        return;
      }
      o[name2] = {
        get: getter,
        set: setter
      };
    });
  });
};
const animations = ({ mixinConfig, viewProps, viewInternalAPI, viewExternalAPI }) => {
  const initialProps = { ...viewProps };
  const animations2 = [];
  forin(mixinConfig, (property, animation) => {
    const animator2 = createAnimator(animation);
    if (!animator2) {
      return;
    }
    animator2.onupdate = (value) => {
      viewProps[property] = value;
    };
    animator2.target = initialProps[property];
    const prop = {
      key: property,
      setter: (value) => {
        if (animator2.target === value) {
          return;
        }
        animator2.target = value;
      },
      getter: () => viewProps[property]
    };
    addGetSet([prop], [viewInternalAPI, viewExternalAPI], viewProps, true);
    animations2.push(animator2);
  });
  return {
    write: (ts) => {
      let skipToEndState = document.hidden;
      let resting = true;
      animations2.forEach((animation) => {
        if (!animation.resting) resting = false;
        animation.interpolate(ts, skipToEndState);
      });
      return resting;
    },
    destroy: () => {
    }
  };
};
const addEvent = (element) => (type, fn2) => {
  element.addEventListener(type, fn2);
};
const removeEvent = (element) => (type, fn2) => {
  element.removeEventListener(type, fn2);
};
const listeners = ({
  mixinConfig,
  viewProps,
  viewInternalAPI,
  viewExternalAPI,
  viewState,
  view
}) => {
  const events = [];
  const add = addEvent(view.element);
  const remove = removeEvent(view.element);
  viewExternalAPI.on = (type, fn2) => {
    events.push({
      type,
      fn: fn2
    });
    add(type, fn2);
  };
  viewExternalAPI.off = (type, fn2) => {
    events.splice(events.findIndex((event) => event.type === type && event.fn === fn2), 1);
    remove(type, fn2);
  };
  return {
    write: () => {
      return true;
    },
    destroy: () => {
      events.forEach((event) => {
        remove(event.type, event.fn);
      });
    }
  };
};
const apis = ({ mixinConfig, viewProps, viewExternalAPI }) => {
  addGetSet(mixinConfig, viewExternalAPI, viewProps);
};
const isDefined = (value) => value != null;
const defaults = {
  opacity: 1,
  scaleX: 1,
  scaleY: 1,
  translateX: 0,
  translateY: 0,
  rotateX: 0,
  rotateY: 0,
  rotateZ: 0,
  originX: 0,
  originY: 0
};
const styles = ({ mixinConfig, viewProps, viewInternalAPI, viewExternalAPI, view }) => {
  const initialProps = { ...viewProps };
  const currentProps = {};
  addGetSet(mixinConfig, [viewInternalAPI, viewExternalAPI], viewProps);
  const getOffset = () => [viewProps["translateX"] || 0, viewProps["translateY"] || 0];
  const getScale = () => [viewProps["scaleX"] || 0, viewProps["scaleY"] || 0];
  const getRect = () => view.rect ? getViewRect(view.rect, view.childViews, getOffset(), getScale()) : null;
  viewInternalAPI.rect = { get: getRect };
  viewExternalAPI.rect = { get: getRect };
  mixinConfig.forEach((key) => {
    viewProps[key] = typeof initialProps[key] === "undefined" ? defaults[key] : initialProps[key];
  });
  return {
    write: () => {
      if (!propsHaveChanged(currentProps, viewProps)) {
        return;
      }
      applyStyles(view.element, viewProps);
      Object.assign(currentProps, { ...viewProps });
      return true;
    },
    destroy: () => {
    }
  };
};
const propsHaveChanged = (currentProps, newProps) => {
  if (Object.keys(currentProps).length !== Object.keys(newProps).length) {
    return true;
  }
  for (const prop in newProps) {
    if (newProps[prop] !== currentProps[prop]) {
      return true;
    }
  }
  return false;
};
const applyStyles = (element, {
  opacity,
  perspective,
  translateX,
  translateY,
  scaleX,
  scaleY,
  rotateX,
  rotateY,
  rotateZ,
  originX,
  originY,
  width,
  height
}) => {
  let transforms = "";
  let styles2 = "";
  if (isDefined(originX) || isDefined(originY)) {
    styles2 += `transform-origin: ${originX || 0}px ${originY || 0}px;`;
  }
  if (isDefined(perspective)) {
    transforms += `perspective(${perspective}px) `;
  }
  if (isDefined(translateX) || isDefined(translateY)) {
    transforms += `translate3d(${translateX || 0}px, ${translateY || 0}px, 0) `;
  }
  if (isDefined(scaleX) || isDefined(scaleY)) {
    transforms += `scale3d(${isDefined(scaleX) ? scaleX : 1}, ${isDefined(scaleY) ? scaleY : 1}, 1) `;
  }
  if (isDefined(rotateZ)) {
    transforms += `rotateZ(${rotateZ}rad) `;
  }
  if (isDefined(rotateX)) {
    transforms += `rotateX(${rotateX}rad) `;
  }
  if (isDefined(rotateY)) {
    transforms += `rotateY(${rotateY}rad) `;
  }
  if (transforms.length) {
    styles2 += `transform:${transforms};`;
  }
  if (isDefined(opacity)) {
    styles2 += `opacity:${opacity};`;
    if (opacity === 0) {
      styles2 += `visibility:hidden;`;
    }
    if (opacity < 1) {
      styles2 += `pointer-events:none;`;
    }
  }
  if (isDefined(height)) {
    styles2 += `height:${height}px;`;
  }
  if (isDefined(width)) {
    styles2 += `width:${width}px;`;
  }
  const elementCurrentStyle = element.elementCurrentStyle || "";
  if (styles2.length !== elementCurrentStyle.length || styles2 !== elementCurrentStyle) {
    element.style.cssText = styles2;
    element.elementCurrentStyle = styles2;
  }
};
const Mixins = {
  styles,
  listeners,
  animations,
  apis
};
const updateRect = (rect = {}, element = {}, style = {}) => {
  if (!element.layoutCalculated) {
    rect.paddingTop = parseInt(style.paddingTop, 10) || 0;
    rect.marginTop = parseInt(style.marginTop, 10) || 0;
    rect.marginRight = parseInt(style.marginRight, 10) || 0;
    rect.marginBottom = parseInt(style.marginBottom, 10) || 0;
    rect.marginLeft = parseInt(style.marginLeft, 10) || 0;
    element.layoutCalculated = true;
  }
  rect.left = element.offsetLeft || 0;
  rect.top = element.offsetTop || 0;
  rect.width = element.offsetWidth || 0;
  rect.height = element.offsetHeight || 0;
  rect.right = rect.left + rect.width;
  rect.bottom = rect.top + rect.height;
  rect.scrollTop = element.scrollTop;
  rect.hidden = element.offsetParent === null;
  return rect;
};
const createView = (
  // default view definition
  ({
    // element definition
    tag = "div",
    name: name2 = null,
    attributes = {},
    // view interaction
    read = () => {
    },
    write: write2 = () => {
    },
    create: create2 = () => {
    },
    destroy: destroy2 = () => {
    },
    // hooks
    filterFrameActionsForChild = (child, actions2) => actions2,
    didCreateView = () => {
    },
    didWriteView = () => {
    },
    // rect related
    ignoreRect = false,
    ignoreRectUpdate = false,
    // mixins
    mixins = []
  } = {}) => (store, props = {}) => {
    const element = createElement(tag, `filepond--${name2}`, attributes);
    const style = window.getComputedStyle(element, null);
    const rect = updateRect();
    let frameRect = null;
    let isResting = false;
    const childViews = [];
    const activeMixins = [];
    const ref = {};
    const state2 = {};
    const writers = [
      write2
      // default writer
    ];
    const readers = [
      read
      // default reader
    ];
    const destroyers = [
      destroy2
      // default destroy
    ];
    const getElement = () => element;
    const getChildViews = () => childViews.concat();
    const getReference = () => ref;
    const createChildView = (store2) => (view, props2) => view(store2, props2);
    const getRect = () => {
      if (frameRect) {
        return frameRect;
      }
      frameRect = getViewRect(rect, childViews, [0, 0], [1, 1]);
      return frameRect;
    };
    const getStyle = () => style;
    const _read = () => {
      frameRect = null;
      childViews.forEach((child) => child._read());
      const shouldUpdate = !(ignoreRectUpdate && rect.width && rect.height);
      if (shouldUpdate) {
        updateRect(rect, element, style);
      }
      const api = { root: internalAPI, props, rect };
      readers.forEach((reader) => reader(api));
    };
    const _write = (ts, frameActions, shouldOptimize) => {
      let resting = frameActions.length === 0;
      writers.forEach((writer) => {
        const writerResting = writer({
          props,
          root: internalAPI,
          actions: frameActions,
          timestamp: ts,
          shouldOptimize
        });
        if (writerResting === false) {
          resting = false;
        }
      });
      activeMixins.forEach((mixin) => {
        const mixinResting = mixin.write(ts);
        if (mixinResting === false) {
          resting = false;
        }
      });
      childViews.filter((child) => !!child.element.parentNode).forEach((child) => {
        const childResting = child._write(
          ts,
          filterFrameActionsForChild(child, frameActions),
          shouldOptimize
        );
        if (!childResting) {
          resting = false;
        }
      });
      childViews.forEach((child, index) => {
        if (child.element.parentNode) {
          return;
        }
        internalAPI.appendChild(child.element, index);
        child._read();
        child._write(
          ts,
          filterFrameActionsForChild(child, frameActions),
          shouldOptimize
        );
        resting = false;
      });
      isResting = resting;
      didWriteView({
        props,
        root: internalAPI,
        actions: frameActions,
        timestamp: ts
      });
      return resting;
    };
    const _destroy = () => {
      activeMixins.forEach((mixin) => mixin.destroy());
      destroyers.forEach((destroyer) => {
        destroyer({ root: internalAPI, props });
      });
      childViews.forEach((child) => child._destroy());
    };
    const sharedAPIDefinition = {
      element: {
        get: getElement
      },
      style: {
        get: getStyle
      },
      childViews: {
        get: getChildViews
      }
    };
    const internalAPIDefinition = {
      ...sharedAPIDefinition,
      rect: {
        get: getRect
      },
      // access to custom children references
      ref: {
        get: getReference
      },
      // dom modifiers
      is: (needle) => name2 === needle,
      appendChild: appendChild(element),
      createChildView: createChildView(store),
      linkView: (view) => {
        childViews.push(view);
        return view;
      },
      unlinkView: (view) => {
        childViews.splice(childViews.indexOf(view), 1);
      },
      appendChildView: appendChildView(element, childViews),
      removeChildView: removeChildView(element, childViews),
      registerWriter: (writer) => writers.push(writer),
      registerReader: (reader) => readers.push(reader),
      registerDestroyer: (destroyer) => destroyers.push(destroyer),
      invalidateLayout: () => element.layoutCalculated = false,
      // access to data store
      dispatch: store.dispatch,
      query: store.query
    };
    const externalAPIDefinition = {
      element: {
        get: getElement
      },
      childViews: {
        get: getChildViews
      },
      rect: {
        get: getRect
      },
      resting: {
        get: () => isResting
      },
      isRectIgnored: () => ignoreRect,
      _read,
      _write,
      _destroy
    };
    const mixinAPIDefinition = {
      ...sharedAPIDefinition,
      rect: {
        get: () => rect
      }
    };
    Object.keys(mixins).sort((a, b) => {
      if (a === "styles") {
        return 1;
      } else if (b === "styles") {
        return -1;
      }
      return 0;
    }).forEach((key) => {
      const mixinAPI = Mixins[key]({
        mixinConfig: mixins[key],
        viewProps: props,
        viewState: state2,
        viewInternalAPI: internalAPIDefinition,
        viewExternalAPI: externalAPIDefinition,
        view: createObject(mixinAPIDefinition)
      });
      if (mixinAPI) {
        activeMixins.push(mixinAPI);
      }
    });
    const internalAPI = createObject(internalAPIDefinition);
    create2({
      root: internalAPI,
      props
    });
    const childCount = getChildCount(element);
    childViews.forEach((child, index) => {
      internalAPI.appendChild(child.element, childCount + index);
    });
    didCreateView(internalAPI);
    return createObject(externalAPIDefinition);
  }
);
const createPainter = (read, write2, fps = 60) => {
  const name2 = "__framePainter";
  if (window[name2]) {
    window[name2].readers.push(read);
    window[name2].writers.push(write2);
    return;
  }
  window[name2] = {
    readers: [read],
    writers: [write2]
  };
  const painter = window[name2];
  const interval = 1e3 / fps;
  let last = null;
  let id = null;
  let requestTick = null;
  let cancelTick = null;
  const setTimerType = () => {
    if (document.hidden) {
      requestTick = () => window.setTimeout(() => tick(performance.now()), interval);
      cancelTick = () => window.clearTimeout(id);
    } else {
      requestTick = () => window.requestAnimationFrame(tick);
      cancelTick = () => window.cancelAnimationFrame(id);
    }
  };
  document.addEventListener("visibilitychange", () => {
    if (cancelTick) cancelTick();
    setTimerType();
    tick(performance.now());
  });
  const tick = (ts) => {
    id = requestTick(tick);
    if (!last) {
      last = ts;
    }
    const delta = ts - last;
    if (delta <= interval) {
      return;
    }
    last = ts - delta % interval;
    painter.readers.forEach((read2) => read2());
    painter.writers.forEach((write3) => write3(ts));
  };
  setTimerType();
  tick(performance.now());
  return {
    pause: () => {
      cancelTick(id);
    }
  };
};
const createRoute = (routes, fn2) => ({ root: root2, props, actions: actions2 = [], timestamp, shouldOptimize }) => {
  actions2.filter((action) => routes[action.type]).forEach(
    (action) => routes[action.type]({ root: root2, props, action: action.data, timestamp, shouldOptimize })
  );
  if (fn2) {
    fn2({ root: root2, props, actions: actions2, timestamp, shouldOptimize });
  }
};
const insertBefore = (newNode, referenceNode) => referenceNode.parentNode.insertBefore(newNode, referenceNode);
const insertAfter = (newNode, referenceNode) => {
  return referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
};
const isArray = (value) => Array.isArray(value);
const isEmpty = (value) => value == null;
const trim = (str) => str.trim();
const toString = (value) => "" + value;
const toArray = (value, splitter = ",") => {
  if (isEmpty(value)) {
    return [];
  }
  if (isArray(value)) {
    return value;
  }
  return toString(value).split(splitter).map(trim).filter((str) => str.length);
};
const isBoolean = (value) => typeof value === "boolean";
const toBoolean = (value) => isBoolean(value) ? value : value === "true";
const isString = (value) => typeof value === "string";
const toNumber = (value) => isNumber(value) ? value : isString(value) ? toString(value).replace(/[a-z]+/gi, "") : 0;
const toInt = (value) => parseInt(toNumber(value), 10);
const toFloat = (value) => parseFloat(toNumber(value));
const isInt = (value) => isNumber(value) && isFinite(value) && Math.floor(value) === value;
const toBytes = (value, base = 1e3) => {
  if (isInt(value)) {
    return value;
  }
  let naturalFileSize = toString(value).trim();
  if (/MB$/i.test(naturalFileSize)) {
    naturalFileSize = naturalFileSize.replace(/MB$i/, "").trim();
    return toInt(naturalFileSize) * base * base;
  }
  if (/KB/i.test(naturalFileSize)) {
    naturalFileSize = naturalFileSize.replace(/KB$i/, "").trim();
    return toInt(naturalFileSize) * base;
  }
  return toInt(naturalFileSize);
};
const isFunction = (value) => typeof value === "function";
const toFunctionReference = (string) => {
  let ref = self;
  let levels = string.split(".");
  let level = null;
  while (level = levels.shift()) {
    ref = ref[level];
    if (!ref) {
      return null;
    }
  }
  return ref;
};
const methods = {
  process: "POST",
  patch: "PATCH",
  revert: "DELETE",
  fetch: "GET",
  restore: "GET",
  load: "GET"
};
const createServerAPI = (outline) => {
  const api = {};
  api.url = isString(outline) ? outline : outline.url || "";
  api.timeout = outline.timeout ? parseInt(outline.timeout, 10) : 0;
  api.headers = outline.headers ? outline.headers : {};
  forin(methods, (key) => {
    api[key] = createAction(key, outline[key], methods[key], api.timeout, api.headers);
  });
  api.process = outline.process || isString(outline) || outline.url ? api.process : null;
  api.remove = outline.remove || null;
  delete api.headers;
  return api;
};
const createAction = (name2, outline, method, timeout, headers) => {
  if (outline === null) {
    return null;
  }
  if (typeof outline === "function") {
    return outline;
  }
  const action = {
    url: method === "GET" || method === "PATCH" ? `?${name2}=` : "",
    method,
    headers,
    withCredentials: false,
    timeout,
    onload: null,
    ondata: null,
    onerror: null
  };
  if (isString(outline)) {
    action.url = outline;
    return action;
  }
  Object.assign(action, outline);
  if (isString(action.headers)) {
    const parts = action.headers.split(/:(.+)/);
    action.headers = {
      header: parts[0],
      value: parts[1]
    };
  }
  action.withCredentials = toBoolean(action.withCredentials);
  return action;
};
const toServerAPI = (value) => createServerAPI(value);
const isNull = (value) => value === null;
const isObject = (value) => typeof value === "object" && value !== null;
const isAPI = (value) => {
  return isObject(value) && isString(value.url) && isObject(value.process) && isObject(value.revert) && isObject(value.restore) && isObject(value.fetch);
};
const getType = (value) => {
  if (isArray(value)) {
    return "array";
  }
  if (isNull(value)) {
    return "null";
  }
  if (isInt(value)) {
    return "int";
  }
  if (/^[0-9]+ ?(?:GB|MB|KB)$/gi.test(value)) {
    return "bytes";
  }
  if (isAPI(value)) {
    return "api";
  }
  return typeof value;
};
const replaceSingleQuotes = (str) => str.replace(/{\s*'/g, '{"').replace(/'\s*}/g, '"}').replace(/'\s*:/g, '":').replace(/:\s*'/g, ':"').replace(/,\s*'/g, ',"').replace(/'\s*,/g, '",');
const conversionTable = {
  array: toArray,
  boolean: toBoolean,
  int: (value) => getType(value) === "bytes" ? toBytes(value) : toInt(value),
  number: toFloat,
  float: toFloat,
  bytes: toBytes,
  string: (value) => isFunction(value) ? value : toString(value),
  function: (value) => toFunctionReference(value),
  serverapi: toServerAPI,
  object: (value) => {
    try {
      return JSON.parse(replaceSingleQuotes(value));
    } catch (e) {
      return null;
    }
  }
};
const convertTo = (value, type) => conversionTable[type](value);
const getValueByType = (newValue, defaultValue, valueType) => {
  if (newValue === defaultValue) {
    return newValue;
  }
  let newValueType = getType(newValue);
  if (newValueType !== valueType) {
    const convertedValue = convertTo(newValue, valueType);
    newValueType = getType(convertedValue);
    if (convertedValue === null) {
      throw `Trying to assign value with incorrect type to "${option}", allowed type: "${valueType}"`;
    } else {
      newValue = convertedValue;
    }
  }
  return newValue;
};
const createOption = (defaultValue, valueType) => {
  let currentValue = defaultValue;
  return {
    enumerable: true,
    get: () => currentValue,
    set: (newValue) => {
      currentValue = getValueByType(newValue, defaultValue, valueType);
    }
  };
};
const createOptions = (options) => {
  const obj = {};
  forin(options, (prop) => {
    const optionDefinition = options[prop];
    obj[prop] = createOption(optionDefinition[0], optionDefinition[1]);
  });
  return createObject(obj);
};
const createInitialState = (options) => ({
  // model
  items: [],
  // timeout used for calling update items
  listUpdateTimeout: null,
  // timeout used for stacking metadata updates
  itemUpdateTimeout: null,
  // queue of items waiting to be processed
  processingQueue: [],
  // options
  options: createOptions(options)
});
const fromCamels = (string, separator = "-") => string.split(/(?=[A-Z])/).map((part) => part.toLowerCase()).join(separator);
const createOptionAPI = (store, options) => {
  const obj = {};
  forin(options, (key) => {
    obj[key] = {
      get: () => store.getState().options[key],
      set: (value) => {
        store.dispatch(`SET_${fromCamels(key, "_").toUpperCase()}`, {
          value
        });
      }
    };
  });
  return obj;
};
const createOptionActions = (options) => (dispatch, query, state2) => {
  const obj = {};
  forin(options, (key) => {
    const name2 = fromCamels(key, "_").toUpperCase();
    obj[`SET_${name2}`] = (action) => {
      try {
        state2.options[key] = action.value;
      } catch (e) {
      }
      dispatch(`DID_SET_${name2}`, { value: state2.options[key] });
    };
  });
  return obj;
};
const createOptionQueries = (options) => (state2) => {
  const obj = {};
  forin(options, (key) => {
    obj[`GET_${fromCamels(key, "_").toUpperCase()}`] = (action) => state2.options[key];
  });
  return obj;
};
const InteractionMethod = {
  API: 1,
  DROP: 2,
  BROWSE: 3,
  PASTE: 4,
  NONE: 5
};
const getUniqueId = () => Math.random().toString(36).substring(2, 11);
const arrayRemove = (arr, index) => arr.splice(index, 1);
const run = (cb, sync) => {
  if (sync) {
    cb();
  } else if (document.hidden) {
    Promise.resolve(1).then(cb);
  } else {
    setTimeout(cb, 0);
  }
};
const on = () => {
  const listeners2 = [];
  const off = (event, cb) => {
    arrayRemove(
      listeners2,
      listeners2.findIndex((listener) => listener.event === event && (listener.cb === cb || !cb))
    );
  };
  const fire = (event, args, sync) => {
    listeners2.filter((listener) => listener.event === event).map((listener) => listener.cb).forEach((cb) => run(() => cb(...args), sync));
  };
  return {
    fireSync: (event, ...args) => {
      fire(event, args, true);
    },
    fire: (event, ...args) => {
      fire(event, args, false);
    },
    on: (event, cb) => {
      listeners2.push({ event, cb });
    },
    onOnce: (event, cb) => {
      listeners2.push({
        event,
        cb: (...args) => {
          off(event, cb);
          cb(...args);
        }
      });
    },
    off
  };
};
const copyObjectPropertiesToObject = (src, target, excluded) => {
  Object.getOwnPropertyNames(src).filter((property) => !excluded.includes(property)).forEach(
    (key) => Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(src, key))
  );
};
const PRIVATE = [
  "fire",
  "process",
  "revert",
  "load",
  "on",
  "off",
  "onOnce",
  "retryLoad",
  "extend",
  "archive",
  "archived",
  "release",
  "released",
  "requestProcessing",
  "freeze"
];
const createItemAPI = (item2) => {
  const api = {};
  copyObjectPropertiesToObject(item2, api, PRIVATE);
  return api;
};
const removeReleasedItems = (items) => {
  items.forEach((item2, index) => {
    if (item2.released) {
      arrayRemove(items, index);
    }
  });
};
const ItemStatus = {
  INIT: 1,
  IDLE: 2,
  PROCESSING_QUEUED: 9,
  PROCESSING: 3,
  PROCESSING_COMPLETE: 5,
  PROCESSING_ERROR: 6,
  PROCESSING_REVERT_ERROR: 10,
  LOADING: 7,
  LOAD_ERROR: 8
};
const FileOrigin = {
  INPUT: 1,
  LIMBO: 2,
  LOCAL: 3
};
const getNonNumeric = (str) => /[^0-9]+/.exec(str);
const getDecimalSeparator = () => getNonNumeric(1.1.toLocaleString())[0];
const getThousandsSeparator = () => {
  const decimalSeparator = getDecimalSeparator();
  const thousandsStringWithSeparator = 1e3.toLocaleString();
  const thousandsStringWithoutSeparator = 1e3.toString();
  if (thousandsStringWithSeparator !== thousandsStringWithoutSeparator) {
    return getNonNumeric(thousandsStringWithSeparator)[0];
  }
  return decimalSeparator === "." ? "," : ".";
};
const Type = {
  BOOLEAN: "boolean",
  INT: "int",
  NUMBER: "number",
  STRING: "string",
  ARRAY: "array",
  OBJECT: "object",
  FUNCTION: "function",
  ACTION: "action",
  SERVER_API: "serverapi",
  REGEX: "regex"
};
const filters = [];
const applyFilterChain = (key, value, utils) => new Promise((resolve, reject) => {
  const matchingFilters = filters.filter((f) => f.key === key).map((f) => f.cb);
  if (matchingFilters.length === 0) {
    resolve(value);
    return;
  }
  const initialFilter = matchingFilters.shift();
  matchingFilters.reduce(
    // loop over promises passing value to next promise
    (current, next) => current.then((value2) => next(value2, utils)),
    // call initial filter, will return a promise
    initialFilter(value, utils)
    // all executed
  ).then((value2) => resolve(value2)).catch((error2) => reject(error2));
});
const applyFilters = (key, value, utils) => filters.filter((f) => f.key === key).map((f) => f.cb(value, utils));
const addFilter = (key, cb) => filters.push({ key, cb });
const extendDefaultOptions = (additionalOptions) => Object.assign(defaultOptions, additionalOptions);
const getOptions = () => ({ ...defaultOptions });
const setOptions = (opts) => {
  forin(opts, (key, value) => {
    if (!defaultOptions[key]) {
      return;
    }
    defaultOptions[key][0] = getValueByType(
      value,
      defaultOptions[key][0],
      defaultOptions[key][1]
    );
  });
};
const defaultOptions = {
  // the id to add to the root element
  id: [null, Type.STRING],
  // input field name to use
  name: ["filepond", Type.STRING],
  // disable the field
  disabled: [false, Type.BOOLEAN],
  // classname to put on wrapper
  className: [null, Type.STRING],
  // is the field required
  required: [false, Type.BOOLEAN],
  // Allow media capture when value is set
  captureMethod: [null, Type.STRING],
  // - "camera", "microphone" or "camcorder",
  // - Does not work with multiple on apple devices
  // - If set, acceptedFileTypes must be made to match with media wildcard "image/*", "audio/*" or "video/*"
  // sync `acceptedFileTypes` property with `accept` attribute
  allowSyncAcceptAttribute: [true, Type.BOOLEAN],
  // Feature toggles
  allowDrop: [true, Type.BOOLEAN],
  // Allow dropping of files
  allowBrowse: [true, Type.BOOLEAN],
  // Allow browsing the file system
  allowPaste: [true, Type.BOOLEAN],
  // Allow pasting files
  allowMultiple: [false, Type.BOOLEAN],
  // Allow multiple files (disabled by default, as multiple attribute is also required on input to allow multiple)
  allowReplace: [true, Type.BOOLEAN],
  // Allow dropping a file on other file to replace it (only works when multiple is set to false)
  allowRevert: [true, Type.BOOLEAN],
  // Allows user to revert file upload
  allowRemove: [true, Type.BOOLEAN],
  // Allow user to remove a file
  allowProcess: [true, Type.BOOLEAN],
  // Allows user to process a file, when set to false, this removes the file upload button
  allowReorder: [false, Type.BOOLEAN],
  // Allow reordering of files
  allowDirectoriesOnly: [false, Type.BOOLEAN],
  // Allow only selecting directories with browse (no support for filtering dnd at this point)
  // Try store file if `server` not set
  storeAsFile: [false, Type.BOOLEAN],
  // Revert mode
  forceRevert: [false, Type.BOOLEAN],
  // Set to 'force' to require the file to be reverted before removal
  // Input requirements
  maxFiles: [null, Type.INT],
  // Max number of files
  checkValidity: [false, Type.BOOLEAN],
  // Enables custom validity messages
  // Where to put file
  itemInsertLocationFreedom: [true, Type.BOOLEAN],
  // Set to false to always add items to begin or end of list
  itemInsertLocation: ["before", Type.STRING],
  // Default index in list to add items that have been dropped at the top of the list
  itemInsertInterval: [75, Type.INT],
  // Drag 'n Drop related
  dropOnPage: [false, Type.BOOLEAN],
  // Allow dropping of files anywhere on page (prevents browser from opening file if dropped outside of Up)
  dropOnElement: [true, Type.BOOLEAN],
  // Drop needs to happen on element (set to false to also load drops outside of Up)
  dropValidation: [false, Type.BOOLEAN],
  // Enable or disable validating files on drop
  ignoredFiles: [[".ds_store", "thumbs.db", "desktop.ini"], Type.ARRAY],
  // Upload related
  instantUpload: [true, Type.BOOLEAN],
  // Should upload files immediately on drop
  maxParallelUploads: [2, Type.INT],
  // Maximum files to upload in parallel
  allowMinimumUploadDuration: [true, Type.BOOLEAN],
  // if true uploads take at least 750 ms, this ensures the user sees the upload progress giving trust the upload actually happened
  // Chunks
  chunkUploads: [false, Type.BOOLEAN],
  // Enable chunked uploads
  chunkForce: [false, Type.BOOLEAN],
  // Force use of chunk uploads even for files smaller than chunk size
  chunkSize: [5e6, Type.INT],
  // Size of chunks (5MB default)
  chunkRetryDelays: [[500, 1e3, 3e3], Type.ARRAY],
  // Amount of times to retry upload of a chunk when it fails
  // The server api end points to use for uploading (see docs)
  server: [null, Type.SERVER_API],
  // File size calculations, can set to 1024, this is only used for display, properties use file size base 1000
  fileSizeBase: [1e3, Type.INT],
  // Labels and status messages
  labelFileSizeBytes: ["bytes", Type.STRING],
  labelFileSizeKilobytes: ["KB", Type.STRING],
  labelFileSizeMegabytes: ["MB", Type.STRING],
  labelFileSizeGigabytes: ["GB", Type.STRING],
  labelDecimalSeparator: [getDecimalSeparator(), Type.STRING],
  // Default is locale separator
  labelThousandsSeparator: [getThousandsSeparator(), Type.STRING],
  // Default is locale separator
  labelIdle: [
    'Drag & Drop your files or <span class="filepond--label-action">Browse</span>',
    Type.STRING
  ],
  labelInvalidField: ["Field contains invalid files", Type.STRING],
  labelFileWaitingForSize: ["Waiting for size", Type.STRING],
  labelFileSizeNotAvailable: ["Size not available", Type.STRING],
  labelFileCountSingular: ["file in list", Type.STRING],
  labelFileCountPlural: ["files in list", Type.STRING],
  labelFileLoading: ["Loading", Type.STRING],
  labelFileAdded: ["Added", Type.STRING],
  // assistive only
  labelFileLoadError: ["Error during load", Type.STRING],
  labelFileRemoved: ["Removed", Type.STRING],
  // assistive only
  labelFileRemoveError: ["Error during remove", Type.STRING],
  labelFileProcessing: ["Uploading", Type.STRING],
  labelFileProcessingComplete: ["Upload complete", Type.STRING],
  labelFileProcessingAborted: ["Upload cancelled", Type.STRING],
  labelFileProcessingError: ["Error during upload", Type.STRING],
  labelFileProcessingRevertError: ["Error during revert", Type.STRING],
  labelTapToCancel: ["tap to cancel", Type.STRING],
  labelTapToRetry: ["tap to retry", Type.STRING],
  labelTapToUndo: ["tap to undo", Type.STRING],
  labelButtonRemoveItem: ["Remove", Type.STRING],
  labelButtonAbortItemLoad: ["Abort", Type.STRING],
  labelButtonRetryItemLoad: ["Retry", Type.STRING],
  labelButtonAbortItemProcessing: ["Cancel", Type.STRING],
  labelButtonUndoItemProcessing: ["Undo", Type.STRING],
  labelButtonRetryItemProcessing: ["Retry", Type.STRING],
  labelButtonProcessItem: ["Upload", Type.STRING],
  // make sure width and height plus viewpox are even numbers so icons are nicely centered
  iconRemove: [
    '<svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"><path d="M11.586 13l-2.293 2.293a1 1 0 0 0 1.414 1.414L13 14.414l2.293 2.293a1 1 0 0 0 1.414-1.414L14.414 13l2.293-2.293a1 1 0 0 0-1.414-1.414L13 11.586l-2.293-2.293a1 1 0 0 0-1.414 1.414L11.586 13z" fill="currentColor" fill-rule="nonzero"/></svg>',
    Type.STRING
  ],
  iconProcess: [
    '<svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"><path d="M14 10.414v3.585a1 1 0 0 1-2 0v-3.585l-1.293 1.293a1 1 0 0 1-1.414-1.415l3-3a1 1 0 0 1 1.414 0l3 3a1 1 0 0 1-1.414 1.415L14 10.414zM9 18a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2H9z" fill="currentColor" fill-rule="evenodd"/></svg>',
    Type.STRING
  ],
  iconRetry: [
    '<svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"><path d="M10.81 9.185l-.038.02A4.997 4.997 0 0 0 8 13.683a5 5 0 0 0 5 5 5 5 0 0 0 5-5 1 1 0 0 1 2 0A7 7 0 1 1 9.722 7.496l-.842-.21a.999.999 0 1 1 .484-1.94l3.23.806c.535.133.86.675.73 1.21l-.804 3.233a.997.997 0 0 1-1.21.73.997.997 0 0 1-.73-1.21l.23-.928v-.002z" fill="currentColor" fill-rule="nonzero"/></svg>',
    Type.STRING
  ],
  iconUndo: [
    '<svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"><path d="M9.185 10.81l.02-.038A4.997 4.997 0 0 1 13.683 8a5 5 0 0 1 5 5 5 5 0 0 1-5 5 1 1 0 0 0 0 2A7 7 0 1 0 7.496 9.722l-.21-.842a.999.999 0 1 0-1.94.484l.806 3.23c.133.535.675.86 1.21.73l3.233-.803a.997.997 0 0 0 .73-1.21.997.997 0 0 0-1.21-.73l-.928.23-.002-.001z" fill="currentColor" fill-rule="nonzero"/></svg>',
    Type.STRING
  ],
  iconDone: [
    '<svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"><path d="M18.293 9.293a1 1 0 0 1 1.414 1.414l-7.002 7a1 1 0 0 1-1.414 0l-3.998-4a1 1 0 1 1 1.414-1.414L12 15.586l6.294-6.293z" fill="currentColor" fill-rule="nonzero"/></svg>',
    Type.STRING
  ],
  // event handlers
  oninit: [null, Type.FUNCTION],
  onwarning: [null, Type.FUNCTION],
  onerror: [null, Type.FUNCTION],
  onactivatefile: [null, Type.FUNCTION],
  oninitfile: [null, Type.FUNCTION],
  onaddfilestart: [null, Type.FUNCTION],
  onaddfileprogress: [null, Type.FUNCTION],
  onaddfile: [null, Type.FUNCTION],
  onprocessfilestart: [null, Type.FUNCTION],
  onprocessfileprogress: [null, Type.FUNCTION],
  onprocessfileabort: [null, Type.FUNCTION],
  onprocessfilerevert: [null, Type.FUNCTION],
  onprocessfile: [null, Type.FUNCTION],
  onprocessfiles: [null, Type.FUNCTION],
  onremovefile: [null, Type.FUNCTION],
  onpreparefile: [null, Type.FUNCTION],
  onupdatefiles: [null, Type.FUNCTION],
  onreorderfiles: [null, Type.FUNCTION],
  // hooks
  beforeDropFile: [null, Type.FUNCTION],
  beforeAddFile: [null, Type.FUNCTION],
  beforeRemoveFile: [null, Type.FUNCTION],
  beforePrepareFile: [null, Type.FUNCTION],
  // styles
  stylePanelLayout: [null, Type.STRING],
  // null 'integrated', 'compact', 'circle'
  stylePanelAspectRatio: [null, Type.STRING],
  // null or '3:2' or 1
  styleItemPanelAspectRatio: [null, Type.STRING],
  styleButtonRemoveItemPosition: ["left", Type.STRING],
  styleButtonProcessItemPosition: ["right", Type.STRING],
  styleLoadIndicatorPosition: ["right", Type.STRING],
  styleProgressIndicatorPosition: ["right", Type.STRING],
  styleButtonRemoveItemAlign: [false, Type.BOOLEAN],
  // custom initial files array
  files: [[], Type.ARRAY],
  // show support by displaying credits
  credits: [["https://filepond.com", "Powered by FilePond"], Type.ARRAY]
};
const getItemByQuery = (items, query) => {
  if (isEmpty(query)) {
    return items[0] || null;
  }
  if (isInt(query)) {
    return items[query] || null;
  }
  if (typeof query === "object") {
    query = query.id;
  }
  return items.find((item2) => item2.id === query) || null;
};
const getNumericAspectRatioFromString = (aspectRatio) => {
  if (isEmpty(aspectRatio)) {
    return aspectRatio;
  }
  if (/:/.test(aspectRatio)) {
    const parts = aspectRatio.split(":");
    return parts[1] / parts[0];
  }
  return parseFloat(aspectRatio);
};
const getActiveItems = (items) => items.filter((item2) => !item2.archived);
const Status = {
  EMPTY: 0,
  IDLE: 1,
  // waiting
  ERROR: 2,
  // a file is in error state
  BUSY: 3,
  // busy processing or loading
  READY: 4
  // all files uploaded
};
let res = null;
const canUpdateFileInput = () => {
  if (res === null) {
    try {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(new File(["hello world"], "This_Works.txt"));
      const el = document.createElement("input");
      el.setAttribute("type", "file");
      el.files = dataTransfer.files;
      res = el.files.length === 1;
    } catch (err) {
      res = false;
    }
  }
  return res;
};
const ITEM_ERROR = [
  ItemStatus.LOAD_ERROR,
  ItemStatus.PROCESSING_ERROR,
  ItemStatus.PROCESSING_REVERT_ERROR
];
const ITEM_BUSY = [
  ItemStatus.LOADING,
  ItemStatus.PROCESSING,
  ItemStatus.PROCESSING_QUEUED,
  ItemStatus.INIT
];
const ITEM_READY = [ItemStatus.PROCESSING_COMPLETE];
const isItemInErrorState = (item2) => ITEM_ERROR.includes(item2.status);
const isItemInBusyState = (item2) => ITEM_BUSY.includes(item2.status);
const isItemInReadyState = (item2) => ITEM_READY.includes(item2.status);
const isAsync = (state2) => isObject(state2.options.server) && (isObject(state2.options.server.process) || isFunction(state2.options.server.process));
const queries = (state2) => ({
  GET_STATUS: () => {
    const items = getActiveItems(state2.items);
    const { EMPTY, ERROR, BUSY, IDLE, READY } = Status;
    if (items.length === 0) return EMPTY;
    if (items.some(isItemInErrorState)) return ERROR;
    if (items.some(isItemInBusyState)) return BUSY;
    if (items.some(isItemInReadyState)) return READY;
    return IDLE;
  },
  GET_ITEM: (query) => getItemByQuery(state2.items, query),
  GET_ACTIVE_ITEM: (query) => getItemByQuery(getActiveItems(state2.items), query),
  GET_ACTIVE_ITEMS: () => getActiveItems(state2.items),
  GET_ITEMS: () => state2.items,
  GET_ITEM_NAME: (query) => {
    const item2 = getItemByQuery(state2.items, query);
    return item2 ? item2.filename : null;
  },
  GET_ITEM_SIZE: (query) => {
    const item2 = getItemByQuery(state2.items, query);
    return item2 ? item2.fileSize : null;
  },
  GET_STYLES: () => Object.keys(state2.options).filter((key) => /^style/.test(key)).map((option2) => ({
    name: option2,
    value: state2.options[option2]
  })),
  GET_PANEL_ASPECT_RATIO: () => {
    const isShapeCircle = /circle/.test(state2.options.stylePanelLayout);
    const aspectRatio = isShapeCircle ? 1 : getNumericAspectRatioFromString(state2.options.stylePanelAspectRatio);
    return aspectRatio;
  },
  GET_ITEM_PANEL_ASPECT_RATIO: () => state2.options.styleItemPanelAspectRatio,
  GET_ITEMS_BY_STATUS: (status) => getActiveItems(state2.items).filter((item2) => item2.status === status),
  GET_TOTAL_ITEMS: () => getActiveItems(state2.items).length,
  SHOULD_UPDATE_FILE_INPUT: () => state2.options.storeAsFile && canUpdateFileInput() && !isAsync(state2),
  IS_ASYNC: () => isAsync(state2),
  GET_FILE_SIZE_LABELS: (query) => ({
    labelBytes: query("GET_LABEL_FILE_SIZE_BYTES") || void 0,
    labelKilobytes: query("GET_LABEL_FILE_SIZE_KILOBYTES") || void 0,
    labelMegabytes: query("GET_LABEL_FILE_SIZE_MEGABYTES") || void 0,
    labelGigabytes: query("GET_LABEL_FILE_SIZE_GIGABYTES") || void 0
  })
});
const hasRoomForItem = (state2) => {
  const count = getActiveItems(state2.items).length;
  if (!state2.options.allowMultiple) {
    return count === 0;
  }
  const maxFileCount = state2.options.maxFiles;
  if (maxFileCount === null) {
    return true;
  }
  if (count < maxFileCount) {
    return true;
  }
  return false;
};
const limit = (value, min, max) => Math.max(Math.min(max, value), min);
const arrayInsert = (arr, index, item2) => arr.splice(index, 0, item2);
const insertItem = (items, item2, index) => {
  if (isEmpty(item2)) {
    return null;
  }
  if (typeof index === "undefined") {
    items.push(item2);
    return item2;
  }
  index = limit(index, 0, items.length);
  arrayInsert(items, index, item2);
  return item2;
};
const isBase64DataURI = (str) => /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s]*)\s*$/i.test(
  str
);
const getFilenameFromURL = (url) => `${url}`.split("/").pop().split("?").shift();
const getExtensionFromFilename = (name2) => name2.split(".").pop();
const guesstimateExtension = (type) => {
  if (typeof type !== "string") {
    return "";
  }
  const subtype = type.split("/").pop();
  if (/svg/.test(subtype)) {
    return "svg";
  }
  if (/zip|compressed/.test(subtype)) {
    return "zip";
  }
  if (/plain/.test(subtype)) {
    return "txt";
  }
  if (/msword/.test(subtype)) {
    return "doc";
  }
  if (/[a-z]+/.test(subtype)) {
    if (subtype === "jpeg") {
      return "jpg";
    }
    return subtype;
  }
  return "";
};
const leftPad = (value, padding = "") => (padding + value).slice(-padding.length);
const getDateString = (date = /* @__PURE__ */ new Date()) => `${date.getFullYear()}-${leftPad(date.getMonth() + 1, "00")}-${leftPad(
  date.getDate(),
  "00"
)}_${leftPad(date.getHours(), "00")}-${leftPad(date.getMinutes(), "00")}-${leftPad(
  date.getSeconds(),
  "00"
)}`;
const getFileFromBlob = (blob2, filename, type = null, extension = null) => {
  const file2 = typeof type === "string" ? blob2.slice(0, blob2.size, type) : blob2.slice(0, blob2.size, blob2.type);
  file2.lastModifiedDate = /* @__PURE__ */ new Date();
  if (blob2._relativePath) file2._relativePath = blob2._relativePath;
  if (!isString(filename)) {
    filename = getDateString();
  }
  if (filename && extension === null && getExtensionFromFilename(filename)) {
    file2.name = filename;
  } else {
    extension = extension || guesstimateExtension(file2.type);
    file2.name = filename + (extension ? "." + extension : "");
  }
  return file2;
};
const getBlobBuilder = () => {
  return window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
};
const createBlob = (arrayBuffer, mimeType) => {
  const BB = getBlobBuilder();
  if (BB) {
    const bb = new BB();
    bb.append(arrayBuffer);
    return bb.getBlob(mimeType);
  }
  return new Blob([arrayBuffer], {
    type: mimeType
  });
};
const getBlobFromByteStringWithMimeType = (byteString, mimeType) => {
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return createBlob(ab, mimeType);
};
const getMimeTypeFromBase64DataURI = (dataURI) => {
  return (/^data:(.+);/.exec(dataURI) || [])[1] || null;
};
const getBase64DataFromBase64DataURI = (dataURI) => {
  const data2 = dataURI.split(",")[1];
  return data2.replace(/\s/g, "");
};
const getByteStringFromBase64DataURI = (dataURI) => {
  return atob(getBase64DataFromBase64DataURI(dataURI));
};
const getBlobFromBase64DataURI = (dataURI) => {
  const mimeType = getMimeTypeFromBase64DataURI(dataURI);
  const byteString = getByteStringFromBase64DataURI(dataURI);
  return getBlobFromByteStringWithMimeType(byteString, mimeType);
};
const getFileFromBase64DataURI = (dataURI, filename, extension) => {
  return getFileFromBlob(getBlobFromBase64DataURI(dataURI), filename, null, extension);
};
const getFileNameFromHeader = (header) => {
  if (!/^content-disposition:/i.test(header)) return null;
  const matches = header.split(/filename=|filename\*=.+''/).splice(1).map((name2) => name2.trim().replace(/^["']|[;"']{0,2}$/g, "")).filter((name2) => name2.length);
  return matches.length ? decodeURI(matches[matches.length - 1]) : null;
};
const getFileSizeFromHeader = (header) => {
  if (/content-length:/i.test(header)) {
    const size = header.match(/[0-9]+/)[0];
    return size ? parseInt(size, 10) : null;
  }
  return null;
};
const getTranfserIdFromHeader = (header) => {
  if (/x-content-transfer-id:/i.test(header)) {
    const id = (header.split(":")[1] || "").trim();
    return id || null;
  }
  return null;
};
const getFileInfoFromHeaders = (headers) => {
  const info = {
    source: null,
    name: null,
    size: null
  };
  const rows = headers.split("\n");
  for (let header of rows) {
    const name2 = getFileNameFromHeader(header);
    if (name2) {
      info.name = name2;
      continue;
    }
    const size = getFileSizeFromHeader(header);
    if (size) {
      info.size = size;
      continue;
    }
    const source = getTranfserIdFromHeader(header);
    if (source) {
      info.source = source;
      continue;
    }
  }
  return info;
};
const createFileLoader = (fetchFn) => {
  const state2 = {
    source: null,
    complete: false,
    progress: 0,
    size: null,
    timestamp: null,
    duration: 0,
    request: null
  };
  const getProgress = () => state2.progress;
  const abort = () => {
    if (state2.request && state2.request.abort) {
      state2.request.abort();
    }
  };
  const load = () => {
    const source = state2.source;
    api.fire("init", source);
    if (source instanceof File) {
      api.fire("load", source);
    } else if (source instanceof Blob) {
      api.fire("load", getFileFromBlob(source, source.name));
    } else if (isBase64DataURI(source)) {
      api.fire("load", getFileFromBase64DataURI(source));
    } else {
      loadURL(source);
    }
  };
  const loadURL = (url) => {
    if (!fetchFn) {
      api.fire("error", {
        type: "error",
        body: "Can't load URL",
        code: 400
      });
      return;
    }
    state2.timestamp = Date.now();
    state2.request = fetchFn(
      url,
      (response) => {
        state2.duration = Date.now() - state2.timestamp;
        state2.complete = true;
        if (response instanceof Blob) {
          response = getFileFromBlob(response, response.name || getFilenameFromURL(url));
        }
        api.fire(
          "load",
          // if has received blob, we go with blob, if no response, we return null
          response instanceof Blob ? response : response ? response.body : null
        );
      },
      (error2) => {
        api.fire(
          "error",
          typeof error2 === "string" ? {
            type: "error",
            code: 0,
            body: error2
          } : error2
        );
      },
      (computable, current, total) => {
        if (total) {
          state2.size = total;
        }
        state2.duration = Date.now() - state2.timestamp;
        if (!computable) {
          state2.progress = null;
          return;
        }
        state2.progress = current / total;
        api.fire("progress", state2.progress);
      },
      () => {
        api.fire("abort");
      },
      (response) => {
        const fileinfo = getFileInfoFromHeaders(
          typeof response === "string" ? response : response.headers
        );
        api.fire("meta", {
          size: state2.size || fileinfo.size,
          filename: fileinfo.name,
          source: fileinfo.source
        });
      }
    );
  };
  const api = {
    ...on(),
    setSource: (source) => state2.source = source,
    getProgress,
    // file load progress
    abort,
    // abort file load
    load
    // start load
  };
  return api;
};
const isGet = (method) => /GET|HEAD/.test(method);
const sendRequest = (data2, url, options) => {
  const api = {
    onheaders: () => {
    },
    onprogress: () => {
    },
    onload: () => {
    },
    ontimeout: () => {
    },
    onerror: () => {
    },
    onabort: () => {
    },
    abort: () => {
      aborted = true;
      xhr.abort();
    }
  };
  let aborted = false;
  let headersReceived = false;
  options = {
    method: "POST",
    headers: {},
    withCredentials: false,
    ...options
  };
  url = encodeURI(url);
  if (isGet(options.method) && data2) {
    url = `${url}${encodeURIComponent(typeof data2 === "string" ? data2 : JSON.stringify(data2))}`;
  }
  const xhr = new XMLHttpRequest();
  const process = isGet(options.method) ? xhr : xhr.upload;
  process.onprogress = (e) => {
    if (aborted) {
      return;
    }
    api.onprogress(e.lengthComputable, e.loaded, e.total);
  };
  xhr.onreadystatechange = () => {
    if (xhr.readyState < 2) {
      return;
    }
    if (xhr.readyState === 4 && xhr.status === 0) {
      return;
    }
    if (headersReceived) {
      return;
    }
    headersReceived = true;
    api.onheaders(xhr);
  };
  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      api.onload(xhr);
    } else {
      api.onerror(xhr);
    }
  };
  xhr.onerror = () => api.onerror(xhr);
  xhr.onabort = () => {
    aborted = true;
    api.onabort();
  };
  xhr.ontimeout = () => api.ontimeout(xhr);
  xhr.open(options.method, url, true);
  if (isInt(options.timeout)) {
    xhr.timeout = options.timeout;
  }
  Object.keys(options.headers).forEach((key) => {
    const value = unescape(encodeURIComponent(options.headers[key]));
    xhr.setRequestHeader(key, value);
  });
  if (options.responseType) {
    xhr.responseType = options.responseType;
  }
  if (options.withCredentials) {
    xhr.withCredentials = true;
  }
  xhr.send(data2);
  return api;
};
const createResponse = (type, code, body, headers) => ({
  type,
  code,
  body,
  headers
});
const createTimeoutResponse = (cb) => (xhr) => {
  cb(createResponse("error", 0, "Timeout", xhr.getAllResponseHeaders()));
};
const hasQS = (str) => /\?/.test(str);
const buildURL = (...parts) => {
  let url = "";
  parts.forEach((part) => {
    url += hasQS(url) && hasQS(part) ? part.replace(/\?/, "&") : part;
  });
  return url;
};
const createFetchFunction = (apiUrl = "", action) => {
  if (typeof action === "function") {
    return action;
  }
  if (!action || !isString(action.url)) {
    return null;
  }
  const onload = action.onload || ((res2) => res2);
  const onerror = action.onerror || ((res2) => null);
  return (url, load, error2, progress, abort, headers) => {
    const request = sendRequest(url, buildURL(apiUrl, action.url), {
      ...action,
      responseType: "blob"
    });
    request.onload = (xhr) => {
      const headers2 = xhr.getAllResponseHeaders();
      const filename = getFileInfoFromHeaders(headers2).name || getFilenameFromURL(url);
      load(
        createResponse(
          "load",
          xhr.status,
          action.method === "HEAD" ? null : getFileFromBlob(onload(xhr.response), filename),
          headers2
        )
      );
    };
    request.onerror = (xhr) => {
      error2(
        createResponse(
          "error",
          xhr.status,
          onerror(xhr.response) || xhr.statusText,
          xhr.getAllResponseHeaders()
        )
      );
    };
    request.onheaders = (xhr) => {
      headers(createResponse("headers", xhr.status, null, xhr.getAllResponseHeaders()));
    };
    request.ontimeout = createTimeoutResponse(error2);
    request.onprogress = progress;
    request.onabort = abort;
    return request;
  };
};
const ChunkStatus = {
  QUEUED: 0,
  COMPLETE: 1,
  PROCESSING: 2,
  ERROR: 3,
  WAITING: 4
};
const processFileChunked = (apiUrl, action, name2, file2, metadata, load, error2, progress, abort, transfer, options) => {
  const chunks = [];
  const { chunkTransferId, chunkServer, chunkSize, chunkRetryDelays } = options;
  const state2 = {
    serverId: chunkTransferId,
    aborted: false
  };
  const ondata = action.ondata || ((fd) => fd);
  const onload = action.onload || ((xhr, method) => method === "HEAD" ? xhr.getResponseHeader("Upload-Offset") : xhr.response);
  const onerror = action.onerror || ((res2) => null);
  const requestTransferId = (cb) => {
    const formData = new FormData();
    if (isObject(metadata)) formData.append(name2, JSON.stringify(metadata));
    const headers = typeof action.headers === "function" ? action.headers(file2, metadata) : {
      ...action.headers,
      "Upload-Length": file2.size
    };
    const requestParams = {
      ...action,
      headers
    };
    const request = sendRequest(ondata(formData), buildURL(apiUrl, action.url), requestParams);
    request.onload = (xhr) => cb(onload(xhr, requestParams.method));
    request.onerror = (xhr) => error2(
      createResponse(
        "error",
        xhr.status,
        onerror(xhr.response) || xhr.statusText,
        xhr.getAllResponseHeaders()
      )
    );
    request.ontimeout = createTimeoutResponse(error2);
  };
  const requestTransferOffset = (cb) => {
    const requestUrl = buildURL(apiUrl, chunkServer.url, state2.serverId);
    const headers = typeof action.headers === "function" ? action.headers(state2.serverId) : {
      ...action.headers
    };
    const requestParams = {
      headers,
      method: "HEAD"
    };
    const request = sendRequest(null, requestUrl, requestParams);
    request.onload = (xhr) => cb(onload(xhr, requestParams.method));
    request.onerror = (xhr) => error2(
      createResponse(
        "error",
        xhr.status,
        onerror(xhr.response) || xhr.statusText,
        xhr.getAllResponseHeaders()
      )
    );
    request.ontimeout = createTimeoutResponse(error2);
  };
  const lastChunkIndex = Math.floor(file2.size / chunkSize);
  for (let i = 0; i <= lastChunkIndex; i++) {
    const offset = i * chunkSize;
    const data2 = file2.slice(offset, offset + chunkSize, "application/offset+octet-stream");
    chunks[i] = {
      index: i,
      size: data2.size,
      offset,
      data: data2,
      file: file2,
      progress: 0,
      retries: [...chunkRetryDelays],
      status: ChunkStatus.QUEUED,
      error: null,
      request: null,
      timeout: null
    };
  }
  const completeProcessingChunks = () => load(state2.serverId);
  const canProcessChunk = (chunk) => chunk.status === ChunkStatus.QUEUED || chunk.status === ChunkStatus.ERROR;
  const processChunk = (chunk) => {
    if (state2.aborted) return;
    chunk = chunk || chunks.find(canProcessChunk);
    if (!chunk) {
      if (chunks.every((chunk2) => chunk2.status === ChunkStatus.COMPLETE)) {
        completeProcessingChunks();
      }
      return;
    }
    chunk.status = ChunkStatus.PROCESSING;
    chunk.progress = null;
    const ondata2 = chunkServer.ondata || ((fd) => fd);
    const onerror2 = chunkServer.onerror || ((res2) => null);
    const onload2 = chunkServer.onload || (() => {
    });
    const requestUrl = buildURL(apiUrl, chunkServer.url, state2.serverId);
    const headers = typeof chunkServer.headers === "function" ? chunkServer.headers(chunk) : {
      ...chunkServer.headers,
      "Content-Type": "application/offset+octet-stream",
      "Upload-Offset": chunk.offset,
      "Upload-Length": file2.size,
      "Upload-Name": file2.name
    };
    const request = chunk.request = sendRequest(ondata2(chunk.data), requestUrl, {
      ...chunkServer,
      headers
    });
    request.onload = (xhr) => {
      onload2(xhr, chunk.index, chunks.length);
      chunk.status = ChunkStatus.COMPLETE;
      chunk.request = null;
      processChunks();
    };
    request.onprogress = (lengthComputable, loaded, total) => {
      chunk.progress = lengthComputable ? loaded : null;
      updateTotalProgress();
    };
    request.onerror = (xhr) => {
      chunk.status = ChunkStatus.ERROR;
      chunk.request = null;
      chunk.error = onerror2(xhr.response) || xhr.statusText;
      if (!retryProcessChunk(chunk)) {
        error2(
          createResponse(
            "error",
            xhr.status,
            onerror2(xhr.response) || xhr.statusText,
            xhr.getAllResponseHeaders()
          )
        );
      }
    };
    request.ontimeout = (xhr) => {
      chunk.status = ChunkStatus.ERROR;
      chunk.request = null;
      if (!retryProcessChunk(chunk)) {
        createTimeoutResponse(error2)(xhr);
      }
    };
    request.onabort = () => {
      chunk.status = ChunkStatus.QUEUED;
      chunk.request = null;
      abort();
    };
  };
  const retryProcessChunk = (chunk) => {
    if (chunk.retries.length === 0) return false;
    chunk.status = ChunkStatus.WAITING;
    clearTimeout(chunk.timeout);
    chunk.timeout = setTimeout(() => {
      processChunk(chunk);
    }, chunk.retries.shift());
    return true;
  };
  const updateTotalProgress = () => {
    const totalBytesTransfered = chunks.reduce((p, chunk) => {
      if (p === null || chunk.progress === null) return null;
      return p + chunk.progress;
    }, 0);
    if (totalBytesTransfered === null) return progress(false, 0, 0);
    const totalSize = chunks.reduce((total, chunk) => total + chunk.size, 0);
    progress(true, totalBytesTransfered, totalSize);
  };
  const processChunks = () => {
    const totalProcessing = chunks.filter((chunk) => chunk.status === ChunkStatus.PROCESSING).length;
    if (totalProcessing >= 1) return;
    processChunk();
  };
  const abortChunks = () => {
    chunks.forEach((chunk) => {
      clearTimeout(chunk.timeout);
      if (chunk.request) {
        chunk.request.abort();
      }
    });
  };
  if (!state2.serverId) {
    requestTransferId((serverId) => {
      if (state2.aborted) return;
      transfer(serverId);
      state2.serverId = serverId;
      processChunks();
    });
  } else {
    requestTransferOffset((offset) => {
      if (state2.aborted) return;
      chunks.filter((chunk) => chunk.offset < offset).forEach((chunk) => {
        chunk.status = ChunkStatus.COMPLETE;
        chunk.progress = chunk.size;
      });
      processChunks();
    });
  }
  return {
    abort: () => {
      state2.aborted = true;
      abortChunks();
    }
  };
};
const createFileProcessorFunction = (apiUrl, action, name2, options) => (file2, metadata, load, error2, progress, abort, transfer) => {
  if (!file2) return;
  const canChunkUpload = options.chunkUploads;
  const shouldChunkUpload = canChunkUpload && file2.size > options.chunkSize;
  const willChunkUpload = canChunkUpload && (shouldChunkUpload || options.chunkForce);
  if (file2 instanceof Blob && willChunkUpload)
    return processFileChunked(
      apiUrl,
      action,
      name2,
      file2,
      metadata,
      load,
      error2,
      progress,
      abort,
      transfer,
      options
    );
  const ondata = action.ondata || ((fd) => fd);
  const onload = action.onload || ((res2) => res2);
  const onerror = action.onerror || ((res2) => null);
  const headers = typeof action.headers === "function" ? action.headers(file2, metadata) || {} : {
    ...action.headers
  };
  const requestParams = {
    ...action,
    headers
  };
  var formData = new FormData();
  if (isObject(metadata)) {
    formData.append(name2, JSON.stringify(metadata));
  }
  (file2 instanceof Blob ? [{ name: null, file: file2 }] : file2).forEach((item2) => {
    formData.append(
      name2,
      item2.file,
      item2.name === null ? item2.file.name : `${item2.name}${item2.file.name}`
    );
  });
  const request = sendRequest(ondata(formData), buildURL(apiUrl, action.url), requestParams);
  request.onload = (xhr) => {
    load(createResponse("load", xhr.status, onload(xhr.response), xhr.getAllResponseHeaders()));
  };
  request.onerror = (xhr) => {
    error2(
      createResponse(
        "error",
        xhr.status,
        onerror(xhr.response) || xhr.statusText,
        xhr.getAllResponseHeaders()
      )
    );
  };
  request.ontimeout = createTimeoutResponse(error2);
  request.onprogress = progress;
  request.onabort = abort;
  return request;
};
const createProcessorFunction = (apiUrl = "", action, name2, options) => {
  if (typeof action === "function") return (...params) => action(name2, ...params, options);
  if (!action || !isString(action.url)) return null;
  return createFileProcessorFunction(apiUrl, action, name2, options);
};
const createRevertFunction = (apiUrl = "", action) => {
  if (typeof action === "function") {
    return action;
  }
  if (!action || !isString(action.url)) {
    return (uniqueFileId, load) => load();
  }
  const onload = action.onload || ((res2) => res2);
  const onerror = action.onerror || ((res2) => null);
  return (uniqueFileId, load, error2) => {
    const request = sendRequest(
      uniqueFileId,
      apiUrl + action.url,
      action
      // contains method, headers and withCredentials properties
    );
    request.onload = (xhr) => {
      load(
        createResponse(
          "load",
          xhr.status,
          onload(xhr.response),
          xhr.getAllResponseHeaders()
        )
      );
    };
    request.onerror = (xhr) => {
      error2(
        createResponse(
          "error",
          xhr.status,
          onerror(xhr.response) || xhr.statusText,
          xhr.getAllResponseHeaders()
        )
      );
    };
    request.ontimeout = createTimeoutResponse(error2);
    return request;
  };
};
const getRandomNumber = (min = 0, max = 1) => min + Math.random() * (max - min);
const createPerceivedPerformanceUpdater = (cb, duration = 1e3, offset = 0, tickMin = 25, tickMax = 250) => {
  let timeout = null;
  const start = Date.now();
  const tick = () => {
    let runtime = Date.now() - start;
    let delay = getRandomNumber(tickMin, tickMax);
    if (runtime + delay > duration) {
      delay = runtime + delay - duration;
    }
    let progress = runtime / duration;
    if (progress >= 1 || document.hidden) {
      cb(1);
      return;
    }
    cb(progress);
    timeout = setTimeout(tick, delay);
  };
  if (duration > 0) tick();
  return {
    clear: () => {
      clearTimeout(timeout);
    }
  };
};
const createFileProcessor = (processFn, options) => {
  const state2 = {
    complete: false,
    perceivedProgress: 0,
    perceivedPerformanceUpdater: null,
    progress: null,
    timestamp: null,
    perceivedDuration: 0,
    duration: 0,
    request: null,
    response: null
  };
  const { allowMinimumUploadDuration } = options;
  const process = (file2, metadata) => {
    const progressFn = () => {
      if (state2.duration === 0 || state2.progress === null) return;
      api.fire("progress", api.getProgress());
    };
    const completeFn = () => {
      state2.complete = true;
      api.fire("load-perceived", state2.response.body);
    };
    api.fire("start");
    state2.timestamp = Date.now();
    state2.perceivedPerformanceUpdater = createPerceivedPerformanceUpdater(
      (progress) => {
        state2.perceivedProgress = progress;
        state2.perceivedDuration = Date.now() - state2.timestamp;
        progressFn();
        if (state2.response && state2.perceivedProgress === 1 && !state2.complete) {
          completeFn();
        }
      },
      // random delay as in a list of files you start noticing
      // files uploading at the exact same speed
      allowMinimumUploadDuration ? getRandomNumber(750, 1500) : 0
    );
    state2.request = processFn(
      // the file to process
      file2,
      // the metadata to send along
      metadata,
      // callbacks (load, error, progress, abort, transfer)
      // load expects the body to be a server id if
      // you want to make use of revert
      (response) => {
        state2.response = isObject(response) ? response : {
          type: "load",
          code: 200,
          body: `${response}`,
          headers: {}
        };
        state2.duration = Date.now() - state2.timestamp;
        state2.progress = 1;
        api.fire("load", state2.response.body);
        if (!allowMinimumUploadDuration || allowMinimumUploadDuration && state2.perceivedProgress === 1) {
          completeFn();
        }
      },
      // error is expected to be an object with type, code, body
      (error2) => {
        state2.perceivedPerformanceUpdater.clear();
        api.fire(
          "error",
          isObject(error2) ? error2 : {
            type: "error",
            code: 0,
            body: `${error2}`
          }
        );
      },
      // actual processing progress
      (computable, current, total) => {
        state2.duration = Date.now() - state2.timestamp;
        state2.progress = computable ? current / total : null;
        progressFn();
      },
      // abort does not expect a value
      () => {
        state2.perceivedPerformanceUpdater.clear();
        api.fire("abort", state2.response ? state2.response.body : null);
      },
      // register the id for this transfer
      (transferId) => {
        api.fire("transfer", transferId);
      }
    );
  };
  const abort = () => {
    if (!state2.request) return;
    state2.perceivedPerformanceUpdater.clear();
    if (state2.request.abort) state2.request.abort();
    state2.complete = true;
  };
  const reset = () => {
    abort();
    state2.complete = false;
    state2.perceivedProgress = 0;
    state2.progress = 0;
    state2.timestamp = null;
    state2.perceivedDuration = 0;
    state2.duration = 0;
    state2.request = null;
    state2.response = null;
  };
  const getProgress = allowMinimumUploadDuration ? () => state2.progress ? Math.min(state2.progress, state2.perceivedProgress) : null : () => state2.progress || null;
  const getDuration = allowMinimumUploadDuration ? () => Math.min(state2.duration, state2.perceivedDuration) : () => state2.duration;
  const api = {
    ...on(),
    process,
    // start processing file
    abort,
    // abort active process request
    getProgress,
    getDuration,
    reset
  };
  return api;
};
const getFilenameWithoutExtension = (name2) => name2.substring(0, name2.lastIndexOf(".")) || name2;
const createFileStub = (source) => {
  let data2 = [source.name, source.size, source.type];
  if (source instanceof Blob || isBase64DataURI(source)) {
    data2[0] = source.name || getDateString();
  } else if (isBase64DataURI(source)) {
    data2[1] = source.length;
    data2[2] = getMimeTypeFromBase64DataURI(source);
  } else if (isString(source)) {
    data2[0] = getFilenameFromURL(source);
    data2[1] = 0;
    data2[2] = "application/octet-stream";
  }
  return {
    name: data2[0],
    size: data2[1],
    type: data2[2]
  };
};
const isFile = (value) => !!(value instanceof File || value instanceof Blob && value.name);
const deepCloneObject = (src) => {
  if (!isObject(src)) return src;
  const target = isArray(src) ? [] : {};
  for (const key in src) {
    if (!src.hasOwnProperty(key)) continue;
    const v = src[key];
    target[key] = v && isObject(v) ? deepCloneObject(v) : v;
  }
  return target;
};
const createItem = (origin = null, serverFileReference = null, file2 = null) => {
  const id = getUniqueId();
  const state2 = {
    // is archived
    archived: false,
    // if is frozen, no longer fires events
    frozen: false,
    // removed from view
    released: false,
    // original source
    source: null,
    // file model reference
    file: file2,
    // id of file on server
    serverFileReference,
    // id of file transfer on server
    transferId: null,
    // is aborted
    processingAborted: false,
    // current item status
    status: serverFileReference ? ItemStatus.PROCESSING_COMPLETE : ItemStatus.INIT,
    // active processes
    activeLoader: null,
    activeProcessor: null
  };
  let abortProcessingRequestComplete = null;
  const metadata = {};
  const setStatus = (status) => state2.status = status;
  const fire = (event, ...params) => {
    if (state2.released || state2.frozen) return;
    api.fire(event, ...params);
  };
  const getFileExtension = () => getExtensionFromFilename(state2.file.name);
  const getFileType = () => state2.file.type;
  const getFileSize = () => state2.file.size;
  const getFile = () => state2.file;
  const load = (source, loader, onload) => {
    state2.source = source;
    api.fireSync("init");
    if (state2.file) {
      api.fireSync("load-skip");
      return;
    }
    state2.file = createFileStub(source);
    loader.on("init", () => {
      fire("load-init");
    });
    loader.on("meta", (meta) => {
      state2.file.size = meta.size;
      state2.file.filename = meta.filename;
      if (meta.source) {
        origin = FileOrigin.LIMBO;
        state2.serverFileReference = meta.source;
        state2.status = ItemStatus.PROCESSING_COMPLETE;
      }
      fire("load-meta");
    });
    loader.on("progress", (progress) => {
      setStatus(ItemStatus.LOADING);
      fire("load-progress", progress);
    });
    loader.on("error", (error2) => {
      setStatus(ItemStatus.LOAD_ERROR);
      fire("load-request-error", error2);
    });
    loader.on("abort", () => {
      setStatus(ItemStatus.INIT);
      fire("load-abort");
    });
    loader.on("load", (file3) => {
      state2.activeLoader = null;
      const success = (result) => {
        state2.file = isFile(result) ? result : state2.file;
        if (origin === FileOrigin.LIMBO && state2.serverFileReference) {
          setStatus(ItemStatus.PROCESSING_COMPLETE);
        } else {
          setStatus(ItemStatus.IDLE);
        }
        fire("load");
      };
      const error2 = (result) => {
        state2.file = file3;
        fire("load-meta");
        setStatus(ItemStatus.LOAD_ERROR);
        fire("load-file-error", result);
      };
      if (state2.serverFileReference) {
        success(file3);
        return;
      }
      onload(file3, success, error2);
    });
    loader.setSource(source);
    state2.activeLoader = loader;
    loader.load();
  };
  const retryLoad = () => {
    if (!state2.activeLoader) {
      return;
    }
    state2.activeLoader.load();
  };
  const abortLoad = () => {
    if (state2.activeLoader) {
      state2.activeLoader.abort();
      return;
    }
    setStatus(ItemStatus.INIT);
    fire("load-abort");
  };
  const process = (processor, onprocess) => {
    if (state2.processingAborted) {
      state2.processingAborted = false;
      return;
    }
    setStatus(ItemStatus.PROCESSING);
    abortProcessingRequestComplete = null;
    if (!(state2.file instanceof Blob)) {
      api.on("load", () => {
        process(processor, onprocess);
      });
      return;
    }
    processor.on("load", (serverFileReference2) => {
      state2.transferId = null;
      state2.serverFileReference = serverFileReference2;
    });
    processor.on("transfer", (transferId) => {
      state2.transferId = transferId;
    });
    processor.on("load-perceived", (serverFileReference2) => {
      state2.activeProcessor = null;
      state2.transferId = null;
      state2.serverFileReference = serverFileReference2;
      setStatus(ItemStatus.PROCESSING_COMPLETE);
      fire("process-complete", serverFileReference2);
    });
    processor.on("start", () => {
      fire("process-start");
    });
    processor.on("error", (error3) => {
      state2.activeProcessor = null;
      setStatus(ItemStatus.PROCESSING_ERROR);
      fire("process-error", error3);
    });
    processor.on("abort", (serverFileReference2) => {
      state2.activeProcessor = null;
      state2.serverFileReference = serverFileReference2;
      setStatus(ItemStatus.IDLE);
      fire("process-abort");
      if (abortProcessingRequestComplete) {
        abortProcessingRequestComplete();
      }
    });
    processor.on("progress", (progress) => {
      fire("process-progress", progress);
    });
    const success = (file3) => {
      if (state2.archived) return;
      processor.process(file3, { ...metadata });
    };
    const error2 = console.error;
    onprocess(state2.file, success, error2);
    state2.activeProcessor = processor;
  };
  const requestProcessing = () => {
    state2.processingAborted = false;
    setStatus(ItemStatus.PROCESSING_QUEUED);
  };
  const abortProcessing = () => new Promise((resolve) => {
    if (!state2.activeProcessor) {
      state2.processingAborted = true;
      setStatus(ItemStatus.IDLE);
      fire("process-abort");
      resolve();
      return;
    }
    abortProcessingRequestComplete = () => {
      resolve();
    };
    state2.activeProcessor.abort();
  });
  const revert = (revertFileUpload, forceRevert) => new Promise((resolve, reject) => {
    const serverTransferId = state2.serverFileReference !== null ? state2.serverFileReference : state2.transferId;
    if (serverTransferId === null) {
      resolve();
      return;
    }
    revertFileUpload(
      serverTransferId,
      () => {
        state2.serverFileReference = null;
        state2.transferId = null;
        resolve();
      },
      (error2) => {
        if (!forceRevert) {
          resolve();
          return;
        }
        setStatus(ItemStatus.PROCESSING_REVERT_ERROR);
        fire("process-revert-error");
        reject(error2);
      }
    );
    setStatus(ItemStatus.IDLE);
    fire("process-revert");
  });
  const setMetadata = (key, value, silent) => {
    const keys = key.split(".");
    const root2 = keys[0];
    const last = keys.pop();
    let data2 = metadata;
    keys.forEach((key2) => data2 = data2[key2]);
    if (JSON.stringify(data2[last]) === JSON.stringify(value)) return;
    data2[last] = value;
    fire("metadata-update", {
      key: root2,
      value: metadata[root2],
      silent
    });
  };
  const getMetadata = (key) => deepCloneObject(key ? metadata[key] : metadata);
  const api = {
    id: { get: () => id },
    origin: { get: () => origin, set: (value) => origin = value },
    serverId: { get: () => state2.serverFileReference },
    transferId: { get: () => state2.transferId },
    status: { get: () => state2.status },
    filename: { get: () => state2.file.name },
    filenameWithoutExtension: { get: () => getFilenameWithoutExtension(state2.file.name) },
    fileExtension: { get: getFileExtension },
    fileType: { get: getFileType },
    fileSize: { get: getFileSize },
    file: { get: getFile },
    relativePath: { get: () => state2.file._relativePath },
    source: { get: () => state2.source },
    getMetadata,
    setMetadata: (key, value, silent) => {
      if (isObject(key)) {
        const data2 = key;
        Object.keys(data2).forEach((key2) => {
          setMetadata(key2, data2[key2], value);
        });
        return key;
      }
      setMetadata(key, value, silent);
      return value;
    },
    extend: (name2, handler) => itemAPI[name2] = handler,
    abortLoad,
    retryLoad,
    requestProcessing,
    abortProcessing,
    load,
    process,
    revert,
    ...on(),
    freeze: () => state2.frozen = true,
    release: () => state2.released = true,
    released: { get: () => state2.released },
    archive: () => state2.archived = true,
    archived: { get: () => state2.archived },
    // replace source and file object
    setFile: (file3) => state2.file = file3
  };
  const itemAPI = createObject(api);
  return itemAPI;
};
const getItemIndexByQuery = (items, query) => {
  if (isEmpty(query)) {
    return 0;
  }
  if (!isString(query)) {
    return -1;
  }
  return items.findIndex((item2) => item2.id === query);
};
const getItemById = (items, itemId) => {
  const index = getItemIndexByQuery(items, itemId);
  if (index < 0) {
    return;
  }
  return items[index] || null;
};
const fetchBlob = (url, load, error2, progress, abort, headers) => {
  const request = sendRequest(null, url, {
    method: "GET",
    responseType: "blob"
  });
  request.onload = (xhr) => {
    const headers2 = xhr.getAllResponseHeaders();
    const filename = getFileInfoFromHeaders(headers2).name || getFilenameFromURL(url);
    load(createResponse("load", xhr.status, getFileFromBlob(xhr.response, filename), headers2));
  };
  request.onerror = (xhr) => {
    error2(createResponse("error", xhr.status, xhr.statusText, xhr.getAllResponseHeaders()));
  };
  request.onheaders = (xhr) => {
    headers(createResponse("headers", xhr.status, null, xhr.getAllResponseHeaders()));
  };
  request.ontimeout = createTimeoutResponse(error2);
  request.onprogress = progress;
  request.onabort = abort;
  return request;
};
const getDomainFromURL = (url) => {
  if (url.indexOf("//") === 0) {
    url = location.protocol + url;
  }
  return url.toLowerCase().replace("blob:", "").replace(/([a-z])?:\/\//, "$1").split("/")[0];
};
const isExternalURL = (url) => (url.indexOf(":") > -1 || url.indexOf("//") > -1) && getDomainFromURL(location.href) !== getDomainFromURL(url);
const dynamicLabel = (label) => (...params) => isFunction(label) ? label(...params) : label;
const isMockItem = (item2) => !isFile(item2.file);
const listUpdated = (dispatch, state2) => {
  clearTimeout(state2.listUpdateTimeout);
  state2.listUpdateTimeout = setTimeout(() => {
    dispatch("DID_UPDATE_ITEMS", { items: getActiveItems(state2.items) });
  }, 0);
};
const optionalPromise = (fn2, ...params) => new Promise((resolve) => {
  if (!fn2) {
    return resolve(true);
  }
  const result = fn2(...params);
  if (result == null) {
    return resolve(true);
  }
  if (typeof result === "boolean") {
    return resolve(result);
  }
  if (typeof result.then === "function") {
    result.then(resolve);
  }
});
const sortItems = (state2, compare) => {
  state2.items.sort((a, b) => compare(createItemAPI(a), createItemAPI(b)));
};
const getItemByQueryFromState = (state2, itemHandler) => ({
  query,
  success = () => {
  },
  failure = () => {
  },
  ...options
} = {}) => {
  const item2 = getItemByQuery(state2.items, query);
  if (!item2) {
    failure({
      error: createResponse("error", 0, "Item not found"),
      file: null
    });
    return;
  }
  itemHandler(item2, success, failure, options || {});
};
const actions = (dispatch, query, state2) => ({
  /**
   * Aborts all ongoing processes
   */
  ABORT_ALL: () => {
    getActiveItems(state2.items).forEach((item2) => {
      item2.freeze();
      item2.abortLoad();
      item2.abortProcessing();
    });
  },
  /**
   * Sets initial files
   */
  DID_SET_FILES: ({ value = [] }) => {
    const files = value.map((file2) => ({
      source: file2.source ? file2.source : file2,
      options: file2.options
    }));
    let activeItems = getActiveItems(state2.items);
    activeItems.forEach((item2) => {
      if (!files.find((file2) => file2.source === item2.source || file2.source === item2.file)) {
        dispatch("REMOVE_ITEM", { query: item2, remove: false });
      }
    });
    activeItems = getActiveItems(state2.items);
    files.forEach((file2, index) => {
      if (activeItems.find((item2) => item2.source === file2.source || item2.file === file2.source))
        return;
      dispatch("ADD_ITEM", {
        ...file2,
        interactionMethod: InteractionMethod.NONE,
        index
      });
    });
  },
  DID_UPDATE_ITEM_METADATA: ({ id, action, change }) => {
    if (change.silent) return;
    clearTimeout(state2.itemUpdateTimeout);
    state2.itemUpdateTimeout = setTimeout(() => {
      const item2 = getItemById(state2.items, id);
      if (!query("IS_ASYNC")) {
        applyFilterChain("SHOULD_PREPARE_OUTPUT", false, {
          item: item2,
          query,
          action,
          change
        }).then((shouldPrepareOutput) => {
          const beforePrepareFile = query("GET_BEFORE_PREPARE_FILE");
          if (beforePrepareFile)
            shouldPrepareOutput = beforePrepareFile(item2, shouldPrepareOutput);
          if (!shouldPrepareOutput) return;
          dispatch(
            "REQUEST_PREPARE_OUTPUT",
            {
              query: id,
              item: item2,
              success: (file2) => {
                dispatch("DID_PREPARE_OUTPUT", { id, file: file2 });
              }
            },
            true
          );
        });
        return;
      }
      if (item2.origin === FileOrigin.LOCAL) {
        dispatch("DID_LOAD_ITEM", {
          id: item2.id,
          error: null,
          serverFileReference: item2.source
        });
      }
      const upload = () => {
        setTimeout(() => {
          dispatch("REQUEST_ITEM_PROCESSING", { query: id });
        }, 32);
      };
      const revert = (doUpload) => {
        item2.revert(
          createRevertFunction(state2.options.server.url, state2.options.server.revert),
          query("GET_FORCE_REVERT")
        ).then(doUpload ? upload : () => {
        }).catch(() => {
        });
      };
      const abort = (doUpload) => {
        item2.abortProcessing().then(doUpload ? upload : () => {
        });
      };
      if (item2.status === ItemStatus.PROCESSING_COMPLETE) {
        return revert(state2.options.instantUpload);
      }
      if (item2.status === ItemStatus.PROCESSING) {
        return abort(state2.options.instantUpload);
      }
      if (state2.options.instantUpload) {
        upload();
      }
    }, 0);
  },
  MOVE_ITEM: ({ query: query2, index }) => {
    const item2 = getItemByQuery(state2.items, query2);
    if (!item2) return;
    const currentIndex = state2.items.indexOf(item2);
    index = limit(index, 0, state2.items.length - 1);
    if (currentIndex === index) return;
    state2.items.splice(index, 0, state2.items.splice(currentIndex, 1)[0]);
  },
  SORT: ({ compare }) => {
    sortItems(state2, compare);
    dispatch("DID_SORT_ITEMS", {
      items: query("GET_ACTIVE_ITEMS")
    });
  },
  ADD_ITEMS: ({ items, index, interactionMethod, success = () => {
  }, failure = () => {
  } }) => {
    let currentIndex = index;
    if (index === -1 || typeof index === "undefined") {
      const insertLocation = query("GET_ITEM_INSERT_LOCATION");
      const totalItems = query("GET_TOTAL_ITEMS");
      currentIndex = insertLocation === "before" ? 0 : totalItems;
    }
    const ignoredFiles = query("GET_IGNORED_FILES");
    const isValidFile = (source) => isFile(source) ? !ignoredFiles.includes(source.name.toLowerCase()) : !isEmpty(source);
    const validItems = items.filter(isValidFile);
    const promises = validItems.map(
      (source) => new Promise((resolve, reject) => {
        dispatch("ADD_ITEM", {
          interactionMethod,
          source: source.source || source,
          success: resolve,
          failure: reject,
          index: currentIndex++,
          options: source.options || {}
        });
      })
    );
    Promise.all(promises).then(success).catch(failure);
  },
  /**
   * @param source
   * @param index
   * @param interactionMethod
   */
  ADD_ITEM: ({
    source,
    index = -1,
    interactionMethod,
    success = () => {
    },
    failure = () => {
    },
    options = {}
  }) => {
    if (isEmpty(source)) {
      failure({
        error: createResponse("error", 0, "No source"),
        file: null
      });
      return;
    }
    if (isFile(source) && state2.options.ignoredFiles.includes(source.name.toLowerCase())) {
      return;
    }
    if (!hasRoomForItem(state2)) {
      if (state2.options.allowMultiple || !state2.options.allowMultiple && !state2.options.allowReplace) {
        const error2 = createResponse("warning", 0, "Max files");
        dispatch("DID_THROW_MAX_FILES", {
          source,
          error: error2
        });
        failure({ error: error2, file: null });
        return;
      }
      const item3 = getActiveItems(state2.items)[0];
      if (item3.status === ItemStatus.PROCESSING_COMPLETE || item3.status === ItemStatus.PROCESSING_REVERT_ERROR) {
        const forceRevert = query("GET_FORCE_REVERT");
        item3.revert(
          createRevertFunction(state2.options.server.url, state2.options.server.revert),
          forceRevert
        ).then(() => {
          if (!forceRevert) return;
          dispatch("ADD_ITEM", {
            source,
            index,
            interactionMethod,
            success,
            failure,
            options
          });
        }).catch(() => {
        });
        if (forceRevert) return;
      }
      dispatch("REMOVE_ITEM", { query: item3.id });
    }
    const origin = options.type === "local" ? FileOrigin.LOCAL : options.type === "limbo" ? FileOrigin.LIMBO : FileOrigin.INPUT;
    const item2 = createItem(
      // where did this file come from
      origin,
      // an input file never has a server file reference
      origin === FileOrigin.INPUT ? null : source,
      // file mock data, if defined
      options.file
    );
    Object.keys(options.metadata || {}).forEach((key) => {
      item2.setMetadata(key, options.metadata[key]);
    });
    applyFilters("DID_CREATE_ITEM", item2, { query, dispatch });
    const itemInsertLocation = query("GET_ITEM_INSERT_LOCATION");
    if (!state2.options.itemInsertLocationFreedom) {
      index = itemInsertLocation === "before" ? -1 : state2.items.length;
    }
    insertItem(state2.items, item2, index);
    if (isFunction(itemInsertLocation) && source) {
      sortItems(state2, itemInsertLocation);
    }
    const id = item2.id;
    item2.on("init", () => {
      dispatch("DID_INIT_ITEM", { id });
    });
    item2.on("load-init", () => {
      dispatch("DID_START_ITEM_LOAD", { id });
    });
    item2.on("load-meta", () => {
      dispatch("DID_UPDATE_ITEM_META", { id });
    });
    item2.on("load-progress", (progress) => {
      dispatch("DID_UPDATE_ITEM_LOAD_PROGRESS", { id, progress });
    });
    item2.on("load-request-error", (error2) => {
      const mainStatus = dynamicLabel(state2.options.labelFileLoadError)(error2);
      if (error2.code >= 400 && error2.code < 500) {
        dispatch("DID_THROW_ITEM_INVALID", {
          id,
          error: error2,
          status: {
            main: mainStatus,
            sub: `${error2.code} (${error2.body})`
          }
        });
        failure({ error: error2, file: createItemAPI(item2) });
        return;
      }
      dispatch("DID_THROW_ITEM_LOAD_ERROR", {
        id,
        error: error2,
        status: {
          main: mainStatus,
          sub: state2.options.labelTapToRetry
        }
      });
    });
    item2.on("load-file-error", (error2) => {
      dispatch("DID_THROW_ITEM_INVALID", {
        id,
        error: error2.status,
        status: error2.status
      });
      failure({ error: error2.status, file: createItemAPI(item2) });
    });
    item2.on("load-abort", () => {
      dispatch("REMOVE_ITEM", { query: id });
    });
    item2.on("load-skip", () => {
      item2.on("metadata-update", (change) => {
        if (!isFile(item2.file)) return;
        dispatch("DID_UPDATE_ITEM_METADATA", { id, change });
      });
      dispatch("COMPLETE_LOAD_ITEM", {
        query: id,
        item: item2,
        data: {
          source,
          success
        }
      });
    });
    item2.on("load", () => {
      const handleAdd = (shouldAdd) => {
        if (!shouldAdd) {
          dispatch("REMOVE_ITEM", {
            query: id
          });
          return;
        }
        item2.on("metadata-update", (change) => {
          dispatch("DID_UPDATE_ITEM_METADATA", { id, change });
        });
        applyFilterChain("SHOULD_PREPARE_OUTPUT", false, { item: item2, query }).then(
          (shouldPrepareOutput) => {
            const beforePrepareFile = query("GET_BEFORE_PREPARE_FILE");
            if (beforePrepareFile)
              shouldPrepareOutput = beforePrepareFile(item2, shouldPrepareOutput);
            const loadComplete = () => {
              dispatch("COMPLETE_LOAD_ITEM", {
                query: id,
                item: item2,
                data: {
                  source,
                  success
                }
              });
              listUpdated(dispatch, state2);
            };
            if (shouldPrepareOutput) {
              dispatch(
                "REQUEST_PREPARE_OUTPUT",
                {
                  query: id,
                  item: item2,
                  success: (file2) => {
                    dispatch("DID_PREPARE_OUTPUT", { id, file: file2 });
                    loadComplete();
                  }
                },
                true
              );
              return;
            }
            loadComplete();
          }
        );
      };
      applyFilterChain("DID_LOAD_ITEM", item2, { query, dispatch }).then(() => {
        optionalPromise(query("GET_BEFORE_ADD_FILE"), createItemAPI(item2)).then(
          handleAdd
        );
      }).catch((e) => {
        if (!e || !e.error || !e.status) return handleAdd(false);
        dispatch("DID_THROW_ITEM_INVALID", {
          id,
          error: e.error,
          status: e.status
        });
      });
    });
    item2.on("process-start", () => {
      dispatch("DID_START_ITEM_PROCESSING", { id });
    });
    item2.on("process-progress", (progress) => {
      dispatch("DID_UPDATE_ITEM_PROCESS_PROGRESS", { id, progress });
    });
    item2.on("process-error", (error2) => {
      dispatch("DID_THROW_ITEM_PROCESSING_ERROR", {
        id,
        error: error2,
        status: {
          main: dynamicLabel(state2.options.labelFileProcessingError)(error2),
          sub: state2.options.labelTapToRetry
        }
      });
    });
    item2.on("process-revert-error", (error2) => {
      dispatch("DID_THROW_ITEM_PROCESSING_REVERT_ERROR", {
        id,
        error: error2,
        status: {
          main: dynamicLabel(state2.options.labelFileProcessingRevertError)(error2),
          sub: state2.options.labelTapToRetry
        }
      });
    });
    item2.on("process-complete", (serverFileReference) => {
      dispatch("DID_COMPLETE_ITEM_PROCESSING", {
        id,
        error: null,
        serverFileReference
      });
      dispatch("DID_DEFINE_VALUE", { id, value: serverFileReference });
    });
    item2.on("process-abort", () => {
      dispatch("DID_ABORT_ITEM_PROCESSING", { id });
    });
    item2.on("process-revert", () => {
      dispatch("DID_REVERT_ITEM_PROCESSING", { id });
      dispatch("DID_DEFINE_VALUE", { id, value: null });
    });
    dispatch("DID_ADD_ITEM", { id, index, interactionMethod });
    listUpdated(dispatch, state2);
    const { url, load, restore, fetch } = state2.options.server || {};
    item2.load(
      source,
      // this creates a function that loads the file based on the type of file (string, base64, blob, file) and location of file (local, remote, limbo)
      createFileLoader(
        origin === FileOrigin.INPUT ? (
          // input, if is remote, see if should use custom fetch, else use default fetchBlob
          isString(source) && isExternalURL(source) ? fetch ? createFetchFunction(url, fetch) : fetchBlob : fetchBlob
        ) : (
          // limbo or local
          origin === FileOrigin.LIMBO ? createFetchFunction(url, restore) : createFetchFunction(url, load)
        )
        // local
      ),
      // called when the file is loaded so it can be piped through the filters
      (file2, success2, error2) => {
        applyFilterChain("LOAD_FILE", file2, { query }).then(success2).catch(error2);
      }
    );
  },
  REQUEST_PREPARE_OUTPUT: ({ item: item2, success, failure = () => {
  } }) => {
    const err = {
      error: createResponse("error", 0, "Item not found"),
      file: null
    };
    if (item2.archived) return failure(err);
    applyFilterChain("PREPARE_OUTPUT", item2.file, { query, item: item2 }).then((result) => {
      applyFilterChain("COMPLETE_PREPARE_OUTPUT", result, { query, item: item2 }).then((result2) => {
        if (item2.archived) return failure(err);
        success(result2);
      });
    });
  },
  COMPLETE_LOAD_ITEM: ({ item: item2, data: data2 }) => {
    const { success, source } = data2;
    const itemInsertLocation = query("GET_ITEM_INSERT_LOCATION");
    if (isFunction(itemInsertLocation) && source) {
      sortItems(state2, itemInsertLocation);
    }
    dispatch("DID_LOAD_ITEM", {
      id: item2.id,
      error: null,
      serverFileReference: item2.origin === FileOrigin.INPUT ? null : source
    });
    success(createItemAPI(item2));
    if (item2.origin === FileOrigin.LOCAL) {
      dispatch("DID_LOAD_LOCAL_ITEM", { id: item2.id });
      return;
    }
    if (item2.origin === FileOrigin.LIMBO) {
      dispatch("DID_COMPLETE_ITEM_PROCESSING", {
        id: item2.id,
        error: null,
        serverFileReference: source
      });
      dispatch("DID_DEFINE_VALUE", {
        id: item2.id,
        value: item2.serverId || source
      });
      return;
    }
    if (query("IS_ASYNC") && state2.options.instantUpload) {
      dispatch("REQUEST_ITEM_PROCESSING", { query: item2.id });
    }
  },
  RETRY_ITEM_LOAD: getItemByQueryFromState(state2, (item2) => {
    item2.retryLoad();
  }),
  REQUEST_ITEM_PREPARE: getItemByQueryFromState(state2, (item2, success, failure) => {
    dispatch(
      "REQUEST_PREPARE_OUTPUT",
      {
        query: item2.id,
        item: item2,
        success: (file2) => {
          dispatch("DID_PREPARE_OUTPUT", { id: item2.id, file: file2 });
          success({
            file: item2,
            output: file2
          });
        },
        failure
      },
      true
    );
  }),
  REQUEST_ITEM_PROCESSING: getItemByQueryFromState(state2, (item2, success, failure) => {
    const itemCanBeQueuedForProcessing = (
      // waiting for something
      item2.status === ItemStatus.IDLE || // processing went wrong earlier
      item2.status === ItemStatus.PROCESSING_ERROR
    );
    if (!itemCanBeQueuedForProcessing) {
      const processNow = () => dispatch("REQUEST_ITEM_PROCESSING", { query: item2, success, failure });
      const process = () => document.hidden ? processNow() : setTimeout(processNow, 32);
      if (item2.status === ItemStatus.PROCESSING_COMPLETE || item2.status === ItemStatus.PROCESSING_REVERT_ERROR) {
        item2.revert(
          createRevertFunction(state2.options.server.url, state2.options.server.revert),
          query("GET_FORCE_REVERT")
        ).then(process).catch(() => {
        });
      } else if (item2.status === ItemStatus.PROCESSING) {
        item2.abortProcessing().then(process);
      }
      return;
    }
    if (item2.status === ItemStatus.PROCESSING_QUEUED) return;
    item2.requestProcessing();
    dispatch("DID_REQUEST_ITEM_PROCESSING", { id: item2.id });
    dispatch("PROCESS_ITEM", { query: item2, success, failure }, true);
  }),
  PROCESS_ITEM: getItemByQueryFromState(state2, (item2, success, failure) => {
    const maxParallelUploads = query("GET_MAX_PARALLEL_UPLOADS");
    const totalCurrentUploads = query("GET_ITEMS_BY_STATUS", ItemStatus.PROCESSING).length;
    if (totalCurrentUploads === maxParallelUploads) {
      state2.processingQueue.push({
        id: item2.id,
        success,
        failure
      });
      return;
    }
    if (item2.status === ItemStatus.PROCESSING) return;
    const processNext = () => {
      const queueEntry = state2.processingQueue.shift();
      if (!queueEntry) return;
      const { id, success: success2, failure: failure2 } = queueEntry;
      const itemReference = getItemByQuery(state2.items, id);
      if (!itemReference || itemReference.archived) {
        processNext();
        return;
      }
      dispatch("PROCESS_ITEM", { query: id, success: success2, failure: failure2 }, true);
    };
    item2.onOnce("process-complete", () => {
      success(createItemAPI(item2));
      processNext();
      const server2 = state2.options.server;
      const instantUpload = state2.options.instantUpload;
      if (instantUpload && item2.origin === FileOrigin.LOCAL && isFunction(server2.remove)) {
        const noop = () => {
        };
        item2.origin = FileOrigin.LIMBO;
        state2.options.server.remove(item2.source, noop, noop);
      }
      const allItemsProcessed = query("GET_ITEMS_BY_STATUS", ItemStatus.PROCESSING_COMPLETE).length === state2.items.length;
      if (allItemsProcessed) {
        dispatch("DID_COMPLETE_ITEM_PROCESSING_ALL");
      }
    });
    item2.onOnce("process-error", (error2) => {
      failure({ error: error2, file: createItemAPI(item2) });
      processNext();
    });
    item2.onOnce("process-abort", () => {
      processNext();
    });
    const options = state2.options;
    item2.process(
      createFileProcessor(
        createProcessorFunction(options.server.url, options.server.process, options.name, {
          chunkTransferId: item2.transferId,
          chunkServer: options.server.patch,
          chunkUploads: options.chunkUploads,
          chunkForce: options.chunkForce,
          chunkSize: options.chunkSize,
          chunkRetryDelays: options.chunkRetryDelays
        }),
        {
          allowMinimumUploadDuration: query("GET_ALLOW_MINIMUM_UPLOAD_DURATION")
        }
      ),
      // called when the file is about to be processed so it can be piped through the transform filters
      (file2, success2, error2) => {
        applyFilterChain("PREPARE_OUTPUT", file2, { query, item: item2 }).then((file3) => {
          dispatch("DID_PREPARE_OUTPUT", { id: item2.id, file: file3 });
          success2(file3);
        }).catch(error2);
      }
    );
  }),
  RETRY_ITEM_PROCESSING: getItemByQueryFromState(state2, (item2) => {
    dispatch("REQUEST_ITEM_PROCESSING", { query: item2 });
  }),
  REQUEST_REMOVE_ITEM: getItemByQueryFromState(state2, (item2) => {
    optionalPromise(query("GET_BEFORE_REMOVE_FILE"), createItemAPI(item2)).then((shouldRemove) => {
      if (!shouldRemove) {
        return;
      }
      dispatch("REMOVE_ITEM", { query: item2 });
    });
  }),
  RELEASE_ITEM: getItemByQueryFromState(state2, (item2) => {
    item2.release();
  }),
  REMOVE_ITEM: getItemByQueryFromState(state2, (item2, success, failure, options) => {
    const removeFromView = () => {
      const id = item2.id;
      getItemById(state2.items, id).archive();
      dispatch("DID_REMOVE_ITEM", { error: null, id, item: item2 });
      listUpdated(dispatch, state2);
      success(createItemAPI(item2));
    };
    const server2 = state2.options.server;
    if (item2.origin === FileOrigin.LOCAL && server2 && isFunction(server2.remove) && options.remove !== false) {
      dispatch("DID_START_ITEM_REMOVE", { id: item2.id });
      server2.remove(
        item2.source,
        () => removeFromView(),
        (status) => {
          dispatch("DID_THROW_ITEM_REMOVE_ERROR", {
            id: item2.id,
            error: createResponse("error", 0, status, null),
            status: {
              main: dynamicLabel(state2.options.labelFileRemoveError)(status),
              sub: state2.options.labelTapToRetry
            }
          });
        }
      );
    } else {
      if (options.revert && item2.origin !== FileOrigin.LOCAL && item2.serverId !== null || // if chunked uploads are enabled and we're uploading in chunks for this specific file
      // or if the file isn't big enough for chunked uploads but chunkForce is set then call
      // revert before removing from the view...
      state2.options.chunkUploads && item2.file.size > state2.options.chunkSize || state2.options.chunkUploads && state2.options.chunkForce) {
        item2.revert(
          createRevertFunction(state2.options.server.url, state2.options.server.revert),
          query("GET_FORCE_REVERT")
        );
      }
      removeFromView();
    }
  }),
  ABORT_ITEM_LOAD: getItemByQueryFromState(state2, (item2) => {
    item2.abortLoad();
  }),
  ABORT_ITEM_PROCESSING: getItemByQueryFromState(state2, (item2) => {
    if (item2.serverId) {
      dispatch("REVERT_ITEM_PROCESSING", { id: item2.id });
      return;
    }
    item2.abortProcessing().then(() => {
      const shouldRemove = state2.options.instantUpload;
      if (shouldRemove) {
        dispatch("REMOVE_ITEM", { query: item2.id });
      }
    });
  }),
  REQUEST_REVERT_ITEM_PROCESSING: getItemByQueryFromState(state2, (item2) => {
    if (!state2.options.instantUpload) {
      dispatch("REVERT_ITEM_PROCESSING", { query: item2 });
      return;
    }
    const handleRevert = (shouldRevert) => {
      if (!shouldRevert) return;
      dispatch("REVERT_ITEM_PROCESSING", { query: item2 });
    };
    const fn2 = query("GET_BEFORE_REMOVE_FILE");
    if (!fn2) {
      return handleRevert(true);
    }
    const requestRemoveResult = fn2(createItemAPI(item2));
    if (requestRemoveResult == null) {
      return handleRevert(true);
    }
    if (typeof requestRemoveResult === "boolean") {
      return handleRevert(requestRemoveResult);
    }
    if (typeof requestRemoveResult.then === "function") {
      requestRemoveResult.then(handleRevert);
    }
  }),
  REVERT_ITEM_PROCESSING: getItemByQueryFromState(state2, (item2) => {
    item2.revert(
      createRevertFunction(state2.options.server.url, state2.options.server.revert),
      query("GET_FORCE_REVERT")
    ).then(() => {
      const shouldRemove = state2.options.instantUpload || isMockItem(item2);
      if (shouldRemove) {
        dispatch("REMOVE_ITEM", { query: item2.id });
      }
    }).catch(() => {
    });
  }),
  SET_OPTIONS: ({ options }) => {
    const optionKeys = Object.keys(options);
    const prioritizedOptionKeys = PrioritizedOptions.filter((key) => optionKeys.includes(key));
    const orderedOptionKeys = [
      // add prioritized first if passed to options, else remove
      ...prioritizedOptionKeys,
      // prevent duplicate keys
      ...Object.keys(options).filter((key) => !prioritizedOptionKeys.includes(key))
    ];
    orderedOptionKeys.forEach((key) => {
      dispatch(`SET_${fromCamels(key, "_").toUpperCase()}`, {
        value: options[key]
      });
    });
  }
});
const PrioritizedOptions = [
  "server"
  // must be processed before "files"
];
const formatFilename = (name2) => name2;
const createElement$1 = (tagName) => {
  return document.createElement(tagName);
};
const text = (node, value) => {
  let textNode = node.childNodes[0];
  if (!textNode) {
    textNode = document.createTextNode(value);
    node.appendChild(textNode);
  } else if (value !== textNode.nodeValue) {
    textNode.nodeValue = value;
  }
};
const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
  const angleInRadians = (angleInDegrees % 360 - 90) * Math.PI / 180;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians)
  };
};
const describeArc = (x, y, radius, startAngle, endAngle, arcSweep) => {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  return ["M", start.x, start.y, "A", radius, radius, 0, arcSweep, 0, end.x, end.y].join(" ");
};
const percentageArc = (x, y, radius, from, to) => {
  let arcSweep = 1;
  if (to > from && to - from <= 0.5) {
    arcSweep = 0;
  }
  if (from > to && from - to >= 0.5) {
    arcSweep = 0;
  }
  return describeArc(
    x,
    y,
    radius,
    Math.min(0.9999, from) * 360,
    Math.min(0.9999, to) * 360,
    arcSweep
  );
};
const create = ({ root: root2, props }) => {
  props.spin = false;
  props.progress = 0;
  props.opacity = 0;
  const svg = createElement("svg");
  root2.ref.path = createElement("path", {
    "stroke-width": 2,
    "stroke-linecap": "round"
  });
  svg.appendChild(root2.ref.path);
  root2.ref.svg = svg;
  root2.appendChild(svg);
};
const write = ({ root: root2, props }) => {
  if (props.opacity === 0) {
    return;
  }
  if (props.align) {
    root2.element.dataset.align = props.align;
  }
  const ringStrokeWidth = parseInt(attr(root2.ref.path, "stroke-width"), 10);
  const size = root2.rect.element.width * 0.5;
  let ringFrom = 0;
  let ringTo = 0;
  if (props.spin) {
    ringFrom = 0;
    ringTo = 0.5;
  } else {
    ringFrom = 0;
    ringTo = props.progress;
  }
  const coordinates = percentageArc(size, size, size - ringStrokeWidth, ringFrom, ringTo);
  attr(root2.ref.path, "d", coordinates);
  attr(root2.ref.path, "stroke-opacity", props.spin || props.progress > 0 ? 1 : 0);
};
const progressIndicator = createView({
  tag: "div",
  name: "progress-indicator",
  ignoreRectUpdate: true,
  ignoreRect: true,
  create,
  write,
  mixins: {
    apis: ["progress", "spin", "align"],
    styles: ["opacity"],
    animations: {
      opacity: { type: "tween", duration: 500 },
      progress: {
        type: "spring",
        stiffness: 0.95,
        damping: 0.65,
        mass: 10
      }
    }
  }
});
const create$1 = ({ root: root2, props }) => {
  root2.element.innerHTML = (props.icon || "") + `<span>${props.label}</span>`;
  props.isDisabled = false;
};
const write$1 = ({ root: root2, props }) => {
  const { isDisabled } = props;
  const shouldDisable = root2.query("GET_DISABLED") || props.opacity === 0;
  if (shouldDisable && !isDisabled) {
    props.isDisabled = true;
    attr(root2.element, "disabled", "disabled");
  } else if (!shouldDisable && isDisabled) {
    props.isDisabled = false;
    root2.element.removeAttribute("disabled");
  }
};
const fileActionButton = createView({
  tag: "button",
  attributes: {
    type: "button"
  },
  ignoreRect: true,
  ignoreRectUpdate: true,
  name: "file-action-button",
  mixins: {
    apis: ["label"],
    styles: ["translateX", "translateY", "scaleX", "scaleY", "opacity"],
    animations: {
      scaleX: "spring",
      scaleY: "spring",
      translateX: "spring",
      translateY: "spring",
      opacity: { type: "tween", duration: 250 }
    },
    listeners: true
  },
  create: create$1,
  write: write$1
});
const toNaturalFileSize = (bytes, decimalSeparator = ".", base = 1e3, options = {}) => {
  const {
    labelBytes = "bytes",
    labelKilobytes = "KB",
    labelMegabytes = "MB",
    labelGigabytes = "GB"
  } = options;
  bytes = Math.round(Math.abs(bytes));
  const KB = base;
  const MB = base * base;
  const GB = base * base * base;
  if (bytes < KB) {
    return `${bytes} ${labelBytes}`;
  }
  if (bytes < MB) {
    return `${Math.floor(bytes / KB)} ${labelKilobytes}`;
  }
  if (bytes < GB) {
    return `${removeDecimalsWhenZero(bytes / MB, 1, decimalSeparator)} ${labelMegabytes}`;
  }
  return `${removeDecimalsWhenZero(bytes / GB, 2, decimalSeparator)} ${labelGigabytes}`;
};
const removeDecimalsWhenZero = (value, decimalCount, separator) => {
  return value.toFixed(decimalCount).split(".").filter((part) => part !== "0").join(separator);
};
const create$2 = ({ root: root2, props }) => {
  const fileName = createElement$1("span");
  fileName.className = "filepond--file-info-main";
  attr(fileName, "aria-hidden", "true");
  root2.appendChild(fileName);
  root2.ref.fileName = fileName;
  const fileSize = createElement$1("span");
  fileSize.className = "filepond--file-info-sub";
  root2.appendChild(fileSize);
  root2.ref.fileSize = fileSize;
  text(fileSize, root2.query("GET_LABEL_FILE_WAITING_FOR_SIZE"));
  text(fileName, formatFilename(root2.query("GET_ITEM_NAME", props.id)));
};
const updateFile = ({ root: root2, props }) => {
  text(
    root2.ref.fileSize,
    toNaturalFileSize(
      root2.query("GET_ITEM_SIZE", props.id),
      ".",
      root2.query("GET_FILE_SIZE_BASE"),
      root2.query("GET_FILE_SIZE_LABELS", root2.query)
    )
  );
  text(root2.ref.fileName, formatFilename(root2.query("GET_ITEM_NAME", props.id)));
};
const updateFileSizeOnError = ({ root: root2, props }) => {
  if (isInt(root2.query("GET_ITEM_SIZE", props.id))) {
    updateFile({ root: root2, props });
    return;
  }
  text(root2.ref.fileSize, root2.query("GET_LABEL_FILE_SIZE_NOT_AVAILABLE"));
};
const fileInfo = createView({
  name: "file-info",
  ignoreRect: true,
  ignoreRectUpdate: true,
  write: createRoute({
    DID_LOAD_ITEM: updateFile,
    DID_UPDATE_ITEM_META: updateFile,
    DID_THROW_ITEM_LOAD_ERROR: updateFileSizeOnError,
    DID_THROW_ITEM_INVALID: updateFileSizeOnError
  }),
  didCreateView: (root2) => {
    applyFilters("CREATE_VIEW", { ...root2, view: root2 });
  },
  create: create$2,
  mixins: {
    styles: ["translateX", "translateY"],
    animations: {
      translateX: "spring",
      translateY: "spring"
    }
  }
});
const toPercentage = (value) => Math.round(value * 100);
const create$3 = ({ root: root2 }) => {
  const main = createElement$1("span");
  main.className = "filepond--file-status-main";
  root2.appendChild(main);
  root2.ref.main = main;
  const sub = createElement$1("span");
  sub.className = "filepond--file-status-sub";
  root2.appendChild(sub);
  root2.ref.sub = sub;
  didSetItemLoadProgress({ root: root2, action: { progress: null } });
};
const didSetItemLoadProgress = ({ root: root2, action }) => {
  const title = action.progress === null ? root2.query("GET_LABEL_FILE_LOADING") : `${root2.query("GET_LABEL_FILE_LOADING")} ${toPercentage(action.progress)}%`;
  text(root2.ref.main, title);
  text(root2.ref.sub, root2.query("GET_LABEL_TAP_TO_CANCEL"));
};
const didSetItemProcessProgress = ({ root: root2, action }) => {
  const title = action.progress === null ? root2.query("GET_LABEL_FILE_PROCESSING") : `${root2.query("GET_LABEL_FILE_PROCESSING")} ${toPercentage(action.progress)}%`;
  text(root2.ref.main, title);
  text(root2.ref.sub, root2.query("GET_LABEL_TAP_TO_CANCEL"));
};
const didRequestItemProcessing = ({ root: root2 }) => {
  text(root2.ref.main, root2.query("GET_LABEL_FILE_PROCESSING"));
  text(root2.ref.sub, root2.query("GET_LABEL_TAP_TO_CANCEL"));
};
const didAbortItemProcessing = ({ root: root2 }) => {
  text(root2.ref.main, root2.query("GET_LABEL_FILE_PROCESSING_ABORTED"));
  text(root2.ref.sub, root2.query("GET_LABEL_TAP_TO_RETRY"));
};
const didCompleteItemProcessing = ({ root: root2 }) => {
  text(root2.ref.main, root2.query("GET_LABEL_FILE_PROCESSING_COMPLETE"));
  text(root2.ref.sub, root2.query("GET_LABEL_TAP_TO_UNDO"));
};
const clear = ({ root: root2 }) => {
  text(root2.ref.main, "");
  text(root2.ref.sub, "");
};
const error = ({ root: root2, action }) => {
  text(root2.ref.main, action.status.main);
  text(root2.ref.sub, action.status.sub);
};
const fileStatus = createView({
  name: "file-status",
  ignoreRect: true,
  ignoreRectUpdate: true,
  write: createRoute({
    DID_LOAD_ITEM: clear,
    DID_REVERT_ITEM_PROCESSING: clear,
    DID_REQUEST_ITEM_PROCESSING: didRequestItemProcessing,
    DID_ABORT_ITEM_PROCESSING: didAbortItemProcessing,
    DID_COMPLETE_ITEM_PROCESSING: didCompleteItemProcessing,
    DID_UPDATE_ITEM_PROCESS_PROGRESS: didSetItemProcessProgress,
    DID_UPDATE_ITEM_LOAD_PROGRESS: didSetItemLoadProgress,
    DID_THROW_ITEM_LOAD_ERROR: error,
    DID_THROW_ITEM_INVALID: error,
    DID_THROW_ITEM_PROCESSING_ERROR: error,
    DID_THROW_ITEM_PROCESSING_REVERT_ERROR: error,
    DID_THROW_ITEM_REMOVE_ERROR: error
  }),
  didCreateView: (root2) => {
    applyFilters("CREATE_VIEW", { ...root2, view: root2 });
  },
  create: create$3,
  mixins: {
    styles: ["translateX", "translateY", "opacity"],
    animations: {
      opacity: { type: "tween", duration: 250 },
      translateX: "spring",
      translateY: "spring"
    }
  }
});
const Buttons = {
  AbortItemLoad: {
    label: "GET_LABEL_BUTTON_ABORT_ITEM_LOAD",
    action: "ABORT_ITEM_LOAD",
    className: "filepond--action-abort-item-load",
    align: "LOAD_INDICATOR_POSITION"
    // right
  },
  RetryItemLoad: {
    label: "GET_LABEL_BUTTON_RETRY_ITEM_LOAD",
    action: "RETRY_ITEM_LOAD",
    icon: "GET_ICON_RETRY",
    className: "filepond--action-retry-item-load",
    align: "BUTTON_PROCESS_ITEM_POSITION"
    // right
  },
  RemoveItem: {
    label: "GET_LABEL_BUTTON_REMOVE_ITEM",
    action: "REQUEST_REMOVE_ITEM",
    icon: "GET_ICON_REMOVE",
    className: "filepond--action-remove-item",
    align: "BUTTON_REMOVE_ITEM_POSITION"
    // left
  },
  ProcessItem: {
    label: "GET_LABEL_BUTTON_PROCESS_ITEM",
    action: "REQUEST_ITEM_PROCESSING",
    icon: "GET_ICON_PROCESS",
    className: "filepond--action-process-item",
    align: "BUTTON_PROCESS_ITEM_POSITION"
    // right
  },
  AbortItemProcessing: {
    label: "GET_LABEL_BUTTON_ABORT_ITEM_PROCESSING",
    action: "ABORT_ITEM_PROCESSING",
    className: "filepond--action-abort-item-processing",
    align: "BUTTON_PROCESS_ITEM_POSITION"
    // right
  },
  RetryItemProcessing: {
    label: "GET_LABEL_BUTTON_RETRY_ITEM_PROCESSING",
    action: "RETRY_ITEM_PROCESSING",
    icon: "GET_ICON_RETRY",
    className: "filepond--action-retry-item-processing",
    align: "BUTTON_PROCESS_ITEM_POSITION"
    // right
  },
  RevertItemProcessing: {
    label: "GET_LABEL_BUTTON_UNDO_ITEM_PROCESSING",
    action: "REQUEST_REVERT_ITEM_PROCESSING",
    icon: "GET_ICON_UNDO",
    className: "filepond--action-revert-item-processing",
    align: "BUTTON_PROCESS_ITEM_POSITION"
    // right
  }
};
const ButtonKeys = [];
forin(Buttons, (key) => {
  ButtonKeys.push(key);
});
const calculateFileInfoOffset = (root2) => {
  if (getRemoveIndicatorAligment(root2) === "right") return 0;
  const buttonRect = root2.ref.buttonRemoveItem.rect.element;
  return buttonRect.hidden ? null : buttonRect.width + buttonRect.left;
};
const calculateButtonWidth = (root2) => {
  const buttonRect = root2.ref.buttonAbortItemLoad.rect.element;
  return buttonRect.width;
};
const calculateFileVerticalCenterOffset = (root2) => Math.floor(root2.ref.buttonRemoveItem.rect.element.height / 4);
const calculateFileHorizontalCenterOffset = (root2) => Math.floor(root2.ref.buttonRemoveItem.rect.element.left / 2);
const getLoadIndicatorAlignment = (root2) => root2.query("GET_STYLE_LOAD_INDICATOR_POSITION");
const getProcessIndicatorAlignment = (root2) => root2.query("GET_STYLE_PROGRESS_INDICATOR_POSITION");
const getRemoveIndicatorAligment = (root2) => root2.query("GET_STYLE_BUTTON_REMOVE_ITEM_POSITION");
const DefaultStyle = {
  buttonAbortItemLoad: { opacity: 0 },
  buttonRetryItemLoad: { opacity: 0 },
  buttonRemoveItem: { opacity: 0 },
  buttonProcessItem: { opacity: 0 },
  buttonAbortItemProcessing: { opacity: 0 },
  buttonRetryItemProcessing: { opacity: 0 },
  buttonRevertItemProcessing: { opacity: 0 },
  loadProgressIndicator: { opacity: 0, align: getLoadIndicatorAlignment },
  processProgressIndicator: { opacity: 0, align: getProcessIndicatorAlignment },
  processingCompleteIndicator: { opacity: 0, scaleX: 0.75, scaleY: 0.75 },
  info: { translateX: 0, translateY: 0, opacity: 0 },
  status: { translateX: 0, translateY: 0, opacity: 0 }
};
const IdleStyle = {
  buttonRemoveItem: { opacity: 1 },
  buttonProcessItem: { opacity: 1 },
  info: { translateX: calculateFileInfoOffset },
  status: { translateX: calculateFileInfoOffset }
};
const ProcessingStyle = {
  buttonAbortItemProcessing: { opacity: 1 },
  processProgressIndicator: { opacity: 1 },
  status: { opacity: 1 }
};
const StyleMap = {
  DID_THROW_ITEM_INVALID: {
    buttonRemoveItem: { opacity: 1 },
    info: { translateX: calculateFileInfoOffset },
    status: { translateX: calculateFileInfoOffset, opacity: 1 }
  },
  DID_START_ITEM_LOAD: {
    buttonAbortItemLoad: { opacity: 1 },
    loadProgressIndicator: { opacity: 1 },
    status: { opacity: 1 }
  },
  DID_THROW_ITEM_LOAD_ERROR: {
    buttonRetryItemLoad: { opacity: 1 },
    buttonRemoveItem: { opacity: 1 },
    info: { translateX: calculateFileInfoOffset },
    status: { opacity: 1 }
  },
  DID_START_ITEM_REMOVE: {
    processProgressIndicator: { opacity: 1, align: getRemoveIndicatorAligment },
    info: { translateX: calculateFileInfoOffset },
    status: { opacity: 0 }
  },
  DID_THROW_ITEM_REMOVE_ERROR: {
    processProgressIndicator: { opacity: 0, align: getRemoveIndicatorAligment },
    buttonRemoveItem: { opacity: 1 },
    info: { translateX: calculateFileInfoOffset },
    status: { opacity: 1, translateX: calculateFileInfoOffset }
  },
  DID_LOAD_ITEM: IdleStyle,
  DID_LOAD_LOCAL_ITEM: {
    buttonRemoveItem: { opacity: 1 },
    info: { translateX: calculateFileInfoOffset },
    status: { translateX: calculateFileInfoOffset }
  },
  DID_START_ITEM_PROCESSING: ProcessingStyle,
  DID_REQUEST_ITEM_PROCESSING: ProcessingStyle,
  DID_UPDATE_ITEM_PROCESS_PROGRESS: ProcessingStyle,
  DID_COMPLETE_ITEM_PROCESSING: {
    buttonRevertItemProcessing: { opacity: 1 },
    info: { opacity: 1 },
    status: { opacity: 1 }
  },
  DID_THROW_ITEM_PROCESSING_ERROR: {
    buttonRemoveItem: { opacity: 1 },
    buttonRetryItemProcessing: { opacity: 1 },
    status: { opacity: 1 },
    info: { translateX: calculateFileInfoOffset }
  },
  DID_THROW_ITEM_PROCESSING_REVERT_ERROR: {
    buttonRevertItemProcessing: { opacity: 1 },
    status: { opacity: 1 },
    info: { opacity: 1 }
  },
  DID_ABORT_ITEM_PROCESSING: {
    buttonRemoveItem: { opacity: 1 },
    buttonProcessItem: { opacity: 1 },
    info: { translateX: calculateFileInfoOffset },
    status: { opacity: 1 }
  },
  DID_REVERT_ITEM_PROCESSING: IdleStyle
};
const processingCompleteIndicatorView = createView({
  create: ({ root: root2 }) => {
    root2.element.innerHTML = root2.query("GET_ICON_DONE");
  },
  name: "processing-complete-indicator",
  ignoreRect: true,
  mixins: {
    styles: ["scaleX", "scaleY", "opacity"],
    animations: {
      scaleX: "spring",
      scaleY: "spring",
      opacity: { type: "tween", duration: 250 }
    }
  }
});
const create$4 = ({ root: root2, props }) => {
  const LocalButtons = Object.keys(Buttons).reduce((prev, curr) => {
    prev[curr] = { ...Buttons[curr] };
    return prev;
  }, {});
  const { id } = props;
  const allowRevert = root2.query("GET_ALLOW_REVERT");
  const allowRemove = root2.query("GET_ALLOW_REMOVE");
  const allowProcess = root2.query("GET_ALLOW_PROCESS");
  const instantUpload = root2.query("GET_INSTANT_UPLOAD");
  const isAsync2 = root2.query("IS_ASYNC");
  const alignRemoveItemButton = root2.query("GET_STYLE_BUTTON_REMOVE_ITEM_ALIGN");
  let buttonFilter;
  if (isAsync2) {
    if (allowProcess && !allowRevert) {
      buttonFilter = (key) => !/RevertItemProcessing/.test(key);
    } else if (!allowProcess && allowRevert) {
      buttonFilter = (key) => !/ProcessItem|RetryItemProcessing|AbortItemProcessing/.test(key);
    } else if (!allowProcess && !allowRevert) {
      buttonFilter = (key) => !/Process/.test(key);
    }
  } else {
    buttonFilter = (key) => !/Process/.test(key);
  }
  const enabledButtons = buttonFilter ? ButtonKeys.filter(buttonFilter) : ButtonKeys.concat();
  if (instantUpload && allowRevert) {
    LocalButtons["RevertItemProcessing"].label = "GET_LABEL_BUTTON_REMOVE_ITEM";
    LocalButtons["RevertItemProcessing"].icon = "GET_ICON_REMOVE";
  }
  if (isAsync2 && !allowRevert) {
    const map2 = StyleMap["DID_COMPLETE_ITEM_PROCESSING"];
    map2.info.translateX = calculateFileHorizontalCenterOffset;
    map2.info.translateY = calculateFileVerticalCenterOffset;
    map2.status.translateY = calculateFileVerticalCenterOffset;
    map2.processingCompleteIndicator = { opacity: 1, scaleX: 1, scaleY: 1 };
  }
  if (isAsync2 && !allowProcess) {
    [
      "DID_START_ITEM_PROCESSING",
      "DID_REQUEST_ITEM_PROCESSING",
      "DID_UPDATE_ITEM_PROCESS_PROGRESS",
      "DID_THROW_ITEM_PROCESSING_ERROR"
    ].forEach((key) => {
      StyleMap[key].status.translateY = calculateFileVerticalCenterOffset;
    });
    StyleMap["DID_THROW_ITEM_PROCESSING_ERROR"].status.translateX = calculateButtonWidth;
  }
  if (alignRemoveItemButton && allowRevert) {
    LocalButtons["RevertItemProcessing"].align = "BUTTON_REMOVE_ITEM_POSITION";
    const map2 = StyleMap["DID_COMPLETE_ITEM_PROCESSING"];
    map2.info.translateX = calculateFileInfoOffset;
    map2.status.translateY = calculateFileVerticalCenterOffset;
    map2.processingCompleteIndicator = { opacity: 1, scaleX: 1, scaleY: 1 };
  }
  if (!allowRemove) {
    LocalButtons["RemoveItem"].disabled = true;
  }
  forin(LocalButtons, (key, definition) => {
    const buttonView = root2.createChildView(fileActionButton, {
      label: root2.query(definition.label),
      icon: root2.query(definition.icon),
      opacity: 0
    });
    if (enabledButtons.includes(key)) {
      root2.appendChildView(buttonView);
    }
    if (definition.disabled) {
      buttonView.element.setAttribute("disabled", "disabled");
      buttonView.element.setAttribute("hidden", "hidden");
    }
    buttonView.element.dataset.align = root2.query(`GET_STYLE_${definition.align}`);
    buttonView.element.classList.add(definition.className);
    buttonView.on("click", (e) => {
      e.stopPropagation();
      if (definition.disabled) return;
      root2.dispatch(definition.action, { query: id });
    });
    root2.ref[`button${key}`] = buttonView;
  });
  root2.ref.processingCompleteIndicator = root2.appendChildView(
    root2.createChildView(processingCompleteIndicatorView)
  );
  root2.ref.processingCompleteIndicator.element.dataset.align = root2.query(
    `GET_STYLE_BUTTON_PROCESS_ITEM_POSITION`
  );
  root2.ref.info = root2.appendChildView(root2.createChildView(fileInfo, { id }));
  root2.ref.status = root2.appendChildView(root2.createChildView(fileStatus, { id }));
  const loadIndicatorView = root2.appendChildView(
    root2.createChildView(progressIndicator, {
      opacity: 0,
      align: root2.query(`GET_STYLE_LOAD_INDICATOR_POSITION`)
    })
  );
  loadIndicatorView.element.classList.add("filepond--load-indicator");
  root2.ref.loadProgressIndicator = loadIndicatorView;
  const progressIndicatorView = root2.appendChildView(
    root2.createChildView(progressIndicator, {
      opacity: 0,
      align: root2.query(`GET_STYLE_PROGRESS_INDICATOR_POSITION`)
    })
  );
  progressIndicatorView.element.classList.add("filepond--process-indicator");
  root2.ref.processProgressIndicator = progressIndicatorView;
  root2.ref.activeStyles = [];
};
const write$2 = ({ root: root2, actions: actions2, props }) => {
  route({ root: root2, actions: actions2, props });
  let action = actions2.concat().filter((action2) => /^DID_/.test(action2.type)).reverse().find((action2) => StyleMap[action2.type]);
  if (action) {
    root2.ref.activeStyles = [];
    const stylesToApply = StyleMap[action.type];
    forin(DefaultStyle, (name2, defaultStyles) => {
      const control = root2.ref[name2];
      forin(defaultStyles, (key, defaultValue) => {
        const value = stylesToApply[name2] && typeof stylesToApply[name2][key] !== "undefined" ? stylesToApply[name2][key] : defaultValue;
        root2.ref.activeStyles.push({ control, key, value });
      });
    });
  }
  root2.ref.activeStyles.forEach(({ control, key, value }) => {
    control[key] = typeof value === "function" ? value(root2) : value;
  });
};
const route = createRoute({
  DID_SET_LABEL_BUTTON_ABORT_ITEM_PROCESSING: ({ root: root2, action }) => {
    root2.ref.buttonAbortItemProcessing.label = action.value;
  },
  DID_SET_LABEL_BUTTON_ABORT_ITEM_LOAD: ({ root: root2, action }) => {
    root2.ref.buttonAbortItemLoad.label = action.value;
  },
  DID_SET_LABEL_BUTTON_ABORT_ITEM_REMOVAL: ({ root: root2, action }) => {
    root2.ref.buttonAbortItemRemoval.label = action.value;
  },
  DID_REQUEST_ITEM_PROCESSING: ({ root: root2 }) => {
    root2.ref.processProgressIndicator.spin = true;
    root2.ref.processProgressIndicator.progress = 0;
  },
  DID_START_ITEM_LOAD: ({ root: root2 }) => {
    root2.ref.loadProgressIndicator.spin = true;
    root2.ref.loadProgressIndicator.progress = 0;
  },
  DID_START_ITEM_REMOVE: ({ root: root2 }) => {
    root2.ref.processProgressIndicator.spin = true;
    root2.ref.processProgressIndicator.progress = 0;
  },
  DID_UPDATE_ITEM_LOAD_PROGRESS: ({ root: root2, action }) => {
    root2.ref.loadProgressIndicator.spin = false;
    root2.ref.loadProgressIndicator.progress = action.progress;
  },
  DID_UPDATE_ITEM_PROCESS_PROGRESS: ({ root: root2, action }) => {
    root2.ref.processProgressIndicator.spin = false;
    root2.ref.processProgressIndicator.progress = action.progress;
  }
});
const file = createView({
  create: create$4,
  write: write$2,
  didCreateView: (root2) => {
    applyFilters("CREATE_VIEW", { ...root2, view: root2 });
  },
  name: "file"
});
const create$5 = ({ root: root2, props }) => {
  root2.ref.fileName = createElement$1("legend");
  root2.appendChild(root2.ref.fileName);
  root2.ref.file = root2.appendChildView(root2.createChildView(file, { id: props.id }));
  root2.ref.data = false;
};
const didLoadItem = ({ root: root2, props }) => {
  text(root2.ref.fileName, formatFilename(root2.query("GET_ITEM_NAME", props.id)));
};
const fileWrapper = createView({
  create: create$5,
  ignoreRect: true,
  write: createRoute({
    DID_LOAD_ITEM: didLoadItem
  }),
  didCreateView: (root2) => {
    applyFilters("CREATE_VIEW", { ...root2, view: root2 });
  },
  tag: "fieldset",
  name: "file-wrapper"
});
const PANEL_SPRING_PROPS = { type: "spring", damping: 0.6, mass: 7 };
const create$6 = ({ root: root2, props }) => {
  [
    {
      name: "top"
    },
    {
      name: "center",
      props: {
        translateY: null,
        scaleY: null
      },
      mixins: {
        animations: {
          scaleY: PANEL_SPRING_PROPS
        },
        styles: ["translateY", "scaleY"]
      }
    },
    {
      name: "bottom",
      props: {
        translateY: null
      },
      mixins: {
        animations: {
          translateY: PANEL_SPRING_PROPS
        },
        styles: ["translateY"]
      }
    }
  ].forEach((section) => {
    createSection(root2, section, props.name);
  });
  root2.element.classList.add(`filepond--${props.name}`);
  root2.ref.scalable = null;
};
const createSection = (root2, section, className) => {
  const viewConstructor = createView({
    name: `panel-${section.name} filepond--${className}`,
    mixins: section.mixins,
    ignoreRectUpdate: true
  });
  const view = root2.createChildView(viewConstructor, section.props);
  root2.ref[section.name] = root2.appendChildView(view);
};
const write$3 = ({ root: root2, props }) => {
  if (root2.ref.scalable === null || props.scalable !== root2.ref.scalable) {
    root2.ref.scalable = isBoolean(props.scalable) ? props.scalable : true;
    root2.element.dataset.scalable = root2.ref.scalable;
  }
  if (!props.height) return;
  const topRect = root2.ref.top.rect.element;
  const bottomRect = root2.ref.bottom.rect.element;
  const height = Math.max(topRect.height + bottomRect.height, props.height);
  root2.ref.center.translateY = topRect.height;
  root2.ref.center.scaleY = (height - topRect.height - bottomRect.height) / 100;
  root2.ref.bottom.translateY = height - bottomRect.height;
};
const panel = createView({
  name: "panel",
  read: ({ root: root2, props }) => props.heightCurrent = root2.ref.bottom.translateY,
  write: write$3,
  create: create$6,
  ignoreRect: true,
  mixins: {
    apis: ["height", "heightCurrent", "scalable"]
  }
});
const createDragHelper = (items) => {
  const itemIds = items.map((item2) => item2.id);
  let prevIndex = void 0;
  return {
    setIndex: (index) => {
      prevIndex = index;
    },
    getIndex: () => prevIndex,
    getItemIndex: (item2) => itemIds.indexOf(item2.id)
  };
};
const ITEM_TRANSLATE_SPRING = {
  type: "spring",
  stiffness: 0.75,
  damping: 0.45,
  mass: 10
};
const ITEM_SCALE_SPRING = "spring";
const StateMap = {
  DID_START_ITEM_LOAD: "busy",
  DID_UPDATE_ITEM_LOAD_PROGRESS: "loading",
  DID_THROW_ITEM_INVALID: "load-invalid",
  DID_THROW_ITEM_LOAD_ERROR: "load-error",
  DID_LOAD_ITEM: "idle",
  DID_THROW_ITEM_REMOVE_ERROR: "remove-error",
  DID_START_ITEM_REMOVE: "busy",
  DID_START_ITEM_PROCESSING: "busy processing",
  DID_REQUEST_ITEM_PROCESSING: "busy processing",
  DID_UPDATE_ITEM_PROCESS_PROGRESS: "processing",
  DID_COMPLETE_ITEM_PROCESSING: "processing-complete",
  DID_THROW_ITEM_PROCESSING_ERROR: "processing-error",
  DID_THROW_ITEM_PROCESSING_REVERT_ERROR: "processing-revert-error",
  DID_ABORT_ITEM_PROCESSING: "cancelled",
  DID_REVERT_ITEM_PROCESSING: "idle"
};
const create$7 = ({ root: root2, props }) => {
  root2.ref.handleClick = (e) => root2.dispatch("DID_ACTIVATE_ITEM", { id: props.id });
  root2.element.id = `filepond--item-${props.id}`;
  root2.element.addEventListener("click", root2.ref.handleClick);
  root2.ref.container = root2.appendChildView(root2.createChildView(fileWrapper, { id: props.id }));
  root2.ref.panel = root2.appendChildView(root2.createChildView(panel, { name: "item-panel" }));
  root2.ref.panel.height = null;
  props.markedForRemoval = false;
  if (!root2.query("GET_ALLOW_REORDER")) return;
  root2.element.dataset.dragState = "idle";
  const grab = (e) => {
    if (!e.isPrimary) return;
    let removedActivateListener = false;
    const origin = {
      x: e.pageX,
      y: e.pageY
    };
    props.dragOrigin = {
      x: root2.translateX,
      y: root2.translateY
    };
    props.dragCenter = {
      x: e.offsetX,
      y: e.offsetY
    };
    const dragState = createDragHelper(root2.query("GET_ACTIVE_ITEMS"));
    root2.dispatch("DID_GRAB_ITEM", { id: props.id, dragState });
    const drag = (e2) => {
      if (!e2.isPrimary) return;
      e2.stopPropagation();
      e2.preventDefault();
      props.dragOffset = {
        x: e2.pageX - origin.x,
        y: e2.pageY - origin.y
      };
      const dist = props.dragOffset.x * props.dragOffset.x + props.dragOffset.y * props.dragOffset.y;
      if (dist > 16 && !removedActivateListener) {
        removedActivateListener = true;
        root2.element.removeEventListener("click", root2.ref.handleClick);
      }
      root2.dispatch("DID_DRAG_ITEM", { id: props.id, dragState });
    };
    const drop2 = (e2) => {
      if (!e2.isPrimary) return;
      props.dragOffset = {
        x: e2.pageX - origin.x,
        y: e2.pageY - origin.y
      };
      reset();
    };
    const cancel = () => {
      reset();
    };
    const reset = () => {
      document.removeEventListener("pointercancel", cancel);
      document.removeEventListener("pointermove", drag);
      document.removeEventListener("pointerup", drop2);
      root2.dispatch("DID_DROP_ITEM", { id: props.id, dragState });
      if (removedActivateListener) {
        setTimeout(() => root2.element.addEventListener("click", root2.ref.handleClick), 0);
      }
    };
    document.addEventListener("pointercancel", cancel);
    document.addEventListener("pointermove", drag);
    document.addEventListener("pointerup", drop2);
  };
  root2.element.addEventListener("pointerdown", grab);
};
const route$1 = createRoute({
  DID_UPDATE_PANEL_HEIGHT: ({ root: root2, action }) => {
    root2.height = action.height;
  }
});
const write$4 = createRoute(
  {
    DID_GRAB_ITEM: ({ root: root2, props }) => {
      props.dragOrigin = {
        x: root2.translateX,
        y: root2.translateY
      };
    },
    DID_DRAG_ITEM: ({ root: root2 }) => {
      root2.element.dataset.dragState = "drag";
    },
    DID_DROP_ITEM: ({ root: root2, props }) => {
      props.dragOffset = null;
      props.dragOrigin = null;
      root2.element.dataset.dragState = "drop";
    }
  },
  ({ root: root2, actions: actions2, props, shouldOptimize }) => {
    if (root2.element.dataset.dragState === "drop") {
      if (root2.scaleX <= 1) {
        root2.element.dataset.dragState = "idle";
      }
    }
    let action = actions2.concat().filter((action2) => /^DID_/.test(action2.type)).reverse().find((action2) => StateMap[action2.type]);
    if (action && action.type !== props.currentState) {
      props.currentState = action.type;
      root2.element.dataset.filepondItemState = StateMap[props.currentState] || "";
    }
    const aspectRatio = root2.query("GET_ITEM_PANEL_ASPECT_RATIO") || root2.query("GET_PANEL_ASPECT_RATIO");
    if (!aspectRatio) {
      route$1({ root: root2, actions: actions2, props });
      if (!root2.height && root2.ref.container.rect.element.height > 0) {
        root2.height = root2.ref.container.rect.element.height;
      }
    } else if (!shouldOptimize) {
      root2.height = root2.rect.element.width * aspectRatio;
    }
    if (shouldOptimize) {
      root2.ref.panel.height = null;
    }
    root2.ref.panel.height = root2.height;
  }
);
const item = createView({
  create: create$7,
  write: write$4,
  destroy: ({ root: root2, props }) => {
    root2.element.removeEventListener("click", root2.ref.handleClick);
    root2.dispatch("RELEASE_ITEM", { query: props.id });
  },
  tag: "li",
  name: "item",
  mixins: {
    apis: [
      "id",
      "interactionMethod",
      "markedForRemoval",
      "spawnDate",
      "dragCenter",
      "dragOrigin",
      "dragOffset"
    ],
    styles: ["translateX", "translateY", "scaleX", "scaleY", "opacity", "height"],
    animations: {
      scaleX: ITEM_SCALE_SPRING,
      scaleY: ITEM_SCALE_SPRING,
      translateX: ITEM_TRANSLATE_SPRING,
      translateY: ITEM_TRANSLATE_SPRING,
      opacity: { type: "tween", duration: 150 }
    }
  }
});
var getItemsPerRow = (horizontalSpace, itemWidth) => {
  return Math.max(1, Math.floor((horizontalSpace + 1) / itemWidth));
};
const getItemIndexByPosition = (view, children, positionInView) => {
  if (!positionInView) return;
  const horizontalSpace = view.rect.element.width;
  const l = children.length;
  let last = null;
  if (l === 0 || positionInView.top < children[0].rect.element.top) return -1;
  const item2 = children[0];
  const itemRect = item2.rect.element;
  const itemHorizontalMargin = itemRect.marginLeft + itemRect.marginRight;
  const itemWidth = itemRect.width + itemHorizontalMargin;
  const itemsPerRow = getItemsPerRow(horizontalSpace, itemWidth);
  if (itemsPerRow === 1) {
    for (let index = 0; index < l; index++) {
      const child = children[index];
      const childMid = child.rect.outer.top + child.rect.element.height * 0.5;
      if (positionInView.top < childMid) {
        return index;
      }
    }
    return l;
  }
  const itemVerticalMargin = itemRect.marginTop + itemRect.marginBottom;
  const itemHeight = itemRect.height + itemVerticalMargin;
  for (let index = 0; index < l; index++) {
    const indexX = index % itemsPerRow;
    const indexY = Math.floor(index / itemsPerRow);
    const offsetX = indexX * itemWidth;
    const offsetY = indexY * itemHeight;
    const itemTop = offsetY - itemRect.marginTop;
    const itemRight = offsetX + itemWidth;
    const itemBottom = offsetY + itemHeight + itemRect.marginBottom;
    if (positionInView.top < itemBottom && positionInView.top > itemTop) {
      if (positionInView.left < itemRight) {
        return index;
      } else if (index !== l - 1) {
        last = index;
      } else {
        last = null;
      }
    }
  }
  if (last !== null) {
    return last;
  }
  return l;
};
const dropAreaDimensions = {
  height: 0,
  width: 0,
  get getHeight() {
    return this.height;
  },
  set setHeight(val) {
    if (this.height === 0 || val === 0) this.height = val;
  },
  get getWidth() {
    return this.width;
  },
  set setWidth(val) {
    if (this.width === 0 || val === 0) this.width = val;
  }
};
const create$8 = ({ root: root2 }) => {
  attr(root2.element, "role", "list");
  root2.ref.lastItemSpanwDate = Date.now();
};
const addItemView = ({ root: root2, action }) => {
  const { id, index, interactionMethod } = action;
  root2.ref.addIndex = index;
  const now = Date.now();
  let spawnDate = now;
  let opacity = 1;
  if (interactionMethod !== InteractionMethod.NONE) {
    opacity = 0;
    const cooldown = root2.query("GET_ITEM_INSERT_INTERVAL");
    const dist = now - root2.ref.lastItemSpanwDate;
    spawnDate = dist < cooldown ? now + (cooldown - dist) : now;
  }
  root2.ref.lastItemSpanwDate = spawnDate;
  root2.appendChildView(
    root2.createChildView(
      // view type
      item,
      // props
      {
        spawnDate,
        id,
        opacity,
        interactionMethod
      }
    ),
    index
  );
};
const moveItem = (item2, x, y, vx = 0, vy = 1) => {
  if (item2.dragOffset) {
    item2.translateX = null;
    item2.translateY = null;
    item2.translateX = item2.dragOrigin.x + item2.dragOffset.x;
    item2.translateY = item2.dragOrigin.y + item2.dragOffset.y;
    item2.scaleX = 1.025;
    item2.scaleY = 1.025;
  } else {
    item2.translateX = x;
    item2.translateY = y;
    if (Date.now() > item2.spawnDate) {
      if (item2.opacity === 0) {
        introItemView(item2, x, y, vx, vy);
      }
      item2.scaleX = 1;
      item2.scaleY = 1;
      item2.opacity = 1;
    }
  }
};
const introItemView = (item2, x, y, vx, vy) => {
  if (item2.interactionMethod === InteractionMethod.NONE) {
    item2.translateX = null;
    item2.translateX = x;
    item2.translateY = null;
    item2.translateY = y;
  } else if (item2.interactionMethod === InteractionMethod.DROP) {
    item2.translateX = null;
    item2.translateX = x - vx * 20;
    item2.translateY = null;
    item2.translateY = y - vy * 10;
    item2.scaleX = 0.8;
    item2.scaleY = 0.8;
  } else if (item2.interactionMethod === InteractionMethod.BROWSE) {
    item2.translateY = null;
    item2.translateY = y - 30;
  } else if (item2.interactionMethod === InteractionMethod.API) {
    item2.translateX = null;
    item2.translateX = x - 30;
    item2.translateY = null;
  }
};
const removeItemView = ({ root: root2, action }) => {
  const { id } = action;
  const view = root2.childViews.find((child) => child.id === id);
  if (!view) {
    return;
  }
  view.scaleX = 0.9;
  view.scaleY = 0.9;
  view.opacity = 0;
  view.markedForRemoval = true;
};
const getItemHeight = (child) => child.rect.element.height + child.rect.element.marginBottom + child.rect.element.marginTop;
const getItemWidth = (child) => child.rect.element.width + child.rect.element.marginLeft * 0.5 + child.rect.element.marginRight * 0.5;
const dragItem = ({ root: root2, action }) => {
  const { id, dragState } = action;
  const item2 = root2.query("GET_ITEM", { id });
  const view = root2.childViews.find((child) => child.id === id);
  const numItems = root2.childViews.length;
  const oldIndex = dragState.getItemIndex(item2);
  if (!view) return;
  const dragPosition = {
    x: view.dragOrigin.x + view.dragOffset.x + view.dragCenter.x,
    y: view.dragOrigin.y + view.dragOffset.y + view.dragCenter.y
  };
  const dragHeight = getItemHeight(view);
  const dragWidth = getItemWidth(view);
  let cols = Math.floor(root2.rect.outer.width / dragWidth);
  if (cols > numItems) cols = numItems;
  const rows = Math.floor(numItems / cols + 1);
  dropAreaDimensions.setHeight = dragHeight * rows;
  dropAreaDimensions.setWidth = dragWidth * cols;
  var location2 = {
    y: Math.floor(dragPosition.y / dragHeight),
    x: Math.floor(dragPosition.x / dragWidth),
    getGridIndex: function getGridIndex() {
      if (dragPosition.y > dropAreaDimensions.getHeight || dragPosition.y < 0 || dragPosition.x > dropAreaDimensions.getWidth || dragPosition.x < 0)
        return oldIndex;
      return this.y * cols + this.x;
    },
    getColIndex: function getColIndex() {
      const items = root2.query("GET_ACTIVE_ITEMS");
      const visibleChildren = root2.childViews.filter((child) => child.rect.element.height);
      const children = items.map(
        (item3) => visibleChildren.find((childView) => childView.id === item3.id)
      );
      const currentIndex2 = children.findIndex((child) => child === view);
      const dragHeight2 = getItemHeight(view);
      const l = children.length;
      let idx = l;
      let childHeight = 0;
      let childBottom = 0;
      let childTop = 0;
      for (let i = 0; i < l; i++) {
        childHeight = getItemHeight(children[i]);
        childTop = childBottom;
        childBottom = childTop + childHeight;
        if (dragPosition.y < childBottom) {
          if (currentIndex2 > i) {
            if (dragPosition.y < childTop + dragHeight2) {
              idx = i;
              break;
            }
            continue;
          }
          idx = i;
          break;
        }
      }
      return idx;
    }
  };
  const index = cols > 1 ? location2.getGridIndex() : location2.getColIndex();
  root2.dispatch("MOVE_ITEM", { query: view, index });
  const currentIndex = dragState.getIndex();
  if (currentIndex === void 0 || currentIndex !== index) {
    dragState.setIndex(index);
    if (currentIndex === void 0) return;
    root2.dispatch("DID_REORDER_ITEMS", {
      items: root2.query("GET_ACTIVE_ITEMS"),
      origin: oldIndex,
      target: index
    });
  }
};
const route$2 = createRoute({
  DID_ADD_ITEM: addItemView,
  DID_REMOVE_ITEM: removeItemView,
  DID_DRAG_ITEM: dragItem
});
const write$5 = ({ root: root2, props, actions: actions2, shouldOptimize }) => {
  route$2({ root: root2, props, actions: actions2 });
  const { dragCoordinates } = props;
  const horizontalSpace = root2.rect.element.width;
  const visibleChildren = root2.childViews.filter((child) => child.rect.element.height);
  const children = root2.query("GET_ACTIVE_ITEMS").map((item2) => visibleChildren.find((child) => child.id === item2.id)).filter((item2) => item2);
  const dragIndex = dragCoordinates ? getItemIndexByPosition(root2, children, dragCoordinates) : null;
  const addIndex = root2.ref.addIndex || null;
  root2.ref.addIndex = null;
  let dragIndexOffset = 0;
  let removeIndexOffset = 0;
  let addIndexOffset = 0;
  if (children.length === 0) return;
  const childRect = children[0].rect.element;
  const itemVerticalMargin = childRect.marginTop + childRect.marginBottom;
  const itemHorizontalMargin = childRect.marginLeft + childRect.marginRight;
  const itemWidth = childRect.width + itemHorizontalMargin;
  const itemHeight = childRect.height + itemVerticalMargin;
  const itemsPerRow = getItemsPerRow(horizontalSpace, itemWidth);
  if (itemsPerRow === 1) {
    let offsetY = 0;
    let dragOffset = 0;
    children.forEach((child, index) => {
      if (dragIndex) {
        let dist = index - dragIndex;
        if (dist === -2) {
          dragOffset = -itemVerticalMargin * 0.25;
        } else if (dist === -1) {
          dragOffset = -itemVerticalMargin * 0.75;
        } else if (dist === 0) {
          dragOffset = itemVerticalMargin * 0.75;
        } else if (dist === 1) {
          dragOffset = itemVerticalMargin * 0.25;
        } else {
          dragOffset = 0;
        }
      }
      if (shouldOptimize) {
        child.translateX = null;
        child.translateY = null;
      }
      if (!child.markedForRemoval) {
        moveItem(child, 0, offsetY + dragOffset);
      }
      let itemHeight2 = child.rect.element.height + itemVerticalMargin;
      let visualHeight = itemHeight2 * (child.markedForRemoval ? child.opacity : 1);
      offsetY += visualHeight;
    });
  } else {
    let prevX = 0;
    let prevY = 0;
    children.forEach((child, index) => {
      if (index === dragIndex) {
        dragIndexOffset = 1;
      }
      if (index === addIndex) {
        addIndexOffset += 1;
      }
      if (child.markedForRemoval && child.opacity < 0.5) {
        removeIndexOffset -= 1;
      }
      const visualIndex = index + addIndexOffset + dragIndexOffset + removeIndexOffset;
      const indexX = visualIndex % itemsPerRow;
      const indexY = Math.floor(visualIndex / itemsPerRow);
      const offsetX = indexX * itemWidth;
      const offsetY = indexY * itemHeight;
      const vectorX = Math.sign(offsetX - prevX);
      const vectorY = Math.sign(offsetY - prevY);
      prevX = offsetX;
      prevY = offsetY;
      if (child.markedForRemoval) return;
      if (shouldOptimize) {
        child.translateX = null;
        child.translateY = null;
      }
      moveItem(child, offsetX, offsetY, vectorX, vectorY);
    });
  }
};
const filterSetItemActions = (child, actions2) => actions2.filter((action) => {
  if (action.data && action.data.id) {
    return child.id === action.data.id;
  }
  return true;
});
const list = createView({
  create: create$8,
  write: write$5,
  tag: "ul",
  name: "list",
  didWriteView: ({ root: root2 }) => {
    root2.childViews.filter((view) => view.markedForRemoval && view.opacity === 0 && view.resting).forEach((view) => {
      view._destroy();
      root2.removeChildView(view);
    });
  },
  filterFrameActionsForChild: filterSetItemActions,
  mixins: {
    apis: ["dragCoordinates"]
  }
});
const create$9 = ({ root: root2, props }) => {
  root2.ref.list = root2.appendChildView(root2.createChildView(list));
  props.dragCoordinates = null;
  props.overflowing = false;
};
const storeDragCoordinates = ({ root: root2, props, action }) => {
  if (!root2.query("GET_ITEM_INSERT_LOCATION_FREEDOM")) return;
  props.dragCoordinates = {
    left: action.position.scopeLeft - root2.ref.list.rect.element.left,
    top: action.position.scopeTop - (root2.rect.outer.top + root2.rect.element.marginTop + root2.rect.element.scrollTop)
  };
};
const clearDragCoordinates = ({ props }) => {
  props.dragCoordinates = null;
};
const route$3 = createRoute({
  DID_DRAG: storeDragCoordinates,
  DID_END_DRAG: clearDragCoordinates
});
const write$6 = ({ root: root2, props, actions: actions2 }) => {
  route$3({ root: root2, props, actions: actions2 });
  root2.ref.list.dragCoordinates = props.dragCoordinates;
  if (props.overflowing && !props.overflow) {
    props.overflowing = false;
    root2.element.dataset.state = "";
    root2.height = null;
  }
  if (props.overflow) {
    const newHeight = Math.round(props.overflow);
    if (newHeight !== root2.height) {
      props.overflowing = true;
      root2.element.dataset.state = "overflow";
      root2.height = newHeight;
    }
  }
};
const listScroller = createView({
  create: create$9,
  write: write$6,
  name: "list-scroller",
  mixins: {
    apis: ["overflow", "dragCoordinates"],
    styles: ["height", "translateY"],
    animations: {
      translateY: "spring"
    }
  }
});
const attrToggle = (element, name2, state2, enabledValue = "") => {
  if (state2) {
    attr(element, name2, enabledValue);
  } else {
    element.removeAttribute(name2);
  }
};
const resetFileInput = (input) => {
  if (!input || input.value === "") {
    return;
  }
  try {
    input.value = "";
  } catch (err) {
  }
  if (input.value) {
    const form = createElement$1("form");
    const parentNode = input.parentNode;
    const ref = input.nextSibling;
    form.appendChild(input);
    form.reset();
    if (ref) {
      parentNode.insertBefore(input, ref);
    } else {
      parentNode.appendChild(input);
    }
  }
};
const create$a = ({ root: root2, props }) => {
  root2.element.id = `filepond--browser-${props.id}`;
  attr(root2.element, "name", root2.query("GET_NAME"));
  attr(root2.element, "aria-controls", `filepond--assistant-${props.id}`);
  attr(root2.element, "aria-labelledby", `filepond--drop-label-${props.id}`);
  setAcceptedFileTypes({ root: root2, action: { value: root2.query("GET_ACCEPTED_FILE_TYPES") } });
  toggleAllowMultiple({ root: root2, action: { value: root2.query("GET_ALLOW_MULTIPLE") } });
  toggleDirectoryFilter({ root: root2, action: { value: root2.query("GET_ALLOW_DIRECTORIES_ONLY") } });
  toggleDisabled({ root: root2 });
  toggleRequired({ root: root2, action: { value: root2.query("GET_REQUIRED") } });
  setCaptureMethod({ root: root2, action: { value: root2.query("GET_CAPTURE_METHOD") } });
  root2.ref.handleChange = (e) => {
    if (!root2.element.value) {
      return;
    }
    const files = Array.from(root2.element.files).map((file2) => {
      file2._relativePath = file2.webkitRelativePath;
      return file2;
    });
    setTimeout(() => {
      props.onload(files);
      resetFileInput(root2.element);
    }, 250);
  };
  root2.element.addEventListener("change", root2.ref.handleChange);
};
const setAcceptedFileTypes = ({ root: root2, action }) => {
  if (!root2.query("GET_ALLOW_SYNC_ACCEPT_ATTRIBUTE")) return;
  attrToggle(root2.element, "accept", !!action.value, action.value ? action.value.join(",") : "");
};
const toggleAllowMultiple = ({ root: root2, action }) => {
  attrToggle(root2.element, "multiple", action.value);
};
const toggleDirectoryFilter = ({ root: root2, action }) => {
  attrToggle(root2.element, "webkitdirectory", action.value);
};
const toggleDisabled = ({ root: root2 }) => {
  const isDisabled = root2.query("GET_DISABLED");
  const doesAllowBrowse = root2.query("GET_ALLOW_BROWSE");
  const disableField = isDisabled || !doesAllowBrowse;
  attrToggle(root2.element, "disabled", disableField);
};
const toggleRequired = ({ root: root2, action }) => {
  if (!action.value) {
    attrToggle(root2.element, "required", false);
  } else if (root2.query("GET_TOTAL_ITEMS") === 0) {
    attrToggle(root2.element, "required", true);
  }
};
const setCaptureMethod = ({ root: root2, action }) => {
  attrToggle(root2.element, "capture", !!action.value, action.value === true ? "" : action.value);
};
const updateRequiredStatus = ({ root: root2 }) => {
  const { element } = root2;
  if (root2.query("GET_TOTAL_ITEMS") > 0) {
    attrToggle(element, "required", false);
    attrToggle(element, "name", false);
    const activeItems = root2.query("GET_ACTIVE_ITEMS");
    let hasInvalidField = false;
    for (let i = 0; i < activeItems.length; i++) {
      if (activeItems[i].status === ItemStatus.LOAD_ERROR) {
        hasInvalidField = true;
      }
    }
    root2.element.setCustomValidity(
      hasInvalidField ? root2.query("GET_LABEL_INVALID_FIELD") : ""
    );
  } else {
    attrToggle(element, "name", true, root2.query("GET_NAME"));
    const shouldCheckValidity = root2.query("GET_CHECK_VALIDITY");
    if (shouldCheckValidity) {
      element.setCustomValidity("");
    }
    if (root2.query("GET_REQUIRED")) {
      attrToggle(element, "required", true);
    }
  }
};
const updateFieldValidityStatus = ({ root: root2 }) => {
  const shouldCheckValidity = root2.query("GET_CHECK_VALIDITY");
  if (!shouldCheckValidity) return;
  root2.element.setCustomValidity(root2.query("GET_LABEL_INVALID_FIELD"));
};
const browser = createView({
  tag: "input",
  name: "browser",
  ignoreRect: true,
  ignoreRectUpdate: true,
  attributes: {
    type: "file"
  },
  create: create$a,
  destroy: ({ root: root2 }) => {
    root2.element.removeEventListener("change", root2.ref.handleChange);
  },
  write: createRoute({
    DID_LOAD_ITEM: updateRequiredStatus,
    DID_REMOVE_ITEM: updateRequiredStatus,
    DID_THROW_ITEM_INVALID: updateFieldValidityStatus,
    DID_SET_DISABLED: toggleDisabled,
    DID_SET_ALLOW_BROWSE: toggleDisabled,
    DID_SET_ALLOW_DIRECTORIES_ONLY: toggleDirectoryFilter,
    DID_SET_ALLOW_MULTIPLE: toggleAllowMultiple,
    DID_SET_ACCEPTED_FILE_TYPES: setAcceptedFileTypes,
    DID_SET_CAPTURE_METHOD: setCaptureMethod,
    DID_SET_REQUIRED: toggleRequired
  })
});
const Key = {
  ENTER: 13,
  SPACE: 32
};
const create$b = ({ root: root2, props }) => {
  const label = createElement$1("label");
  attr(label, "for", `filepond--browser-${props.id}`);
  attr(label, "id", `filepond--drop-label-${props.id}`);
  root2.ref.handleKeyDown = (e) => {
    const isActivationKey = e.keyCode === Key.ENTER || e.keyCode === Key.SPACE;
    if (!isActivationKey) return;
    e.preventDefault();
    root2.ref.label.click();
  };
  root2.ref.handleClick = (e) => {
    const isLabelClick = e.target === label || label.contains(e.target);
    if (isLabelClick) return;
    root2.ref.label.click();
  };
  label.addEventListener("keydown", root2.ref.handleKeyDown);
  root2.element.addEventListener("click", root2.ref.handleClick);
  updateLabelValue(label, props.caption);
  root2.appendChild(label);
  root2.ref.label = label;
};
const updateLabelValue = (label, value) => {
  label.innerHTML = value;
  const clickable = label.querySelector(".filepond--label-action");
  if (clickable) {
    attr(clickable, "tabindex", "0");
  }
  return value;
};
const dropLabel = createView({
  name: "drop-label",
  ignoreRect: true,
  create: create$b,
  destroy: ({ root: root2 }) => {
    root2.ref.label.addEventListener("keydown", root2.ref.handleKeyDown);
    root2.element.removeEventListener("click", root2.ref.handleClick);
  },
  write: createRoute({
    DID_SET_LABEL_IDLE: ({ root: root2, action }) => {
      updateLabelValue(root2.ref.label, action.value);
    }
  }),
  mixins: {
    styles: ["opacity", "translateX", "translateY"],
    animations: {
      opacity: { type: "tween", duration: 150 },
      translateX: "spring",
      translateY: "spring"
    }
  }
});
const blob = createView({
  name: "drip-blob",
  ignoreRect: true,
  mixins: {
    styles: ["translateX", "translateY", "scaleX", "scaleY", "opacity"],
    animations: {
      scaleX: "spring",
      scaleY: "spring",
      translateX: "spring",
      translateY: "spring",
      opacity: { type: "tween", duration: 250 }
    }
  }
});
const addBlob = ({ root: root2 }) => {
  const centerX = root2.rect.element.width * 0.5;
  const centerY = root2.rect.element.height * 0.5;
  root2.ref.blob = root2.appendChildView(
    root2.createChildView(blob, {
      opacity: 0,
      scaleX: 2.5,
      scaleY: 2.5,
      translateX: centerX,
      translateY: centerY
    })
  );
};
const moveBlob = ({ root: root2, action }) => {
  if (!root2.ref.blob) {
    addBlob({ root: root2 });
    return;
  }
  root2.ref.blob.translateX = action.position.scopeLeft;
  root2.ref.blob.translateY = action.position.scopeTop;
  root2.ref.blob.scaleX = 1;
  root2.ref.blob.scaleY = 1;
  root2.ref.blob.opacity = 1;
};
const hideBlob = ({ root: root2 }) => {
  if (!root2.ref.blob) {
    return;
  }
  root2.ref.blob.opacity = 0;
};
const explodeBlob = ({ root: root2 }) => {
  if (!root2.ref.blob) {
    return;
  }
  root2.ref.blob.scaleX = 2.5;
  root2.ref.blob.scaleY = 2.5;
  root2.ref.blob.opacity = 0;
};
const write$7 = ({ root: root2, props, actions: actions2 }) => {
  route$4({ root: root2, props, actions: actions2 });
  const { blob: blob2 } = root2.ref;
  if (actions2.length === 0 && blob2 && blob2.opacity === 0) {
    root2.removeChildView(blob2);
    root2.ref.blob = null;
  }
};
const route$4 = createRoute({
  DID_DRAG: moveBlob,
  DID_DROP: explodeBlob,
  DID_END_DRAG: hideBlob
});
const drip = createView({
  ignoreRect: true,
  ignoreRectUpdate: true,
  name: "drip",
  write: write$7
});
const setInputFiles = (element, files) => {
  try {
    const dataTransfer = new DataTransfer();
    files.forEach((file2) => {
      if (file2 instanceof File) {
        dataTransfer.items.add(file2);
      } else {
        dataTransfer.items.add(
          new File([file2], file2.name, {
            type: file2.type
          })
        );
      }
    });
    element.files = dataTransfer.files;
  } catch (err) {
    return false;
  }
  return true;
};
const create$c = ({ root: root2 }) => {
  root2.ref.fields = {};
  const legend = document.createElement("legend");
  legend.textContent = "Files";
  root2.element.appendChild(legend);
};
const getField = (root2, id) => root2.ref.fields[id];
const syncFieldPositionsWithItems = (root2) => {
  root2.query("GET_ACTIVE_ITEMS").forEach((item2) => {
    if (!root2.ref.fields[item2.id]) return;
    root2.element.appendChild(root2.ref.fields[item2.id]);
  });
};
const didReorderItems = ({ root: root2 }) => syncFieldPositionsWithItems(root2);
const didAddItem = ({ root: root2, action }) => {
  const fileItem = root2.query("GET_ITEM", action.id);
  const isLocalFile = fileItem.origin === FileOrigin.LOCAL;
  const shouldUseFileInput = !isLocalFile && root2.query("SHOULD_UPDATE_FILE_INPUT");
  const dataContainer = createElement$1("input");
  dataContainer.type = shouldUseFileInput ? "file" : "hidden";
  dataContainer.name = root2.query("GET_NAME");
  root2.ref.fields[action.id] = dataContainer;
  syncFieldPositionsWithItems(root2);
};
const didLoadItem$1 = ({ root: root2, action }) => {
  const field = getField(root2, action.id);
  if (!field) return;
  if (action.serverFileReference !== null) field.value = action.serverFileReference;
  if (!root2.query("SHOULD_UPDATE_FILE_INPUT")) return;
  const fileItem = root2.query("GET_ITEM", action.id);
  setInputFiles(field, [fileItem.file]);
};
const didPrepareOutput = ({ root: root2, action }) => {
  if (!root2.query("SHOULD_UPDATE_FILE_INPUT")) return;
  setTimeout(() => {
    const field = getField(root2, action.id);
    if (!field) return;
    setInputFiles(field, [action.file]);
  }, 0);
};
const didSetDisabled = ({ root: root2 }) => {
  root2.element.disabled = root2.query("GET_DISABLED");
};
const didRemoveItem = ({ root: root2, action }) => {
  const field = getField(root2, action.id);
  if (!field) return;
  if (field.parentNode) field.parentNode.removeChild(field);
  delete root2.ref.fields[action.id];
};
const didDefineValue = ({ root: root2, action }) => {
  const field = getField(root2, action.id);
  if (!field) return;
  if (action.value === null) {
    field.removeAttribute("value");
  } else {
    if (field.type != "file") {
      field.value = action.value;
    }
  }
  syncFieldPositionsWithItems(root2);
};
const write$8 = createRoute({
  DID_SET_DISABLED: didSetDisabled,
  DID_ADD_ITEM: didAddItem,
  DID_LOAD_ITEM: didLoadItem$1,
  DID_REMOVE_ITEM: didRemoveItem,
  DID_DEFINE_VALUE: didDefineValue,
  DID_PREPARE_OUTPUT: didPrepareOutput,
  DID_REORDER_ITEMS: didReorderItems,
  DID_SORT_ITEMS: didReorderItems
});
const data = createView({
  tag: "fieldset",
  name: "data",
  create: create$c,
  write: write$8,
  ignoreRect: true
});
const getRootNode = (element) => "getRootNode" in element ? element.getRootNode() : document;
const images = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg", "tiff"];
const text$1 = ["css", "csv", "html", "txt"];
const map = {
  zip: "zip|compressed",
  epub: "application/epub+zip"
};
const guesstimateMimeType = (extension = "") => {
  extension = extension.toLowerCase();
  if (images.includes(extension)) {
    return "image/" + (extension === "jpg" ? "jpeg" : extension === "svg" ? "svg+xml" : extension);
  }
  if (text$1.includes(extension)) {
    return "text/" + extension;
  }
  return map[extension] || "";
};
const requestDataTransferItems = (dataTransfer) => new Promise((resolve, reject) => {
  const links = getLinks(dataTransfer);
  if (links.length && !hasFiles(dataTransfer)) {
    return resolve(links);
  }
  getFiles(dataTransfer).then(resolve);
});
const hasFiles = (dataTransfer) => {
  if (dataTransfer.files) return dataTransfer.files.length > 0;
  return false;
};
const getFiles = (dataTransfer) => new Promise((resolve, reject) => {
  const promisedFiles = (dataTransfer.items ? Array.from(dataTransfer.items) : []).filter((item2) => isFileSystemItem(item2)).map((item2) => getFilesFromItem(item2));
  if (!promisedFiles.length) {
    resolve(dataTransfer.files ? Array.from(dataTransfer.files) : []);
    return;
  }
  Promise.all(promisedFiles).then((returnedFileGroups) => {
    const files = [];
    returnedFileGroups.forEach((group) => {
      files.push.apply(files, group);
    });
    resolve(
      files.filter((file2) => file2).map((file2) => {
        if (!file2._relativePath) file2._relativePath = file2.webkitRelativePath;
        return file2;
      })
    );
  }).catch(console.error);
});
const isFileSystemItem = (item2) => {
  if (isEntry(item2)) {
    const entry = getAsEntry(item2);
    if (entry) {
      return entry.isFile || entry.isDirectory;
    }
  }
  return item2.kind === "file";
};
const getFilesFromItem = (item2) => new Promise((resolve, reject) => {
  if (isDirectoryEntry(item2)) {
    getFilesInDirectory(getAsEntry(item2)).then(resolve).catch(reject);
    return;
  }
  resolve([item2.getAsFile()]);
});
const getFilesInDirectory = (entry) => new Promise((resolve, reject) => {
  const files = [];
  let dirCounter = 0;
  let fileCounter = 0;
  const resolveIfDone = () => {
    if (fileCounter === 0 && dirCounter === 0) {
      resolve(files);
    }
  };
  const readEntries = (dirEntry) => {
    dirCounter++;
    const directoryReader = dirEntry.createReader();
    const readBatch = () => {
      directoryReader.readEntries((entries) => {
        if (entries.length === 0) {
          dirCounter--;
          resolveIfDone();
          return;
        }
        entries.forEach((entry2) => {
          if (entry2.isDirectory) {
            readEntries(entry2);
          } else {
            fileCounter++;
            entry2.file((file2) => {
              const correctedFile = correctMissingFileType(file2);
              if (entry2.fullPath) correctedFile._relativePath = entry2.fullPath;
              files.push(correctedFile);
              fileCounter--;
              resolveIfDone();
            });
          }
        });
        readBatch();
      }, reject);
    };
    readBatch();
  };
  readEntries(entry);
});
const correctMissingFileType = (file2) => {
  if (file2.type.length) return file2;
  const date = file2.lastModifiedDate;
  const name2 = file2.name;
  const type = guesstimateMimeType(getExtensionFromFilename(file2.name));
  if (!type.length) return file2;
  file2 = file2.slice(0, file2.size, type);
  file2.name = name2;
  file2.lastModifiedDate = date;
  return file2;
};
const isDirectoryEntry = (item2) => isEntry(item2) && (getAsEntry(item2) || {}).isDirectory;
const isEntry = (item2) => "webkitGetAsEntry" in item2;
const getAsEntry = (item2) => item2.webkitGetAsEntry();
const getLinks = (dataTransfer) => {
  let links = [];
  try {
    links = getLinksFromTransferMetaData(dataTransfer);
    if (links.length) {
      return links;
    }
    links = getLinksFromTransferURLData(dataTransfer);
  } catch (e) {
  }
  return links;
};
const getLinksFromTransferURLData = (dataTransfer) => {
  let data2 = dataTransfer.getData("url");
  if (typeof data2 === "string" && data2.length) {
    return [data2];
  }
  return [];
};
const getLinksFromTransferMetaData = (dataTransfer) => {
  let data2 = dataTransfer.getData("text/html");
  if (typeof data2 === "string" && data2.length) {
    const matches = data2.match(/src\s*=\s*"(.+?)"/);
    if (matches) {
      return [matches[1]];
    }
  }
  return [];
};
const dragNDropObservers = [];
const eventPosition = (e) => ({
  pageLeft: e.pageX,
  pageTop: e.pageY,
  scopeLeft: e.offsetX || e.layerX,
  scopeTop: e.offsetY || e.layerY
});
const createDragNDropClient = (element, scopeToObserve, filterElement) => {
  const observer = getDragNDropObserver(scopeToObserve);
  const client = {
    element,
    filterElement,
    state: null,
    ondrop: () => {
    },
    onenter: () => {
    },
    ondrag: () => {
    },
    onexit: () => {
    },
    onload: () => {
    },
    allowdrop: () => {
    }
  };
  client.destroy = observer.addListener(client);
  return client;
};
const getDragNDropObserver = (element) => {
  const observer = dragNDropObservers.find((item2) => item2.element === element);
  if (observer) {
    return observer;
  }
  const newObserver = createDragNDropObserver(element);
  dragNDropObservers.push(newObserver);
  return newObserver;
};
const createDragNDropObserver = (element) => {
  const clients = [];
  const routes = {
    dragenter,
    dragover,
    dragleave,
    drop
  };
  const handlers = {};
  forin(routes, (event, createHandler) => {
    handlers[event] = createHandler(element, clients);
    element.addEventListener(event, handlers[event], false);
  });
  const observer = {
    element,
    addListener: (client) => {
      clients.push(client);
      return () => {
        clients.splice(clients.indexOf(client), 1);
        if (clients.length === 0) {
          dragNDropObservers.splice(dragNDropObservers.indexOf(observer), 1);
          forin(routes, (event) => {
            element.removeEventListener(event, handlers[event], false);
          });
        }
      };
    }
  };
  return observer;
};
const elementFromPoint = (root2, point) => {
  if (!("elementFromPoint" in root2)) {
    root2 = document;
  }
  return root2.elementFromPoint(point.x, point.y);
};
const isEventTarget = (e, target) => {
  const root2 = getRootNode(target);
  const elementAtPosition = elementFromPoint(root2, {
    x: e.pageX - window.pageXOffset,
    y: e.pageY - window.pageYOffset
  });
  return elementAtPosition === target || target.contains(elementAtPosition);
};
let initialTarget = null;
const setDropEffect = (dataTransfer, effect) => {
  try {
    dataTransfer.dropEffect = effect;
  } catch (e) {
  }
};
const dragenter = (root2, clients) => (e) => {
  e.preventDefault();
  initialTarget = e.target;
  clients.forEach((client) => {
    const { element, onenter } = client;
    if (isEventTarget(e, element)) {
      client.state = "enter";
      onenter(eventPosition(e));
    }
  });
};
const dragover = (root2, clients) => (e) => {
  e.preventDefault();
  const dataTransfer = e.dataTransfer;
  requestDataTransferItems(dataTransfer).then((items) => {
    let overDropTarget = false;
    clients.some((client) => {
      const { filterElement, element, onenter, onexit, ondrag, allowdrop } = client;
      setDropEffect(dataTransfer, "copy");
      const allowsTransfer = allowdrop(items);
      if (!allowsTransfer) {
        setDropEffect(dataTransfer, "none");
        return;
      }
      if (isEventTarget(e, element)) {
        overDropTarget = true;
        if (client.state === null) {
          client.state = "enter";
          onenter(eventPosition(e));
          return;
        }
        client.state = "over";
        if (filterElement && !allowsTransfer) {
          setDropEffect(dataTransfer, "none");
          return;
        }
        ondrag(eventPosition(e));
      } else {
        if (filterElement && !overDropTarget) {
          setDropEffect(dataTransfer, "none");
        }
        if (client.state) {
          client.state = null;
          onexit(eventPosition(e));
        }
      }
    });
  });
};
const drop = (root2, clients) => (e) => {
  e.preventDefault();
  const dataTransfer = e.dataTransfer;
  requestDataTransferItems(dataTransfer).then((items) => {
    clients.forEach((client) => {
      const { filterElement, element, ondrop, onexit, allowdrop } = client;
      client.state = null;
      if (filterElement && !isEventTarget(e, element)) return;
      if (!allowdrop(items)) return onexit(eventPosition(e));
      ondrop(eventPosition(e), items);
    });
  });
};
const dragleave = (root2, clients) => (e) => {
  if (initialTarget !== e.target) {
    return;
  }
  clients.forEach((client) => {
    const { onexit } = client;
    client.state = null;
    onexit(eventPosition(e));
  });
};
const createHopper = (scope, validateItems, options) => {
  scope.classList.add("filepond--hopper");
  const { catchesDropsOnPage, requiresDropOnElement, filterItems = (items) => items } = options;
  const client = createDragNDropClient(
    scope,
    catchesDropsOnPage ? document.documentElement : scope,
    requiresDropOnElement
  );
  let lastState = "";
  let currentState = "";
  client.allowdrop = (items) => {
    return validateItems(filterItems(items));
  };
  client.ondrop = (position, items) => {
    const filteredItems = filterItems(items);
    if (!validateItems(filteredItems)) {
      api.ondragend(position);
      return;
    }
    currentState = "drag-drop";
    api.onload(filteredItems, position);
  };
  client.ondrag = (position) => {
    api.ondrag(position);
  };
  client.onenter = (position) => {
    currentState = "drag-over";
    api.ondragstart(position);
  };
  client.onexit = (position) => {
    currentState = "drag-exit";
    api.ondragend(position);
  };
  const api = {
    updateHopperState: () => {
      if (lastState !== currentState) {
        scope.dataset.hopperState = currentState;
        lastState = currentState;
      }
    },
    onload: () => {
    },
    ondragstart: () => {
    },
    ondrag: () => {
    },
    ondragend: () => {
    },
    destroy: () => {
      client.destroy();
    }
  };
  return api;
};
let listening = false;
const listeners$1 = [];
const handlePaste = (e) => {
  const activeEl = document.activeElement;
  const isActiveElementEditable = activeEl && (/textarea|input/i.test(activeEl.nodeName) || activeEl.getAttribute("contenteditable") === "true" || activeEl.getAttribute("contenteditable") === "");
  if (isActiveElementEditable) {
    let inScope = false;
    let element = activeEl;
    while (element !== document.body) {
      if (element.classList.contains("filepond--root")) {
        inScope = true;
        break;
      }
      element = element.parentNode;
    }
    if (!inScope) return;
  }
  requestDataTransferItems(e.clipboardData).then((files) => {
    if (!files.length) {
      return;
    }
    listeners$1.forEach((listener) => listener(files));
  });
};
const listen = (cb) => {
  if (listeners$1.includes(cb)) {
    return;
  }
  listeners$1.push(cb);
  if (listening) {
    return;
  }
  listening = true;
  document.addEventListener("paste", handlePaste);
};
const unlisten = (listener) => {
  arrayRemove(listeners$1, listeners$1.indexOf(listener));
  if (listeners$1.length === 0) {
    document.removeEventListener("paste", handlePaste);
    listening = false;
  }
};
const createPaster = () => {
  const cb = (files) => {
    api.onload(files);
  };
  const api = {
    destroy: () => {
      unlisten(cb);
    },
    onload: () => {
    }
  };
  listen(cb);
  return api;
};
const create$d = ({ root: root2, props }) => {
  root2.element.id = `filepond--assistant-${props.id}`;
  attr(root2.element, "role", "alert");
  attr(root2.element, "aria-live", "polite");
  attr(root2.element, "aria-relevant", "additions");
};
let addFilesNotificationTimeout = null;
let notificationClearTimeout = null;
const filenames = [];
const assist = (root2, message) => {
  root2.element.textContent = message;
};
const clear$1 = (root2) => {
  root2.element.textContent = "";
};
const listModified = (root2, filename, label) => {
  const total = root2.query("GET_TOTAL_ITEMS");
  assist(
    root2,
    `${label} ${filename}, ${total} ${total === 1 ? root2.query("GET_LABEL_FILE_COUNT_SINGULAR") : root2.query("GET_LABEL_FILE_COUNT_PLURAL")}`
  );
  clearTimeout(notificationClearTimeout);
  notificationClearTimeout = setTimeout(() => {
    clear$1(root2);
  }, 1500);
};
const isUsingFilePond = (root2) => root2.element.parentNode.contains(document.activeElement);
const itemAdded = ({ root: root2, action }) => {
  if (!isUsingFilePond(root2)) {
    return;
  }
  root2.element.textContent = "";
  const item2 = root2.query("GET_ITEM", action.id);
  filenames.push(item2.filename);
  clearTimeout(addFilesNotificationTimeout);
  addFilesNotificationTimeout = setTimeout(() => {
    listModified(root2, filenames.join(", "), root2.query("GET_LABEL_FILE_ADDED"));
    filenames.length = 0;
  }, 750);
};
const itemRemoved = ({ root: root2, action }) => {
  if (!isUsingFilePond(root2)) {
    return;
  }
  const item2 = action.item;
  listModified(root2, item2.filename, root2.query("GET_LABEL_FILE_REMOVED"));
};
const itemProcessed = ({ root: root2, action }) => {
  const item2 = root2.query("GET_ITEM", action.id);
  const filename = item2.filename;
  const label = root2.query("GET_LABEL_FILE_PROCESSING_COMPLETE");
  assist(root2, `${filename} ${label}`);
};
const itemProcessedUndo = ({ root: root2, action }) => {
  const item2 = root2.query("GET_ITEM", action.id);
  const filename = item2.filename;
  const label = root2.query("GET_LABEL_FILE_PROCESSING_ABORTED");
  assist(root2, `${filename} ${label}`);
};
const itemError = ({ root: root2, action }) => {
  const item2 = root2.query("GET_ITEM", action.id);
  const filename = item2.filename;
  assist(root2, `${action.status.main} ${filename} ${action.status.sub}`);
};
const assistant = createView({
  create: create$d,
  ignoreRect: true,
  ignoreRectUpdate: true,
  write: createRoute({
    DID_LOAD_ITEM: itemAdded,
    DID_REMOVE_ITEM: itemRemoved,
    DID_COMPLETE_ITEM_PROCESSING: itemProcessed,
    DID_ABORT_ITEM_PROCESSING: itemProcessedUndo,
    DID_REVERT_ITEM_PROCESSING: itemProcessedUndo,
    DID_THROW_ITEM_REMOVE_ERROR: itemError,
    DID_THROW_ITEM_LOAD_ERROR: itemError,
    DID_THROW_ITEM_INVALID: itemError,
    DID_THROW_ITEM_PROCESSING_ERROR: itemError
  }),
  tag: "span",
  name: "assistant"
});
const toCamels = (string, separator = "-") => string.replace(new RegExp(`${separator}.`, "g"), (sub) => sub.charAt(1).toUpperCase());
const debounce = (func, interval = 16, immidiateOnly = true) => {
  let last = Date.now();
  let timeout = null;
  return (...args) => {
    clearTimeout(timeout);
    const dist = Date.now() - last;
    const fn2 = () => {
      last = Date.now();
      func(...args);
    };
    if (dist < interval) {
      if (!immidiateOnly) {
        timeout = setTimeout(fn2, interval - dist);
      }
    } else {
      fn2();
    }
  };
};
const MAX_FILES_LIMIT = 1e6;
const prevent = (e) => e.preventDefault();
const create$e = ({ root: root2, props }) => {
  const id = root2.query("GET_ID");
  if (id) {
    root2.element.id = id;
  }
  const className = root2.query("GET_CLASS_NAME");
  if (className) {
    className.split(" ").filter((name2) => name2.length).forEach((name2) => {
      root2.element.classList.add(name2);
    });
  }
  root2.ref.label = root2.appendChildView(
    root2.createChildView(dropLabel, {
      ...props,
      translateY: null,
      caption: root2.query("GET_LABEL_IDLE")
    })
  );
  root2.ref.list = root2.appendChildView(root2.createChildView(listScroller, { translateY: null }));
  root2.ref.panel = root2.appendChildView(root2.createChildView(panel, { name: "panel-root" }));
  root2.ref.assistant = root2.appendChildView(root2.createChildView(assistant, { ...props }));
  root2.ref.data = root2.appendChildView(root2.createChildView(data, { ...props }));
  root2.ref.measure = createElement$1("div");
  root2.ref.measure.style.height = "100%";
  root2.element.appendChild(root2.ref.measure);
  root2.ref.bounds = null;
  root2.query("GET_STYLES").filter((style) => !isEmpty(style.value)).map(({ name: name2, value }) => {
    root2.element.dataset[name2] = value;
  });
  root2.ref.widthPrevious = null;
  root2.ref.widthUpdated = debounce(() => {
    root2.ref.updateHistory = [];
    root2.dispatch("DID_RESIZE_ROOT");
  }, 250);
  root2.ref.previousAspectRatio = null;
  root2.ref.updateHistory = [];
  const canHover = window.matchMedia("(pointer: fine) and (hover: hover)").matches;
  const hasPointerEvents = "PointerEvent" in window;
  if (root2.query("GET_ALLOW_REORDER") && hasPointerEvents && !canHover) {
    root2.element.addEventListener("touchmove", prevent, { passive: false });
    root2.element.addEventListener("gesturestart", prevent);
  }
  const credits = root2.query("GET_CREDITS");
  const hasCredits = credits.length === 2;
  if (hasCredits) {
    const frag = document.createElement("a");
    frag.className = "filepond--credits";
    frag.href = credits[0];
    frag.tabIndex = -1;
    frag.target = "_blank";
    frag.rel = "noopener noreferrer nofollow";
    frag.textContent = credits[1];
    root2.element.appendChild(frag);
    root2.ref.credits = frag;
  }
};
const write$9 = ({ root: root2, props, actions: actions2 }) => {
  route$5({ root: root2, props, actions: actions2 });
  actions2.filter((action) => /^DID_SET_STYLE_/.test(action.type)).filter((action) => !isEmpty(action.data.value)).map(({ type, data: data2 }) => {
    const name2 = toCamels(type.substring(8).toLowerCase(), "_");
    root2.element.dataset[name2] = data2.value;
    root2.invalidateLayout();
  });
  if (root2.rect.element.hidden) return;
  if (root2.rect.element.width !== root2.ref.widthPrevious) {
    root2.ref.widthPrevious = root2.rect.element.width;
    root2.ref.widthUpdated();
  }
  let bounds = root2.ref.bounds;
  if (!bounds) {
    bounds = root2.ref.bounds = calculateRootBoundingBoxHeight(root2);
    root2.element.removeChild(root2.ref.measure);
    root2.ref.measure = null;
  }
  const { hopper, label, list: list2, panel: panel2 } = root2.ref;
  if (hopper) {
    hopper.updateHopperState();
  }
  const aspectRatio = root2.query("GET_PANEL_ASPECT_RATIO");
  const isMultiItem = root2.query("GET_ALLOW_MULTIPLE");
  const totalItems = root2.query("GET_TOTAL_ITEMS");
  const maxItems = isMultiItem ? root2.query("GET_MAX_FILES") || MAX_FILES_LIMIT : 1;
  const atMaxCapacity = totalItems === maxItems;
  const addAction = actions2.find((action) => action.type === "DID_ADD_ITEM");
  if (atMaxCapacity && addAction) {
    const interactionMethod = addAction.data.interactionMethod;
    label.opacity = 0;
    if (isMultiItem) {
      label.translateY = -40;
    } else {
      if (interactionMethod === InteractionMethod.API) {
        label.translateX = 40;
      } else if (interactionMethod === InteractionMethod.BROWSE) {
        label.translateY = 40;
      } else {
        label.translateY = 30;
      }
    }
  } else if (!atMaxCapacity) {
    label.opacity = 1;
    label.translateX = 0;
    label.translateY = 0;
  }
  const listItemMargin = calculateListItemMargin(root2);
  const listHeight = calculateListHeight(root2);
  const labelHeight = label.rect.element.height;
  const currentLabelHeight = !isMultiItem || atMaxCapacity ? 0 : labelHeight;
  const listMarginTop = atMaxCapacity ? list2.rect.element.marginTop : 0;
  const listMarginBottom = totalItems === 0 ? 0 : list2.rect.element.marginBottom;
  const visualHeight = currentLabelHeight + listMarginTop + listHeight.visual + listMarginBottom;
  const boundsHeight = currentLabelHeight + listMarginTop + listHeight.bounds + listMarginBottom;
  list2.translateY = Math.max(0, currentLabelHeight - list2.rect.element.marginTop) - listItemMargin.top;
  if (aspectRatio) {
    const width = root2.rect.element.width;
    const height = width * aspectRatio;
    if (aspectRatio !== root2.ref.previousAspectRatio) {
      root2.ref.previousAspectRatio = aspectRatio;
      root2.ref.updateHistory = [];
    }
    const history = root2.ref.updateHistory;
    history.push(width);
    const MAX_BOUNCES = 2;
    if (history.length > MAX_BOUNCES * 2) {
      const l = history.length;
      const bottom = l - 10;
      let bounces = 0;
      for (let i = l; i >= bottom; i--) {
        if (history[i] === history[i - 2]) {
          bounces++;
        }
        if (bounces >= MAX_BOUNCES) {
          return;
        }
      }
    }
    panel2.scalable = false;
    panel2.height = height;
    const listAvailableHeight = (
      // the height of the panel minus the label height
      height - currentLabelHeight - // the room we leave open between the end of the list and the panel bottom
      (listMarginBottom - listItemMargin.bottom) - // if we're full we need to leave some room between the top of the panel and the list
      (atMaxCapacity ? listMarginTop : 0)
    );
    if (listHeight.visual > listAvailableHeight) {
      list2.overflow = listAvailableHeight;
    } else {
      list2.overflow = null;
    }
    root2.height = height;
  } else if (bounds.fixedHeight) {
    panel2.scalable = false;
    const listAvailableHeight = (
      // the height of the panel minus the label height
      bounds.fixedHeight - currentLabelHeight - // the room we leave open between the end of the list and the panel bottom
      (listMarginBottom - listItemMargin.bottom) - // if we're full we need to leave some room between the top of the panel and the list
      (atMaxCapacity ? listMarginTop : 0)
    );
    if (listHeight.visual > listAvailableHeight) {
      list2.overflow = listAvailableHeight;
    } else {
      list2.overflow = null;
    }
  } else if (bounds.cappedHeight) {
    const isCappedHeight = visualHeight >= bounds.cappedHeight;
    const panelHeight = Math.min(bounds.cappedHeight, visualHeight);
    panel2.scalable = true;
    panel2.height = isCappedHeight ? panelHeight : panelHeight - listItemMargin.top - listItemMargin.bottom;
    const listAvailableHeight = (
      // the height of the panel minus the label height
      panelHeight - currentLabelHeight - // the room we leave open between the end of the list and the panel bottom
      (listMarginBottom - listItemMargin.bottom) - // if we're full we need to leave some room between the top of the panel and the list
      (atMaxCapacity ? listMarginTop : 0)
    );
    if (visualHeight > bounds.cappedHeight && listHeight.visual > listAvailableHeight) {
      list2.overflow = listAvailableHeight;
    } else {
      list2.overflow = null;
    }
    root2.height = Math.min(
      bounds.cappedHeight,
      boundsHeight - listItemMargin.top - listItemMargin.bottom
    );
  } else {
    const itemMargin = totalItems > 0 ? listItemMargin.top + listItemMargin.bottom : 0;
    panel2.scalable = true;
    panel2.height = Math.max(labelHeight, visualHeight - itemMargin);
    root2.height = Math.max(labelHeight, boundsHeight - itemMargin);
  }
  if (root2.ref.credits && panel2.heightCurrent)
    root2.ref.credits.style.transform = `translateY(${panel2.heightCurrent}px)`;
};
const calculateListItemMargin = (root2) => {
  const item2 = root2.ref.list.childViews[0].childViews[0];
  return item2 ? {
    top: item2.rect.element.marginTop,
    bottom: item2.rect.element.marginBottom
  } : {
    top: 0,
    bottom: 0
  };
};
const calculateListHeight = (root2) => {
  let visual = 0;
  let bounds = 0;
  const scrollList = root2.ref.list;
  const itemList = scrollList.childViews[0];
  const visibleChildren = itemList.childViews.filter((child) => child.rect.element.height);
  const children = root2.query("GET_ACTIVE_ITEMS").map((item2) => visibleChildren.find((child) => child.id === item2.id)).filter((item2) => item2);
  if (children.length === 0) return { visual, bounds };
  const horizontalSpace = itemList.rect.element.width;
  const dragIndex = getItemIndexByPosition(itemList, children, scrollList.dragCoordinates);
  const childRect = children[0].rect.element;
  const itemVerticalMargin = childRect.marginTop + childRect.marginBottom;
  const itemHorizontalMargin = childRect.marginLeft + childRect.marginRight;
  const itemWidth = childRect.width + itemHorizontalMargin;
  const itemHeight = childRect.height + itemVerticalMargin;
  const newItem = typeof dragIndex !== "undefined" && dragIndex >= 0 ? 1 : 0;
  const removedItem = children.find((child) => child.markedForRemoval && child.opacity < 0.45) ? -1 : 0;
  const verticalItemCount = children.length + newItem + removedItem;
  const itemsPerRow = getItemsPerRow(horizontalSpace, itemWidth);
  if (itemsPerRow === 1) {
    children.forEach((item2) => {
      const height = item2.rect.element.height + itemVerticalMargin;
      bounds += height;
      visual += height * item2.opacity;
    });
  } else {
    bounds = Math.ceil(verticalItemCount / itemsPerRow) * itemHeight;
    visual = bounds;
  }
  return { visual, bounds };
};
const calculateRootBoundingBoxHeight = (root2) => {
  const height = root2.ref.measureHeight || null;
  const cappedHeight = parseInt(root2.style.maxHeight, 10) || null;
  const fixedHeight = height === 0 ? null : height;
  return {
    cappedHeight,
    fixedHeight
  };
};
const exceedsMaxFiles = (root2, items) => {
  const allowReplace = root2.query("GET_ALLOW_REPLACE");
  const allowMultiple = root2.query("GET_ALLOW_MULTIPLE");
  const totalItems = root2.query("GET_TOTAL_ITEMS");
  let maxItems = root2.query("GET_MAX_FILES");
  const totalBrowseItems = items.length;
  if (!allowMultiple && totalBrowseItems > 1) {
    root2.dispatch("DID_THROW_MAX_FILES", {
      source: items,
      error: createResponse("warning", 0, "Max files")
    });
    return true;
  }
  maxItems = allowMultiple ? maxItems : 1;
  if (!allowMultiple && allowReplace) {
    return false;
  }
  const hasMaxItems = isInt(maxItems);
  if (hasMaxItems && totalItems + totalBrowseItems > maxItems) {
    root2.dispatch("DID_THROW_MAX_FILES", {
      source: items,
      error: createResponse("warning", 0, "Max files")
    });
    return true;
  }
  return false;
};
const getDragIndex = (list2, children, position) => {
  const itemList = list2.childViews[0];
  return getItemIndexByPosition(itemList, children, {
    left: position.scopeLeft - itemList.rect.element.left,
    top: position.scopeTop - (list2.rect.outer.top + list2.rect.element.marginTop + list2.rect.element.scrollTop)
  });
};
const toggleDrop = (root2) => {
  const isAllowed = root2.query("GET_ALLOW_DROP");
  const isDisabled = root2.query("GET_DISABLED");
  const enabled = isAllowed && !isDisabled;
  if (enabled && !root2.ref.hopper) {
    const hopper = createHopper(
      root2.element,
      (items) => {
        const beforeDropFile = root2.query("GET_BEFORE_DROP_FILE") || (() => true);
        const dropValidation = root2.query("GET_DROP_VALIDATION");
        return dropValidation ? items.every(
          (item2) => applyFilters("ALLOW_HOPPER_ITEM", item2, {
            query: root2.query
          }).every((result) => result === true) && beforeDropFile(item2)
        ) : true;
      },
      {
        filterItems: (items) => {
          const ignoredFiles = root2.query("GET_IGNORED_FILES");
          return items.filter((item2) => {
            if (isFile(item2)) {
              return !ignoredFiles.includes(item2.name.toLowerCase());
            }
            return true;
          });
        },
        catchesDropsOnPage: root2.query("GET_DROP_ON_PAGE"),
        requiresDropOnElement: root2.query("GET_DROP_ON_ELEMENT")
      }
    );
    hopper.onload = (items, position) => {
      const list2 = root2.ref.list.childViews[0];
      const visibleChildren = list2.childViews.filter((child) => child.rect.element.height);
      const children = root2.query("GET_ACTIVE_ITEMS").map((item2) => visibleChildren.find((child) => child.id === item2.id)).filter((item2) => item2);
      applyFilterChain("ADD_ITEMS", items, { dispatch: root2.dispatch }).then((queue) => {
        if (exceedsMaxFiles(root2, queue)) return false;
        root2.dispatch("ADD_ITEMS", {
          items: queue,
          index: getDragIndex(root2.ref.list, children, position),
          interactionMethod: InteractionMethod.DROP
        });
      });
      root2.dispatch("DID_DROP", { position });
      root2.dispatch("DID_END_DRAG", { position });
    };
    hopper.ondragstart = (position) => {
      root2.dispatch("DID_START_DRAG", { position });
    };
    hopper.ondrag = debounce((position) => {
      root2.dispatch("DID_DRAG", { position });
    });
    hopper.ondragend = (position) => {
      root2.dispatch("DID_END_DRAG", { position });
    };
    root2.ref.hopper = hopper;
    root2.ref.drip = root2.appendChildView(root2.createChildView(drip));
  } else if (!enabled && root2.ref.hopper) {
    root2.ref.hopper.destroy();
    root2.ref.hopper = null;
    root2.removeChildView(root2.ref.drip);
  }
};
const toggleBrowse = (root2, props) => {
  const isAllowed = root2.query("GET_ALLOW_BROWSE");
  const isDisabled = root2.query("GET_DISABLED");
  const enabled = isAllowed && !isDisabled;
  if (enabled && !root2.ref.browser) {
    root2.ref.browser = root2.appendChildView(
      root2.createChildView(browser, {
        ...props,
        onload: (items) => {
          applyFilterChain("ADD_ITEMS", items, {
            dispatch: root2.dispatch
          }).then((queue) => {
            if (exceedsMaxFiles(root2, queue)) return false;
            root2.dispatch("ADD_ITEMS", {
              items: queue,
              index: -1,
              interactionMethod: InteractionMethod.BROWSE
            });
          });
        }
      }),
      0
    );
  } else if (!enabled && root2.ref.browser) {
    root2.removeChildView(root2.ref.browser);
    root2.ref.browser = null;
  }
};
const togglePaste = (root2) => {
  const isAllowed = root2.query("GET_ALLOW_PASTE");
  const isDisabled = root2.query("GET_DISABLED");
  const enabled = isAllowed && !isDisabled;
  if (enabled && !root2.ref.paster) {
    root2.ref.paster = createPaster();
    root2.ref.paster.onload = (items) => {
      applyFilterChain("ADD_ITEMS", items, { dispatch: root2.dispatch }).then((queue) => {
        if (exceedsMaxFiles(root2, queue)) return false;
        root2.dispatch("ADD_ITEMS", {
          items: queue,
          index: -1,
          interactionMethod: InteractionMethod.PASTE
        });
      });
    };
  } else if (!enabled && root2.ref.paster) {
    root2.ref.paster.destroy();
    root2.ref.paster = null;
  }
};
const route$5 = createRoute({
  DID_SET_ALLOW_BROWSE: ({ root: root2, props }) => {
    toggleBrowse(root2, props);
  },
  DID_SET_ALLOW_DROP: ({ root: root2 }) => {
    toggleDrop(root2);
  },
  DID_SET_ALLOW_PASTE: ({ root: root2 }) => {
    togglePaste(root2);
  },
  DID_SET_DISABLED: ({ root: root2, props }) => {
    toggleDrop(root2);
    togglePaste(root2);
    toggleBrowse(root2, props);
    const isDisabled = root2.query("GET_DISABLED");
    if (isDisabled) {
      root2.element.dataset.disabled = "disabled";
    } else {
      root2.element.removeAttribute("data-disabled");
    }
  }
});
const root = createView({
  name: "root",
  read: ({ root: root2 }) => {
    if (root2.ref.measure) {
      root2.ref.measureHeight = root2.ref.measure.offsetHeight;
    }
  },
  create: create$e,
  write: write$9,
  destroy: ({ root: root2 }) => {
    if (root2.ref.paster) {
      root2.ref.paster.destroy();
    }
    if (root2.ref.hopper) {
      root2.ref.hopper.destroy();
    }
    root2.element.removeEventListener("touchmove", prevent);
    root2.element.removeEventListener("gesturestart", prevent);
  },
  mixins: {
    styles: ["height"]
  }
});
const createApp = (initialOptions = {}) => {
  let originalElement = null;
  const defaultOptions2 = getOptions();
  const store = createStore(
    // initial state (should be serializable)
    createInitialState(defaultOptions2),
    // queries
    [queries, createOptionQueries(defaultOptions2)],
    // action handlers
    [actions, createOptionActions(defaultOptions2)]
  );
  store.dispatch("SET_OPTIONS", { options: initialOptions });
  const visibilityHandler = () => {
    if (document.hidden) return;
    store.dispatch("KICK");
  };
  document.addEventListener("visibilitychange", visibilityHandler);
  let resizeDoneTimer = null;
  let isResizing = false;
  let isResizingHorizontally = false;
  let initialWindowWidth = null;
  let currentWindowWidth = null;
  const resizeHandler = () => {
    if (!isResizing) {
      isResizing = true;
    }
    clearTimeout(resizeDoneTimer);
    resizeDoneTimer = setTimeout(() => {
      isResizing = false;
      initialWindowWidth = null;
      currentWindowWidth = null;
      if (isResizingHorizontally) {
        isResizingHorizontally = false;
        store.dispatch("DID_STOP_RESIZE");
      }
    }, 500);
  };
  window.addEventListener("resize", resizeHandler);
  const view = root(store, { id: getUniqueId() });
  let isResting = false;
  let isHidden = false;
  const readWriteApi = {
    // necessary for update loop
    /**
     * Reads from dom (never call manually)
     * @private
     */
    _read: () => {
      if (isResizing) {
        currentWindowWidth = window.innerWidth;
        if (!initialWindowWidth) {
          initialWindowWidth = currentWindowWidth;
        }
        if (!isResizingHorizontally && currentWindowWidth !== initialWindowWidth) {
          store.dispatch("DID_START_RESIZE");
          isResizingHorizontally = true;
        }
      }
      if (isHidden && isResting) {
        isResting = view.element.offsetParent === null;
      }
      if (isResting) return;
      view._read();
      isHidden = view.rect.element.hidden;
    },
    /**
     * Writes to dom (never call manually)
     * @private
     */
    _write: (ts) => {
      const actions2 = store.processActionQueue().filter((action) => !/^SET_/.test(action.type));
      if (isResting && !actions2.length) return;
      routeActionsToEvents(actions2);
      isResting = view._write(ts, actions2, isResizingHorizontally);
      removeReleasedItems(store.query("GET_ITEMS"));
      if (isResting) {
        store.processDispatchQueue();
      }
    }
  };
  const createEvent = (name2) => (data2) => {
    const event = {
      type: name2
    };
    if (!data2) {
      return event;
    }
    if (data2.hasOwnProperty("error")) {
      event.error = data2.error ? { ...data2.error } : null;
    }
    if (data2.status) {
      event.status = { ...data2.status };
    }
    if (data2.file) {
      event.output = data2.file;
    }
    if (data2.source) {
      event.file = data2.source;
    } else if (data2.item || data2.id) {
      const item2 = data2.item ? data2.item : store.query("GET_ITEM", data2.id);
      event.file = item2 ? createItemAPI(item2) : null;
    }
    if (data2.items) {
      event.items = data2.items.map(createItemAPI);
    }
    if (/progress/.test(name2)) {
      event.progress = data2.progress;
    }
    if (data2.hasOwnProperty("origin") && data2.hasOwnProperty("target")) {
      event.origin = data2.origin;
      event.target = data2.target;
    }
    return event;
  };
  const eventRoutes = {
    DID_DESTROY: createEvent("destroy"),
    DID_INIT: createEvent("init"),
    DID_THROW_MAX_FILES: createEvent("warning"),
    DID_INIT_ITEM: createEvent("initfile"),
    DID_START_ITEM_LOAD: createEvent("addfilestart"),
    DID_UPDATE_ITEM_LOAD_PROGRESS: createEvent("addfileprogress"),
    DID_LOAD_ITEM: createEvent("addfile"),
    DID_THROW_ITEM_INVALID: [createEvent("error"), createEvent("addfile")],
    DID_THROW_ITEM_LOAD_ERROR: [createEvent("error"), createEvent("addfile")],
    DID_THROW_ITEM_REMOVE_ERROR: [createEvent("error"), createEvent("removefile")],
    DID_PREPARE_OUTPUT: createEvent("preparefile"),
    DID_START_ITEM_PROCESSING: createEvent("processfilestart"),
    DID_UPDATE_ITEM_PROCESS_PROGRESS: createEvent("processfileprogress"),
    DID_ABORT_ITEM_PROCESSING: createEvent("processfileabort"),
    DID_COMPLETE_ITEM_PROCESSING: createEvent("processfile"),
    DID_COMPLETE_ITEM_PROCESSING_ALL: createEvent("processfiles"),
    DID_REVERT_ITEM_PROCESSING: createEvent("processfilerevert"),
    DID_THROW_ITEM_PROCESSING_ERROR: [createEvent("error"), createEvent("processfile")],
    DID_REMOVE_ITEM: createEvent("removefile"),
    DID_UPDATE_ITEMS: createEvent("updatefiles"),
    DID_ACTIVATE_ITEM: createEvent("activatefile"),
    DID_REORDER_ITEMS: createEvent("reorderfiles")
  };
  const exposeEvent = (event) => {
    const detail = { pond: exports$1, ...event };
    delete detail.type;
    view.element.dispatchEvent(
      new CustomEvent(`FilePond:${event.type}`, {
        // event info
        detail,
        // event behaviour
        bubbles: true,
        cancelable: true,
        composed: true
        // triggers listeners outside of shadow root
      })
    );
    const params = [];
    if (event.hasOwnProperty("error")) {
      params.push(event.error);
    }
    if (event.hasOwnProperty("file")) {
      params.push(event.file);
    }
    const filtered = ["type", "error", "file"];
    Object.keys(event).filter((key) => !filtered.includes(key)).forEach((key) => params.push(event[key]));
    exports$1.fire(event.type, ...params);
    const handler = store.query(`GET_ON${event.type.toUpperCase()}`);
    if (handler) {
      handler(...params);
    }
  };
  const routeActionsToEvents = (actions2) => {
    if (!actions2.length) return;
    actions2.filter((action) => eventRoutes[action.type]).forEach((action) => {
      const routes = eventRoutes[action.type];
      (Array.isArray(routes) ? routes : [routes]).forEach((route2) => {
        if (action.type === "DID_INIT_ITEM") {
          exposeEvent(route2(action.data));
        } else {
          setTimeout(() => {
            exposeEvent(route2(action.data));
          }, 0);
        }
      });
    });
  };
  const setOptions2 = (options) => store.dispatch("SET_OPTIONS", { options });
  const getFile = (query) => store.query("GET_ACTIVE_ITEM", query);
  const prepareFile = (query) => new Promise((resolve, reject) => {
    store.dispatch("REQUEST_ITEM_PREPARE", {
      query,
      success: (item2) => {
        resolve(item2);
      },
      failure: (error2) => {
        reject(error2);
      }
    });
  });
  const addFile = (source, options = {}) => new Promise((resolve, reject) => {
    addFiles([{ source, options }], { index: options.index }).then((items) => resolve(items && items[0])).catch(reject);
  });
  const isFilePondFile = (obj) => obj.file && obj.id;
  const removeFile = (query, options) => {
    if (typeof query === "object" && !isFilePondFile(query) && !options) {
      options = query;
      query = void 0;
    }
    store.dispatch("REMOVE_ITEM", { ...options, query });
    return store.query("GET_ACTIVE_ITEM", query) === null;
  };
  const addFiles = (...args) => new Promise((resolve, reject) => {
    const sources = [];
    const options = {};
    if (isArray(args[0])) {
      sources.push.apply(sources, args[0]);
      Object.assign(options, args[1] || {});
    } else {
      const lastArgument = args[args.length - 1];
      if (typeof lastArgument === "object" && !(lastArgument instanceof Blob)) {
        Object.assign(options, args.pop());
      }
      sources.push(...args);
    }
    store.dispatch("ADD_ITEMS", {
      items: sources,
      index: options.index,
      interactionMethod: InteractionMethod.API,
      success: resolve,
      failure: reject
    });
  });
  const getFiles2 = () => store.query("GET_ACTIVE_ITEMS");
  const processFile = (query) => new Promise((resolve, reject) => {
    store.dispatch("REQUEST_ITEM_PROCESSING", {
      query,
      success: (item2) => {
        resolve(item2);
      },
      failure: (error2) => {
        reject(error2);
      }
    });
  });
  const prepareFiles = (...args) => {
    const queries2 = Array.isArray(args[0]) ? args[0] : args;
    const items = queries2.length ? queries2 : getFiles2();
    return Promise.all(items.map(prepareFile));
  };
  const processFiles = (...args) => {
    const queries2 = Array.isArray(args[0]) ? args[0] : args;
    if (!queries2.length) {
      const files = getFiles2().filter(
        (item2) => !(item2.status === ItemStatus.IDLE && item2.origin === FileOrigin.LOCAL) && item2.status !== ItemStatus.PROCESSING && item2.status !== ItemStatus.PROCESSING_COMPLETE && item2.status !== ItemStatus.PROCESSING_REVERT_ERROR
      );
      return Promise.all(files.map(processFile));
    }
    return Promise.all(queries2.map(processFile));
  };
  const removeFiles = (...args) => {
    const queries2 = Array.isArray(args[0]) ? args[0] : args;
    let options;
    if (typeof queries2[queries2.length - 1] === "object") {
      options = queries2.pop();
    } else if (Array.isArray(args[0])) {
      options = args[1];
    }
    const files = getFiles2();
    if (!queries2.length) return Promise.all(files.map((file2) => removeFile(file2, options)));
    const mappedQueries = queries2.map((query) => isNumber(query) ? files[query] ? files[query].id : null : query).filter((query) => query);
    return mappedQueries.map((q) => removeFile(q, options));
  };
  const exports$1 = {
    // supports events
    ...on(),
    // inject private api methods
    ...readWriteApi,
    // inject all getters and setters
    ...createOptionAPI(store, defaultOptions2),
    /**
     * Override options defined in options object
     * @param options
     */
    setOptions: setOptions2,
    /**
     * Load the given file
     * @param source - the source of the file (either a File, base64 data uri or url)
     * @param options - object, { index: 0 }
     */
    addFile,
    /**
     * Load the given files
     * @param sources - the sources of the files to load
     * @param options - object, { index: 0 }
     */
    addFiles,
    /**
     * Returns the file objects matching the given query
     * @param query { string, number, null }
     */
    getFile,
    /**
     * Upload file with given name
     * @param query { string, number, null  }
     */
    processFile,
    /**
     * Request prepare output for file with given name
     * @param query { string, number, null  }
     */
    prepareFile,
    /**
     * Removes a file by its name
     * @param query { string, number, null  }
     */
    removeFile,
    /**
     * Moves a file to a new location in the files list
     */
    moveFile: (query, index) => store.dispatch("MOVE_ITEM", { query, index }),
    /**
     * Returns all files (wrapped in public api)
     */
    getFiles: getFiles2,
    /**
     * Starts uploading all files
     */
    processFiles,
    /**
     * Clears all files from the files list
     */
    removeFiles,
    /**
     * Starts preparing output of all files
     */
    prepareFiles,
    /**
     * Sort list of files
     */
    sort: (compare) => store.dispatch("SORT", { compare }),
    /**
     * Browse the file system for a file
     */
    browse: () => {
      var input = view.element.querySelector("input[type=file]");
      if (input) {
        input.click();
      }
    },
    /**
     * Destroys the app
     */
    destroy: () => {
      exports$1.fire("destroy", view.element);
      store.dispatch("ABORT_ALL");
      view._destroy();
      window.removeEventListener("resize", resizeHandler);
      document.removeEventListener("visibilitychange", visibilityHandler);
      store.dispatch("DID_DESTROY");
    },
    /**
     * Inserts the plugin before the target element
     */
    insertBefore: (element) => insertBefore(view.element, element),
    /**
     * Inserts the plugin after the target element
     */
    insertAfter: (element) => insertAfter(view.element, element),
    /**
     * Appends the plugin to the target element
     */
    appendTo: (element) => element.appendChild(view.element),
    /**
     * Replaces an element with the app
     */
    replaceElement: (element) => {
      insertBefore(view.element, element);
      element.parentNode.removeChild(element);
      originalElement = element;
    },
    /**
     * Restores the original element
     */
    restoreElement: () => {
      if (!originalElement) {
        return;
      }
      insertAfter(originalElement, view.element);
      view.element.parentNode.removeChild(view.element);
      originalElement = null;
    },
    /**
     * Returns true if the app root is attached to given element
     * @param element
     */
    isAttachedTo: (element) => view.element === element || originalElement === element,
    /**
     * Returns the root element
     */
    element: {
      get: () => view.element
    },
    /**
     * Returns the current pond status
     */
    status: {
      get: () => store.query("GET_STATUS")
    }
  };
  store.dispatch("DID_INIT");
  return createObject(exports$1);
};
const createAppObject = (customOptions = {}) => {
  const defaultOptions2 = {};
  forin(getOptions(), (key, value) => {
    defaultOptions2[key] = value[0];
  });
  const app = createApp({
    // default options
    ...defaultOptions2,
    // custom options
    ...customOptions
  });
  return app;
};
const lowerCaseFirstLetter = (string) => string.charAt(0).toLowerCase() + string.slice(1);
const attributeNameToPropertyName = (attributeName) => toCamels(attributeName.replace(/^data-/, ""));
const mapObject = (object, propertyMap) => {
  forin(propertyMap, (selector, mapping) => {
    forin(object, (property, value) => {
      const selectorRegExp = new RegExp(selector);
      const matches = selectorRegExp.test(property);
      if (!matches) {
        return;
      }
      delete object[property];
      if (mapping === false) {
        return;
      }
      if (isString(mapping)) {
        object[mapping] = value;
        return;
      }
      const group = mapping.group;
      if (isObject(mapping) && !object[group]) {
        object[group] = {};
      }
      object[group][lowerCaseFirstLetter(property.replace(selectorRegExp, ""))] = value;
    });
    if (mapping.mapping) {
      mapObject(object[mapping.group], mapping.mapping);
    }
  });
};
const getAttributesAsObject = (node, attributeMapping = {}) => {
  const attributes = [];
  forin(node.attributes, (index) => {
    attributes.push(node.attributes[index]);
  });
  const output = attributes.filter((attribute) => attribute.name).reduce((obj, attribute) => {
    const value = attr(node, attribute.name);
    obj[attributeNameToPropertyName(attribute.name)] = value === attribute.name ? true : value;
    return obj;
  }, {});
  mapObject(output, attributeMapping);
  return output;
};
const createAppAtElement = (element, options = {}) => {
  const attributeMapping = {
    // translate to other name
    "^class$": "className",
    "^multiple$": "allowMultiple",
    "^capture$": "captureMethod",
    "^webkitdirectory$": "allowDirectoriesOnly",
    // group under single property
    "^server": {
      group: "server",
      mapping: {
        "^process": {
          group: "process"
        },
        "^revert": {
          group: "revert"
        },
        "^fetch": {
          group: "fetch"
        },
        "^restore": {
          group: "restore"
        },
        "^load": {
          group: "load"
        }
      }
    },
    // don't include in object
    "^type$": false,
    "^files$": false
  };
  applyFilters("SET_ATTRIBUTE_TO_OPTION_MAP", attributeMapping);
  const mergedOptions = {
    ...options
  };
  const attributeOptions = getAttributesAsObject(
    element.nodeName === "FIELDSET" ? element.querySelector("input[type=file]") : element,
    attributeMapping
  );
  Object.keys(attributeOptions).forEach((key) => {
    if (isObject(attributeOptions[key])) {
      if (!isObject(mergedOptions[key])) {
        mergedOptions[key] = {};
      }
      Object.assign(mergedOptions[key], attributeOptions[key]);
    } else {
      mergedOptions[key] = attributeOptions[key];
    }
  });
  mergedOptions.files = (options.files || []).concat(
    Array.from(element.querySelectorAll("input:not([type=file])")).map((input) => ({
      source: input.value,
      options: {
        type: input.dataset.type
      }
    }))
  );
  const app = createAppObject(mergedOptions);
  if (element.files) {
    Array.from(element.files).forEach((file2) => {
      app.addFile(file2);
    });
  }
  app.replaceElement(element);
  return app;
};
const createApp$1 = (...args) => isNode(args[0]) ? createAppAtElement(...args) : createAppObject(...args);
const PRIVATE_METHODS = ["fire", "_read", "_write"];
const createAppAPI = (app) => {
  const api = {};
  copyObjectPropertiesToObject(app, api, PRIVATE_METHODS);
  return api;
};
const replaceInString = (string, replacements) => string.replace(/(?:{([a-zA-Z]+)})/g, (match, group) => replacements[group]);
const createWorker = (fn2) => {
  const workerBlob = new Blob(["(", fn2.toString(), ")()"], {
    type: "application/javascript"
  });
  const workerURL = URL.createObjectURL(workerBlob);
  const worker = new Worker(workerURL);
  return {
    transfer: (message, cb) => {
    },
    post: (message, cb, transferList) => {
      const id = getUniqueId();
      worker.onmessage = (e) => {
        if (e.data.id === id) {
          cb(e.data.message);
        }
      };
      worker.postMessage(
        {
          id,
          message
        },
        transferList
      );
    },
    terminate: () => {
      worker.terminate();
      URL.revokeObjectURL(workerURL);
    }
  };
};
const loadImage = (url) => new Promise((resolve, reject) => {
  const img = new Image();
  img.onload = () => {
    resolve(img);
  };
  img.onerror = (e) => {
    reject(e);
  };
  img.src = url;
});
const renameFile = (file2, name2) => {
  const renamedFile = file2.slice(0, file2.size, file2.type);
  renamedFile.lastModifiedDate = file2.lastModifiedDate;
  renamedFile.name = name2;
  return renamedFile;
};
const copyFile = (file2) => renameFile(file2, file2.name);
const registeredPlugins = [];
const createAppPlugin = (plugin) => {
  if (registeredPlugins.includes(plugin)) {
    return;
  }
  registeredPlugins.push(plugin);
  const pluginOutline = plugin({
    addFilter,
    utils: {
      Type,
      forin,
      isString,
      isFile,
      toNaturalFileSize,
      replaceInString,
      getExtensionFromFilename,
      getFilenameWithoutExtension,
      guesstimateMimeType,
      getFileFromBlob,
      getFilenameFromURL,
      createRoute,
      createWorker,
      createView,
      createItemAPI,
      loadImage,
      copyFile,
      renameFile,
      createBlob,
      applyFilterChain,
      text,
      getNumericAspectRatioFromString
    },
    views: {
      fileActionButton
    }
  });
  extendDefaultOptions(pluginOutline.options);
};
const isOperaMini = () => Object.prototype.toString.call(window.operamini) === "[object OperaMini]";
const hasPromises = () => "Promise" in window;
const hasBlobSlice = () => "slice" in Blob.prototype;
const hasCreateObjectURL = () => "URL" in window && "createObjectURL" in window.URL;
const hasVisibility = () => "visibilityState" in document;
const hasTiming = () => "performance" in window;
const hasCSSSupports = () => "supports" in (window.CSS || {});
const isIE11 = () => /MSIE|Trident/.test(window.navigator.userAgent);
const supported = (() => {
  const isSupported2 = (
    // Has to be a browser
    isBrowser() && // Can't run on Opera Mini due to lack of everything
    !isOperaMini() && // Require these APIs to feature detect a modern browser
    hasVisibility() && hasPromises() && hasBlobSlice() && hasCreateObjectURL() && hasTiming() && // doesn't need CSSSupports but is a good way to detect Safari 9+ (we do want to support IE11 though)
    (hasCSSSupports() || isIE11())
  );
  return () => isSupported2;
})();
const state = {
  // active app instances, used to redraw the apps and to find the later
  apps: []
};
const name = "filepond";
const fn = () => {
};
let OptionTypes = {};
let create$f = fn;
let destroy = fn;
let parse = fn;
let find = fn;
let registerPlugin = fn;
let getOptions$1 = fn;
let setOptions$1 = fn;
if (supported()) {
  createPainter(
    () => {
      state.apps.forEach((app) => app._read());
    },
    (ts) => {
      state.apps.forEach((app) => app._write(ts));
    }
  );
  const dispatch = () => {
    document.dispatchEvent(
      new CustomEvent("FilePond:loaded", {
        detail: {
          supported,
          create: create$f,
          destroy,
          parse,
          find,
          registerPlugin,
          setOptions: setOptions$1
        }
      })
    );
    document.removeEventListener("DOMContentLoaded", dispatch);
  };
  if (document.readyState !== "loading") {
    setTimeout(() => dispatch(), 0);
  } else {
    document.addEventListener("DOMContentLoaded", dispatch);
  }
  const updateOptionTypes = () => forin(getOptions(), (key, value) => {
    OptionTypes[key] = value[1];
  });
  OptionTypes = {};
  updateOptionTypes();
  create$f = (...args) => {
    const app = createApp$1(...args);
    app.on("destroy", destroy);
    state.apps.push(app);
    return createAppAPI(app);
  };
  destroy = (hook) => {
    const indexToRemove = state.apps.findIndex((app) => app.isAttachedTo(hook));
    if (indexToRemove >= 0) {
      const app = state.apps.splice(indexToRemove, 1)[0];
      app.restoreElement();
      return true;
    }
    return false;
  };
  parse = (context) => {
    const matchedHooks = Array.from(context.querySelectorAll(`.${name}`));
    const newHooks = matchedHooks.filter(
      (newHook) => !state.apps.find((app) => app.isAttachedTo(newHook))
    );
    return newHooks.map((hook) => create$f(hook));
  };
  find = (hook) => {
    const app = state.apps.find((app2) => app2.isAttachedTo(hook));
    if (!app) {
      return null;
    }
    return createAppAPI(app);
  };
  registerPlugin = (...plugins) => {
    plugins.forEach(createAppPlugin);
    updateOptionTypes();
  };
  getOptions$1 = () => {
    const opts = {};
    forin(getOptions(), (key, value) => {
      opts[key] = value[0];
    });
    return opts;
  };
  setOptions$1 = (opts) => {
    if (isObject(opts)) {
      state.apps.forEach((app) => {
        app.setOptions(opts);
      });
      setOptions(opts);
    }
    return getOptions$1();
  };
}
const isSupported = supported();
const filteredMethods = [
  "setOptions",
  "on",
  "off",
  "onOnce",
  "appendTo",
  "insertAfter",
  "insertBefore",
  "isAttachedTo",
  "replaceElement",
  "restoreElement",
  "destroy"
];
class FilePond extends React.Component {
  constructor(props) {
    super(props);
    this.allowFilesSync = true;
  }
  // Will setup FilePond instance when mounted
  componentDidMount() {
    this._input = this._element.querySelector('input[type="file"]');
    this._inputClone = this._input.cloneNode();
    if (!isSupported) return;
    const options = Object.assign({}, this.props);
    if (options.onupdatefiles) {
      const cb = options.onupdatefiles;
      options.onupdatefiles = (items) => {
        this.allowFilesSync = false;
        cb(items);
      };
    }
    this._pond = create$f(this._input, options);
    Object.keys(this._pond).filter((key) => !filteredMethods.includes(key)).forEach((key) => {
      this[key] = this._pond[key];
    });
  }
  // Will clean up FilePond instance when unmounted
  componentWillUnmount() {
    if (!this._pond) return;
    const bin = document.createElement("div");
    bin.append(this._pond.element);
    bin.id = "foo";
    this._pond.destroy();
    this._pond = void 0;
    this._element.append(this._inputClone);
  }
  shouldComponentUpdate() {
    if (!this.allowFilesSync) {
      this.allowFilesSync = true;
      return false;
    }
    return true;
  }
  // Something changed
  componentDidUpdate() {
    if (!this._pond) return;
    const options = Object.assign({}, this.props);
    delete options.onupdatefiles;
    this._pond.setOptions(options);
  }
  // Renders basic element hook for FilePond to attach to
  render() {
    const {
      id,
      name: name2,
      className,
      allowMultiple,
      required,
      captureMethod,
      acceptedFileTypes
    } = this.props;
    return reactExports.createElement(
      "div",
      {
        className: "filepond--wrapper",
        ref: (element) => this._element = element
      },
      reactExports.createElement("input", {
        type: "file",
        name: name2,
        id,
        accept: acceptedFileTypes,
        multiple: allowMultiple,
        required,
        className,
        capture: captureMethod
      })
    );
  }
}
function WLFileUploader(props) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    FilePond,
    {
      server: server(props.WLtype, props.WLimageIDsRef),
      ...props,
      instantUpload: false,
      allowReplace: false,
      allowProcess: false,
      allowFileTypeValidation: true,
      acceptedFileTypes: ["image/*"]
    }
  );
}
const server = (type, imageIDsRef) => ({
  process: {
    url: "/api/filepond/upload",
    method: "POST",
    headers: {
      //form data is not available when processing with multer so I have to pack 
      //these here
      "x-file-data": encodeURIComponent(btoa(JSON.stringify({
        projectName: encodeURIComponent(localStorage.getItem(LS_PROJECT_NAME)),
        type
      })))
    },
    onload: (response) => {
      imageIDsRef.current[type] = response;
    }
  },
  load: {
    url: "/api/filepond/load",
    method: "POST",
    headers: {
      //form data is not available when processing with multer so I have to pack 
      //these here
      "x-file-data": encodeURIComponent(btoa(JSON.stringify({
        projectName: encodeURIComponent(localStorage.getItem(LS_PROJECT_NAME)),
        type
      })))
    }
  },
  revert: {
    url: "/api/filepond/remove",
    headers: {
      //form data is not available when processing with multer so I have to pack 
      //these here
      "x-file-data": encodeURIComponent(btoa(JSON.stringify({
        projectName: encodeURIComponent(localStorage.getItem(LS_PROJECT_NAME)),
        type
      })))
    },
    onload: (response) => {
      imageIDsRef[type] = null;
    }
  }
});
function DesignTab({ selectedTab, imageIDs, getDesignRef }) {
  const index = 2;
  const bannerUploadRef = reactExports.useRef();
  const thumbnailUploadRef = reactExports.useRef();
  const imageIDsRef = reactExports.useRef({});
  getDesignRef.current = async () => {
    await bannerUploadRef.current.processFiles();
    await thumbnailUploadRef.current.processFiles();
    return imageIDsRef.current;
  };
  reactExports.useEffect(() => {
    imageIDsRef.current = imageIDs;
  }, [imageIDs]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tab design-tab " + (selectedTab == index ? "active-tab" : ""), index, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { action: "", className: "filepond-form", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "prompt-container", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "thumbnail-prompt-title prompt-label", children: "Thumbnail (not implemented)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        WLFileUploader,
        {
          className: "thumbnail-prompt",
          WLtype: "thumbnail",
          WLimageIDsRef: imageIDsRef,
          ref: thumbnailUploadRef,
          files: imageIDsRef.current["thumbnail"] ? [{
            source: imageIDsRef.current["thumbnail"],
            options: {
              type: "local"
            }
          }] : []
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "prompt-container", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "banner-prompt-title prompt-label", children: "Banner (9:1)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        WLFileUploader,
        {
          className: "banner-prompt",
          WLtype: "banner",
          WLimageIDsRef: imageIDsRef,
          ref: bannerUploadRef,
          files: imageIDsRef.current["banner"] ? [{
            source: imageIDsRef.current["banner"],
            options: {
              type: "local"
            }
          }] : []
        }
      )
    ] })
  ] }) });
}
function SettingsTab({ selectedTab, getSettingsRef, defaultTemplate }) {
  const [templateList, setTemplateList] = reactExports.useState([]);
  const templateSelectRef = reactExports.useRef();
  const index = 3;
  getSettingsRef.current = async () => {
    return { templateName: templateSelectRef.current.getValue()[0].value };
  };
  function onChange(e) {
    sessionStorage.setItem("TemplateName", e.value);
    if (confirm("This action will cause unsaved data to be lost. Proceed?")) {
      sessionStorage.setItem("ArticleRestructureFlag", 1);
      window.location.reload();
    }
  }
  reactExports.useEffect(() => {
    (async () => {
      let res2 = await getTemplateList(localStorage.getItem(LS_PROJECT_NAME));
      if (res2.startsWith("Fail")) {
        console.error("Couldn't fetch template list");
      } else {
        setTemplateList(JSON.parse(res2));
      }
    })();
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tab settings-tab " + (selectedTab == index ? "active-tab" : ""), index, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Template" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: "type-selector-container", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      WLSelect,
      {
        options: templateList?.map((t, i) => {
          return { value: t, label: t };
        }),
        onChange,
        value: { value: defaultTemplate, label: defaultTemplate },
        ref: templateSelectRef
      }
    ) })
  ] }) });
}
function ArticleEditor() {
  const [selectedTab, setSelectedTab] = reactExports.useState(1);
  const [templateData, setTemplateData] = reactExports.useState([]);
  const [selectedTemplate, setSelectedTemplate] = reactExports.useState("");
  const [articleData, setArticleData] = reactExports.useState({ content: {}, settings: { templateName: null }, design: {} });
  const contentsFetchFunction = reactExports.useRef(() => {
    console.warn("Content fetch function is undefined");
  });
  const desginFetchFunction = reactExports.useRef(() => {
    console.warn("Design fetch function is undefined");
  });
  const settingsFetchFunction = reactExports.useRef(() => {
    console.warn("Settings fetch function is undefined");
  });
  async function saveFunction() {
    let content = await contentsFetchFunction.current();
    let design = await desginFetchFunction.current();
    let settings = await settingsFetchFunction.current();
    try {
      await modifyArticle(localStorage.getItem(LS_PROJECT_NAME), "modify", sessionStorage.getItem("Article"), {
        content,
        design,
        settings
      });
      showToast("Saved!", "success", 1500);
    } catch (err) {
      console.error(err);
      showToast("Error while saving article", "danger", 1500);
    }
  }
  reactExports.useEffect(() => {
    (async () => {
      let res2 = await getTemplate(localStorage.getItem(LS_PROJECT_NAME), selectedTemplate);
      if (res2.startsWith("Fail")) {
        console.error("Couldn't fetch template");
      } else {
        setTemplateData(JSON.parse(res2));
      }
    })();
  }, [selectedTemplate]);
  reactExports.useEffect(() => {
    (async () => {
      if (sessionStorage.getItem("Article")) {
        try {
          let res2 = await fetchArticle(localStorage.getItem(LS_PROJECT_NAME), sessionStorage.getItem("Article"));
          let data2 = JSON.parse(res2).data;
          setArticleData(data2);
        } catch (err) {
        }
      }
    })();
  }, []);
  reactExports.useEffect(() => {
    if (articleData?.settings?.templateName) {
      if (sessionStorage.getItem("ArticleRestructureFlag") == 1) {
        articleData.settings.templateName = sessionStorage.getItem("TemplateName");
        sessionStorage.setItem("ArticleRestructureFlag", 0);
      } else {
        sessionStorage.setItem("TemplateName", articleData.settings.templateName);
      }
    } else {
      articleData.settings.templateName = sessionStorage.getItem("TemplateName");
    }
    setSelectedTemplate(articleData.settings.templateName);
  }, [articleData]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "body-container", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "topbar", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "topbar-section clickable " + (selectedTab == 1 ? "selected-section" : ""),
          onClick: () => {
            setSelectedTab(1);
          },
          children: "Content"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "topbar-section clickable " + (selectedTab == 2 ? "selected-section" : ""),
          onClick: () => {
            setSelectedTab(2);
          },
          children: "Design"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "topbar-section clickable " + (selectedTab == 3 ? "selected-section" : ""),
          onClick: () => {
            setSelectedTab(3);
          },
          children: "Settings"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "editor-panel", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ContentTab, { selectedTab, templateData, saveFunction: contentsFetchFunction, priorArticleData: articleData.content }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DesignTab, { selectedTab, getDesignRef: desginFetchFunction, imageIDs: articleData.design }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsTab, { selectedTab, getSettingsRef: settingsFetchFunction, defaultTemplate: selectedTemplate })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "button", className: "save-button", value: "Save", onClick: saveFunction })
  ] });
}
export {
  ArticleEditor as default
};
