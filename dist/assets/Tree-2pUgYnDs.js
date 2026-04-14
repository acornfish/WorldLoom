import { r as reactExports, j as jsxRuntimeExports } from "./index-BGqFm7i_.js";
function jQueryFactory(window2, noGlobal) {
  if (typeof window2 === "undefined" || !window2.document) {
    throw new Error("jQuery requires a window with a document");
  }
  var arr = [];
  var getProto = Object.getPrototypeOf;
  var slice = arr.slice;
  var flat = arr.flat ? function(array) {
    return arr.flat.call(array);
  } : function(array) {
    return arr.concat.apply([], array);
  };
  var push = arr.push;
  var indexOf = arr.indexOf;
  var class2type = {};
  var toString = class2type.toString;
  var hasOwn = class2type.hasOwnProperty;
  var fnToString = hasOwn.toString;
  var ObjectFunctionString = fnToString.call(Object);
  var support = {};
  function toType(obj) {
    if (obj == null) {
      return obj + "";
    }
    return typeof obj === "object" ? class2type[toString.call(obj)] || "object" : typeof obj;
  }
  function isWindow(obj) {
    return obj != null && obj === obj.window;
  }
  function isArrayLike(obj) {
    var length = !!obj && obj.length, type = toType(obj);
    if (typeof obj === "function" || isWindow(obj)) {
      return false;
    }
    return type === "array" || length === 0 || typeof length === "number" && length > 0 && length - 1 in obj;
  }
  var document$1 = window2.document;
  var preservedScriptAttributes = {
    type: true,
    src: true,
    nonce: true,
    noModule: true
  };
  function DOMEval(code, node, doc) {
    doc = doc || document$1;
    var i2, script = doc.createElement("script");
    script.text = code;
    for (i2 in preservedScriptAttributes) {
      if (node && node[i2]) {
        script[i2] = node[i2];
      }
    }
    if (doc.head.appendChild(script).parentNode) {
      script.parentNode.removeChild(script);
    }
  }
  var version = "4.0.0", rhtmlSuffix = /HTML$/i, jQuery2 = function(selector, context) {
    return new jQuery2.fn.init(selector, context);
  };
  jQuery2.fn = jQuery2.prototype = {
    // The current version of jQuery being used
    jquery: version,
    constructor: jQuery2,
    // The default length of a jQuery object is 0
    length: 0,
    toArray: function() {
      return slice.call(this);
    },
    // Get the Nth element in the matched element set OR
    // Get the whole matched element set as a clean array
    get: function(num) {
      if (num == null) {
        return slice.call(this);
      }
      return num < 0 ? this[num + this.length] : this[num];
    },
    // Take an array of elements and push it onto the stack
    // (returning the new matched element set)
    pushStack: function(elems) {
      var ret = jQuery2.merge(this.constructor(), elems);
      ret.prevObject = this;
      return ret;
    },
    // Execute a callback for every element in the matched set.
    each: function(callback) {
      return jQuery2.each(this, callback);
    },
    map: function(callback) {
      return this.pushStack(jQuery2.map(this, function(elem, i2) {
        return callback.call(elem, i2, elem);
      }));
    },
    slice: function() {
      return this.pushStack(slice.apply(this, arguments));
    },
    first: function() {
      return this.eq(0);
    },
    last: function() {
      return this.eq(-1);
    },
    even: function() {
      return this.pushStack(jQuery2.grep(this, function(_elem, i2) {
        return (i2 + 1) % 2;
      }));
    },
    odd: function() {
      return this.pushStack(jQuery2.grep(this, function(_elem, i2) {
        return i2 % 2;
      }));
    },
    eq: function(i2) {
      var len = this.length, j = +i2 + (i2 < 0 ? len : 0);
      return this.pushStack(j >= 0 && j < len ? [this[j]] : []);
    },
    end: function() {
      return this.prevObject || this.constructor();
    }
  };
  jQuery2.extend = jQuery2.fn.extend = function() {
    var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {}, i2 = 1, length = arguments.length, deep = false;
    if (typeof target === "boolean") {
      deep = target;
      target = arguments[i2] || {};
      i2++;
    }
    if (typeof target !== "object" && typeof target !== "function") {
      target = {};
    }
    if (i2 === length) {
      target = this;
      i2--;
    }
    for (; i2 < length; i2++) {
      if ((options = arguments[i2]) != null) {
        for (name in options) {
          copy = options[name];
          if (name === "__proto__" || target === copy) {
            continue;
          }
          if (deep && copy && (jQuery2.isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
            src = target[name];
            if (copyIsArray && !Array.isArray(src)) {
              clone = [];
            } else if (!copyIsArray && !jQuery2.isPlainObject(src)) {
              clone = {};
            } else {
              clone = src;
            }
            copyIsArray = false;
            target[name] = jQuery2.extend(deep, clone, copy);
          } else if (copy !== void 0) {
            target[name] = copy;
          }
        }
      }
    }
    return target;
  };
  jQuery2.extend({
    // Unique for each copy of jQuery on the page
    expando: "jQuery" + (version + Math.random()).replace(/\D/g, ""),
    // Assume jQuery is ready without the ready module
    isReady: true,
    error: function(msg) {
      throw new Error(msg);
    },
    noop: function() {
    },
    isPlainObject: function(obj) {
      var proto, Ctor;
      if (!obj || toString.call(obj) !== "[object Object]") {
        return false;
      }
      proto = getProto(obj);
      if (!proto) {
        return true;
      }
      Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
      return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;
    },
    isEmptyObject: function(obj) {
      var name;
      for (name in obj) {
        return false;
      }
      return true;
    },
    // Evaluates a script in a provided context; falls back to the global one
    // if not specified.
    globalEval: function(code, options, doc) {
      DOMEval(code, { nonce: options && options.nonce }, doc);
    },
    each: function(obj, callback) {
      var length, i2 = 0;
      if (isArrayLike(obj)) {
        length = obj.length;
        for (; i2 < length; i2++) {
          if (callback.call(obj[i2], i2, obj[i2]) === false) {
            break;
          }
        }
      } else {
        for (i2 in obj) {
          if (callback.call(obj[i2], i2, obj[i2]) === false) {
            break;
          }
        }
      }
      return obj;
    },
    // Retrieve the text value of an array of DOM nodes
    text: function(elem) {
      var node, ret = "", i2 = 0, nodeType = elem.nodeType;
      if (!nodeType) {
        while (node = elem[i2++]) {
          ret += jQuery2.text(node);
        }
      }
      if (nodeType === 1 || nodeType === 11) {
        return elem.textContent;
      }
      if (nodeType === 9) {
        return elem.documentElement.textContent;
      }
      if (nodeType === 3 || nodeType === 4) {
        return elem.nodeValue;
      }
      return ret;
    },
    // results is for internal usage only
    makeArray: function(arr2, results) {
      var ret = results || [];
      if (arr2 != null) {
        if (isArrayLike(Object(arr2))) {
          jQuery2.merge(
            ret,
            typeof arr2 === "string" ? [arr2] : arr2
          );
        } else {
          push.call(ret, arr2);
        }
      }
      return ret;
    },
    inArray: function(elem, arr2, i2) {
      return arr2 == null ? -1 : indexOf.call(arr2, elem, i2);
    },
    isXMLDoc: function(elem) {
      var namespace = elem && elem.namespaceURI, docElem = elem && (elem.ownerDocument || elem).documentElement;
      return !rhtmlSuffix.test(namespace || docElem && docElem.nodeName || "HTML");
    },
    // Note: an element does not contain itself
    contains: function(a, b) {
      var bup = b && b.parentNode;
      return a === bup || !!(bup && bup.nodeType === 1 && // Support: IE 9 - 11+
      // IE doesn't have `contains` on SVG.
      (a.contains ? a.contains(bup) : a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16));
    },
    merge: function(first, second) {
      var len = +second.length, j = 0, i2 = first.length;
      for (; j < len; j++) {
        first[i2++] = second[j];
      }
      first.length = i2;
      return first;
    },
    grep: function(elems, callback, invert) {
      var callbackInverse, matches2 = [], i2 = 0, length = elems.length, callbackExpect = !invert;
      for (; i2 < length; i2++) {
        callbackInverse = !callback(elems[i2], i2);
        if (callbackInverse !== callbackExpect) {
          matches2.push(elems[i2]);
        }
      }
      return matches2;
    },
    // arg is for internal usage only
    map: function(elems, callback, arg) {
      var length, value, i2 = 0, ret = [];
      if (isArrayLike(elems)) {
        length = elems.length;
        for (; i2 < length; i2++) {
          value = callback(elems[i2], i2, arg);
          if (value != null) {
            ret.push(value);
          }
        }
      } else {
        for (i2 in elems) {
          value = callback(elems[i2], i2, arg);
          if (value != null) {
            ret.push(value);
          }
        }
      }
      return flat(ret);
    },
    // A global GUID counter for objects
    guid: 1,
    // jQuery.support is not used in Core but other projects attach their
    // properties to it so it needs to exist.
    support
  });
  if (typeof Symbol === "function") {
    jQuery2.fn[Symbol.iterator] = arr[Symbol.iterator];
  }
  jQuery2.each(
    "Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),
    function(_i, name) {
      class2type["[object " + name + "]"] = name.toLowerCase();
    }
  );
  function nodeName(elem, name) {
    return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
  }
  var pop = arr.pop;
  var whitespace = "[\\x20\\t\\r\\n\\f]";
  var isIE = document$1.documentMode;
  var rbuggyQSA = isIE && new RegExp(
    // Support: IE 9 - 11+
    // IE's :disabled selector does not pick up the children of disabled fieldsets
    ":enabled|:disabled|\\[" + whitespace + "*name" + whitespace + "*=" + whitespace + `*(?:''|"")`
  );
  var rtrimCSS = new RegExp(
    "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$",
    "g"
  );
  var identifier = "(?:\\\\[\\da-fA-F]{1,6}" + whitespace + "?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+";
  var rleadingCombinator = new RegExp("^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*");
  var rdescend = new RegExp(whitespace + "|>");
  var rsibling = /[+~]/;
  var documentElement$1 = document$1.documentElement;
  var matches = documentElement$1.matches || documentElement$1.msMatchesSelector;
  function createCache() {
    var keys = [];
    function cache(key, value) {
      if (keys.push(key + " ") > jQuery2.expr.cacheLength) {
        delete cache[keys.shift()];
      }
      return cache[key + " "] = value;
    }
    return cache;
  }
  function testContext(context) {
    return context && typeof context.getElementsByTagName !== "undefined" && context;
  }
  var attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace + // Operator (capture 2)
  "*([*^$|!~]?=)" + whitespace + // "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
  `*(?:'((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)"|(` + identifier + "))|)" + whitespace + "*\\]";
  var pseudos = ":(" + identifier + `)(?:\\((('((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)")|((?:\\\\.|[^\\\\()[\\]]|` + attributes + ")*)|.*)\\)|)";
  var filterMatchExpr = {
    ID: new RegExp("^#(" + identifier + ")"),
    CLASS: new RegExp("^\\.(" + identifier + ")"),
    TAG: new RegExp("^(" + identifier + "|[*])"),
    ATTR: new RegExp("^" + attributes),
    PSEUDO: new RegExp("^" + pseudos),
    CHILD: new RegExp(
      "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace + "*(\\d+)|))" + whitespace + "*\\)|)",
      "i"
    )
  };
  var rpseudo = new RegExp(pseudos);
  var runescape = new RegExp("\\\\[\\da-fA-F]{1,6}" + whitespace + "?|\\\\([^\\r\\n\\f])", "g"), funescape = function(escape, nonHex) {
    var high = "0x" + escape.slice(1) - 65536;
    if (nonHex) {
      return nonHex;
    }
    return high < 0 ? String.fromCharCode(high + 65536) : String.fromCharCode(high >> 10 | 55296, high & 1023 | 56320);
  };
  function unescapeSelector(sel) {
    return sel.replace(runescape, funescape);
  }
  function selectorError(msg) {
    jQuery2.error("Syntax error, unrecognized expression: " + msg);
  }
  var rcomma = new RegExp("^" + whitespace + "*," + whitespace + "*");
  var tokenCache = createCache();
  function tokenize(selector, parseOnly) {
    var matched, match, tokens, type, soFar, groups, preFilters, cached = tokenCache[selector + " "];
    if (cached) {
      return parseOnly ? 0 : cached.slice(0);
    }
    soFar = selector;
    groups = [];
    preFilters = jQuery2.expr.preFilter;
    while (soFar) {
      if (!matched || (match = rcomma.exec(soFar))) {
        if (match) {
          soFar = soFar.slice(match[0].length) || soFar;
        }
        groups.push(tokens = []);
      }
      matched = false;
      if (match = rleadingCombinator.exec(soFar)) {
        matched = match.shift();
        tokens.push({
          value: matched,
          // Cast descendant combinators to space
          type: match[0].replace(rtrimCSS, " ")
        });
        soFar = soFar.slice(matched.length);
      }
      for (type in filterMatchExpr) {
        if ((match = jQuery2.expr.match[type].exec(soFar)) && (!preFilters[type] || (match = preFilters[type](match)))) {
          matched = match.shift();
          tokens.push({
            value: matched,
            type,
            matches: match
          });
          soFar = soFar.slice(matched.length);
        }
      }
      if (!matched) {
        break;
      }
    }
    if (parseOnly) {
      return soFar.length;
    }
    return soFar ? selectorError(selector) : (
      // Cache the tokens
      tokenCache(selector, groups).slice(0)
    );
  }
  var preFilter = {
    ATTR: function(match) {
      match[1] = unescapeSelector(match[1]);
      match[3] = unescapeSelector(match[3] || match[4] || match[5] || "");
      if (match[2] === "~=") {
        match[3] = " " + match[3] + " ";
      }
      return match.slice(0, 4);
    },
    CHILD: function(match) {
      match[1] = match[1].toLowerCase();
      if (match[1].slice(0, 3) === "nth") {
        if (!match[3]) {
          selectorError(match[0]);
        }
        match[4] = +(match[4] ? match[5] + (match[6] || 1) : 2 * (match[3] === "even" || match[3] === "odd"));
        match[5] = +(match[7] + match[8] || match[3] === "odd");
      } else if (match[3]) {
        selectorError(match[0]);
      }
      return match;
    },
    PSEUDO: function(match) {
      var excess, unquoted = !match[6] && match[2];
      if (filterMatchExpr.CHILD.test(match[0])) {
        return null;
      }
      if (match[3]) {
        match[2] = match[4] || match[5] || "";
      } else if (unquoted && rpseudo.test(unquoted) && // Get excess from tokenize (recursively)
      (excess = tokenize(unquoted, true)) && // advance to the next closing parenthesis
      (excess = unquoted.indexOf(")", unquoted.length - excess) - unquoted.length)) {
        match[0] = match[0].slice(0, excess);
        match[2] = unquoted.slice(0, excess);
      }
      return match.slice(0, 3);
    }
  };
  function toSelector(tokens) {
    var i2 = 0, len = tokens.length, selector = "";
    for (; i2 < len; i2++) {
      selector += tokens[i2].value;
    }
    return selector;
  }
  function access(elems, fn, key, value, chainable, emptyGet, raw) {
    var i2 = 0, len = elems.length, bulk = key == null;
    if (toType(key) === "object") {
      chainable = true;
      for (i2 in key) {
        access(elems, fn, i2, key[i2], true, emptyGet, raw);
      }
    } else if (value !== void 0) {
      chainable = true;
      if (typeof value !== "function") {
        raw = true;
      }
      if (bulk) {
        if (raw) {
          fn.call(elems, value);
          fn = null;
        } else {
          bulk = fn;
          fn = function(elem, _key, value2) {
            return bulk.call(jQuery2(elem), value2);
          };
        }
      }
      if (fn) {
        for (; i2 < len; i2++) {
          fn(
            elems[i2],
            key,
            raw ? value : value.call(elems[i2], i2, fn(elems[i2], key))
          );
        }
      }
    }
    if (chainable) {
      return elems;
    }
    if (bulk) {
      return fn.call(elems);
    }
    return len ? fn(elems[0], key) : emptyGet;
  }
  var rnothtmlwhite = /[^\x20\t\r\n\f]+/g;
  jQuery2.fn.extend({
    attr: function(name, value) {
      return access(this, jQuery2.attr, name, value, arguments.length > 1);
    },
    removeAttr: function(name) {
      return this.each(function() {
        jQuery2.removeAttr(this, name);
      });
    }
  });
  jQuery2.extend({
    attr: function(elem, name, value) {
      var ret, hooks, nType = elem.nodeType;
      if (nType === 3 || nType === 8 || nType === 2) {
        return;
      }
      if (typeof elem.getAttribute === "undefined") {
        return jQuery2.prop(elem, name, value);
      }
      if (nType !== 1 || !jQuery2.isXMLDoc(elem)) {
        hooks = jQuery2.attrHooks[name.toLowerCase()];
      }
      if (value !== void 0) {
        if (value === null || // For compat with previous handling of boolean attributes,
        // remove when `false` passed. For ARIA attributes -
        // many of which recognize a `"false"` value - continue to
        // set the `"false"` value as jQuery <4 did.
        value === false && name.toLowerCase().indexOf("aria-") !== 0) {
          jQuery2.removeAttr(elem, name);
          return;
        }
        if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== void 0) {
          return ret;
        }
        elem.setAttribute(name, value);
        return value;
      }
      if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
        return ret;
      }
      ret = elem.getAttribute(name);
      return ret == null ? void 0 : ret;
    },
    attrHooks: {},
    removeAttr: function(elem, value) {
      var name, i2 = 0, attrNames = value && value.match(rnothtmlwhite);
      if (attrNames && elem.nodeType === 1) {
        while (name = attrNames[i2++]) {
          elem.removeAttribute(name);
        }
      }
    }
  });
  if (isIE) {
    jQuery2.attrHooks.type = {
      set: function(elem, value) {
        if (value === "radio" && nodeName(elem, "input")) {
          var val = elem.value;
          elem.setAttribute("type", value);
          if (val) {
            elem.value = val;
          }
          return value;
        }
      }
    };
  }
  var rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g;
  function fcssescape(ch, asCodePoint) {
    if (asCodePoint) {
      if (ch === "\0") {
        return "�";
      }
      return ch.slice(0, -1) + "\\" + ch.charCodeAt(ch.length - 1).toString(16) + " ";
    }
    return "\\" + ch;
  }
  jQuery2.escapeSelector = function(sel) {
    return (sel + "").replace(rcssescape, fcssescape);
  };
  var sort = arr.sort;
  var splice = arr.splice;
  var hasDuplicate;
  function sortOrder(a, b) {
    if (a === b) {
      hasDuplicate = true;
      return 0;
    }
    var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
    if (compare) {
      return compare;
    }
    compare = (a.ownerDocument || a) == (b.ownerDocument || b) ? a.compareDocumentPosition(b) : (
      // Otherwise we know they are disconnected
      1
    );
    if (compare & 1) {
      if (a == document$1 || a.ownerDocument == document$1 && jQuery2.contains(document$1, a)) {
        return -1;
      }
      if (b == document$1 || b.ownerDocument == document$1 && jQuery2.contains(document$1, b)) {
        return 1;
      }
      return 0;
    }
    return compare & 4 ? -1 : 1;
  }
  jQuery2.uniqueSort = function(results) {
    var elem, duplicates = [], j = 0, i2 = 0;
    hasDuplicate = false;
    sort.call(results, sortOrder);
    if (hasDuplicate) {
      while (elem = results[i2++]) {
        if (elem === results[i2]) {
          j = duplicates.push(i2);
        }
      }
      while (j--) {
        splice.call(results, duplicates[j], 1);
      }
    }
    return results;
  };
  jQuery2.fn.uniqueSort = function() {
    return this.pushStack(jQuery2.uniqueSort(slice.apply(this)));
  };
  var i, outermostContext, document, documentElement, documentIsHTML, dirruns = 0, done = 0, classCache = createCache(), compilerCache = createCache(), nonnativeSelectorCache = createCache(), rwhitespace = new RegExp(whitespace + "+", "g"), ridentifier = new RegExp("^" + identifier + "$"), matchExpr = jQuery2.extend({
    // For use in libraries implementing .is()
    // We use this for POS matching in `select`
    needsContext: new RegExp("^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i")
  }, filterMatchExpr), rinputs = /^(?:input|select|textarea|button)$/i, rheader = /^h\d$/i, rquickExpr$1 = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, unloadHandler = function() {
    setDocument();
  }, inDisabledFieldset = addCombinator(
    function(elem) {
      return elem.disabled === true && nodeName(elem, "fieldset");
    },
    { dir: "parentNode", next: "legend" }
  );
  function find(selector, context, results, seed) {
    var m, i2, elem, nid, match, groups, newSelector, newContext = context && context.ownerDocument, nodeType = context ? context.nodeType : 9;
    results = results || [];
    if (typeof selector !== "string" || !selector || nodeType !== 1 && nodeType !== 9 && nodeType !== 11) {
      return results;
    }
    if (!seed) {
      setDocument(context);
      context = context || document;
      if (documentIsHTML) {
        if (nodeType !== 11 && (match = rquickExpr$1.exec(selector))) {
          if (m = match[1]) {
            if (nodeType === 9) {
              if (elem = context.getElementById(m)) {
                push.call(results, elem);
              }
              return results;
            } else {
              if (newContext && (elem = newContext.getElementById(m)) && jQuery2.contains(context, elem)) {
                push.call(results, elem);
                return results;
              }
            }
          } else if (match[2]) {
            push.apply(results, context.getElementsByTagName(selector));
            return results;
          } else if ((m = match[3]) && context.getElementsByClassName) {
            push.apply(results, context.getElementsByClassName(m));
            return results;
          }
        }
        if (!nonnativeSelectorCache[selector + " "] && (!rbuggyQSA || !rbuggyQSA.test(selector))) {
          newSelector = selector;
          newContext = context;
          if (nodeType === 1 && (rdescend.test(selector) || rleadingCombinator.test(selector))) {
            newContext = rsibling.test(selector) && testContext(context.parentNode) || context;
            if (newContext != context || isIE) {
              if (nid = context.getAttribute("id")) {
                nid = jQuery2.escapeSelector(nid);
              } else {
                context.setAttribute("id", nid = jQuery2.expando);
              }
            }
            groups = tokenize(selector);
            i2 = groups.length;
            while (i2--) {
              groups[i2] = (nid ? "#" + nid : ":scope") + " " + toSelector(groups[i2]);
            }
            newSelector = groups.join(",");
          }
          try {
            push.apply(
              results,
              newContext.querySelectorAll(newSelector)
            );
            return results;
          } catch (qsaError) {
            nonnativeSelectorCache(selector, true);
          } finally {
            if (nid === jQuery2.expando) {
              context.removeAttribute("id");
            }
          }
        }
      }
    }
    return select(selector.replace(rtrimCSS, "$1"), context, results, seed);
  }
  function markFunction(fn) {
    fn[jQuery2.expando] = true;
    return fn;
  }
  function createInputPseudo(type) {
    return function(elem) {
      return nodeName(elem, "input") && elem.type === type;
    };
  }
  function createButtonPseudo(type) {
    return function(elem) {
      return (nodeName(elem, "input") || nodeName(elem, "button")) && elem.type === type;
    };
  }
  function createDisabledPseudo(disabled) {
    return function(elem) {
      if ("form" in elem) {
        if (elem.parentNode && elem.disabled === false) {
          if ("label" in elem) {
            if ("label" in elem.parentNode) {
              return elem.parentNode.disabled === disabled;
            } else {
              return elem.disabled === disabled;
            }
          }
          return elem.isDisabled === disabled || // Where there is no isDisabled, check manually
          elem.isDisabled !== !disabled && inDisabledFieldset(elem) === disabled;
        }
        return elem.disabled === disabled;
      } else if ("label" in elem) {
        return elem.disabled === disabled;
      }
      return false;
    };
  }
  function createPositionalPseudo(fn) {
    return markFunction(function(argument) {
      argument = +argument;
      return markFunction(function(seed, matches2) {
        var j, matchIndexes = fn([], seed.length, argument), i2 = matchIndexes.length;
        while (i2--) {
          if (seed[j = matchIndexes[i2]]) {
            seed[j] = !(matches2[j] = seed[j]);
          }
        }
      });
    });
  }
  function setDocument(node) {
    var subWindow, doc = node ? node.ownerDocument || node : document$1;
    if (doc == document || doc.nodeType !== 9) {
      return;
    }
    document = doc;
    documentElement = document.documentElement;
    documentIsHTML = !jQuery2.isXMLDoc(document);
    if (isIE && document$1 != document && (subWindow = document.defaultView) && subWindow.top !== subWindow) {
      subWindow.addEventListener("unload", unloadHandler);
    }
  }
  find.matches = function(expr, elements) {
    return find(expr, null, null, elements);
  };
  find.matchesSelector = function(elem, expr) {
    setDocument(elem);
    if (documentIsHTML && !nonnativeSelectorCache[expr + " "] && (!rbuggyQSA || !rbuggyQSA.test(expr))) {
      try {
        return matches.call(elem, expr);
      } catch (e) {
        nonnativeSelectorCache(expr, true);
      }
    }
    return find(expr, document, null, [elem]).length > 0;
  };
  jQuery2.expr = {
    // Can be adjusted by the user
    cacheLength: 50,
    createPseudo: markFunction,
    match: matchExpr,
    find: {
      ID: function(id, context) {
        if (typeof context.getElementById !== "undefined" && documentIsHTML) {
          var elem = context.getElementById(id);
          return elem ? [elem] : [];
        }
      },
      TAG: function(tag, context) {
        if (typeof context.getElementsByTagName !== "undefined") {
          return context.getElementsByTagName(tag);
        } else {
          return context.querySelectorAll(tag);
        }
      },
      CLASS: function(className, context) {
        if (typeof context.getElementsByClassName !== "undefined" && documentIsHTML) {
          return context.getElementsByClassName(className);
        }
      }
    },
    relative: {
      ">": { dir: "parentNode", first: true },
      " ": { dir: "parentNode" },
      "+": { dir: "previousSibling", first: true },
      "~": { dir: "previousSibling" }
    },
    preFilter,
    filter: {
      ID: function(id) {
        var attrId = unescapeSelector(id);
        return function(elem) {
          return elem.getAttribute("id") === attrId;
        };
      },
      TAG: function(nodeNameSelector) {
        var expectedNodeName = unescapeSelector(nodeNameSelector).toLowerCase();
        return nodeNameSelector === "*" ? function() {
          return true;
        } : function(elem) {
          return nodeName(elem, expectedNodeName);
        };
      },
      CLASS: function(className) {
        var pattern = classCache[className + " "];
        return pattern || (pattern = new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)")) && classCache(className, function(elem) {
          return pattern.test(
            typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || ""
          );
        });
      },
      ATTR: function(name, operator, check) {
        return function(elem) {
          var result = jQuery2.attr(elem, name);
          if (result == null) {
            return operator === "!=";
          }
          if (!operator) {
            return true;
          }
          result += "";
          if (operator === "=") {
            return result === check;
          }
          if (operator === "!=") {
            return result !== check;
          }
          if (operator === "^=") {
            return check && result.indexOf(check) === 0;
          }
          if (operator === "*=") {
            return check && result.indexOf(check) > -1;
          }
          if (operator === "$=") {
            return check && result.slice(-check.length) === check;
          }
          if (operator === "~=") {
            return (" " + result.replace(rwhitespace, " ") + " ").indexOf(check) > -1;
          }
          if (operator === "|=") {
            return result === check || result.slice(0, check.length + 1) === check + "-";
          }
          return false;
        };
      },
      CHILD: function(type, what, _argument, first, last) {
        var simple = type.slice(0, 3) !== "nth", forward = type.slice(-4) !== "last", ofType = what === "of-type";
        return first === 1 && last === 0 ? (
          // Shortcut for :nth-*(n)
          function(elem) {
            return !!elem.parentNode;
          }
        ) : function(elem, _context, xml) {
          var cache, outerCache, node, nodeIndex, start, dir2 = simple !== forward ? "nextSibling" : "previousSibling", parent = elem.parentNode, name = ofType && elem.nodeName.toLowerCase(), useCache = !xml && !ofType, diff = false;
          if (parent) {
            if (simple) {
              while (dir2) {
                node = elem;
                while (node = node[dir2]) {
                  if (ofType ? nodeName(node, name) : node.nodeType === 1) {
                    return false;
                  }
                }
                start = dir2 = type === "only" && !start && "nextSibling";
              }
              return true;
            }
            start = [forward ? parent.firstChild : parent.lastChild];
            if (forward && useCache) {
              outerCache = parent[jQuery2.expando] || (parent[jQuery2.expando] = {});
              cache = outerCache[type] || [];
              nodeIndex = cache[0] === dirruns && cache[1];
              diff = nodeIndex && cache[2];
              node = nodeIndex && parent.childNodes[nodeIndex];
              while (node = ++nodeIndex && node && node[dir2] || // Fallback to seeking `elem` from the start
              (diff = nodeIndex = 0) || start.pop()) {
                if (node.nodeType === 1 && ++diff && node === elem) {
                  outerCache[type] = [dirruns, nodeIndex, diff];
                  break;
                }
              }
            } else {
              if (useCache) {
                outerCache = elem[jQuery2.expando] || (elem[jQuery2.expando] = {});
                cache = outerCache[type] || [];
                nodeIndex = cache[0] === dirruns && cache[1];
                diff = nodeIndex;
              }
              if (diff === false) {
                while (node = ++nodeIndex && node && node[dir2] || (diff = nodeIndex = 0) || start.pop()) {
                  if ((ofType ? nodeName(node, name) : node.nodeType === 1) && ++diff) {
                    if (useCache) {
                      outerCache = node[jQuery2.expando] || (node[jQuery2.expando] = {});
                      outerCache[type] = [dirruns, diff];
                    }
                    if (node === elem) {
                      break;
                    }
                  }
                }
              }
            }
            diff -= last;
            return diff === first || diff % first === 0 && diff / first >= 0;
          }
        };
      },
      PSEUDO: function(pseudo, argument) {
        var fn = jQuery2.expr.pseudos[pseudo] || jQuery2.expr.setFilters[pseudo.toLowerCase()] || selectorError("unsupported pseudo: " + pseudo);
        if (fn[jQuery2.expando]) {
          return fn(argument);
        }
        return fn;
      }
    },
    pseudos: {
      // Potentially complex pseudos
      not: markFunction(function(selector) {
        var input = [], results = [], matcher = compile(selector.replace(rtrimCSS, "$1"));
        return matcher[jQuery2.expando] ? markFunction(function(seed, matches2, _context, xml) {
          var elem, unmatched = matcher(seed, null, xml, []), i2 = seed.length;
          while (i2--) {
            if (elem = unmatched[i2]) {
              seed[i2] = !(matches2[i2] = elem);
            }
          }
        }) : function(elem, _context, xml) {
          input[0] = elem;
          matcher(input, null, xml, results);
          input[0] = null;
          return !results.pop();
        };
      }),
      has: markFunction(function(selector) {
        return function(elem) {
          return find(selector, elem).length > 0;
        };
      }),
      contains: markFunction(function(text) {
        text = unescapeSelector(text);
        return function(elem) {
          return (elem.textContent || jQuery2.text(elem)).indexOf(text) > -1;
        };
      }),
      // "Whether an element is represented by a :lang() selector
      // is based solely on the element's language value
      // being equal to the identifier C,
      // or beginning with the identifier C immediately followed by "-".
      // The matching of C against the element's language value is performed case-insensitively.
      // The identifier C does not have to be a valid language name."
      // https://www.w3.org/TR/selectors/#lang-pseudo
      lang: markFunction(function(lang) {
        if (!ridentifier.test(lang || "")) {
          selectorError("unsupported lang: " + lang);
        }
        lang = unescapeSelector(lang).toLowerCase();
        return function(elem) {
          var elemLang;
          do {
            if (elemLang = documentIsHTML ? elem.lang : elem.getAttribute("xml:lang") || elem.getAttribute("lang")) {
              elemLang = elemLang.toLowerCase();
              return elemLang === lang || elemLang.indexOf(lang + "-") === 0;
            }
          } while ((elem = elem.parentNode) && elem.nodeType === 1);
          return false;
        };
      }),
      // Miscellaneous
      target: function(elem) {
        var hash = window2.location && window2.location.hash;
        return hash && hash.slice(1) === elem.id;
      },
      root: function(elem) {
        return elem === documentElement;
      },
      focus: function(elem) {
        return elem === document.activeElement && document.hasFocus() && !!(elem.type || elem.href || ~elem.tabIndex);
      },
      // Boolean properties
      enabled: createDisabledPseudo(false),
      disabled: createDisabledPseudo(true),
      checked: function(elem) {
        return nodeName(elem, "input") && !!elem.checked || nodeName(elem, "option") && !!elem.selected;
      },
      selected: function(elem) {
        if (isIE && elem.parentNode) {
          elem.parentNode.selectedIndex;
        }
        return elem.selected === true;
      },
      // Contents
      empty: function(elem) {
        for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
          if (elem.nodeType < 6) {
            return false;
          }
        }
        return true;
      },
      parent: function(elem) {
        return !jQuery2.expr.pseudos.empty(elem);
      },
      // Element/input types
      header: function(elem) {
        return rheader.test(elem.nodeName);
      },
      input: function(elem) {
        return rinputs.test(elem.nodeName);
      },
      button: function(elem) {
        return nodeName(elem, "input") && elem.type === "button" || nodeName(elem, "button");
      },
      text: function(elem) {
        return nodeName(elem, "input") && elem.type === "text";
      },
      // Position-in-collection
      first: createPositionalPseudo(function() {
        return [0];
      }),
      last: createPositionalPseudo(function(_matchIndexes, length) {
        return [length - 1];
      }),
      eq: createPositionalPseudo(function(_matchIndexes, length, argument) {
        return [argument < 0 ? argument + length : argument];
      }),
      even: createPositionalPseudo(function(matchIndexes, length) {
        var i2 = 0;
        for (; i2 < length; i2 += 2) {
          matchIndexes.push(i2);
        }
        return matchIndexes;
      }),
      odd: createPositionalPseudo(function(matchIndexes, length) {
        var i2 = 1;
        for (; i2 < length; i2 += 2) {
          matchIndexes.push(i2);
        }
        return matchIndexes;
      }),
      lt: createPositionalPseudo(function(matchIndexes, length, argument) {
        var i2;
        if (argument < 0) {
          i2 = argument + length;
        } else if (argument > length) {
          i2 = length;
        } else {
          i2 = argument;
        }
        for (; --i2 >= 0; ) {
          matchIndexes.push(i2);
        }
        return matchIndexes;
      }),
      gt: createPositionalPseudo(function(matchIndexes, length, argument) {
        var i2 = argument < 0 ? argument + length : argument;
        for (; ++i2 < length; ) {
          matchIndexes.push(i2);
        }
        return matchIndexes;
      })
    }
  };
  jQuery2.expr.pseudos.nth = jQuery2.expr.pseudos.eq;
  for (i in { radio: true, checkbox: true, file: true, password: true, image: true }) {
    jQuery2.expr.pseudos[i] = createInputPseudo(i);
  }
  for (i in { submit: true, reset: true }) {
    jQuery2.expr.pseudos[i] = createButtonPseudo(i);
  }
  function setFilters() {
  }
  setFilters.prototype = jQuery2.expr.pseudos;
  jQuery2.expr.setFilters = new setFilters();
  function addCombinator(matcher, combinator, base) {
    var dir2 = combinator.dir, skip = combinator.next, key = skip || dir2, checkNonElements = base && key === "parentNode", doneName = done++;
    return combinator.first ? (
      // Check against closest ancestor/preceding element
      function(elem, context, xml) {
        while (elem = elem[dir2]) {
          if (elem.nodeType === 1 || checkNonElements) {
            return matcher(elem, context, xml);
          }
        }
        return false;
      }
    ) : (
      // Check against all ancestor/preceding elements
      function(elem, context, xml) {
        var oldCache, outerCache, newCache = [dirruns, doneName];
        if (xml) {
          while (elem = elem[dir2]) {
            if (elem.nodeType === 1 || checkNonElements) {
              if (matcher(elem, context, xml)) {
                return true;
              }
            }
          }
        } else {
          while (elem = elem[dir2]) {
            if (elem.nodeType === 1 || checkNonElements) {
              outerCache = elem[jQuery2.expando] || (elem[jQuery2.expando] = {});
              if (skip && nodeName(elem, skip)) {
                elem = elem[dir2] || elem;
              } else if ((oldCache = outerCache[key]) && oldCache[0] === dirruns && oldCache[1] === doneName) {
                return newCache[2] = oldCache[2];
              } else {
                outerCache[key] = newCache;
                if (newCache[2] = matcher(elem, context, xml)) {
                  return true;
                }
              }
            }
          }
        }
        return false;
      }
    );
  }
  function elementMatcher(matchers) {
    return matchers.length > 1 ? function(elem, context, xml) {
      var i2 = matchers.length;
      while (i2--) {
        if (!matchers[i2](elem, context, xml)) {
          return false;
        }
      }
      return true;
    } : matchers[0];
  }
  function multipleContexts(selector, contexts, results) {
    var i2 = 0, len = contexts.length;
    for (; i2 < len; i2++) {
      find(selector, contexts[i2], results);
    }
    return results;
  }
  function condense(unmatched, map, filter, context, xml) {
    var elem, newUnmatched = [], i2 = 0, len = unmatched.length, mapped = map != null;
    for (; i2 < len; i2++) {
      if (elem = unmatched[i2]) {
        if (!filter || filter(elem, context, xml)) {
          newUnmatched.push(elem);
          if (mapped) {
            map.push(i2);
          }
        }
      }
    }
    return newUnmatched;
  }
  function setMatcher(preFilter2, selector, matcher, postFilter, postFinder, postSelector) {
    if (postFilter && !postFilter[jQuery2.expando]) {
      postFilter = setMatcher(postFilter);
    }
    if (postFinder && !postFinder[jQuery2.expando]) {
      postFinder = setMatcher(postFinder, postSelector);
    }
    return markFunction(function(seed, results, context, xml) {
      var temp, i2, elem, matcherOut, preMap = [], postMap = [], preexisting = results.length, elems = seed || multipleContexts(
        selector || "*",
        context.nodeType ? [context] : context,
        []
      ), matcherIn = preFilter2 && (seed || !selector) ? condense(elems, preMap, preFilter2, context, xml) : elems;
      if (matcher) {
        matcherOut = postFinder || (seed ? preFilter2 : preexisting || postFilter) ? (
          // ...intermediate processing is necessary
          []
        ) : (
          // ...otherwise use results directly
          results
        );
        matcher(matcherIn, matcherOut, context, xml);
      } else {
        matcherOut = matcherIn;
      }
      if (postFilter) {
        temp = condense(matcherOut, postMap);
        postFilter(temp, [], context, xml);
        i2 = temp.length;
        while (i2--) {
          if (elem = temp[i2]) {
            matcherOut[postMap[i2]] = !(matcherIn[postMap[i2]] = elem);
          }
        }
      }
      if (seed) {
        if (postFinder || preFilter2) {
          if (postFinder) {
            temp = [];
            i2 = matcherOut.length;
            while (i2--) {
              if (elem = matcherOut[i2]) {
                temp.push(matcherIn[i2] = elem);
              }
            }
            postFinder(null, matcherOut = [], temp, xml);
          }
          i2 = matcherOut.length;
          while (i2--) {
            if ((elem = matcherOut[i2]) && (temp = postFinder ? indexOf.call(seed, elem) : preMap[i2]) > -1) {
              seed[temp] = !(results[temp] = elem);
            }
          }
        }
      } else {
        matcherOut = condense(
          matcherOut === results ? matcherOut.splice(preexisting, matcherOut.length) : matcherOut
        );
        if (postFinder) {
          postFinder(null, results, matcherOut, xml);
        } else {
          push.apply(results, matcherOut);
        }
      }
    });
  }
  function matcherFromTokens(tokens) {
    var checkContext, matcher, j, len = tokens.length, leadingRelative = jQuery2.expr.relative[tokens[0].type], implicitRelative = leadingRelative || jQuery2.expr.relative[" "], i2 = leadingRelative ? 1 : 0, matchContext = addCombinator(function(elem) {
      return elem === checkContext;
    }, implicitRelative, true), matchAnyContext = addCombinator(function(elem) {
      return indexOf.call(checkContext, elem) > -1;
    }, implicitRelative, true), matchers = [function(elem, context, xml) {
      var ret = !leadingRelative && (xml || context != outermostContext) || ((checkContext = context).nodeType ? matchContext(elem, context, xml) : matchAnyContext(elem, context, xml));
      checkContext = null;
      return ret;
    }];
    for (; i2 < len; i2++) {
      if (matcher = jQuery2.expr.relative[tokens[i2].type]) {
        matchers = [addCombinator(elementMatcher(matchers), matcher)];
      } else {
        matcher = jQuery2.expr.filter[tokens[i2].type].apply(null, tokens[i2].matches);
        if (matcher[jQuery2.expando]) {
          j = ++i2;
          for (; j < len; j++) {
            if (jQuery2.expr.relative[tokens[j].type]) {
              break;
            }
          }
          return setMatcher(
            i2 > 1 && elementMatcher(matchers),
            i2 > 1 && toSelector(
              // If the preceding token was a descendant combinator, insert an implicit any-element `*`
              tokens.slice(0, i2 - 1).concat({ value: tokens[i2 - 2].type === " " ? "*" : "" })
            ).replace(rtrimCSS, "$1"),
            matcher,
            i2 < j && matcherFromTokens(tokens.slice(i2, j)),
            j < len && matcherFromTokens(tokens = tokens.slice(j)),
            j < len && toSelector(tokens)
          );
        }
        matchers.push(matcher);
      }
    }
    return elementMatcher(matchers);
  }
  function matcherFromGroupMatchers(elementMatchers, setMatchers) {
    var bySet = setMatchers.length > 0, byElement = elementMatchers.length > 0, superMatcher = function(seed, context, xml, results, outermost) {
      var elem, j, matcher, matchedCount = 0, i2 = "0", unmatched = seed && [], setMatched = [], contextBackup = outermostContext, elems = seed || byElement && jQuery2.expr.find.TAG("*", outermost), dirrunsUnique = dirruns += contextBackup == null ? 1 : Math.random() || 0.1;
      if (outermost) {
        outermostContext = context == document || context || outermost;
      }
      for (; (elem = elems[i2]) != null; i2++) {
        if (byElement && elem) {
          j = 0;
          if (!context && elem.ownerDocument != document) {
            setDocument(elem);
            xml = !documentIsHTML;
          }
          while (matcher = elementMatchers[j++]) {
            if (matcher(elem, context || document, xml)) {
              push.call(results, elem);
              break;
            }
          }
          if (outermost) {
            dirruns = dirrunsUnique;
          }
        }
        if (bySet) {
          if (elem = !matcher && elem) {
            matchedCount--;
          }
          if (seed) {
            unmatched.push(elem);
          }
        }
      }
      matchedCount += i2;
      if (bySet && i2 !== matchedCount) {
        j = 0;
        while (matcher = setMatchers[j++]) {
          matcher(unmatched, setMatched, context, xml);
        }
        if (seed) {
          if (matchedCount > 0) {
            while (i2--) {
              if (!(unmatched[i2] || setMatched[i2])) {
                setMatched[i2] = pop.call(results);
              }
            }
          }
          setMatched = condense(setMatched);
        }
        push.apply(results, setMatched);
        if (outermost && !seed && setMatched.length > 0 && matchedCount + setMatchers.length > 1) {
          jQuery2.uniqueSort(results);
        }
      }
      if (outermost) {
        dirruns = dirrunsUnique;
        outermostContext = contextBackup;
      }
      return unmatched;
    };
    return bySet ? markFunction(superMatcher) : superMatcher;
  }
  function compile(selector, match) {
    var i2, setMatchers = [], elementMatchers = [], cached = compilerCache[selector + " "];
    if (!cached) {
      if (!match) {
        match = tokenize(selector);
      }
      i2 = match.length;
      while (i2--) {
        cached = matcherFromTokens(match[i2]);
        if (cached[jQuery2.expando]) {
          setMatchers.push(cached);
        } else {
          elementMatchers.push(cached);
        }
      }
      cached = compilerCache(
        selector,
        matcherFromGroupMatchers(elementMatchers, setMatchers)
      );
      cached.selector = selector;
    }
    return cached;
  }
  function select(selector, context, results, seed) {
    var i2, tokens, token, type, find2, compiled = typeof selector === "function" && selector, match = !seed && tokenize(selector = compiled.selector || selector);
    results = results || [];
    if (match.length === 1) {
      tokens = match[0] = match[0].slice(0);
      if (tokens.length > 2 && (token = tokens[0]).type === "ID" && context.nodeType === 9 && documentIsHTML && jQuery2.expr.relative[tokens[1].type]) {
        context = (jQuery2.expr.find.ID(
          unescapeSelector(token.matches[0]),
          context
        ) || [])[0];
        if (!context) {
          return results;
        } else if (compiled) {
          context = context.parentNode;
        }
        selector = selector.slice(tokens.shift().value.length);
      }
      i2 = matchExpr.needsContext.test(selector) ? 0 : tokens.length;
      while (i2--) {
        token = tokens[i2];
        if (jQuery2.expr.relative[type = token.type]) {
          break;
        }
        if (find2 = jQuery2.expr.find[type]) {
          if (seed = find2(
            unescapeSelector(token.matches[0]),
            rsibling.test(tokens[0].type) && testContext(context.parentNode) || context
          )) {
            tokens.splice(i2, 1);
            selector = seed.length && toSelector(tokens);
            if (!selector) {
              push.apply(results, seed);
              return results;
            }
            break;
          }
        }
      }
    }
    (compiled || compile(selector, match))(
      seed,
      context,
      !documentIsHTML,
      results,
      !context || rsibling.test(selector) && testContext(context.parentNode) || context
    );
    return results;
  }
  setDocument();
  jQuery2.find = find;
  find.compile = compile;
  find.select = select;
  find.setDocument = setDocument;
  find.tokenize = tokenize;
  function dir(elem, dir2, until) {
    var matched = [], truncate = until !== void 0;
    while ((elem = elem[dir2]) && elem.nodeType !== 9) {
      if (elem.nodeType === 1) {
        if (truncate && jQuery2(elem).is(until)) {
          break;
        }
        matched.push(elem);
      }
    }
    return matched;
  }
  function siblings(n, elem) {
    var matched = [];
    for (; n; n = n.nextSibling) {
      if (n.nodeType === 1 && n !== elem) {
        matched.push(n);
      }
    }
    return matched;
  }
  var rneedsContext = jQuery2.expr.match.needsContext;
  var rsingleTag = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;
  function isObviousHtml(input) {
    return input[0] === "<" && input[input.length - 1] === ">" && input.length >= 3;
  }
  function winnow(elements, qualifier, not) {
    if (typeof qualifier === "function") {
      return jQuery2.grep(elements, function(elem, i2) {
        return !!qualifier.call(elem, i2, elem) !== not;
      });
    }
    if (qualifier.nodeType) {
      return jQuery2.grep(elements, function(elem) {
        return elem === qualifier !== not;
      });
    }
    if (typeof qualifier !== "string") {
      return jQuery2.grep(elements, function(elem) {
        return indexOf.call(qualifier, elem) > -1 !== not;
      });
    }
    return jQuery2.filter(qualifier, elements, not);
  }
  jQuery2.filter = function(expr, elems, not) {
    var elem = elems[0];
    if (not) {
      expr = ":not(" + expr + ")";
    }
    if (elems.length === 1 && elem.nodeType === 1) {
      return jQuery2.find.matchesSelector(elem, expr) ? [elem] : [];
    }
    return jQuery2.find.matches(expr, jQuery2.grep(elems, function(elem2) {
      return elem2.nodeType === 1;
    }));
  };
  jQuery2.fn.extend({
    find: function(selector) {
      var i2, ret, len = this.length, self = this;
      if (typeof selector !== "string") {
        return this.pushStack(jQuery2(selector).filter(function() {
          for (i2 = 0; i2 < len; i2++) {
            if (jQuery2.contains(self[i2], this)) {
              return true;
            }
          }
        }));
      }
      ret = this.pushStack([]);
      for (i2 = 0; i2 < len; i2++) {
        jQuery2.find(selector, self[i2], ret);
      }
      return len > 1 ? jQuery2.uniqueSort(ret) : ret;
    },
    filter: function(selector) {
      return this.pushStack(winnow(this, selector || [], false));
    },
    not: function(selector) {
      return this.pushStack(winnow(this, selector || [], true));
    },
    is: function(selector) {
      return !!winnow(
        this,
        // If this is a positional/relative selector, check membership in the returned set
        // so $("p:first").is("p:last") won't return true for a doc with two "p".
        typeof selector === "string" && rneedsContext.test(selector) ? jQuery2(selector) : selector || [],
        false
      ).length;
    }
  });
  var rootjQuery, rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/, init = jQuery2.fn.init = function(selector, context) {
    var match, elem;
    if (!selector) {
      return this;
    }
    if (selector.nodeType) {
      this[0] = selector;
      this.length = 1;
      return this;
    } else if (typeof selector === "function") {
      return rootjQuery.ready !== void 0 ? rootjQuery.ready(selector) : (
        // Execute immediately if ready is not present
        selector(jQuery2)
      );
    } else {
      match = selector + "";
      if (isObviousHtml(match)) {
        match = [null, selector, null];
      } else if (typeof selector === "string") {
        match = rquickExpr.exec(selector);
      } else {
        return jQuery2.makeArray(selector, this);
      }
      if (match && (match[1] || !context)) {
        if (match[1]) {
          context = context instanceof jQuery2 ? context[0] : context;
          jQuery2.merge(this, jQuery2.parseHTML(
            match[1],
            context && context.nodeType ? context.ownerDocument || context : document$1,
            true
          ));
          if (rsingleTag.test(match[1]) && jQuery2.isPlainObject(context)) {
            for (match in context) {
              if (typeof this[match] === "function") {
                this[match](context[match]);
              } else {
                this.attr(match, context[match]);
              }
            }
          }
          return this;
        } else {
          elem = document$1.getElementById(match[2]);
          if (elem) {
            this[0] = elem;
            this.length = 1;
          }
          return this;
        }
      } else if (!context || context.jquery) {
        return (context || rootjQuery).find(selector);
      } else {
        return this.constructor(context).find(selector);
      }
    }
  };
  init.prototype = jQuery2.fn;
  rootjQuery = jQuery2(document$1);
  var rparentsprev = /^(?:parents|prev(?:Until|All))/, guaranteedUnique = {
    children: true,
    contents: true,
    next: true,
    prev: true
  };
  jQuery2.fn.extend({
    has: function(target) {
      var targets = jQuery2(target, this), l = targets.length;
      return this.filter(function() {
        var i2 = 0;
        for (; i2 < l; i2++) {
          if (jQuery2.contains(this, targets[i2])) {
            return true;
          }
        }
      });
    },
    closest: function(selectors, context) {
      var cur, i2 = 0, l = this.length, matched = [], targets = typeof selectors !== "string" && jQuery2(selectors);
      if (!rneedsContext.test(selectors)) {
        for (; i2 < l; i2++) {
          for (cur = this[i2]; cur && cur !== context; cur = cur.parentNode) {
            if (cur.nodeType < 11 && (targets ? targets.index(cur) > -1 : (
              // Don't pass non-elements to jQuery#find
              cur.nodeType === 1 && jQuery2.find.matchesSelector(cur, selectors)
            ))) {
              matched.push(cur);
              break;
            }
          }
        }
      }
      return this.pushStack(matched.length > 1 ? jQuery2.uniqueSort(matched) : matched);
    },
    // Determine the position of an element within the set
    index: function(elem) {
      if (!elem) {
        return this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
      }
      if (typeof elem === "string") {
        return indexOf.call(jQuery2(elem), this[0]);
      }
      return indexOf.call(
        this,
        // If it receives a jQuery object, the first element is used
        elem.jquery ? elem[0] : elem
      );
    },
    add: function(selector, context) {
      return this.pushStack(
        jQuery2.uniqueSort(
          jQuery2.merge(this.get(), jQuery2(selector, context))
        )
      );
    },
    addBack: function(selector) {
      return this.add(
        selector == null ? this.prevObject : this.prevObject.filter(selector)
      );
    }
  });
  function sibling(cur, dir2) {
    while ((cur = cur[dir2]) && cur.nodeType !== 1) {
    }
    return cur;
  }
  jQuery2.each({
    parent: function(elem) {
      var parent = elem.parentNode;
      return parent && parent.nodeType !== 11 ? parent : null;
    },
    parents: function(elem) {
      return dir(elem, "parentNode");
    },
    parentsUntil: function(elem, _i, until) {
      return dir(elem, "parentNode", until);
    },
    next: function(elem) {
      return sibling(elem, "nextSibling");
    },
    prev: function(elem) {
      return sibling(elem, "previousSibling");
    },
    nextAll: function(elem) {
      return dir(elem, "nextSibling");
    },
    prevAll: function(elem) {
      return dir(elem, "previousSibling");
    },
    nextUntil: function(elem, _i, until) {
      return dir(elem, "nextSibling", until);
    },
    prevUntil: function(elem, _i, until) {
      return dir(elem, "previousSibling", until);
    },
    siblings: function(elem) {
      return siblings((elem.parentNode || {}).firstChild, elem);
    },
    children: function(elem) {
      return siblings(elem.firstChild);
    },
    contents: function(elem) {
      if (elem.contentDocument != null && // Support: IE 11+
      // <object> elements with no `data` attribute has an object
      // `contentDocument` with a `null` prototype.
      getProto(elem.contentDocument)) {
        return elem.contentDocument;
      }
      if (nodeName(elem, "template")) {
        elem = elem.content || elem;
      }
      return jQuery2.merge([], elem.childNodes);
    }
  }, function(name, fn) {
    jQuery2.fn[name] = function(until, selector) {
      var matched = jQuery2.map(this, fn, until);
      if (name.slice(-5) !== "Until") {
        selector = until;
      }
      if (selector && typeof selector === "string") {
        matched = jQuery2.filter(selector, matched);
      }
      if (this.length > 1) {
        if (!guaranteedUnique[name]) {
          jQuery2.uniqueSort(matched);
        }
        if (rparentsprev.test(name)) {
          matched.reverse();
        }
      }
      return this.pushStack(matched);
    };
  });
  function createOptions(options) {
    var object = {};
    jQuery2.each(options.match(rnothtmlwhite) || [], function(_, flag) {
      object[flag] = true;
    });
    return object;
  }
  jQuery2.Callbacks = function(options) {
    options = typeof options === "string" ? createOptions(options) : jQuery2.extend({}, options);
    var firing, memory, fired, locked, list = [], queue = [], firingIndex = -1, fire = function() {
      locked = locked || options.once;
      fired = firing = true;
      for (; queue.length; firingIndex = -1) {
        memory = queue.shift();
        while (++firingIndex < list.length) {
          if (list[firingIndex].apply(memory[0], memory[1]) === false && options.stopOnFalse) {
            firingIndex = list.length;
            memory = false;
          }
        }
      }
      if (!options.memory) {
        memory = false;
      }
      firing = false;
      if (locked) {
        if (memory) {
          list = [];
        } else {
          list = "";
        }
      }
    }, self = {
      // Add a callback or a collection of callbacks to the list
      add: function() {
        if (list) {
          if (memory && !firing) {
            firingIndex = list.length - 1;
            queue.push(memory);
          }
          (function add(args) {
            jQuery2.each(args, function(_, arg) {
              if (typeof arg === "function") {
                if (!options.unique || !self.has(arg)) {
                  list.push(arg);
                }
              } else if (arg && arg.length && toType(arg) !== "string") {
                add(arg);
              }
            });
          })(arguments);
          if (memory && !firing) {
            fire();
          }
        }
        return this;
      },
      // Remove a callback from the list
      remove: function() {
        jQuery2.each(arguments, function(_, arg) {
          var index;
          while ((index = jQuery2.inArray(arg, list, index)) > -1) {
            list.splice(index, 1);
            if (index <= firingIndex) {
              firingIndex--;
            }
          }
        });
        return this;
      },
      // Check if a given callback is in the list.
      // If no argument is given, return whether or not list has callbacks attached.
      has: function(fn) {
        return fn ? jQuery2.inArray(fn, list) > -1 : list.length > 0;
      },
      // Remove all callbacks from the list
      empty: function() {
        if (list) {
          list = [];
        }
        return this;
      },
      // Disable .fire and .add
      // Abort any current/pending executions
      // Clear all callbacks and values
      disable: function() {
        locked = queue = [];
        list = memory = "";
        return this;
      },
      disabled: function() {
        return !list;
      },
      // Disable .fire
      // Also disable .add unless we have memory (since it would have no effect)
      // Abort any pending executions
      lock: function() {
        locked = queue = [];
        if (!memory && !firing) {
          list = memory = "";
        }
        return this;
      },
      locked: function() {
        return !!locked;
      },
      // Call all callbacks with the given context and arguments
      fireWith: function(context, args) {
        if (!locked) {
          args = args || [];
          args = [context, args.slice ? args.slice() : args];
          queue.push(args);
          if (!firing) {
            fire();
          }
        }
        return this;
      },
      // Call all the callbacks with the given arguments
      fire: function() {
        self.fireWith(this, arguments);
        return this;
      },
      // To know if the callbacks have already been called at least once
      fired: function() {
        return !!fired;
      }
    };
    return self;
  };
  function Identity(v) {
    return v;
  }
  function Thrower(ex) {
    throw ex;
  }
  function adoptValue(value, resolve, reject, noValue) {
    var method;
    try {
      if (value && typeof (method = value.promise) === "function") {
        method.call(value).done(resolve).fail(reject);
      } else if (value && typeof (method = value.then) === "function") {
        method.call(value, resolve, reject);
      } else {
        resolve.apply(void 0, [value].slice(noValue));
      }
    } catch (value2) {
      reject(value2);
    }
  }
  jQuery2.extend({
    Deferred: function(func) {
      var tuples = [
        // action, add listener, callbacks,
        // ... .then handlers, argument index, [final state]
        [
          "notify",
          "progress",
          jQuery2.Callbacks("memory"),
          jQuery2.Callbacks("memory"),
          2
        ],
        [
          "resolve",
          "done",
          jQuery2.Callbacks("once memory"),
          jQuery2.Callbacks("once memory"),
          0,
          "resolved"
        ],
        [
          "reject",
          "fail",
          jQuery2.Callbacks("once memory"),
          jQuery2.Callbacks("once memory"),
          1,
          "rejected"
        ]
      ], state = "pending", promise = {
        state: function() {
          return state;
        },
        always: function() {
          deferred.done(arguments).fail(arguments);
          return this;
        },
        catch: function(fn) {
          return promise.then(null, fn);
        },
        // Keep pipe for back-compat
        pipe: function() {
          var fns = arguments;
          return jQuery2.Deferred(function(newDefer) {
            jQuery2.each(tuples, function(_i, tuple) {
              var fn = typeof fns[tuple[4]] === "function" && fns[tuple[4]];
              deferred[tuple[1]](function() {
                var returned = fn && fn.apply(this, arguments);
                if (returned && typeof returned.promise === "function") {
                  returned.promise().progress(newDefer.notify).done(newDefer.resolve).fail(newDefer.reject);
                } else {
                  newDefer[tuple[0] + "With"](
                    this,
                    fn ? [returned] : arguments
                  );
                }
              });
            });
            fns = null;
          }).promise();
        },
        then: function(onFulfilled, onRejected, onProgress) {
          var maxDepth = 0;
          function resolve(depth, deferred2, handler, special) {
            return function() {
              var that = this, args = arguments, mightThrow = function() {
                var returned, then;
                if (depth < maxDepth) {
                  return;
                }
                returned = handler.apply(that, args);
                if (returned === deferred2.promise()) {
                  throw new TypeError("Thenable self-resolution");
                }
                then = returned && // Support: Promises/A+ section 2.3.4
                // https://promisesaplus.com/#point-64
                // Only check objects and functions for thenability
                (typeof returned === "object" || typeof returned === "function") && returned.then;
                if (typeof then === "function") {
                  if (special) {
                    then.call(
                      returned,
                      resolve(maxDepth, deferred2, Identity, special),
                      resolve(maxDepth, deferred2, Thrower, special)
                    );
                  } else {
                    maxDepth++;
                    then.call(
                      returned,
                      resolve(maxDepth, deferred2, Identity, special),
                      resolve(maxDepth, deferred2, Thrower, special),
                      resolve(
                        maxDepth,
                        deferred2,
                        Identity,
                        deferred2.notifyWith
                      )
                    );
                  }
                } else {
                  if (handler !== Identity) {
                    that = void 0;
                    args = [returned];
                  }
                  (special || deferred2.resolveWith)(that, args);
                }
              }, process = special ? mightThrow : function() {
                try {
                  mightThrow();
                } catch (e) {
                  if (jQuery2.Deferred.exceptionHook) {
                    jQuery2.Deferred.exceptionHook(
                      e,
                      process.error
                    );
                  }
                  if (depth + 1 >= maxDepth) {
                    if (handler !== Thrower) {
                      that = void 0;
                      args = [e];
                    }
                    deferred2.rejectWith(that, args);
                  }
                }
              };
              if (depth) {
                process();
              } else {
                if (jQuery2.Deferred.getErrorHook) {
                  process.error = jQuery2.Deferred.getErrorHook();
                }
                window2.setTimeout(process);
              }
            };
          }
          return jQuery2.Deferred(function(newDefer) {
            tuples[0][3].add(
              resolve(
                0,
                newDefer,
                typeof onProgress === "function" ? onProgress : Identity,
                newDefer.notifyWith
              )
            );
            tuples[1][3].add(
              resolve(
                0,
                newDefer,
                typeof onFulfilled === "function" ? onFulfilled : Identity
              )
            );
            tuples[2][3].add(
              resolve(
                0,
                newDefer,
                typeof onRejected === "function" ? onRejected : Thrower
              )
            );
          }).promise();
        },
        // Get a promise for this deferred
        // If obj is provided, the promise aspect is added to the object
        promise: function(obj) {
          return obj != null ? jQuery2.extend(obj, promise) : promise;
        }
      }, deferred = {};
      jQuery2.each(tuples, function(i2, tuple) {
        var list = tuple[2], stateString = tuple[5];
        promise[tuple[1]] = list.add;
        if (stateString) {
          list.add(
            function() {
              state = stateString;
            },
            // rejected_callbacks.disable
            // fulfilled_callbacks.disable
            tuples[3 - i2][2].disable,
            // rejected_handlers.disable
            // fulfilled_handlers.disable
            tuples[3 - i2][3].disable,
            // progress_callbacks.lock
            tuples[0][2].lock,
            // progress_handlers.lock
            tuples[0][3].lock
          );
        }
        list.add(tuple[3].fire);
        deferred[tuple[0]] = function() {
          deferred[tuple[0] + "With"](this === deferred ? void 0 : this, arguments);
          return this;
        };
        deferred[tuple[0] + "With"] = list.fireWith;
      });
      promise.promise(deferred);
      if (func) {
        func.call(deferred, deferred);
      }
      return deferred;
    },
    // Deferred helper
    when: function(singleValue) {
      var remaining = arguments.length, i2 = remaining, resolveContexts = Array(i2), resolveValues = slice.call(arguments), primary = jQuery2.Deferred(), updateFunc = function(i3) {
        return function(value) {
          resolveContexts[i3] = this;
          resolveValues[i3] = arguments.length > 1 ? slice.call(arguments) : value;
          if (!--remaining) {
            primary.resolveWith(resolveContexts, resolveValues);
          }
        };
      };
      if (remaining <= 1) {
        adoptValue(
          singleValue,
          primary.done(updateFunc(i2)).resolve,
          primary.reject,
          !remaining
        );
        if (primary.state() === "pending" || typeof (resolveValues[i2] && resolveValues[i2].then) === "function") {
          return primary.then();
        }
      }
      while (i2--) {
        adoptValue(resolveValues[i2], updateFunc(i2), primary.reject);
      }
      return primary.promise();
    }
  });
  var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
  jQuery2.Deferred.exceptionHook = function(error, asyncError) {
    if (error && rerrorNames.test(error.name)) {
      window2.console.warn(
        "jQuery.Deferred exception",
        error,
        asyncError
      );
    }
  };
  jQuery2.readyException = function(error) {
    window2.setTimeout(function() {
      throw error;
    });
  };
  var readyList = jQuery2.Deferred();
  jQuery2.fn.ready = function(fn) {
    readyList.then(fn).catch(function(error) {
      jQuery2.readyException(error);
    });
    return this;
  };
  jQuery2.extend({
    // Is the DOM ready to be used? Set to true once it occurs.
    isReady: false,
    // A counter to track how many items to wait for before
    // the ready event fires. See trac-6781
    readyWait: 1,
    // Handle when the DOM is ready
    ready: function(wait) {
      if (wait === true ? --jQuery2.readyWait : jQuery2.isReady) {
        return;
      }
      jQuery2.isReady = true;
      if (wait !== true && --jQuery2.readyWait > 0) {
        return;
      }
      readyList.resolveWith(document$1, [jQuery2]);
    }
  });
  jQuery2.ready.then = readyList.then;
  function completed() {
    document$1.removeEventListener("DOMContentLoaded", completed);
    window2.removeEventListener("load", completed);
    jQuery2.ready();
  }
  if (document$1.readyState !== "loading") {
    window2.setTimeout(jQuery2.ready);
  } else {
    document$1.addEventListener("DOMContentLoaded", completed);
    window2.addEventListener("load", completed);
  }
  var rdashAlpha = /-([a-z])/g;
  function fcamelCase(_all, letter) {
    return letter.toUpperCase();
  }
  function camelCase(string) {
    return string.replace(rdashAlpha, fcamelCase);
  }
  function acceptData(owner) {
    return owner.nodeType === 1 || owner.nodeType === 9 || !+owner.nodeType;
  }
  function Data() {
    this.expando = jQuery2.expando + Data.uid++;
  }
  Data.uid = 1;
  Data.prototype = {
    cache: function(owner) {
      var value = owner[this.expando];
      if (!value) {
        value = /* @__PURE__ */ Object.create(null);
        if (acceptData(owner)) {
          if (owner.nodeType) {
            owner[this.expando] = value;
          } else {
            Object.defineProperty(owner, this.expando, {
              value,
              configurable: true
            });
          }
        }
      }
      return value;
    },
    set: function(owner, data, value) {
      var prop, cache = this.cache(owner);
      if (typeof data === "string") {
        cache[camelCase(data)] = value;
      } else {
        for (prop in data) {
          cache[camelCase(prop)] = data[prop];
        }
      }
      return value;
    },
    get: function(owner, key) {
      return key === void 0 ? this.cache(owner) : (
        // Always use camelCase key (gh-2257)
        owner[this.expando] && owner[this.expando][camelCase(key)]
      );
    },
    access: function(owner, key, value) {
      if (key === void 0 || key && typeof key === "string" && value === void 0) {
        return this.get(owner, key);
      }
      this.set(owner, key, value);
      return value !== void 0 ? value : key;
    },
    remove: function(owner, key) {
      var i2, cache = owner[this.expando];
      if (cache === void 0) {
        return;
      }
      if (key !== void 0) {
        if (Array.isArray(key)) {
          key = key.map(camelCase);
        } else {
          key = camelCase(key);
          key = key in cache ? [key] : key.match(rnothtmlwhite) || [];
        }
        i2 = key.length;
        while (i2--) {
          delete cache[key[i2]];
        }
      }
      if (key === void 0 || jQuery2.isEmptyObject(cache)) {
        if (owner.nodeType) {
          owner[this.expando] = void 0;
        } else {
          delete owner[this.expando];
        }
      }
    },
    hasData: function(owner) {
      var cache = owner[this.expando];
      return cache !== void 0 && !jQuery2.isEmptyObject(cache);
    }
  };
  var dataPriv = new Data();
  var dataUser = new Data();
  var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/, rmultiDash = /[A-Z]/g;
  function getData(data) {
    if (data === "true") {
      return true;
    }
    if (data === "false") {
      return false;
    }
    if (data === "null") {
      return null;
    }
    if (data === +data + "") {
      return +data;
    }
    if (rbrace.test(data)) {
      return JSON.parse(data);
    }
    return data;
  }
  function dataAttr(elem, key, data) {
    var name;
    if (data === void 0 && elem.nodeType === 1) {
      name = "data-" + key.replace(rmultiDash, "-$&").toLowerCase();
      data = elem.getAttribute(name);
      if (typeof data === "string") {
        try {
          data = getData(data);
        } catch (e) {
        }
        dataUser.set(elem, key, data);
      } else {
        data = void 0;
      }
    }
    return data;
  }
  jQuery2.extend({
    hasData: function(elem) {
      return dataUser.hasData(elem) || dataPriv.hasData(elem);
    },
    data: function(elem, name, data) {
      return dataUser.access(elem, name, data);
    },
    removeData: function(elem, name) {
      dataUser.remove(elem, name);
    },
    // TODO: Now that all calls to _data and _removeData have been replaced
    // with direct calls to dataPriv methods, these can be deprecated.
    _data: function(elem, name, data) {
      return dataPriv.access(elem, name, data);
    },
    _removeData: function(elem, name) {
      dataPriv.remove(elem, name);
    }
  });
  jQuery2.fn.extend({
    data: function(key, value) {
      var i2, name, data, elem = this[0], attrs = elem && elem.attributes;
      if (key === void 0) {
        if (this.length) {
          data = dataUser.get(elem);
          if (elem.nodeType === 1 && !dataPriv.get(elem, "hasDataAttrs")) {
            i2 = attrs.length;
            while (i2--) {
              if (attrs[i2]) {
                name = attrs[i2].name;
                if (name.indexOf("data-") === 0) {
                  name = camelCase(name.slice(5));
                  dataAttr(elem, name, data[name]);
                }
              }
            }
            dataPriv.set(elem, "hasDataAttrs", true);
          }
        }
        return data;
      }
      if (typeof key === "object") {
        return this.each(function() {
          dataUser.set(this, key);
        });
      }
      return access(this, function(value2) {
        var data2;
        if (elem && value2 === void 0) {
          data2 = dataUser.get(elem, key);
          if (data2 !== void 0) {
            return data2;
          }
          data2 = dataAttr(elem, key);
          if (data2 !== void 0) {
            return data2;
          }
          return;
        }
        this.each(function() {
          dataUser.set(this, key, value2);
        });
      }, null, value, arguments.length > 1, null, true);
    },
    removeData: function(key) {
      return this.each(function() {
        dataUser.remove(this, key);
      });
    }
  });
  jQuery2.extend({
    queue: function(elem, type, data) {
      var queue;
      if (elem) {
        type = (type || "fx") + "queue";
        queue = dataPriv.get(elem, type);
        if (data) {
          if (!queue || Array.isArray(data)) {
            queue = dataPriv.set(elem, type, jQuery2.makeArray(data));
          } else {
            queue.push(data);
          }
        }
        return queue || [];
      }
    },
    dequeue: function(elem, type) {
      type = type || "fx";
      var queue = jQuery2.queue(elem, type), startLength = queue.length, fn = queue.shift(), hooks = jQuery2._queueHooks(elem, type), next = function() {
        jQuery2.dequeue(elem, type);
      };
      if (fn === "inprogress") {
        fn = queue.shift();
        startLength--;
      }
      if (fn) {
        if (type === "fx") {
          queue.unshift("inprogress");
        }
        delete hooks.stop;
        fn.call(elem, next, hooks);
      }
      if (!startLength && hooks) {
        hooks.empty.fire();
      }
    },
    // Not public - generate a queueHooks object, or return the current one
    _queueHooks: function(elem, type) {
      var key = type + "queueHooks";
      return dataPriv.get(elem, key) || dataPriv.set(elem, key, {
        empty: jQuery2.Callbacks("once memory").add(function() {
          dataPriv.remove(elem, [type + "queue", key]);
        })
      });
    }
  });
  jQuery2.fn.extend({
    queue: function(type, data) {
      var setter = 2;
      if (typeof type !== "string") {
        data = type;
        type = "fx";
        setter--;
      }
      if (arguments.length < setter) {
        return jQuery2.queue(this[0], type);
      }
      return data === void 0 ? this : this.each(function() {
        var queue = jQuery2.queue(this, type, data);
        jQuery2._queueHooks(this, type);
        if (type === "fx" && queue[0] !== "inprogress") {
          jQuery2.dequeue(this, type);
        }
      });
    },
    dequeue: function(type) {
      return this.each(function() {
        jQuery2.dequeue(this, type);
      });
    },
    clearQueue: function(type) {
      return this.queue(type || "fx", []);
    },
    // Get a promise resolved when queues of a certain type
    // are emptied (fx is the type by default)
    promise: function(type, obj) {
      var tmp, count = 1, defer = jQuery2.Deferred(), elements = this, i2 = this.length, resolve = function() {
        if (!--count) {
          defer.resolveWith(elements, [elements]);
        }
      };
      if (typeof type !== "string") {
        obj = type;
        type = void 0;
      }
      type = type || "fx";
      while (i2--) {
        tmp = dataPriv.get(elements[i2], type + "queueHooks");
        if (tmp && tmp.empty) {
          count++;
          tmp.empty.add(resolve);
        }
      }
      resolve();
      return defer.promise(obj);
    }
  });
  var pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source;
  var rcssNum = new RegExp("^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i");
  var cssExpand = ["Top", "Right", "Bottom", "Left"];
  function isHiddenWithinTree(elem, el) {
    elem = el || elem;
    return elem.style.display === "none" || elem.style.display === "" && jQuery2.css(elem, "display") === "none";
  }
  var ralphaStart = /^[a-z]/, rautoPx = /^(?:Border(?:Top|Right|Bottom|Left)?(?:Width|)|(?:Margin|Padding)?(?:Top|Right|Bottom|Left)?|(?:Min|Max)?(?:Width|Height))$/;
  function isAutoPx(prop) {
    return ralphaStart.test(prop) && rautoPx.test(prop[0].toUpperCase() + prop.slice(1));
  }
  function adjustCSS(elem, prop, valueParts, tween) {
    var adjusted, scale, maxIterations = 20, currentValue = tween ? function() {
      return tween.cur();
    } : function() {
      return jQuery2.css(elem, prop, "");
    }, initial = currentValue(), unit = valueParts && valueParts[3] || (isAutoPx(prop) ? "px" : ""), initialInUnit = elem.nodeType && (!isAutoPx(prop) || unit !== "px" && +initial) && rcssNum.exec(jQuery2.css(elem, prop));
    if (initialInUnit && initialInUnit[3] !== unit) {
      initial = initial / 2;
      unit = unit || initialInUnit[3];
      initialInUnit = +initial || 1;
      while (maxIterations--) {
        jQuery2.style(elem, prop, initialInUnit + unit);
        if ((1 - scale) * (1 - (scale = currentValue() / initial || 0.5)) <= 0) {
          maxIterations = 0;
        }
        initialInUnit = initialInUnit / scale;
      }
      initialInUnit = initialInUnit * 2;
      jQuery2.style(elem, prop, initialInUnit + unit);
      valueParts = valueParts || [];
    }
    if (valueParts) {
      initialInUnit = +initialInUnit || +initial || 0;
      adjusted = valueParts[1] ? initialInUnit + (valueParts[1] + 1) * valueParts[2] : +valueParts[2];
      if (tween) {
        tween.unit = unit;
        tween.start = initialInUnit;
        tween.end = adjusted;
      }
    }
    return adjusted;
  }
  var rmsPrefix = /^-ms-/;
  function cssCamelCase(string) {
    return camelCase(string.replace(rmsPrefix, "ms-"));
  }
  var defaultDisplayMap = {};
  function getDefaultDisplay(elem) {
    var temp, doc = elem.ownerDocument, nodeName2 = elem.nodeName, display = defaultDisplayMap[nodeName2];
    if (display) {
      return display;
    }
    temp = doc.body.appendChild(doc.createElement(nodeName2));
    display = jQuery2.css(temp, "display");
    temp.parentNode.removeChild(temp);
    if (display === "none") {
      display = "block";
    }
    defaultDisplayMap[nodeName2] = display;
    return display;
  }
  function showHide(elements, show) {
    var display, elem, values = [], index = 0, length = elements.length;
    for (; index < length; index++) {
      elem = elements[index];
      if (!elem.style) {
        continue;
      }
      display = elem.style.display;
      if (show) {
        if (display === "none") {
          values[index] = dataPriv.get(elem, "display") || null;
          if (!values[index]) {
            elem.style.display = "";
          }
        }
        if (elem.style.display === "" && isHiddenWithinTree(elem)) {
          values[index] = getDefaultDisplay(elem);
        }
      } else {
        if (display !== "none") {
          values[index] = "none";
          dataPriv.set(elem, "display", display);
        }
      }
    }
    for (index = 0; index < length; index++) {
      if (values[index] != null) {
        elements[index].style.display = values[index];
      }
    }
    return elements;
  }
  jQuery2.fn.extend({
    show: function() {
      return showHide(this, true);
    },
    hide: function() {
      return showHide(this);
    },
    toggle: function(state) {
      if (typeof state === "boolean") {
        return state ? this.show() : this.hide();
      }
      return this.each(function() {
        if (isHiddenWithinTree(this)) {
          jQuery2(this).show();
        } else {
          jQuery2(this).hide();
        }
      });
    }
  });
  var isAttached = function(elem) {
    return jQuery2.contains(elem.ownerDocument, elem) || elem.getRootNode(composed) === elem.ownerDocument;
  }, composed = { composed: true };
  if (!documentElement$1.getRootNode) {
    isAttached = function(elem) {
      return jQuery2.contains(elem.ownerDocument, elem);
    };
  }
  var rtagName = /<([a-z][^\/\0>\x20\t\r\n\f]*)/i;
  var wrapMap = {
    // Table parts need to be wrapped with `<table>` or they're
    // stripped to their contents when put in a div.
    // XHTML parsers do not magically insert elements in the
    // same way that tag soup parsers do, so we cannot shorten
    // this by omitting <tbody> or other required elements.
    thead: ["table"],
    col: ["colgroup", "table"],
    tr: ["tbody", "table"],
    td: ["tr", "tbody", "table"]
  };
  wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
  wrapMap.th = wrapMap.td;
  function getAll(context, tag) {
    var ret;
    if (typeof context.getElementsByTagName !== "undefined") {
      ret = arr.slice.call(context.getElementsByTagName(tag || "*"));
    } else if (typeof context.querySelectorAll !== "undefined") {
      ret = context.querySelectorAll(tag || "*");
    } else {
      ret = [];
    }
    if (tag === void 0 || tag && nodeName(context, tag)) {
      return jQuery2.merge([context], ret);
    }
    return ret;
  }
  var rscriptType = /^$|^module$|\/(?:java|ecma)script/i;
  function setGlobalEval(elems, refElements) {
    var i2 = 0, l = elems.length;
    for (; i2 < l; i2++) {
      dataPriv.set(
        elems[i2],
        "globalEval",
        !refElements || dataPriv.get(refElements[i2], "globalEval")
      );
    }
  }
  var rhtml = /<|&#?\w+;/;
  function buildFragment(elems, context, scripts, selection, ignored) {
    var elem, tmp, tag, wrap, attached, j, fragment = context.createDocumentFragment(), nodes = [], i2 = 0, l = elems.length;
    for (; i2 < l; i2++) {
      elem = elems[i2];
      if (elem || elem === 0) {
        if (toType(elem) === "object" && (elem.nodeType || isArrayLike(elem))) {
          jQuery2.merge(nodes, elem.nodeType ? [elem] : elem);
        } else if (!rhtml.test(elem)) {
          nodes.push(context.createTextNode(elem));
        } else {
          tmp = tmp || fragment.appendChild(context.createElement("div"));
          tag = (rtagName.exec(elem) || ["", ""])[1].toLowerCase();
          wrap = wrapMap[tag] || arr;
          j = wrap.length;
          while (--j > -1) {
            tmp = tmp.appendChild(context.createElement(wrap[j]));
          }
          tmp.innerHTML = jQuery2.htmlPrefilter(elem);
          jQuery2.merge(nodes, tmp.childNodes);
          tmp = fragment.firstChild;
          tmp.textContent = "";
        }
      }
    }
    fragment.textContent = "";
    i2 = 0;
    while (elem = nodes[i2++]) {
      if (selection && jQuery2.inArray(elem, selection) > -1) {
        if (ignored) {
          ignored.push(elem);
        }
        continue;
      }
      attached = isAttached(elem);
      tmp = getAll(fragment.appendChild(elem), "script");
      if (attached) {
        setGlobalEval(tmp);
      }
      if (scripts) {
        j = 0;
        while (elem = tmp[j++]) {
          if (rscriptType.test(elem.type || "")) {
            scripts.push(elem);
          }
        }
      }
    }
    return fragment;
  }
  function disableScript(elem) {
    elem.type = (elem.getAttribute("type") !== null) + "/" + elem.type;
    return elem;
  }
  function restoreScript(elem) {
    if ((elem.type || "").slice(0, 5) === "true/") {
      elem.type = elem.type.slice(5);
    } else {
      elem.removeAttribute("type");
    }
    return elem;
  }
  function domManip(collection, args, callback, ignored) {
    args = flat(args);
    var fragment, first, scripts, hasScripts, node, doc, i2 = 0, l = collection.length, iNoClone = l - 1, value = args[0], valueIsFunction = typeof value === "function";
    if (valueIsFunction) {
      return collection.each(function(index) {
        var self = collection.eq(index);
        args[0] = value.call(this, index, self.html());
        domManip(self, args, callback, ignored);
      });
    }
    if (l) {
      fragment = buildFragment(args, collection[0].ownerDocument, false, collection, ignored);
      first = fragment.firstChild;
      if (fragment.childNodes.length === 1) {
        fragment = first;
      }
      if (first || ignored) {
        scripts = jQuery2.map(getAll(fragment, "script"), disableScript);
        hasScripts = scripts.length;
        for (; i2 < l; i2++) {
          node = fragment;
          if (i2 !== iNoClone) {
            node = jQuery2.clone(node, true, true);
            if (hasScripts) {
              jQuery2.merge(scripts, getAll(node, "script"));
            }
          }
          callback.call(collection[i2], node, i2);
        }
        if (hasScripts) {
          doc = scripts[scripts.length - 1].ownerDocument;
          jQuery2.map(scripts, restoreScript);
          for (i2 = 0; i2 < hasScripts; i2++) {
            node = scripts[i2];
            if (rscriptType.test(node.type || "") && !dataPriv.get(node, "globalEval") && jQuery2.contains(doc, node)) {
              if (node.src && (node.type || "").toLowerCase() !== "module") {
                if (jQuery2._evalUrl && !node.noModule) {
                  jQuery2._evalUrl(node.src, {
                    nonce: node.nonce,
                    crossOrigin: node.crossOrigin
                  }, doc);
                }
              } else {
                DOMEval(node.textContent, node, doc);
              }
            }
          }
        }
      }
    }
    return collection;
  }
  var rcheckableType = /^(?:checkbox|radio)$/i;
  var rtypenamespace = /^([^.]*)(?:\.(.+)|)/;
  function returnTrue() {
    return true;
  }
  function returnFalse() {
    return false;
  }
  function on(elem, types, selector, data, fn, one) {
    var origFn, type;
    if (typeof types === "object") {
      if (typeof selector !== "string") {
        data = data || selector;
        selector = void 0;
      }
      for (type in types) {
        on(elem, type, selector, data, types[type], one);
      }
      return elem;
    }
    if (data == null && fn == null) {
      fn = selector;
      data = selector = void 0;
    } else if (fn == null) {
      if (typeof selector === "string") {
        fn = data;
        data = void 0;
      } else {
        fn = data;
        data = selector;
        selector = void 0;
      }
    }
    if (fn === false) {
      fn = returnFalse;
    } else if (!fn) {
      return elem;
    }
    if (one === 1) {
      origFn = fn;
      fn = function(event) {
        jQuery2().off(event);
        return origFn.apply(this, arguments);
      };
      fn.guid = origFn.guid || (origFn.guid = jQuery2.guid++);
    }
    return elem.each(function() {
      jQuery2.event.add(this, types, fn, data, selector);
    });
  }
  jQuery2.event = {
    add: function(elem, types, handler, data, selector) {
      var handleObjIn, eventHandle, tmp, events, t, handleObj, special, handlers, type, namespaces, origType, elemData = dataPriv.get(elem);
      if (!acceptData(elem)) {
        return;
      }
      if (handler.handler) {
        handleObjIn = handler;
        handler = handleObjIn.handler;
        selector = handleObjIn.selector;
      }
      if (selector) {
        jQuery2.find.matchesSelector(documentElement$1, selector);
      }
      if (!handler.guid) {
        handler.guid = jQuery2.guid++;
      }
      if (!(events = elemData.events)) {
        events = elemData.events = /* @__PURE__ */ Object.create(null);
      }
      if (!(eventHandle = elemData.handle)) {
        eventHandle = elemData.handle = function(e) {
          return typeof jQuery2 !== "undefined" && jQuery2.event.triggered !== e.type ? jQuery2.event.dispatch.apply(elem, arguments) : void 0;
        };
      }
      types = (types || "").match(rnothtmlwhite) || [""];
      t = types.length;
      while (t--) {
        tmp = rtypenamespace.exec(types[t]) || [];
        type = origType = tmp[1];
        namespaces = (tmp[2] || "").split(".").sort();
        if (!type) {
          continue;
        }
        special = jQuery2.event.special[type] || {};
        type = (selector ? special.delegateType : special.bindType) || type;
        special = jQuery2.event.special[type] || {};
        handleObj = jQuery2.extend({
          type,
          origType,
          data,
          handler,
          guid: handler.guid,
          selector,
          needsContext: selector && jQuery2.expr.match.needsContext.test(selector),
          namespace: namespaces.join(".")
        }, handleObjIn);
        if (!(handlers = events[type])) {
          handlers = events[type] = [];
          handlers.delegateCount = 0;
          if (!special.setup || special.setup.call(elem, data, namespaces, eventHandle) === false) {
            if (elem.addEventListener) {
              elem.addEventListener(type, eventHandle);
            }
          }
        }
        if (special.add) {
          special.add.call(elem, handleObj);
          if (!handleObj.handler.guid) {
            handleObj.handler.guid = handler.guid;
          }
        }
        if (selector) {
          handlers.splice(handlers.delegateCount++, 0, handleObj);
        } else {
          handlers.push(handleObj);
        }
      }
    },
    // Detach an event or set of events from an element
    remove: function(elem, types, handler, selector, mappedTypes) {
      var j, origCount, tmp, events, t, handleObj, special, handlers, type, namespaces, origType, elemData = dataPriv.hasData(elem) && dataPriv.get(elem);
      if (!elemData || !(events = elemData.events)) {
        return;
      }
      types = (types || "").match(rnothtmlwhite) || [""];
      t = types.length;
      while (t--) {
        tmp = rtypenamespace.exec(types[t]) || [];
        type = origType = tmp[1];
        namespaces = (tmp[2] || "").split(".").sort();
        if (!type) {
          for (type in events) {
            jQuery2.event.remove(elem, type + types[t], handler, selector, true);
          }
          continue;
        }
        special = jQuery2.event.special[type] || {};
        type = (selector ? special.delegateType : special.bindType) || type;
        handlers = events[type] || [];
        tmp = tmp[2] && new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)");
        origCount = j = handlers.length;
        while (j--) {
          handleObj = handlers[j];
          if ((mappedTypes || origType === handleObj.origType) && (!handler || handler.guid === handleObj.guid) && (!tmp || tmp.test(handleObj.namespace)) && (!selector || selector === handleObj.selector || selector === "**" && handleObj.selector)) {
            handlers.splice(j, 1);
            if (handleObj.selector) {
              handlers.delegateCount--;
            }
            if (special.remove) {
              special.remove.call(elem, handleObj);
            }
          }
        }
        if (origCount && !handlers.length) {
          if (!special.teardown || special.teardown.call(elem, namespaces, elemData.handle) === false) {
            jQuery2.removeEvent(elem, type, elemData.handle);
          }
          delete events[type];
        }
      }
      if (jQuery2.isEmptyObject(events)) {
        dataPriv.remove(elem, "handle events");
      }
    },
    dispatch: function(nativeEvent) {
      var i2, j, ret, matched, handleObj, handlerQueue, args = new Array(arguments.length), event = jQuery2.event.fix(nativeEvent), handlers = (dataPriv.get(this, "events") || /* @__PURE__ */ Object.create(null))[event.type] || [], special = jQuery2.event.special[event.type] || {};
      args[0] = event;
      for (i2 = 1; i2 < arguments.length; i2++) {
        args[i2] = arguments[i2];
      }
      event.delegateTarget = this;
      if (special.preDispatch && special.preDispatch.call(this, event) === false) {
        return;
      }
      handlerQueue = jQuery2.event.handlers.call(this, event, handlers);
      i2 = 0;
      while ((matched = handlerQueue[i2++]) && !event.isPropagationStopped()) {
        event.currentTarget = matched.elem;
        j = 0;
        while ((handleObj = matched.handlers[j++]) && !event.isImmediatePropagationStopped()) {
          if (!event.rnamespace || handleObj.namespace === false || event.rnamespace.test(handleObj.namespace)) {
            event.handleObj = handleObj;
            event.data = handleObj.data;
            ret = ((jQuery2.event.special[handleObj.origType] || {}).handle || handleObj.handler).apply(matched.elem, args);
            if (ret !== void 0) {
              if ((event.result = ret) === false) {
                event.preventDefault();
                event.stopPropagation();
              }
            }
          }
        }
      }
      if (special.postDispatch) {
        special.postDispatch.call(this, event);
      }
      return event.result;
    },
    handlers: function(event, handlers) {
      var i2, handleObj, sel, matchedHandlers, matchedSelectors, handlerQueue = [], delegateCount = handlers.delegateCount, cur = event.target;
      if (delegateCount && // Support: Firefox <=42 - 66+
      // Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
      // https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
      // Support: IE 11+
      // ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
      !(event.type === "click" && event.button >= 1)) {
        for (; cur !== this; cur = cur.parentNode || this) {
          if (cur.nodeType === 1 && !(event.type === "click" && cur.disabled === true)) {
            matchedHandlers = [];
            matchedSelectors = {};
            for (i2 = 0; i2 < delegateCount; i2++) {
              handleObj = handlers[i2];
              sel = handleObj.selector + " ";
              if (matchedSelectors[sel] === void 0) {
                matchedSelectors[sel] = handleObj.needsContext ? jQuery2(sel, this).index(cur) > -1 : jQuery2.find(sel, this, null, [cur]).length;
              }
              if (matchedSelectors[sel]) {
                matchedHandlers.push(handleObj);
              }
            }
            if (matchedHandlers.length) {
              handlerQueue.push({ elem: cur, handlers: matchedHandlers });
            }
          }
        }
      }
      cur = this;
      if (delegateCount < handlers.length) {
        handlerQueue.push({ elem: cur, handlers: handlers.slice(delegateCount) });
      }
      return handlerQueue;
    },
    addProp: function(name, hook) {
      Object.defineProperty(jQuery2.Event.prototype, name, {
        enumerable: true,
        configurable: true,
        get: typeof hook === "function" ? function() {
          if (this.originalEvent) {
            return hook(this.originalEvent);
          }
        } : function() {
          if (this.originalEvent) {
            return this.originalEvent[name];
          }
        },
        set: function(value) {
          Object.defineProperty(this, name, {
            enumerable: true,
            configurable: true,
            writable: true,
            value
          });
        }
      });
    },
    fix: function(originalEvent) {
      return originalEvent[jQuery2.expando] ? originalEvent : new jQuery2.Event(originalEvent);
    },
    special: jQuery2.extend(/* @__PURE__ */ Object.create(null), {
      load: {
        // Prevent triggered image.load events from bubbling to window.load
        noBubble: true
      },
      click: {
        // Utilize native event to ensure correct state for checkable inputs
        setup: function(data) {
          var el = this || data;
          if (rcheckableType.test(el.type) && el.click && nodeName(el, "input")) {
            leverageNative(el, "click", true);
          }
          return false;
        },
        trigger: function(data) {
          var el = this || data;
          if (rcheckableType.test(el.type) && el.click && nodeName(el, "input")) {
            leverageNative(el, "click");
          }
          return true;
        },
        // For cross-browser consistency, suppress native .click() on links
        // Also prevent it if we're currently inside a leveraged native-event stack
        _default: function(event) {
          var target = event.target;
          return rcheckableType.test(target.type) && target.click && nodeName(target, "input") && dataPriv.get(target, "click") || nodeName(target, "a");
        }
      },
      beforeunload: {
        postDispatch: function(event) {
          if (event.result !== void 0) {
            event.preventDefault();
          }
        }
      }
    })
  };
  function leverageNative(el, type, isSetup) {
    if (!isSetup) {
      if (dataPriv.get(el, type) === void 0) {
        jQuery2.event.add(el, type, returnTrue);
      }
      return;
    }
    dataPriv.set(el, type, false);
    jQuery2.event.add(el, type, {
      namespace: false,
      handler: function(event) {
        var result, saved = dataPriv.get(this, type);
        if (event.isTrigger & 1 && this[type]) {
          if (!saved.length) {
            saved = slice.call(arguments);
            dataPriv.set(this, type, saved);
            this[type]();
            result = dataPriv.get(this, type);
            dataPriv.set(this, type, false);
            if (saved !== result) {
              event.stopImmediatePropagation();
              event.preventDefault();
              return result && result.value;
            }
          } else if ((jQuery2.event.special[type] || {}).delegateType) {
            event.stopPropagation();
          }
        } else if (saved.length) {
          dataPriv.set(this, type, {
            value: jQuery2.event.trigger(
              saved[0],
              saved.slice(1),
              this
            )
          });
          event.stopPropagation();
          event.isImmediatePropagationStopped = returnTrue;
        }
      }
    });
  }
  jQuery2.removeEvent = function(elem, type, handle) {
    if (elem.removeEventListener) {
      elem.removeEventListener(type, handle);
    }
  };
  jQuery2.Event = function(src, props) {
    if (!(this instanceof jQuery2.Event)) {
      return new jQuery2.Event(src, props);
    }
    if (src && src.type) {
      this.originalEvent = src;
      this.type = src.type;
      this.isDefaultPrevented = src.defaultPrevented ? returnTrue : returnFalse;
      this.target = src.target;
      this.currentTarget = src.currentTarget;
      this.relatedTarget = src.relatedTarget;
    } else {
      this.type = src;
    }
    if (props) {
      jQuery2.extend(this, props);
    }
    this.timeStamp = src && src.timeStamp || Date.now();
    this[jQuery2.expando] = true;
  };
  jQuery2.Event.prototype = {
    constructor: jQuery2.Event,
    isDefaultPrevented: returnFalse,
    isPropagationStopped: returnFalse,
    isImmediatePropagationStopped: returnFalse,
    isSimulated: false,
    preventDefault: function() {
      var e = this.originalEvent;
      this.isDefaultPrevented = returnTrue;
      if (e && !this.isSimulated) {
        e.preventDefault();
      }
    },
    stopPropagation: function() {
      var e = this.originalEvent;
      this.isPropagationStopped = returnTrue;
      if (e && !this.isSimulated) {
        e.stopPropagation();
      }
    },
    stopImmediatePropagation: function() {
      var e = this.originalEvent;
      this.isImmediatePropagationStopped = returnTrue;
      if (e && !this.isSimulated) {
        e.stopImmediatePropagation();
      }
      this.stopPropagation();
    }
  };
  jQuery2.each({
    altKey: true,
    bubbles: true,
    cancelable: true,
    changedTouches: true,
    ctrlKey: true,
    detail: true,
    eventPhase: true,
    metaKey: true,
    pageX: true,
    pageY: true,
    shiftKey: true,
    view: true,
    "char": true,
    code: true,
    charCode: true,
    key: true,
    keyCode: true,
    button: true,
    buttons: true,
    clientX: true,
    clientY: true,
    offsetX: true,
    offsetY: true,
    pointerId: true,
    pointerType: true,
    screenX: true,
    screenY: true,
    targetTouches: true,
    toElement: true,
    touches: true,
    which: true
  }, jQuery2.event.addProp);
  jQuery2.each({ focus: "focusin", blur: "focusout" }, function(type, delegateType) {
    function focusMappedHandler(nativeEvent) {
      var event = jQuery2.event.fix(nativeEvent);
      event.type = nativeEvent.type === "focusin" ? "focus" : "blur";
      event.isSimulated = true;
      if (event.target === event.currentTarget) {
        dataPriv.get(this, "handle")(event);
      }
    }
    jQuery2.event.special[type] = {
      // Utilize native event if possible so blur/focus sequence is correct
      setup: function() {
        leverageNative(this, type, true);
        if (isIE) {
          this.addEventListener(delegateType, focusMappedHandler);
        } else {
          return false;
        }
      },
      trigger: function() {
        leverageNative(this, type);
        return true;
      },
      teardown: function() {
        if (isIE) {
          this.removeEventListener(delegateType, focusMappedHandler);
        } else {
          return false;
        }
      },
      // Suppress native focus or blur if we're currently inside
      // a leveraged native-event stack
      _default: function(event) {
        return dataPriv.get(event.target, type);
      },
      delegateType
    };
  });
  jQuery2.each({
    mouseenter: "mouseover",
    mouseleave: "mouseout",
    pointerenter: "pointerover",
    pointerleave: "pointerout"
  }, function(orig, fix) {
    jQuery2.event.special[orig] = {
      delegateType: fix,
      bindType: fix,
      handle: function(event) {
        var ret, target = this, related = event.relatedTarget, handleObj = event.handleObj;
        if (!related || related !== target && !jQuery2.contains(target, related)) {
          event.type = handleObj.origType;
          ret = handleObj.handler.apply(this, arguments);
          event.type = fix;
        }
        return ret;
      }
    };
  });
  jQuery2.fn.extend({
    on: function(types, selector, data, fn) {
      return on(this, types, selector, data, fn);
    },
    one: function(types, selector, data, fn) {
      return on(this, types, selector, data, fn, 1);
    },
    off: function(types, selector, fn) {
      var handleObj, type;
      if (types && types.preventDefault && types.handleObj) {
        handleObj = types.handleObj;
        jQuery2(types.delegateTarget).off(
          handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
          handleObj.selector,
          handleObj.handler
        );
        return this;
      }
      if (typeof types === "object") {
        for (type in types) {
          this.off(type, selector, types[type]);
        }
        return this;
      }
      if (selector === false || typeof selector === "function") {
        fn = selector;
        selector = void 0;
      }
      if (fn === false) {
        fn = returnFalse;
      }
      return this.each(function() {
        jQuery2.event.remove(this, types, fn, selector);
      });
    }
  });
  var rnoInnerhtml = /<script|<style|<link/i;
  function manipulationTarget(elem, content) {
    if (nodeName(elem, "table") && nodeName(content.nodeType !== 11 ? content : content.firstChild, "tr")) {
      return jQuery2(elem).children("tbody")[0] || elem;
    }
    return elem;
  }
  function cloneCopyEvent(src, dest) {
    var type, i2, l, events = dataPriv.get(src, "events");
    if (dest.nodeType !== 1) {
      return;
    }
    if (events) {
      dataPriv.remove(dest, "handle events");
      for (type in events) {
        for (i2 = 0, l = events[type].length; i2 < l; i2++) {
          jQuery2.event.add(dest, type, events[type][i2]);
        }
      }
    }
    if (dataUser.hasData(src)) {
      dataUser.set(dest, jQuery2.extend({}, dataUser.get(src)));
    }
  }
  function remove(elem, selector, keepData) {
    var node, nodes = selector ? jQuery2.filter(selector, elem) : elem, i2 = 0;
    for (; (node = nodes[i2]) != null; i2++) {
      if (!keepData && node.nodeType === 1) {
        jQuery2.cleanData(getAll(node));
      }
      if (node.parentNode) {
        if (keepData && isAttached(node)) {
          setGlobalEval(getAll(node, "script"));
        }
        node.parentNode.removeChild(node);
      }
    }
    return elem;
  }
  jQuery2.extend({
    htmlPrefilter: function(html) {
      return html;
    },
    clone: function(elem, dataAndEvents, deepDataAndEvents) {
      var i2, l, srcElements, destElements, clone = elem.cloneNode(true), inPage = isAttached(elem);
      if (isIE && (elem.nodeType === 1 || elem.nodeType === 11) && !jQuery2.isXMLDoc(elem)) {
        destElements = getAll(clone);
        srcElements = getAll(elem);
        for (i2 = 0, l = srcElements.length; i2 < l; i2++) {
          if (nodeName(destElements[i2], "textarea")) {
            destElements[i2].defaultValue = srcElements[i2].defaultValue;
          }
        }
      }
      if (dataAndEvents) {
        if (deepDataAndEvents) {
          srcElements = srcElements || getAll(elem);
          destElements = destElements || getAll(clone);
          for (i2 = 0, l = srcElements.length; i2 < l; i2++) {
            cloneCopyEvent(srcElements[i2], destElements[i2]);
          }
        } else {
          cloneCopyEvent(elem, clone);
        }
      }
      destElements = getAll(clone, "script");
      if (destElements.length > 0) {
        setGlobalEval(destElements, !inPage && getAll(elem, "script"));
      }
      return clone;
    },
    cleanData: function(elems) {
      var data, elem, type, special = jQuery2.event.special, i2 = 0;
      for (; (elem = elems[i2]) !== void 0; i2++) {
        if (acceptData(elem)) {
          if (data = elem[dataPriv.expando]) {
            if (data.events) {
              for (type in data.events) {
                if (special[type]) {
                  jQuery2.event.remove(elem, type);
                } else {
                  jQuery2.removeEvent(elem, type, data.handle);
                }
              }
            }
            elem[dataPriv.expando] = void 0;
          }
          if (elem[dataUser.expando]) {
            elem[dataUser.expando] = void 0;
          }
        }
      }
    }
  });
  jQuery2.fn.extend({
    detach: function(selector) {
      return remove(this, selector, true);
    },
    remove: function(selector) {
      return remove(this, selector);
    },
    text: function(value) {
      return access(this, function(value2) {
        return value2 === void 0 ? jQuery2.text(this) : this.empty().each(function() {
          if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
            this.textContent = value2;
          }
        });
      }, null, value, arguments.length);
    },
    append: function() {
      return domManip(this, arguments, function(elem) {
        if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
          var target = manipulationTarget(this, elem);
          target.appendChild(elem);
        }
      });
    },
    prepend: function() {
      return domManip(this, arguments, function(elem) {
        if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
          var target = manipulationTarget(this, elem);
          target.insertBefore(elem, target.firstChild);
        }
      });
    },
    before: function() {
      return domManip(this, arguments, function(elem) {
        if (this.parentNode) {
          this.parentNode.insertBefore(elem, this);
        }
      });
    },
    after: function() {
      return domManip(this, arguments, function(elem) {
        if (this.parentNode) {
          this.parentNode.insertBefore(elem, this.nextSibling);
        }
      });
    },
    empty: function() {
      var elem, i2 = 0;
      for (; (elem = this[i2]) != null; i2++) {
        if (elem.nodeType === 1) {
          jQuery2.cleanData(getAll(elem, false));
          elem.textContent = "";
        }
      }
      return this;
    },
    clone: function(dataAndEvents, deepDataAndEvents) {
      dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
      deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;
      return this.map(function() {
        return jQuery2.clone(this, dataAndEvents, deepDataAndEvents);
      });
    },
    html: function(value) {
      return access(this, function(value2) {
        var elem = this[0] || {}, i2 = 0, l = this.length;
        if (value2 === void 0 && elem.nodeType === 1) {
          return elem.innerHTML;
        }
        if (typeof value2 === "string" && !rnoInnerhtml.test(value2) && !wrapMap[(rtagName.exec(value2) || ["", ""])[1].toLowerCase()]) {
          value2 = jQuery2.htmlPrefilter(value2);
          try {
            for (; i2 < l; i2++) {
              elem = this[i2] || {};
              if (elem.nodeType === 1) {
                jQuery2.cleanData(getAll(elem, false));
                elem.innerHTML = value2;
              }
            }
            elem = 0;
          } catch (e) {
          }
        }
        if (elem) {
          this.empty().append(value2);
        }
      }, null, value, arguments.length);
    },
    replaceWith: function() {
      var ignored = [];
      return domManip(this, arguments, function(elem) {
        var parent = this.parentNode;
        if (jQuery2.inArray(this, ignored) < 0) {
          jQuery2.cleanData(getAll(this));
          if (parent) {
            parent.replaceChild(elem, this);
          }
        }
      }, ignored);
    }
  });
  jQuery2.each({
    appendTo: "append",
    prependTo: "prepend",
    insertBefore: "before",
    insertAfter: "after",
    replaceAll: "replaceWith"
  }, function(name, original) {
    jQuery2.fn[name] = function(selector) {
      var elems, ret = [], insert = jQuery2(selector), last = insert.length - 1, i2 = 0;
      for (; i2 <= last; i2++) {
        elems = i2 === last ? this : this.clone(true);
        jQuery2(insert[i2])[original](elems);
        push.apply(ret, elems);
      }
      return this.pushStack(ret);
    };
  });
  var rnumnonpx = new RegExp("^(" + pnum + ")(?!px)[a-z%]+$", "i");
  var rcustomProp = /^--/;
  function getStyles(elem) {
    var view = elem.ownerDocument.defaultView;
    if (!view) {
      view = window2;
    }
    return view.getComputedStyle(elem);
  }
  function swap(elem, options, callback) {
    var ret, name, old = {};
    for (name in options) {
      old[name] = elem.style[name];
      elem.style[name] = options[name];
    }
    ret = callback.call(elem);
    for (name in options) {
      elem.style[name] = old[name];
    }
    return ret;
  }
  function curCSS(elem, name, computed) {
    var ret, isCustomProp = rcustomProp.test(name);
    computed = computed || getStyles(elem);
    if (computed) {
      ret = computed.getPropertyValue(name) || computed[name];
      if (isCustomProp && ret) {
        ret = ret.replace(rtrimCSS, "$1") || void 0;
      }
      if (ret === "" && !isAttached(elem)) {
        ret = jQuery2.style(elem, name);
      }
    }
    return ret !== void 0 ? (
      // Support: IE <=9 - 11+
      // IE returns zIndex value as an integer.
      ret + ""
    ) : ret;
  }
  var cssPrefixes = ["Webkit", "Moz", "ms"], emptyStyle = document$1.createElement("div").style;
  function vendorPropName(name) {
    var capName = name[0].toUpperCase() + name.slice(1), i2 = cssPrefixes.length;
    while (i2--) {
      name = cssPrefixes[i2] + capName;
      if (name in emptyStyle) {
        return name;
      }
    }
  }
  function finalPropName(name) {
    if (name in emptyStyle) {
      return name;
    }
    return vendorPropName(name) || name;
  }
  var reliableTrDimensionsVal, reliableColDimensionsVal, table = document$1.createElement("table");
  function computeTableStyleTests() {
    if (
      // This is a singleton, we need to execute it only once
      !table || // Finish early in limited (non-browser) environments
      !table.style
    ) {
      return;
    }
    var trStyle, col = document$1.createElement("col"), tr = document$1.createElement("tr"), td = document$1.createElement("td");
    table.style.cssText = "position:absolute;left:-11111px;border-collapse:separate;border-spacing:0";
    tr.style.cssText = "box-sizing:content-box;border:1px solid;height:1px";
    td.style.cssText = "height:9px;width:9px;padding:0";
    col.span = 2;
    documentElement$1.appendChild(table).appendChild(col).parentNode.appendChild(tr).appendChild(td).parentNode.appendChild(td.cloneNode(true));
    if (table.offsetWidth === 0) {
      documentElement$1.removeChild(table);
      return;
    }
    trStyle = window2.getComputedStyle(tr);
    reliableColDimensionsVal = isIE || Math.round(
      parseFloat(
        window2.getComputedStyle(col).width
      )
    ) === 18;
    reliableTrDimensionsVal = Math.round(parseFloat(trStyle.height) + parseFloat(trStyle.borderTopWidth) + parseFloat(trStyle.borderBottomWidth)) === tr.offsetHeight;
    documentElement$1.removeChild(table);
    table = null;
  }
  jQuery2.extend(support, {
    reliableTrDimensions: function() {
      computeTableStyleTests();
      return reliableTrDimensionsVal;
    },
    reliableColDimensions: function() {
      computeTableStyleTests();
      return reliableColDimensionsVal;
    }
  });
  var cssShow = { position: "absolute", visibility: "hidden", display: "block" }, cssNormalTransform = {
    letterSpacing: "0",
    fontWeight: "400"
  };
  function setPositiveNumber(_elem, value, subtract) {
    var matches2 = rcssNum.exec(value);
    return matches2 ? (
      // Guard against undefined "subtract", e.g., when used as in cssHooks
      Math.max(0, matches2[2] - (subtract || 0)) + (matches2[3] || "px")
    ) : value;
  }
  function boxModelAdjustment(elem, dimension, box, isBorderBox, styles, computedVal) {
    var i2 = dimension === "width" ? 1 : 0, extra = 0, delta = 0, marginDelta = 0;
    if (box === (isBorderBox ? "border" : "content")) {
      return 0;
    }
    for (; i2 < 4; i2 += 2) {
      if (box === "margin") {
        marginDelta += jQuery2.css(elem, box + cssExpand[i2], true, styles);
      }
      if (!isBorderBox) {
        delta += jQuery2.css(elem, "padding" + cssExpand[i2], true, styles);
        if (box !== "padding") {
          delta += jQuery2.css(elem, "border" + cssExpand[i2] + "Width", true, styles);
        } else {
          extra += jQuery2.css(elem, "border" + cssExpand[i2] + "Width", true, styles);
        }
      } else {
        if (box === "content") {
          delta -= jQuery2.css(elem, "padding" + cssExpand[i2], true, styles);
        }
        if (box !== "margin") {
          delta -= jQuery2.css(elem, "border" + cssExpand[i2] + "Width", true, styles);
        }
      }
    }
    if (!isBorderBox && computedVal >= 0) {
      delta += Math.max(0, Math.ceil(
        elem["offset" + dimension[0].toUpperCase() + dimension.slice(1)] - computedVal - delta - extra - 0.5
        // If offsetWidth/offsetHeight is unknown, then we can't determine content-box scroll gutter
        // Use an explicit zero to avoid NaN (gh-3964)
      )) || 0;
    }
    return delta + marginDelta;
  }
  function getWidthOrHeight(elem, dimension, extra) {
    var styles = getStyles(elem), boxSizingNeeded = isIE || extra, isBorderBox = boxSizingNeeded && jQuery2.css(elem, "boxSizing", false, styles) === "border-box", valueIsBorderBox = isBorderBox, val = curCSS(elem, dimension, styles), offsetProp = "offset" + dimension[0].toUpperCase() + dimension.slice(1);
    if (rnumnonpx.test(val)) {
      if (!extra) {
        return val;
      }
      val = "auto";
    }
    if (
      // Fall back to offsetWidth/offsetHeight when value is "auto"
      // This happens for inline elements with no explicit setting (gh-3571)
      (val === "auto" || // Support: IE 9 - 11+
      // Use offsetWidth/offsetHeight for when box sizing is unreliable.
      // In those cases, the computed value can be trusted to be border-box.
      isIE && isBorderBox || !support.reliableColDimensions() && nodeName(elem, "col") || !support.reliableTrDimensions() && nodeName(elem, "tr")) && // Make sure the element is visible & connected
      elem.getClientRects().length
    ) {
      isBorderBox = jQuery2.css(elem, "boxSizing", false, styles) === "border-box";
      valueIsBorderBox = offsetProp in elem;
      if (valueIsBorderBox) {
        val = elem[offsetProp];
      }
    }
    val = parseFloat(val) || 0;
    return val + boxModelAdjustment(
      elem,
      dimension,
      extra || (isBorderBox ? "border" : "content"),
      valueIsBorderBox,
      styles,
      // Provide the current computed size to request scroll gutter calculation (gh-3589)
      val
    ) + "px";
  }
  jQuery2.extend({
    // Add in style property hooks for overriding the default
    // behavior of getting and setting a style property
    cssHooks: {},
    // Get and set the style property on a DOM Node
    style: function(elem, name, value, extra) {
      if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
        return;
      }
      var ret, type, hooks, origName = cssCamelCase(name), isCustomProp = rcustomProp.test(name), style = elem.style;
      if (!isCustomProp) {
        name = finalPropName(origName);
      }
      hooks = jQuery2.cssHooks[name] || jQuery2.cssHooks[origName];
      if (value !== void 0) {
        type = typeof value;
        if (type === "string" && (ret = rcssNum.exec(value)) && ret[1]) {
          value = adjustCSS(elem, name, ret);
          type = "number";
        }
        if (value == null || value !== value) {
          return;
        }
        if (type === "number") {
          value += ret && ret[3] || (isAutoPx(origName) ? "px" : "");
        }
        if (isIE && value === "" && name.indexOf("background") === 0) {
          style[name] = "inherit";
        }
        if (!hooks || !("set" in hooks) || (value = hooks.set(elem, value, extra)) !== void 0) {
          if (isCustomProp) {
            style.setProperty(name, value);
          } else {
            style[name] = value;
          }
        }
      } else {
        if (hooks && "get" in hooks && (ret = hooks.get(elem, false, extra)) !== void 0) {
          return ret;
        }
        return style[name];
      }
    },
    css: function(elem, name, extra, styles) {
      var val, num, hooks, origName = cssCamelCase(name), isCustomProp = rcustomProp.test(name);
      if (!isCustomProp) {
        name = finalPropName(origName);
      }
      hooks = jQuery2.cssHooks[name] || jQuery2.cssHooks[origName];
      if (hooks && "get" in hooks) {
        val = hooks.get(elem, true, extra);
      }
      if (val === void 0) {
        val = curCSS(elem, name, styles);
      }
      if (val === "normal" && name in cssNormalTransform) {
        val = cssNormalTransform[name];
      }
      if (extra === "" || extra) {
        num = parseFloat(val);
        return extra === true || isFinite(num) ? num || 0 : val;
      }
      return val;
    }
  });
  jQuery2.each(["height", "width"], function(_i, dimension) {
    jQuery2.cssHooks[dimension] = {
      get: function(elem, computed, extra) {
        if (computed) {
          return jQuery2.css(elem, "display") === "none" ? swap(elem, cssShow, function() {
            return getWidthOrHeight(elem, dimension, extra);
          }) : getWidthOrHeight(elem, dimension, extra);
        }
      },
      set: function(elem, value, extra) {
        var matches2, styles = getStyles(elem), isBorderBox = extra && jQuery2.css(elem, "boxSizing", false, styles) === "border-box", subtract = extra ? boxModelAdjustment(
          elem,
          dimension,
          extra,
          isBorderBox,
          styles
        ) : 0;
        if (subtract && (matches2 = rcssNum.exec(value)) && (matches2[3] || "px") !== "px") {
          elem.style[dimension] = value;
          value = jQuery2.css(elem, dimension);
        }
        return setPositiveNumber(elem, value, subtract);
      }
    };
  });
  jQuery2.each({
    margin: "",
    padding: "",
    border: "Width"
  }, function(prefix, suffix) {
    jQuery2.cssHooks[prefix + suffix] = {
      expand: function(value) {
        var i2 = 0, expanded = {}, parts = typeof value === "string" ? value.split(" ") : [value];
        for (; i2 < 4; i2++) {
          expanded[prefix + cssExpand[i2] + suffix] = parts[i2] || parts[i2 - 2] || parts[0];
        }
        return expanded;
      }
    };
    if (prefix !== "margin") {
      jQuery2.cssHooks[prefix + suffix].set = setPositiveNumber;
    }
  });
  jQuery2.fn.extend({
    css: function(name, value) {
      return access(this, function(elem, name2, value2) {
        var styles, len, map = {}, i2 = 0;
        if (Array.isArray(name2)) {
          styles = getStyles(elem);
          len = name2.length;
          for (; i2 < len; i2++) {
            map[name2[i2]] = jQuery2.css(elem, name2[i2], false, styles);
          }
          return map;
        }
        return value2 !== void 0 ? jQuery2.style(elem, name2, value2) : jQuery2.css(elem, name2);
      }, name, value, arguments.length > 1);
    }
  });
  function Tween(elem, options, prop, end, easing) {
    return new Tween.prototype.init(elem, options, prop, end, easing);
  }
  jQuery2.Tween = Tween;
  Tween.prototype = {
    constructor: Tween,
    init: function(elem, options, prop, end, easing, unit) {
      this.elem = elem;
      this.prop = prop;
      this.easing = easing || jQuery2.easing._default;
      this.options = options;
      this.start = this.now = this.cur();
      this.end = end;
      this.unit = unit || (isAutoPx(prop) ? "px" : "");
    },
    cur: function() {
      var hooks = Tween.propHooks[this.prop];
      return hooks && hooks.get ? hooks.get(this) : Tween.propHooks._default.get(this);
    },
    run: function(percent) {
      var eased, hooks = Tween.propHooks[this.prop];
      if (this.options.duration) {
        this.pos = eased = jQuery2.easing[this.easing](
          percent,
          this.options.duration * percent,
          0,
          1,
          this.options.duration
        );
      } else {
        this.pos = eased = percent;
      }
      this.now = (this.end - this.start) * eased + this.start;
      if (this.options.step) {
        this.options.step.call(this.elem, this.now, this);
      }
      if (hooks && hooks.set) {
        hooks.set(this);
      } else {
        Tween.propHooks._default.set(this);
      }
      return this;
    }
  };
  Tween.prototype.init.prototype = Tween.prototype;
  Tween.propHooks = {
    _default: {
      get: function(tween) {
        var result;
        if (tween.elem.nodeType !== 1 || tween.elem[tween.prop] != null && tween.elem.style[tween.prop] == null) {
          return tween.elem[tween.prop];
        }
        result = jQuery2.css(tween.elem, tween.prop, "");
        return !result || result === "auto" ? 0 : result;
      },
      set: function(tween) {
        if (jQuery2.fx.step[tween.prop]) {
          jQuery2.fx.step[tween.prop](tween);
        } else if (tween.elem.nodeType === 1 && (jQuery2.cssHooks[tween.prop] || tween.elem.style[finalPropName(tween.prop)] != null)) {
          jQuery2.style(tween.elem, tween.prop, tween.now + tween.unit);
        } else {
          tween.elem[tween.prop] = tween.now;
        }
      }
    }
  };
  jQuery2.easing = {
    linear: function(p) {
      return p;
    },
    swing: function(p) {
      return 0.5 - Math.cos(p * Math.PI) / 2;
    },
    _default: "swing"
  };
  jQuery2.fx = Tween.prototype.init;
  jQuery2.fx.step = {};
  var fxNow, inProgress, rfxtypes = /^(?:toggle|show|hide)$/, rrun = /queueHooks$/;
  function schedule() {
    if (inProgress) {
      if (document$1.hidden === false && window2.requestAnimationFrame) {
        window2.requestAnimationFrame(schedule);
      } else {
        window2.setTimeout(schedule, 13);
      }
      jQuery2.fx.tick();
    }
  }
  function createFxNow() {
    window2.setTimeout(function() {
      fxNow = void 0;
    });
    return fxNow = Date.now();
  }
  function genFx(type, includeWidth) {
    var which, i2 = 0, attrs = { height: type };
    includeWidth = includeWidth ? 1 : 0;
    for (; i2 < 4; i2 += 2 - includeWidth) {
      which = cssExpand[i2];
      attrs["margin" + which] = attrs["padding" + which] = type;
    }
    if (includeWidth) {
      attrs.opacity = attrs.width = type;
    }
    return attrs;
  }
  function createTween(value, prop, animation) {
    var tween, collection = (Animation.tweeners[prop] || []).concat(Animation.tweeners["*"]), index = 0, length = collection.length;
    for (; index < length; index++) {
      if (tween = collection[index].call(animation, prop, value)) {
        return tween;
      }
    }
  }
  function defaultPrefilter(elem, props, opts) {
    var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display, isBox = "width" in props || "height" in props, anim = this, orig = {}, style = elem.style, hidden = elem.nodeType && isHiddenWithinTree(elem), dataShow = dataPriv.get(elem, "fxshow");
    if (!opts.queue) {
      hooks = jQuery2._queueHooks(elem, "fx");
      if (hooks.unqueued == null) {
        hooks.unqueued = 0;
        oldfire = hooks.empty.fire;
        hooks.empty.fire = function() {
          if (!hooks.unqueued) {
            oldfire();
          }
        };
      }
      hooks.unqueued++;
      anim.always(function() {
        anim.always(function() {
          hooks.unqueued--;
          if (!jQuery2.queue(elem, "fx").length) {
            hooks.empty.fire();
          }
        });
      });
    }
    for (prop in props) {
      value = props[prop];
      if (rfxtypes.test(value)) {
        delete props[prop];
        toggle = toggle || value === "toggle";
        if (value === (hidden ? "hide" : "show")) {
          if (value === "show" && dataShow && dataShow[prop] !== void 0) {
            hidden = true;
          } else {
            continue;
          }
        }
        orig[prop] = dataShow && dataShow[prop] || jQuery2.style(elem, prop);
      }
    }
    propTween = !jQuery2.isEmptyObject(props);
    if (!propTween && jQuery2.isEmptyObject(orig)) {
      return;
    }
    if (isBox && elem.nodeType === 1) {
      opts.overflow = [style.overflow, style.overflowX, style.overflowY];
      restoreDisplay = dataShow && dataShow.display;
      if (restoreDisplay == null) {
        restoreDisplay = dataPriv.get(elem, "display");
      }
      display = jQuery2.css(elem, "display");
      if (display === "none") {
        if (restoreDisplay) {
          display = restoreDisplay;
        } else {
          showHide([elem], true);
          restoreDisplay = elem.style.display || restoreDisplay;
          display = jQuery2.css(elem, "display");
          showHide([elem]);
        }
      }
      if (display === "inline" || display === "inline-block" && restoreDisplay != null) {
        if (jQuery2.css(elem, "float") === "none") {
          if (!propTween) {
            anim.done(function() {
              style.display = restoreDisplay;
            });
            if (restoreDisplay == null) {
              display = style.display;
              restoreDisplay = display === "none" ? "" : display;
            }
          }
          style.display = "inline-block";
        }
      }
    }
    if (opts.overflow) {
      style.overflow = "hidden";
      anim.always(function() {
        style.overflow = opts.overflow[0];
        style.overflowX = opts.overflow[1];
        style.overflowY = opts.overflow[2];
      });
    }
    propTween = false;
    for (prop in orig) {
      if (!propTween) {
        if (dataShow) {
          if ("hidden" in dataShow) {
            hidden = dataShow.hidden;
          }
        } else {
          dataShow = dataPriv.set(elem, "fxshow", { display: restoreDisplay });
        }
        if (toggle) {
          dataShow.hidden = !hidden;
        }
        if (hidden) {
          showHide([elem], true);
        }
        anim.done(function() {
          if (!hidden) {
            showHide([elem]);
          }
          dataPriv.remove(elem, "fxshow");
          for (prop in orig) {
            jQuery2.style(elem, prop, orig[prop]);
          }
        });
      }
      propTween = createTween(hidden ? dataShow[prop] : 0, prop, anim);
      if (!(prop in dataShow)) {
        dataShow[prop] = propTween.start;
        if (hidden) {
          propTween.end = propTween.start;
          propTween.start = 0;
        }
      }
    }
  }
  function propFilter(props, specialEasing) {
    var index, name, easing, value, hooks;
    for (index in props) {
      name = cssCamelCase(index);
      easing = specialEasing[name];
      value = props[index];
      if (Array.isArray(value)) {
        easing = value[1];
        value = props[index] = value[0];
      }
      if (index !== name) {
        props[name] = value;
        delete props[index];
      }
      hooks = jQuery2.cssHooks[name];
      if (hooks && "expand" in hooks) {
        value = hooks.expand(value);
        delete props[name];
        for (index in value) {
          if (!(index in props)) {
            props[index] = value[index];
            specialEasing[index] = easing;
          }
        }
      } else {
        specialEasing[name] = easing;
      }
    }
  }
  function Animation(elem, properties, options) {
    var result, stopped, index = 0, length = Animation.prefilters.length, deferred = jQuery2.Deferred().always(function() {
      delete tick.elem;
    }), tick = function() {
      if (stopped) {
        return false;
      }
      var currentTime = fxNow || createFxNow(), remaining = Math.max(0, animation.startTime + animation.duration - currentTime), percent = 1 - (remaining / animation.duration || 0), index2 = 0, length2 = animation.tweens.length;
      for (; index2 < length2; index2++) {
        animation.tweens[index2].run(percent);
      }
      deferred.notifyWith(elem, [animation, percent, remaining]);
      if (percent < 1 && length2) {
        return remaining;
      }
      if (!length2) {
        deferred.notifyWith(elem, [animation, 1, 0]);
      }
      deferred.resolveWith(elem, [animation]);
      return false;
    }, animation = deferred.promise({
      elem,
      props: jQuery2.extend({}, properties),
      opts: jQuery2.extend(true, {
        specialEasing: {},
        easing: jQuery2.easing._default
      }, options),
      originalProperties: properties,
      originalOptions: options,
      startTime: fxNow || createFxNow(),
      duration: options.duration,
      tweens: [],
      createTween: function(prop, end) {
        var tween = jQuery2.Tween(
          elem,
          animation.opts,
          prop,
          end,
          animation.opts.specialEasing[prop] || animation.opts.easing
        );
        animation.tweens.push(tween);
        return tween;
      },
      stop: function(gotoEnd) {
        var index2 = 0, length2 = gotoEnd ? animation.tweens.length : 0;
        if (stopped) {
          return this;
        }
        stopped = true;
        for (; index2 < length2; index2++) {
          animation.tweens[index2].run(1);
        }
        if (gotoEnd) {
          deferred.notifyWith(elem, [animation, 1, 0]);
          deferred.resolveWith(elem, [animation, gotoEnd]);
        } else {
          deferred.rejectWith(elem, [animation, gotoEnd]);
        }
        return this;
      }
    }), props = animation.props;
    propFilter(props, animation.opts.specialEasing);
    for (; index < length; index++) {
      result = Animation.prefilters[index].call(animation, elem, props, animation.opts);
      if (result) {
        if (typeof result.stop === "function") {
          jQuery2._queueHooks(animation.elem, animation.opts.queue).stop = result.stop.bind(result);
        }
        return result;
      }
    }
    jQuery2.map(props, createTween, animation);
    if (typeof animation.opts.start === "function") {
      animation.opts.start.call(elem, animation);
    }
    animation.progress(animation.opts.progress).done(animation.opts.done, animation.opts.complete).fail(animation.opts.fail).always(animation.opts.always);
    jQuery2.fx.timer(
      jQuery2.extend(tick, {
        elem,
        anim: animation,
        queue: animation.opts.queue
      })
    );
    return animation;
  }
  jQuery2.Animation = jQuery2.extend(Animation, {
    tweeners: {
      "*": [function(prop, value) {
        var tween = this.createTween(prop, value);
        adjustCSS(tween.elem, prop, rcssNum.exec(value), tween);
        return tween;
      }]
    },
    tweener: function(props, callback) {
      if (typeof props === "function") {
        callback = props;
        props = ["*"];
      } else {
        props = props.match(rnothtmlwhite);
      }
      var prop, index = 0, length = props.length;
      for (; index < length; index++) {
        prop = props[index];
        Animation.tweeners[prop] = Animation.tweeners[prop] || [];
        Animation.tweeners[prop].unshift(callback);
      }
    },
    prefilters: [defaultPrefilter],
    prefilter: function(callback, prepend) {
      if (prepend) {
        Animation.prefilters.unshift(callback);
      } else {
        Animation.prefilters.push(callback);
      }
    }
  });
  jQuery2.speed = function(speed, easing, fn) {
    var opt = speed && typeof speed === "object" ? jQuery2.extend({}, speed) : {
      complete: fn || easing || typeof speed === "function" && speed,
      duration: speed,
      easing: fn && easing || easing && typeof easing !== "function" && easing
    };
    if (jQuery2.fx.off) {
      opt.duration = 0;
    } else {
      if (typeof opt.duration !== "number") {
        if (opt.duration in jQuery2.fx.speeds) {
          opt.duration = jQuery2.fx.speeds[opt.duration];
        } else {
          opt.duration = jQuery2.fx.speeds._default;
        }
      }
    }
    if (opt.queue == null || opt.queue === true) {
      opt.queue = "fx";
    }
    opt.old = opt.complete;
    opt.complete = function() {
      if (typeof opt.old === "function") {
        opt.old.call(this);
      }
      if (opt.queue) {
        jQuery2.dequeue(this, opt.queue);
      }
    };
    return opt;
  };
  jQuery2.fn.extend({
    fadeTo: function(speed, to, easing, callback) {
      return this.filter(isHiddenWithinTree).css("opacity", 0).show().end().animate({ opacity: to }, speed, easing, callback);
    },
    animate: function(prop, speed, easing, callback) {
      var empty = jQuery2.isEmptyObject(prop), optall = jQuery2.speed(speed, easing, callback), doAnimation = function() {
        var anim = Animation(this, jQuery2.extend({}, prop), optall);
        if (empty || dataPriv.get(this, "finish")) {
          anim.stop(true);
        }
      };
      doAnimation.finish = doAnimation;
      return empty || optall.queue === false ? this.each(doAnimation) : this.queue(optall.queue, doAnimation);
    },
    stop: function(type, clearQueue, gotoEnd) {
      var stopQueue = function(hooks) {
        var stop = hooks.stop;
        delete hooks.stop;
        stop(gotoEnd);
      };
      if (typeof type !== "string") {
        gotoEnd = clearQueue;
        clearQueue = type;
        type = void 0;
      }
      if (clearQueue) {
        this.queue(type || "fx", []);
      }
      return this.each(function() {
        var dequeue = true, index = type != null && type + "queueHooks", timers = jQuery2.timers, data = dataPriv.get(this);
        if (index) {
          if (data[index] && data[index].stop) {
            stopQueue(data[index]);
          }
        } else {
          for (index in data) {
            if (data[index] && data[index].stop && rrun.test(index)) {
              stopQueue(data[index]);
            }
          }
        }
        for (index = timers.length; index--; ) {
          if (timers[index].elem === this && (type == null || timers[index].queue === type)) {
            timers[index].anim.stop(gotoEnd);
            dequeue = false;
            timers.splice(index, 1);
          }
        }
        if (dequeue || !gotoEnd) {
          jQuery2.dequeue(this, type);
        }
      });
    },
    finish: function(type) {
      if (type !== false) {
        type = type || "fx";
      }
      return this.each(function() {
        var index, data = dataPriv.get(this), queue = data[type + "queue"], hooks = data[type + "queueHooks"], timers = jQuery2.timers, length = queue ? queue.length : 0;
        data.finish = true;
        jQuery2.queue(this, type, []);
        if (hooks && hooks.stop) {
          hooks.stop.call(this, true);
        }
        for (index = timers.length; index--; ) {
          if (timers[index].elem === this && timers[index].queue === type) {
            timers[index].anim.stop(true);
            timers.splice(index, 1);
          }
        }
        for (index = 0; index < length; index++) {
          if (queue[index] && queue[index].finish) {
            queue[index].finish.call(this);
          }
        }
        delete data.finish;
      });
    }
  });
  jQuery2.each(["toggle", "show", "hide"], function(_i, name) {
    var cssFn = jQuery2.fn[name];
    jQuery2.fn[name] = function(speed, easing, callback) {
      return speed == null || typeof speed === "boolean" ? cssFn.apply(this, arguments) : this.animate(genFx(name, true), speed, easing, callback);
    };
  });
  jQuery2.each({
    slideDown: genFx("show"),
    slideUp: genFx("hide"),
    slideToggle: genFx("toggle"),
    fadeIn: { opacity: "show" },
    fadeOut: { opacity: "hide" },
    fadeToggle: { opacity: "toggle" }
  }, function(name, props) {
    jQuery2.fn[name] = function(speed, easing, callback) {
      return this.animate(props, speed, easing, callback);
    };
  });
  jQuery2.timers = [];
  jQuery2.fx.tick = function() {
    var timer, i2 = 0, timers = jQuery2.timers;
    fxNow = Date.now();
    for (; i2 < timers.length; i2++) {
      timer = timers[i2];
      if (!timer() && timers[i2] === timer) {
        timers.splice(i2--, 1);
      }
    }
    if (!timers.length) {
      jQuery2.fx.stop();
    }
    fxNow = void 0;
  };
  jQuery2.fx.timer = function(timer) {
    jQuery2.timers.push(timer);
    jQuery2.fx.start();
  };
  jQuery2.fx.start = function() {
    if (inProgress) {
      return;
    }
    inProgress = true;
    schedule();
  };
  jQuery2.fx.stop = function() {
    inProgress = null;
  };
  jQuery2.fx.speeds = {
    slow: 600,
    fast: 200,
    // Default speed
    _default: 400
  };
  jQuery2.fn.delay = function(time, type) {
    time = jQuery2.fx ? jQuery2.fx.speeds[time] || time : time;
    type = type || "fx";
    return this.queue(type, function(next, hooks) {
      var timeout = window2.setTimeout(next, time);
      hooks.stop = function() {
        window2.clearTimeout(timeout);
      };
    });
  };
  var rfocusable = /^(?:input|select|textarea|button)$/i, rclickable = /^(?:a|area)$/i;
  jQuery2.fn.extend({
    prop: function(name, value) {
      return access(this, jQuery2.prop, name, value, arguments.length > 1);
    },
    removeProp: function(name) {
      return this.each(function() {
        delete this[jQuery2.propFix[name] || name];
      });
    }
  });
  jQuery2.extend({
    prop: function(elem, name, value) {
      var ret, hooks, nType = elem.nodeType;
      if (nType === 3 || nType === 8 || nType === 2) {
        return;
      }
      if (nType !== 1 || !jQuery2.isXMLDoc(elem)) {
        name = jQuery2.propFix[name] || name;
        hooks = jQuery2.propHooks[name];
      }
      if (value !== void 0) {
        if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== void 0) {
          return ret;
        }
        return elem[name] = value;
      }
      if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
        return ret;
      }
      return elem[name];
    },
    propHooks: {
      tabIndex: {
        get: function(elem) {
          var tabindex = elem.getAttribute("tabindex");
          if (tabindex) {
            return parseInt(tabindex, 10);
          }
          if (rfocusable.test(elem.nodeName) || // href-less anchor's `tabIndex` property value is `0` and
          // the `tabindex` attribute value: `null`. We want `-1`.
          rclickable.test(elem.nodeName) && elem.href) {
            return 0;
          }
          return -1;
        }
      }
    },
    propFix: {
      "for": "htmlFor",
      "class": "className"
    }
  });
  if (isIE) {
    jQuery2.propHooks.selected = {
      get: function(elem) {
        var parent = elem.parentNode;
        if (parent && parent.parentNode) {
          parent.parentNode.selectedIndex;
        }
        return null;
      },
      set: function(elem) {
        var parent = elem.parentNode;
        if (parent) {
          parent.selectedIndex;
          if (parent.parentNode) {
            parent.parentNode.selectedIndex;
          }
        }
      }
    };
  }
  jQuery2.each([
    "tabIndex",
    "readOnly",
    "maxLength",
    "cellSpacing",
    "cellPadding",
    "rowSpan",
    "colSpan",
    "useMap",
    "frameBorder",
    "contentEditable"
  ], function() {
    jQuery2.propFix[this.toLowerCase()] = this;
  });
  function stripAndCollapse(value) {
    var tokens = value.match(rnothtmlwhite) || [];
    return tokens.join(" ");
  }
  function getClass(elem) {
    return elem.getAttribute && elem.getAttribute("class") || "";
  }
  function classesToArray(value) {
    if (Array.isArray(value)) {
      return value;
    }
    if (typeof value === "string") {
      return value.match(rnothtmlwhite) || [];
    }
    return [];
  }
  jQuery2.fn.extend({
    addClass: function(value) {
      var classNames, cur, curValue, className, i2, finalValue;
      if (typeof value === "function") {
        return this.each(function(j) {
          jQuery2(this).addClass(value.call(this, j, getClass(this)));
        });
      }
      classNames = classesToArray(value);
      if (classNames.length) {
        return this.each(function() {
          curValue = getClass(this);
          cur = this.nodeType === 1 && " " + stripAndCollapse(curValue) + " ";
          if (cur) {
            for (i2 = 0; i2 < classNames.length; i2++) {
              className = classNames[i2];
              if (cur.indexOf(" " + className + " ") < 0) {
                cur += className + " ";
              }
            }
            finalValue = stripAndCollapse(cur);
            if (curValue !== finalValue) {
              this.setAttribute("class", finalValue);
            }
          }
        });
      }
      return this;
    },
    removeClass: function(value) {
      var classNames, cur, curValue, className, i2, finalValue;
      if (typeof value === "function") {
        return this.each(function(j) {
          jQuery2(this).removeClass(value.call(this, j, getClass(this)));
        });
      }
      if (!arguments.length) {
        return this.attr("class", "");
      }
      classNames = classesToArray(value);
      if (classNames.length) {
        return this.each(function() {
          curValue = getClass(this);
          cur = this.nodeType === 1 && " " + stripAndCollapse(curValue) + " ";
          if (cur) {
            for (i2 = 0; i2 < classNames.length; i2++) {
              className = classNames[i2];
              while (cur.indexOf(" " + className + " ") > -1) {
                cur = cur.replace(" " + className + " ", " ");
              }
            }
            finalValue = stripAndCollapse(cur);
            if (curValue !== finalValue) {
              this.setAttribute("class", finalValue);
            }
          }
        });
      }
      return this;
    },
    toggleClass: function(value, stateVal) {
      var classNames, className, i2, self;
      if (typeof value === "function") {
        return this.each(function(i3) {
          jQuery2(this).toggleClass(
            value.call(this, i3, getClass(this), stateVal),
            stateVal
          );
        });
      }
      if (typeof stateVal === "boolean") {
        return stateVal ? this.addClass(value) : this.removeClass(value);
      }
      classNames = classesToArray(value);
      if (classNames.length) {
        return this.each(function() {
          self = jQuery2(this);
          for (i2 = 0; i2 < classNames.length; i2++) {
            className = classNames[i2];
            if (self.hasClass(className)) {
              self.removeClass(className);
            } else {
              self.addClass(className);
            }
          }
        });
      }
      return this;
    },
    hasClass: function(selector) {
      var className, elem, i2 = 0;
      className = " " + selector + " ";
      while (elem = this[i2++]) {
        if (elem.nodeType === 1 && (" " + stripAndCollapse(getClass(elem)) + " ").indexOf(className) > -1) {
          return true;
        }
      }
      return false;
    }
  });
  jQuery2.fn.extend({
    val: function(value) {
      var hooks, ret, valueIsFunction, elem = this[0];
      if (!arguments.length) {
        if (elem) {
          hooks = jQuery2.valHooks[elem.type] || jQuery2.valHooks[elem.nodeName.toLowerCase()];
          if (hooks && "get" in hooks && (ret = hooks.get(elem, "value")) !== void 0) {
            return ret;
          }
          ret = elem.value;
          return ret == null ? "" : ret;
        }
        return;
      }
      valueIsFunction = typeof value === "function";
      return this.each(function(i2) {
        var val;
        if (this.nodeType !== 1) {
          return;
        }
        if (valueIsFunction) {
          val = value.call(this, i2, jQuery2(this).val());
        } else {
          val = value;
        }
        if (val == null) {
          val = "";
        } else if (typeof val === "number") {
          val += "";
        } else if (Array.isArray(val)) {
          val = jQuery2.map(val, function(value2) {
            return value2 == null ? "" : value2 + "";
          });
        }
        hooks = jQuery2.valHooks[this.type] || jQuery2.valHooks[this.nodeName.toLowerCase()];
        if (!hooks || !("set" in hooks) || hooks.set(this, val, "value") === void 0) {
          this.value = val;
        }
      });
    }
  });
  jQuery2.extend({
    valHooks: {
      select: {
        get: function(elem) {
          var value, option, i2, options = elem.options, index = elem.selectedIndex, one = elem.type === "select-one", values = one ? null : [], max = one ? index + 1 : options.length;
          if (index < 0) {
            i2 = max;
          } else {
            i2 = one ? index : 0;
          }
          for (; i2 < max; i2++) {
            option = options[i2];
            if (option.selected && // Don't return options that are disabled or in a disabled optgroup
            !option.disabled && (!option.parentNode.disabled || !nodeName(option.parentNode, "optgroup"))) {
              value = jQuery2(option).val();
              if (one) {
                return value;
              }
              values.push(value);
            }
          }
          return values;
        },
        set: function(elem, value) {
          var optionSet, option, options = elem.options, values = jQuery2.makeArray(value), i2 = options.length;
          while (i2--) {
            option = options[i2];
            if (option.selected = jQuery2.inArray(jQuery2(option).val(), values) > -1) {
              optionSet = true;
            }
          }
          if (!optionSet) {
            elem.selectedIndex = -1;
          }
          return values;
        }
      }
    }
  });
  if (isIE) {
    jQuery2.valHooks.option = {
      get: function(elem) {
        var val = elem.getAttribute("value");
        return val != null ? val : (
          // Support: IE <=10 - 11+
          // option.text throws exceptions (trac-14686, trac-14858)
          // Strip and collapse whitespace
          // https://html.spec.whatwg.org/#strip-and-collapse-whitespace
          stripAndCollapse(jQuery2.text(elem))
        );
      }
    };
  }
  jQuery2.each(["radio", "checkbox"], function() {
    jQuery2.valHooks[this] = {
      set: function(elem, value) {
        if (Array.isArray(value)) {
          return elem.checked = jQuery2.inArray(jQuery2(elem).val(), value) > -1;
        }
      }
    };
  });
  var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/, stopPropagationCallback = function(e) {
    e.stopPropagation();
  };
  jQuery2.extend(jQuery2.event, {
    trigger: function(event, data, elem, onlyHandlers) {
      var i2, cur, tmp, bubbleType, ontype, handle, special, lastElement, eventPath = [elem || document$1], type = hasOwn.call(event, "type") ? event.type : event, namespaces = hasOwn.call(event, "namespace") ? event.namespace.split(".") : [];
      cur = lastElement = tmp = elem = elem || document$1;
      if (elem.nodeType === 3 || elem.nodeType === 8) {
        return;
      }
      if (rfocusMorph.test(type + jQuery2.event.triggered)) {
        return;
      }
      if (type.indexOf(".") > -1) {
        namespaces = type.split(".");
        type = namespaces.shift();
        namespaces.sort();
      }
      ontype = type.indexOf(":") < 0 && "on" + type;
      event = event[jQuery2.expando] ? event : new jQuery2.Event(type, typeof event === "object" && event);
      event.isTrigger = onlyHandlers ? 2 : 3;
      event.namespace = namespaces.join(".");
      event.rnamespace = event.namespace ? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") : null;
      event.result = void 0;
      if (!event.target) {
        event.target = elem;
      }
      data = data == null ? [event] : jQuery2.makeArray(data, [event]);
      special = jQuery2.event.special[type] || {};
      if (!onlyHandlers && special.trigger && special.trigger.apply(elem, data) === false) {
        return;
      }
      if (!onlyHandlers && !special.noBubble && !isWindow(elem)) {
        bubbleType = special.delegateType || type;
        if (!rfocusMorph.test(bubbleType + type)) {
          cur = cur.parentNode;
        }
        for (; cur; cur = cur.parentNode) {
          eventPath.push(cur);
          tmp = cur;
        }
        if (tmp === (elem.ownerDocument || document$1)) {
          eventPath.push(tmp.defaultView || tmp.parentWindow || window2);
        }
      }
      i2 = 0;
      while ((cur = eventPath[i2++]) && !event.isPropagationStopped()) {
        lastElement = cur;
        event.type = i2 > 1 ? bubbleType : special.bindType || type;
        handle = (dataPriv.get(cur, "events") || /* @__PURE__ */ Object.create(null))[event.type] && dataPriv.get(cur, "handle");
        if (handle) {
          handle.apply(cur, data);
        }
        handle = ontype && cur[ontype];
        if (handle && handle.apply && acceptData(cur)) {
          event.result = handle.apply(cur, data);
          if (event.result === false) {
            event.preventDefault();
          }
        }
      }
      event.type = type;
      if (!onlyHandlers && !event.isDefaultPrevented()) {
        if ((!special._default || special._default.apply(eventPath.pop(), data) === false) && acceptData(elem)) {
          if (ontype && typeof elem[type] === "function" && !isWindow(elem)) {
            tmp = elem[ontype];
            if (tmp) {
              elem[ontype] = null;
            }
            jQuery2.event.triggered = type;
            if (event.isPropagationStopped()) {
              lastElement.addEventListener(type, stopPropagationCallback);
            }
            elem[type]();
            if (event.isPropagationStopped()) {
              lastElement.removeEventListener(type, stopPropagationCallback);
            }
            jQuery2.event.triggered = void 0;
            if (tmp) {
              elem[ontype] = tmp;
            }
          }
        }
      }
      return event.result;
    },
    // Piggyback on a donor event to simulate a different one
    // Used only for `focus(in | out)` events
    simulate: function(type, elem, event) {
      var e = jQuery2.extend(
        new jQuery2.Event(),
        event,
        {
          type,
          isSimulated: true
        }
      );
      jQuery2.event.trigger(e, null, elem);
    }
  });
  jQuery2.fn.extend({
    trigger: function(type, data) {
      return this.each(function() {
        jQuery2.event.trigger(type, data, this);
      });
    },
    triggerHandler: function(type, data) {
      var elem = this[0];
      if (elem) {
        return jQuery2.event.trigger(type, data, elem, true);
      }
    }
  });
  var location = window2.location;
  var nonce = { guid: Date.now() };
  var rquery = /\?/;
  jQuery2.parseXML = function(data) {
    var xml, parserErrorElem;
    if (!data || typeof data !== "string") {
      return null;
    }
    try {
      xml = new window2.DOMParser().parseFromString(data, "text/xml");
    } catch (e) {
    }
    parserErrorElem = xml && xml.getElementsByTagName("parsererror")[0];
    if (!xml || parserErrorElem) {
      jQuery2.error("Invalid XML: " + (parserErrorElem ? jQuery2.map(parserErrorElem.childNodes, function(el) {
        return el.textContent;
      }).join("\n") : data));
    }
    return xml;
  };
  var rbracket = /\[\]$/, rCRLF = /\r?\n/g, rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i, rsubmittable = /^(?:input|select|textarea|keygen)/i;
  function buildParams(prefix, obj, traditional, add) {
    var name;
    if (Array.isArray(obj)) {
      jQuery2.each(obj, function(i2, v) {
        if (traditional || rbracket.test(prefix)) {
          add(prefix, v);
        } else {
          buildParams(
            prefix + "[" + (typeof v === "object" && v != null ? i2 : "") + "]",
            v,
            traditional,
            add
          );
        }
      });
    } else if (!traditional && toType(obj) === "object") {
      for (name in obj) {
        buildParams(prefix + "[" + name + "]", obj[name], traditional, add);
      }
    } else {
      add(prefix, obj);
    }
  }
  jQuery2.param = function(a, traditional) {
    var prefix, s = [], add = function(key, valueOrFunction) {
      var value = typeof valueOrFunction === "function" ? valueOrFunction() : valueOrFunction;
      s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value == null ? "" : value);
    };
    if (a == null) {
      return "";
    }
    if (Array.isArray(a) || a.jquery && !jQuery2.isPlainObject(a)) {
      jQuery2.each(a, function() {
        add(this.name, this.value);
      });
    } else {
      for (prefix in a) {
        buildParams(prefix, a[prefix], traditional, add);
      }
    }
    return s.join("&");
  };
  jQuery2.fn.extend({
    serialize: function() {
      return jQuery2.param(this.serializeArray());
    },
    serializeArray: function() {
      return this.map(function() {
        var elements = jQuery2.prop(this, "elements");
        return elements ? jQuery2.makeArray(elements) : this;
      }).filter(function() {
        var type = this.type;
        return this.name && !jQuery2(this).is(":disabled") && rsubmittable.test(this.nodeName) && !rsubmitterTypes.test(type) && (this.checked || !rcheckableType.test(type));
      }).map(function(_i, elem) {
        var val = jQuery2(this).val();
        if (val == null) {
          return null;
        }
        if (Array.isArray(val)) {
          return jQuery2.map(val, function(val2) {
            return { name: elem.name, value: val2.replace(rCRLF, "\r\n") };
          });
        }
        return { name: elem.name, value: val.replace(rCRLF, "\r\n") };
      }).get();
    }
  });
  var r20 = /%20/g, rhash = /#.*$/, rantiCache = /([?&])_=[^&]*/, rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg, rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/, rnoContent = /^(?:GET|HEAD)$/, rprotocol = /^\/\//, prefilters = {}, transports = {}, allTypes = "*/".concat("*"), originAnchor = document$1.createElement("a");
  originAnchor.href = location.href;
  function addToPrefiltersOrTransports(structure) {
    return function(dataTypeExpression, func) {
      if (typeof dataTypeExpression !== "string") {
        func = dataTypeExpression;
        dataTypeExpression = "*";
      }
      var dataType, i2 = 0, dataTypes = dataTypeExpression.toLowerCase().match(rnothtmlwhite) || [];
      if (typeof func === "function") {
        while (dataType = dataTypes[i2++]) {
          if (dataType[0] === "+") {
            dataType = dataType.slice(1) || "*";
            (structure[dataType] = structure[dataType] || []).unshift(func);
          } else {
            (structure[dataType] = structure[dataType] || []).push(func);
          }
        }
      }
    };
  }
  function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR) {
    var inspected = {}, seekingTransport = structure === transports;
    function inspect(dataType) {
      var selected;
      inspected[dataType] = true;
      jQuery2.each(structure[dataType] || [], function(_, prefilterOrFactory) {
        var dataTypeOrTransport = prefilterOrFactory(options, originalOptions, jqXHR);
        if (typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[dataTypeOrTransport]) {
          options.dataTypes.unshift(dataTypeOrTransport);
          inspect(dataTypeOrTransport);
          return false;
        } else if (seekingTransport) {
          return !(selected = dataTypeOrTransport);
        }
      });
      return selected;
    }
    return inspect(options.dataTypes[0]) || !inspected["*"] && inspect("*");
  }
  function ajaxExtend(target, src) {
    var key, deep, flatOptions = jQuery2.ajaxSettings.flatOptions || {};
    for (key in src) {
      if (src[key] !== void 0) {
        (flatOptions[key] ? target : deep || (deep = {}))[key] = src[key];
      }
    }
    if (deep) {
      jQuery2.extend(true, target, deep);
    }
    return target;
  }
  function ajaxHandleResponses(s, jqXHR, responses) {
    var ct, type, finalDataType, firstDataType, contents = s.contents, dataTypes = s.dataTypes;
    while (dataTypes[0] === "*") {
      dataTypes.shift();
      if (ct === void 0) {
        ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
      }
    }
    if (ct) {
      for (type in contents) {
        if (contents[type] && contents[type].test(ct)) {
          dataTypes.unshift(type);
          break;
        }
      }
    }
    if (dataTypes[0] in responses) {
      finalDataType = dataTypes[0];
    } else {
      for (type in responses) {
        if (!dataTypes[0] || s.converters[type + " " + dataTypes[0]]) {
          finalDataType = type;
          break;
        }
        if (!firstDataType) {
          firstDataType = type;
        }
      }
      finalDataType = finalDataType || firstDataType;
    }
    if (finalDataType) {
      if (finalDataType !== dataTypes[0]) {
        dataTypes.unshift(finalDataType);
      }
      return responses[finalDataType];
    }
  }
  function ajaxConvert(s, response, jqXHR, isSuccess) {
    var conv2, current, conv, tmp, prev, converters = {}, dataTypes = s.dataTypes.slice();
    if (dataTypes[1]) {
      for (conv in s.converters) {
        converters[conv.toLowerCase()] = s.converters[conv];
      }
    }
    current = dataTypes.shift();
    while (current) {
      if (s.responseFields[current]) {
        jqXHR[s.responseFields[current]] = response;
      }
      if (!prev && isSuccess && s.dataFilter) {
        response = s.dataFilter(response, s.dataType);
      }
      prev = current;
      current = dataTypes.shift();
      if (current) {
        if (current === "*") {
          current = prev;
        } else if (prev !== "*" && prev !== current) {
          conv = converters[prev + " " + current] || converters["* " + current];
          if (!conv) {
            for (conv2 in converters) {
              tmp = conv2.split(" ");
              if (tmp[1] === current) {
                conv = converters[prev + " " + tmp[0]] || converters["* " + tmp[0]];
                if (conv) {
                  if (conv === true) {
                    conv = converters[conv2];
                  } else if (converters[conv2] !== true) {
                    current = tmp[0];
                    dataTypes.unshift(tmp[1]);
                  }
                  break;
                }
              }
            }
          }
          if (conv !== true) {
            if (conv && s.throws) {
              response = conv(response);
            } else {
              try {
                response = conv(response);
              } catch (e) {
                return {
                  state: "parsererror",
                  error: conv ? e : "No conversion from " + prev + " to " + current
                };
              }
            }
          }
        }
      }
    }
    return { state: "success", data: response };
  }
  jQuery2.extend({
    // Counter for holding the number of active queries
    active: 0,
    // Last-Modified header cache for next request
    lastModified: {},
    etag: {},
    ajaxSettings: {
      url: location.href,
      type: "GET",
      isLocal: rlocalProtocol.test(location.protocol),
      global: true,
      processData: true,
      async: true,
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      /*
      timeout: 0,
      data: null,
      dataType: null,
      username: null,
      password: null,
      cache: null,
      throws: false,
      traditional: false,
      headers: {},
      */
      accepts: {
        "*": allTypes,
        text: "text/plain",
        html: "text/html",
        xml: "application/xml, text/xml",
        json: "application/json, text/javascript"
      },
      contents: {
        xml: /\bxml\b/,
        html: /\bhtml/,
        json: /\bjson\b/
      },
      responseFields: {
        xml: "responseXML",
        text: "responseText",
        json: "responseJSON"
      },
      // Data converters
      // Keys separate source (or catchall "*") and destination types with a single space
      converters: {
        // Convert anything to text
        "* text": String,
        // Text to html (true = no transformation)
        "text html": true,
        // Evaluate text as a json expression
        "text json": JSON.parse,
        // Parse text as xml
        "text xml": jQuery2.parseXML
      },
      // For options that shouldn't be deep extended:
      // you can add your own custom options here if
      // and when you create one that shouldn't be
      // deep extended (see ajaxExtend)
      flatOptions: {
        url: true,
        context: true
      }
    },
    // Creates a full fledged settings object into target
    // with both ajaxSettings and settings fields.
    // If target is omitted, writes into ajaxSettings.
    ajaxSetup: function(target, settings) {
      return settings ? (
        // Building a settings object
        ajaxExtend(ajaxExtend(target, jQuery2.ajaxSettings), settings)
      ) : (
        // Extending ajaxSettings
        ajaxExtend(jQuery2.ajaxSettings, target)
      );
    },
    ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
    ajaxTransport: addToPrefiltersOrTransports(transports),
    // Main method
    ajax: function(url, options) {
      if (typeof url === "object") {
        options = url;
        url = void 0;
      }
      options = options || {};
      var transport, cacheURL, responseHeadersString, responseHeaders, timeoutTimer, urlAnchor, completed2, fireGlobals, i2, uncached, s = jQuery2.ajaxSetup({}, options), callbackContext = s.context || s, globalEventContext = s.context && (callbackContext.nodeType || callbackContext.jquery) ? jQuery2(callbackContext) : jQuery2.event, deferred = jQuery2.Deferred(), completeDeferred = jQuery2.Callbacks("once memory"), statusCode = s.statusCode || {}, requestHeaders = {}, requestHeadersNames = {}, strAbort = "canceled", jqXHR = {
        readyState: 0,
        // Builds headers hashtable if needed
        getResponseHeader: function(key) {
          var match;
          if (completed2) {
            if (!responseHeaders) {
              responseHeaders = {};
              while (match = rheaders.exec(responseHeadersString)) {
                responseHeaders[match[1].toLowerCase() + " "] = (responseHeaders[match[1].toLowerCase() + " "] || []).concat(match[2]);
              }
            }
            match = responseHeaders[key.toLowerCase() + " "];
          }
          return match == null ? null : match.join(", ");
        },
        // Raw string
        getAllResponseHeaders: function() {
          return completed2 ? responseHeadersString : null;
        },
        // Caches the header
        setRequestHeader: function(name, value) {
          if (completed2 == null) {
            name = requestHeadersNames[name.toLowerCase()] = requestHeadersNames[name.toLowerCase()] || name;
            requestHeaders[name] = value;
          }
          return this;
        },
        // Overrides response content-type header
        overrideMimeType: function(type) {
          if (completed2 == null) {
            s.mimeType = type;
          }
          return this;
        },
        // Status-dependent callbacks
        statusCode: function(map) {
          var code;
          if (map) {
            if (completed2) {
              jqXHR.always(map[jqXHR.status]);
            } else {
              for (code in map) {
                statusCode[code] = [statusCode[code], map[code]];
              }
            }
          }
          return this;
        },
        // Cancel the request
        abort: function(statusText) {
          var finalText = statusText || strAbort;
          if (transport) {
            transport.abort(finalText);
          }
          done2(0, finalText);
          return this;
        }
      };
      deferred.promise(jqXHR);
      s.url = ((url || s.url || location.href) + "").replace(rprotocol, location.protocol + "//");
      s.type = options.method || options.type || s.method || s.type;
      s.dataTypes = (s.dataType || "*").toLowerCase().match(rnothtmlwhite) || [""];
      if (s.crossDomain == null) {
        urlAnchor = document$1.createElement("a");
        try {
          urlAnchor.href = s.url;
          urlAnchor.href = urlAnchor.href;
          s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !== urlAnchor.protocol + "//" + urlAnchor.host;
        } catch (e) {
          s.crossDomain = true;
        }
      }
      inspectPrefiltersOrTransports(prefilters, s, options, jqXHR);
      if (s.data && s.processData && typeof s.data !== "string") {
        s.data = jQuery2.param(s.data, s.traditional);
      }
      if (completed2) {
        return jqXHR;
      }
      fireGlobals = jQuery2.event && s.global;
      if (fireGlobals && jQuery2.active++ === 0) {
        jQuery2.event.trigger("ajaxStart");
      }
      s.type = s.type.toUpperCase();
      s.hasContent = !rnoContent.test(s.type);
      cacheURL = s.url.replace(rhash, "");
      if (!s.hasContent) {
        uncached = s.url.slice(cacheURL.length);
        if (s.data && (s.processData || typeof s.data === "string")) {
          cacheURL += (rquery.test(cacheURL) ? "&" : "?") + s.data;
          delete s.data;
        }
        if (s.cache === false) {
          cacheURL = cacheURL.replace(rantiCache, "$1");
          uncached = (rquery.test(cacheURL) ? "&" : "?") + "_=" + nonce.guid++ + uncached;
        }
        s.url = cacheURL + uncached;
      } else if (s.data && s.processData && (s.contentType || "").indexOf("application/x-www-form-urlencoded") === 0) {
        s.data = s.data.replace(r20, "+");
      }
      if (s.ifModified) {
        if (jQuery2.lastModified[cacheURL]) {
          jqXHR.setRequestHeader("If-Modified-Since", jQuery2.lastModified[cacheURL]);
        }
        if (jQuery2.etag[cacheURL]) {
          jqXHR.setRequestHeader("If-None-Match", jQuery2.etag[cacheURL]);
        }
      }
      if (s.data && s.hasContent && s.contentType !== false || options.contentType) {
        jqXHR.setRequestHeader("Content-Type", s.contentType);
      }
      jqXHR.setRequestHeader(
        "Accept",
        s.dataTypes[0] && s.accepts[s.dataTypes[0]] ? s.accepts[s.dataTypes[0]] + (s.dataTypes[0] !== "*" ? ", " + allTypes + "; q=0.01" : "") : s.accepts["*"]
      );
      for (i2 in s.headers) {
        jqXHR.setRequestHeader(i2, s.headers[i2]);
      }
      if (s.beforeSend && (s.beforeSend.call(callbackContext, jqXHR, s) === false || completed2)) {
        return jqXHR.abort();
      }
      strAbort = "abort";
      completeDeferred.add(s.complete);
      jqXHR.done(s.success);
      jqXHR.fail(s.error);
      transport = inspectPrefiltersOrTransports(transports, s, options, jqXHR);
      if (!transport) {
        done2(-1, "No Transport");
      } else {
        jqXHR.readyState = 1;
        if (fireGlobals) {
          globalEventContext.trigger("ajaxSend", [jqXHR, s]);
        }
        if (completed2) {
          return jqXHR;
        }
        if (s.async && s.timeout > 0) {
          timeoutTimer = window2.setTimeout(function() {
            jqXHR.abort("timeout");
          }, s.timeout);
        }
        try {
          completed2 = false;
          transport.send(requestHeaders, done2);
        } catch (e) {
          if (completed2) {
            throw e;
          }
          done2(-1, e);
        }
      }
      function done2(status, nativeStatusText, responses, headers) {
        var isSuccess, success, error, response, modified, statusText = nativeStatusText;
        if (completed2) {
          return;
        }
        completed2 = true;
        if (timeoutTimer) {
          window2.clearTimeout(timeoutTimer);
        }
        transport = void 0;
        responseHeadersString = headers || "";
        jqXHR.readyState = status > 0 ? 4 : 0;
        isSuccess = status >= 200 && status < 300 || status === 304;
        if (responses) {
          response = ajaxHandleResponses(s, jqXHR, responses);
        }
        if (!isSuccess && jQuery2.inArray("script", s.dataTypes) > -1 && jQuery2.inArray("json", s.dataTypes) < 0) {
          s.converters["text script"] = function() {
          };
        }
        response = ajaxConvert(s, response, jqXHR, isSuccess);
        if (isSuccess) {
          if (s.ifModified) {
            modified = jqXHR.getResponseHeader("Last-Modified");
            if (modified) {
              jQuery2.lastModified[cacheURL] = modified;
            }
            modified = jqXHR.getResponseHeader("etag");
            if (modified) {
              jQuery2.etag[cacheURL] = modified;
            }
          }
          if (status === 204 || s.type === "HEAD") {
            statusText = "nocontent";
          } else if (status === 304) {
            statusText = "notmodified";
          } else {
            statusText = response.state;
            success = response.data;
            error = response.error;
            isSuccess = !error;
          }
        } else {
          error = statusText;
          if (status || !statusText) {
            statusText = "error";
            if (status < 0) {
              status = 0;
            }
          }
        }
        jqXHR.status = status;
        jqXHR.statusText = (nativeStatusText || statusText) + "";
        if (isSuccess) {
          deferred.resolveWith(callbackContext, [success, statusText, jqXHR]);
        } else {
          deferred.rejectWith(callbackContext, [jqXHR, statusText, error]);
        }
        jqXHR.statusCode(statusCode);
        statusCode = void 0;
        if (fireGlobals) {
          globalEventContext.trigger(
            isSuccess ? "ajaxSuccess" : "ajaxError",
            [jqXHR, s, isSuccess ? success : error]
          );
        }
        completeDeferred.fireWith(callbackContext, [jqXHR, statusText]);
        if (fireGlobals) {
          globalEventContext.trigger("ajaxComplete", [jqXHR, s]);
          if (!--jQuery2.active) {
            jQuery2.event.trigger("ajaxStop");
          }
        }
      }
      return jqXHR;
    },
    getJSON: function(url, data, callback) {
      return jQuery2.get(url, data, callback, "json");
    },
    getScript: function(url, callback) {
      return jQuery2.get(url, void 0, callback, "script");
    }
  });
  jQuery2.each(["get", "post"], function(_i, method) {
    jQuery2[method] = function(url, data, callback, type) {
      if (typeof data === "function" || data === null) {
        type = type || callback;
        callback = data;
        data = void 0;
      }
      return jQuery2.ajax(jQuery2.extend({
        url,
        type: method,
        dataType: type,
        data,
        success: callback
      }, jQuery2.isPlainObject(url) && url));
    };
  });
  jQuery2.ajaxPrefilter(function(s) {
    var i2;
    for (i2 in s.headers) {
      if (i2.toLowerCase() === "content-type") {
        s.contentType = s.headers[i2] || "";
      }
    }
  });
  jQuery2._evalUrl = function(url, options, doc) {
    return jQuery2.ajax({
      url,
      // Make this explicit, since user can override this through ajaxSetup (trac-11264)
      type: "GET",
      dataType: "script",
      cache: true,
      async: false,
      global: false,
      scriptAttrs: options.crossOrigin ? { "crossOrigin": options.crossOrigin } : void 0,
      // Only evaluate the response if it is successful (gh-4126)
      // dataFilter is not invoked for failure responses, so using it instead
      // of the default converter is kludgy but it works.
      converters: {
        "text script": function() {
        }
      },
      dataFilter: function(response) {
        jQuery2.globalEval(response, options, doc);
      }
    });
  };
  jQuery2.fn.extend({
    wrapAll: function(html) {
      var wrap;
      if (this[0]) {
        if (typeof html === "function") {
          html = html.call(this[0]);
        }
        wrap = jQuery2(html, this[0].ownerDocument).eq(0).clone(true);
        if (this[0].parentNode) {
          wrap.insertBefore(this[0]);
        }
        wrap.map(function() {
          var elem = this;
          while (elem.firstElementChild) {
            elem = elem.firstElementChild;
          }
          return elem;
        }).append(this);
      }
      return this;
    },
    wrapInner: function(html) {
      if (typeof html === "function") {
        return this.each(function(i2) {
          jQuery2(this).wrapInner(html.call(this, i2));
        });
      }
      return this.each(function() {
        var self = jQuery2(this), contents = self.contents();
        if (contents.length) {
          contents.wrapAll(html);
        } else {
          self.append(html);
        }
      });
    },
    wrap: function(html) {
      var htmlIsFunction = typeof html === "function";
      return this.each(function(i2) {
        jQuery2(this).wrapAll(htmlIsFunction ? html.call(this, i2) : html);
      });
    },
    unwrap: function(selector) {
      this.parent(selector).not("body").each(function() {
        jQuery2(this).replaceWith(this.childNodes);
      });
      return this;
    }
  });
  jQuery2.expr.pseudos.hidden = function(elem) {
    return !jQuery2.expr.pseudos.visible(elem);
  };
  jQuery2.expr.pseudos.visible = function(elem) {
    return !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
  };
  jQuery2.ajaxSettings.xhr = function() {
    return new window2.XMLHttpRequest();
  };
  var xhrSuccessStatus = {
    // File protocol always yields status code 0, assume 200
    0: 200
  };
  jQuery2.ajaxTransport(function(options) {
    var callback;
    return {
      send: function(headers, complete) {
        var i2, xhr = options.xhr();
        xhr.open(
          options.type,
          options.url,
          options.async,
          options.username,
          options.password
        );
        if (options.xhrFields) {
          for (i2 in options.xhrFields) {
            xhr[i2] = options.xhrFields[i2];
          }
        }
        if (options.mimeType && xhr.overrideMimeType) {
          xhr.overrideMimeType(options.mimeType);
        }
        if (!options.crossDomain && !headers["X-Requested-With"]) {
          headers["X-Requested-With"] = "XMLHttpRequest";
        }
        for (i2 in headers) {
          xhr.setRequestHeader(i2, headers[i2]);
        }
        callback = function(type) {
          return function() {
            if (callback) {
              callback = xhr.onload = xhr.onerror = xhr.onabort = xhr.ontimeout = null;
              if (type === "abort") {
                xhr.abort();
              } else if (type === "error") {
                complete(
                  // File: protocol always yields status 0; see trac-8605, trac-14207
                  xhr.status,
                  xhr.statusText
                );
              } else {
                complete(
                  xhrSuccessStatus[xhr.status] || xhr.status,
                  xhr.statusText,
                  // For XHR2 non-text, let the caller handle it (gh-2498)
                  (xhr.responseType || "text") === "text" ? { text: xhr.responseText } : { binary: xhr.response },
                  xhr.getAllResponseHeaders()
                );
              }
            }
          };
        };
        xhr.onload = callback();
        xhr.onabort = xhr.onerror = xhr.ontimeout = callback("error");
        callback = callback("abort");
        try {
          xhr.send(options.hasContent && options.data || null);
        } catch (e) {
          if (callback) {
            throw e;
          }
        }
      },
      abort: function() {
        if (callback) {
          callback();
        }
      }
    };
  });
  function canUseScriptTag(s) {
    return s.scriptAttrs || !s.headers && (s.crossDomain || // When dealing with JSONP (`s.dataTypes` include "json" then)
    // don't use a script tag so that error responses still may have
    // `responseJSON` set. Continue using a script tag for JSONP requests that:
    //   * are cross-domain as AJAX requests won't work without a CORS setup
    //   * have `scriptAttrs` set as that's a script-only functionality
    // Note that this means JSONP requests violate strict CSP script-src settings.
    // A proper solution is to migrate from using JSONP to a CORS setup.
    s.async && jQuery2.inArray("json", s.dataTypes) < 0);
  }
  jQuery2.ajaxSetup({
    accepts: {
      script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
    },
    converters: {
      "text script": function(text) {
        jQuery2.globalEval(text);
        return text;
      }
    }
  });
  jQuery2.ajaxPrefilter("script", function(s) {
    if (s.cache === void 0) {
      s.cache = false;
    }
    if (canUseScriptTag(s)) {
      s.type = "GET";
    }
  });
  jQuery2.ajaxTransport("script", function(s) {
    if (canUseScriptTag(s)) {
      var script, callback;
      return {
        send: function(_, complete) {
          script = jQuery2("<script>").attr(s.scriptAttrs || {}).prop({ charset: s.scriptCharset, src: s.url }).on("load error", callback = function(evt) {
            script.remove();
            callback = null;
            if (evt) {
              complete(evt.type === "error" ? 404 : 200, evt.type);
            }
          });
          document$1.head.appendChild(script[0]);
        },
        abort: function() {
          if (callback) {
            callback();
          }
        }
      };
    }
  });
  var oldCallbacks = [], rjsonp = /(=)\?(?=&|$)|\?\?/;
  jQuery2.ajaxSetup({
    jsonp: "callback",
    jsonpCallback: function() {
      var callback = oldCallbacks.pop() || jQuery2.expando + "_" + nonce.guid++;
      this[callback] = true;
      return callback;
    }
  });
  jQuery2.ajaxPrefilter("jsonp", function(s, originalSettings, jqXHR) {
    var callbackName, overwritten, responseContainer, jsonProp = s.jsonp !== false && (rjsonp.test(s.url) ? "url" : typeof s.data === "string" && (s.contentType || "").indexOf("application/x-www-form-urlencoded") === 0 && rjsonp.test(s.data) && "data");
    callbackName = s.jsonpCallback = typeof s.jsonpCallback === "function" ? s.jsonpCallback() : s.jsonpCallback;
    if (jsonProp) {
      s[jsonProp] = s[jsonProp].replace(rjsonp, "$1" + callbackName);
    } else if (s.jsonp !== false) {
      s.url += (rquery.test(s.url) ? "&" : "?") + s.jsonp + "=" + callbackName;
    }
    s.converters["script json"] = function() {
      if (!responseContainer) {
        jQuery2.error(callbackName + " was not called");
      }
      return responseContainer[0];
    };
    s.dataTypes[0] = "json";
    overwritten = window2[callbackName];
    window2[callbackName] = function() {
      responseContainer = arguments;
    };
    jqXHR.always(function() {
      if (overwritten === void 0) {
        jQuery2(window2).removeProp(callbackName);
      } else {
        window2[callbackName] = overwritten;
      }
      if (s[callbackName]) {
        s.jsonpCallback = originalSettings.jsonpCallback;
        oldCallbacks.push(callbackName);
      }
      if (responseContainer && typeof overwritten === "function") {
        overwritten(responseContainer[0]);
      }
      responseContainer = overwritten = void 0;
    });
    return "script";
  });
  jQuery2.ajaxPrefilter(function(s, origOptions) {
    if (typeof s.data !== "string" && !jQuery2.isPlainObject(s.data) && !Array.isArray(s.data) && // Don't disable data processing if explicitly set by the user.
    !("processData" in origOptions)) {
      s.processData = false;
    }
    if (s.data instanceof window2.FormData) {
      s.contentType = false;
    }
  });
  jQuery2.parseHTML = function(data, context, keepScripts) {
    if (typeof data !== "string" && !isObviousHtml(data + "")) {
      return [];
    }
    if (typeof context === "boolean") {
      keepScripts = context;
      context = false;
    }
    var parsed, scripts;
    if (!context) {
      context = new window2.DOMParser().parseFromString("", "text/html");
    }
    parsed = rsingleTag.exec(data);
    scripts = !keepScripts && [];
    if (parsed) {
      return [context.createElement(parsed[1])];
    }
    parsed = buildFragment([data], context, scripts);
    if (scripts && scripts.length) {
      jQuery2(scripts).remove();
    }
    return jQuery2.merge([], parsed.childNodes);
  };
  jQuery2.fn.load = function(url, params, callback) {
    var selector, type, response, self = this, off = url.indexOf(" ");
    if (off > -1) {
      selector = stripAndCollapse(url.slice(off));
      url = url.slice(0, off);
    }
    if (typeof params === "function") {
      callback = params;
      params = void 0;
    } else if (params && typeof params === "object") {
      type = "POST";
    }
    if (self.length > 0) {
      jQuery2.ajax({
        url,
        // If "type" variable is undefined, then "GET" method will be used.
        // Make value of this field explicit since
        // user can override it through ajaxSetup method
        type: type || "GET",
        dataType: "html",
        data: params
      }).done(function(responseText) {
        response = arguments;
        self.html(selector ? (
          // If a selector was specified, locate the right elements in a dummy div
          // Exclude scripts to avoid IE 'Permission Denied' errors
          jQuery2("<div>").append(jQuery2.parseHTML(responseText)).find(selector)
        ) : (
          // Otherwise use the full result
          responseText
        ));
      }).always(callback && function(jqXHR, status) {
        self.each(function() {
          callback.apply(this, response || [jqXHR.responseText, status, jqXHR]);
        });
      });
    }
    return this;
  };
  jQuery2.expr.pseudos.animated = function(elem) {
    return jQuery2.grep(jQuery2.timers, function(fn) {
      return elem === fn.elem;
    }).length;
  };
  jQuery2.offset = {
    setOffset: function(elem, options, i2) {
      var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition, position = jQuery2.css(elem, "position"), curElem = jQuery2(elem), props = {};
      if (position === "static") {
        elem.style.position = "relative";
      }
      curOffset = curElem.offset();
      curCSSTop = jQuery2.css(elem, "top");
      curCSSLeft = jQuery2.css(elem, "left");
      calculatePosition = (position === "absolute" || position === "fixed") && (curCSSTop + curCSSLeft).indexOf("auto") > -1;
      if (calculatePosition) {
        curPosition = curElem.position();
        curTop = curPosition.top;
        curLeft = curPosition.left;
      } else {
        curTop = parseFloat(curCSSTop) || 0;
        curLeft = parseFloat(curCSSLeft) || 0;
      }
      if (typeof options === "function") {
        options = options.call(elem, i2, jQuery2.extend({}, curOffset));
      }
      if (options.top != null) {
        props.top = options.top - curOffset.top + curTop;
      }
      if (options.left != null) {
        props.left = options.left - curOffset.left + curLeft;
      }
      if ("using" in options) {
        options.using.call(elem, props);
      } else {
        curElem.css(props);
      }
    }
  };
  jQuery2.fn.extend({
    // offset() relates an element's border box to the document origin
    offset: function(options) {
      if (arguments.length) {
        return options === void 0 ? this : this.each(function(i2) {
          jQuery2.offset.setOffset(this, options, i2);
        });
      }
      var rect, win, elem = this[0];
      if (!elem) {
        return;
      }
      if (!elem.getClientRects().length) {
        return { top: 0, left: 0 };
      }
      rect = elem.getBoundingClientRect();
      win = elem.ownerDocument.defaultView;
      return {
        top: rect.top + win.pageYOffset,
        left: rect.left + win.pageXOffset
      };
    },
    // position() relates an element's margin box to its offset parent's padding box
    // This corresponds to the behavior of CSS absolute positioning
    position: function() {
      if (!this[0]) {
        return;
      }
      var offsetParent, offset, doc, elem = this[0], parentOffset = { top: 0, left: 0 };
      if (jQuery2.css(elem, "position") === "fixed") {
        offset = elem.getBoundingClientRect();
      } else {
        offset = this.offset();
        doc = elem.ownerDocument;
        offsetParent = elem.offsetParent || doc.documentElement;
        while (offsetParent && offsetParent !== doc.documentElement && jQuery2.css(offsetParent, "position") === "static") {
          offsetParent = offsetParent.offsetParent || doc.documentElement;
        }
        if (offsetParent && offsetParent !== elem && offsetParent.nodeType === 1 && jQuery2.css(offsetParent, "position") !== "static") {
          parentOffset = jQuery2(offsetParent).offset();
          parentOffset.top += jQuery2.css(offsetParent, "borderTopWidth", true);
          parentOffset.left += jQuery2.css(offsetParent, "borderLeftWidth", true);
        }
      }
      return {
        top: offset.top - parentOffset.top - jQuery2.css(elem, "marginTop", true),
        left: offset.left - parentOffset.left - jQuery2.css(elem, "marginLeft", true)
      };
    },
    // This method will return documentElement in the following cases:
    // 1) For the element inside the iframe without offsetParent, this method will return
    //    documentElement of the parent window
    // 2) For the hidden or detached element
    // 3) For body or html element, i.e. in case of the html node - it will return itself
    //
    // but those exceptions were never presented as a real life use-cases
    // and might be considered as more preferable results.
    //
    // This logic, however, is not guaranteed and can change at any point in the future
    offsetParent: function() {
      return this.map(function() {
        var offsetParent = this.offsetParent;
        while (offsetParent && jQuery2.css(offsetParent, "position") === "static") {
          offsetParent = offsetParent.offsetParent;
        }
        return offsetParent || documentElement$1;
      });
    }
  });
  jQuery2.each({ scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function(method, prop) {
    var top = "pageYOffset" === prop;
    jQuery2.fn[method] = function(val) {
      return access(this, function(elem, method2, val2) {
        var win;
        if (isWindow(elem)) {
          win = elem;
        } else if (elem.nodeType === 9) {
          win = elem.defaultView;
        }
        if (val2 === void 0) {
          return win ? win[prop] : elem[method2];
        }
        if (win) {
          win.scrollTo(
            !top ? val2 : win.pageXOffset,
            top ? val2 : win.pageYOffset
          );
        } else {
          elem[method2] = val2;
        }
      }, method, val, arguments.length);
    };
  });
  jQuery2.each({ Height: "height", Width: "width" }, function(name, type) {
    jQuery2.each({
      padding: "inner" + name,
      content: type,
      "": "outer" + name
    }, function(defaultExtra, funcName) {
      jQuery2.fn[funcName] = function(margin, value) {
        var chainable = arguments.length && (defaultExtra || typeof margin !== "boolean"), extra = defaultExtra || (margin === true || value === true ? "margin" : "border");
        return access(this, function(elem, type2, value2) {
          var doc;
          if (isWindow(elem)) {
            return funcName.indexOf("outer") === 0 ? elem["inner" + name] : elem.document.documentElement["client" + name];
          }
          if (elem.nodeType === 9) {
            doc = elem.documentElement;
            return Math.max(
              elem.body["scroll" + name],
              doc["scroll" + name],
              elem.body["offset" + name],
              doc["offset" + name],
              doc["client" + name]
            );
          }
          return value2 === void 0 ? (
            // Get width or height on the element, requesting but not forcing parseFloat
            jQuery2.css(elem, type2, extra)
          ) : (
            // Set width or height on the element
            jQuery2.style(elem, type2, value2, extra)
          );
        }, type, chainable ? margin : void 0, chainable);
      };
    });
  });
  jQuery2.each([
    "ajaxStart",
    "ajaxStop",
    "ajaxComplete",
    "ajaxError",
    "ajaxSuccess",
    "ajaxSend"
  ], function(_i, type) {
    jQuery2.fn[type] = function(fn) {
      return this.on(type, fn);
    };
  });
  jQuery2.fn.extend({
    bind: function(types, data, fn) {
      return this.on(types, null, data, fn);
    },
    unbind: function(types, fn) {
      return this.off(types, null, fn);
    },
    delegate: function(selector, types, data, fn) {
      return this.on(types, selector, data, fn);
    },
    undelegate: function(selector, types, fn) {
      return arguments.length === 1 ? this.off(selector, "**") : this.off(types, selector || "**", fn);
    },
    hover: function(fnOver, fnOut) {
      return this.on("mouseenter", fnOver).on("mouseleave", fnOut || fnOver);
    }
  });
  jQuery2.each(
    "blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "),
    function(_i, name) {
      jQuery2.fn[name] = function(data, fn) {
        return arguments.length > 0 ? this.on(name, null, data, fn) : this.trigger(name);
      };
    }
  );
  jQuery2.proxy = function(fn, context) {
    var tmp, args, proxy;
    if (typeof context === "string") {
      tmp = fn[context];
      context = fn;
      fn = tmp;
    }
    if (typeof fn !== "function") {
      return void 0;
    }
    args = slice.call(arguments, 2);
    proxy = function() {
      return fn.apply(context || this, args.concat(slice.call(arguments)));
    };
    proxy.guid = fn.guid = fn.guid || jQuery2.guid++;
    return proxy;
  };
  jQuery2.holdReady = function(hold) {
    if (hold) {
      jQuery2.readyWait++;
    } else {
      jQuery2.ready(true);
    }
  };
  jQuery2.expr[":"] = jQuery2.expr.filters = jQuery2.expr.pseudos;
  if (typeof define === "function" && define.amd) {
    define("jquery", [], function() {
      return jQuery2;
    });
  }
  var _jQuery = window2.jQuery, _$ = window2.$;
  jQuery2.noConflict = function(deep) {
    if (window2.$ === jQuery2) {
      window2.$ = _$;
    }
    if (deep && window2.jQuery === jQuery2) {
      window2.jQuery = _jQuery;
    }
    return jQuery2;
  };
  return jQuery2;
}
var jQuery = jQueryFactory(window);
window.jQuery = jQuery;
const JstreeConfig = (data) => {
  return {
    "core": {
      "animation": 0,
      "check_callback": true,
      "themes": {
        "name": "proton",
        "responsive": true
      },
      "data": data
    },
    "types": {
      "#": {
        "max_children": 1,
        "max_depth": 9,
        "valid_children": ["root"]
      },
      "root": {
        "icon": "fa-solid fa-book",
        "valid_children": ["default", "file"]
      },
      "default": {
        "valid_children": ["default", "file"]
      },
      "file": {
        "icon": "fa-solid fa-file",
        "valid_children": []
      }
    },
    "plugins": [
      "contextmenu",
      //"dnd",
      "search",
      "types",
      "wholerow",
      "unique"
    ]
  };
};
const treeLoadedEvent = (ul) => function handleTreeLoaded(e, data) {
  jQuery(ul).jstree().deselect_all(true);
  jQuery(ul).jstree().close_all(true);
};
const handleSelectNode = (ul) => function(e, data) {
  if (data.node.id == "root") return;
  if (data.node.type === "file") ;
  else {
    return;
  }
};
function Tree({ getTree, handleCreateNode, handleDeleteNode, handleRenameNode, handleDoubleClick }) {
  const ulRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    jQuery.getScript("/libs/dist/jstree.js", function() {
      const ul = jQuery(ulRef.current);
      getTree().then((tree) => {
        if (typeof tree == "string" && tree != "") {
          tree = JSON.parse(tree);
        }
        if (tree == null || tree == void 0 || tree == "") tree = [{
          "id": "root",
          "text": "Articles",
          "icon": true,
          "li_attr": {
            "id": "root"
          },
          "a_attr": {
            "href": "#"
          },
          "data": {},
          "parent": "#",
          "type": "default"
        }];
        console.log(tree);
        ul.jstree(JstreeConfig(tree)).on("select_node.jstree", handleSelectNode()).on("create_node.jstree", handleCreateNode(ul)).on("delete_node.jstree", handleDeleteNode(ul)).on("loaded.jstree", treeLoadedEvent(ul)).on("rename_node.jstree", handleRenameNode(ul)).on("dblclick.jstree", handleDoubleClick(ul));
      });
    });
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tree-container-outer", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tree-container-controls", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { id: "add-element", onClick: () => {
        addElementButton(ulRef.current);
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fa-solid fa-file-medical" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { id: "add-folder", onClick: () => {
        addFolderButton(ulRef.current);
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "fa-solid fa-folder-plus" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tree-container", id: "article-tree", children: /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { ref: ulRef }) })
  ] });
}
const addElementButton = (ul) => {
  let jstree = jQuery(ul).jstree(true);
  let selected = jstree.get_selected(true).at(0);
  let id = "";
  if (selected.type === "default") {
    id = jstree.create_node(selected.id, { text: " ", type: "file" }, "last");
  } else {
    id = jstree.create_node("#", { text: " ", type: "file" }, "last");
  }
  jstree.edit(jstree.get_node(id));
};
const addFolderButton = (ul) => {
  let jstree = jQuery(ul).jstree(true);
  let selected = jstree.get_selected(true).at(0);
  let id = "";
  if (selected.type === "default") {
    id = jstree.create_node(selected.id, { text: " ", type: "default" }, "last");
  } else {
    id = jstree.create_node("#", { text: " ", type: "default" }, "last");
  }
  jstree.edit(jstree.get_node(id));
};
function enforceUniqueNodeNames(jst, node) {
  let newNodeName = node.text;
  let root = jst.get_node("#");
  const traverseTree = (_node) => {
    let count = 0;
    while (_node.children.length > count) {
      let child = jst.get_node(_node.children[count]);
      traverseTree(child);
      if (child.text == newNodeName && child != node) {
        jst.set_text(node, `(${jst.get_node(node.parent).text}) ${node.text}`);
      }
      count++;
    }
  };
  traverseTree(root);
  node.text = newNodeName;
}
export {
  Tree as T,
  enforceUniqueNodeNames as e,
  jQuery as j
};
