const inBrowser = typeof window !== "undefined" && window !== null;

export const hasIntersectionObserver = checkIntersectionObserver();

function checkIntersectionObserver() {
  if (
    inBrowser &&
    "IntersectionObserver" in window &&
    "IntersectionObserverEntry" in window &&
    "intersectionRatio" in window.IntersectionObserverEntry.prototype
  ) {
    // Minimal polyfill for Edge 15's lack of `isIntersecting`
    // See: https://github.com/w3c/IntersectionObserver/issues/211
    if (!("isIntersecting" in window.IntersectionObserverEntry.prototype)) {
      Object.defineProperty(window.IntersectionObserverEntry.prototype, "isIntersecting", {
        get: function () {
          return this.intersectionRatio > 0;
        },
      });
    }
    return true;
  }
  return false;
}

export const modeType = {
  event: "event",
  observer: "observer",
};

// CustomEvent polyfill
const CustomEvent = (function () {
  if (!inBrowser) return;
  if (typeof window.CustomEvent === "function") return window.CustomEvent;
  function CustomEvent(event, params) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent("CustomEvent");
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  }
  CustomEvent.prototype = window.Event.prototype;
  return CustomEvent;
})();

function remove(arr, item) {
  if (!arr.length) return;
  const index = arr.indexOf(item);
  if (index > -1) return arr.splice(index, 1);
}

function some(arr, fn) {
  let has = false;
  for (let i = 0, len = arr.length; i < len; i++) {
    if (fn(arr[i])) {
      has = true;
      break;
    }
  }
  return has;
}

function find(arr, fn) {
  let item;
  for (let i = 0, len = arr.length; i < len; i++) {
    if (fn(arr[i])) {
      item = arr[i];
      break;
    }
  }
  return item;
}

const getDPR = (scale = 1) => (inBrowser ? window.devicePixelRatio || scale : scale);

function supportWebp() {
  if (!inBrowser) return false;

  let support = true;
  const d = document;

  try {
    const elem = document.createElement("canvas");

    if (!!(elem.getContext && elem.getContext("2d"))) {
      support = elem.toDataURL("image/webp").indexOf("data:image/webp") === 0;
    }
  } catch (err) {
    support = false;
  }

  return support;
}

function throttle(action, delay) {
  let timeout = null;
  let lastRun = 0;
  return function () {
    if (timeout) {
      return;
    }
    let elapsed = Date.now() - lastRun;
    let context = this;
    let args = arguments;
    let runCallback = function () {
      lastRun = Date.now();
      timeout = false;
      action.apply(context, args);
    };
    if (elapsed >= delay) {
      runCallback();
    } else {
      timeout = setTimeout(runCallback, delay);
    }
  };
}

function testSupportsPassive() {
  if (!inBrowser) return;
  let support = false;
  try {
    let opts = Object.defineProperty({}, "passive", {
      get: function () {
        support = true;
      },
    });
    window.addEventListener("test", null, opts);
  } catch (e) {}
  return support;
}

const supportsPassive = testSupportsPassive();

const _ = {
  on(el, type, func, capture = false) {
    if (supportsPassive) {
      el.addEventListener(type, func, {
        capture: capture,
        passive: true,
      });
    } else {
      el.addEventListener(type, func, capture);
    }
  },
  off(el, type, func, capture = false) {
    el.removeEventListener(type, func, capture);
  },
};

const loadImageAsync = (item, resolve, reject) => {
  let image = new Image();
  if (!item || !item.src) {
    const err = new Error("image src is required");
    return reject(err);
  }

  image.src = item.src;
  if (item.cors) {
    image.crossOrigin = item.cors;
  }

  image.onload = function () {
    resolve({
      naturalHeight: image.naturalHeight,
      naturalWidth: image.naturalWidth,
      src: image.src,
    });
  };

  image.onerror = function (e) {
    reject(e);
  };
};

const style = (el, prop) => {
  return typeof getComputedStyle !== "undefined" ? getComputedStyle(el, null).getPropertyValue(prop) : el.style[prop];
};

const overflow = (el) => {
  return style(el, "overflow") + style(el, "overflow-y") + style(el, "overflow-x");
};

const scrollParent = (el) => {
  if (!inBrowser) return;
  if (!(el instanceof HTMLElement)) {
    return window;
  }

  let parent = el;

  while (parent) {
    if (parent === document.body || parent === document.documentElement) {
      break;
    }

    if (!parent.parentNode) {
      break;
    }

    if (/(scroll|auto)/.test(overflow(parent))) {
      return parent;
    }

    parent = parent.parentNode;
  }

  return window;
};

function isObject(obj) {
  return obj !== null && typeof obj === "object";
}

function ObjectKeys(obj) {
  if (!(obj instanceof Object)) return [];
  if (Object.keys) {
    return Object.keys(obj);
  } else {
    let keys = [];
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        keys.push(key);
      }
    }
    return keys;
  }
}

function ArrayFrom(arrLike) {
  let len = arrLike.length;
  const list = [];
  for (let i = 0; i < len; i++) {
    list.push(arrLike[i]);
  }
  return list;
}

function noop() {}

class ImageCache {
  constructor({ max }) {
    this.options = {
      max: max || 100,
    };
    this._caches = [];
  }

  has(key) {
    return this._caches.indexOf(key) > -1;
  }

  add(key) {
    if (this.has(key)) return;
    this._caches.push(key);
    if (this._caches.length > this.options.max) {
      this.free();
    }
  }

  free() {
    this._caches.shift();
  }
}

export {
  ImageCache,
  inBrowser,
  CustomEvent,
  remove,
  some,
  find,
  noop,
  ArrayFrom,
  _,
  isObject,
  throttle,
  supportWebp,
  getDPR,
  scrollParent,
  loadImageAsync,
  ObjectKeys,
};