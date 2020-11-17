import { inBrowser, find, _, throttle, supportWebp, scrollParent, hasIntersectionObserver, modeType } from "./util";

import ReactiveListener from "./listener";
const DEFAULT_EVENTS = ["scroll", "wheel", "mousewheel", "resize", "animationend", "transitionend", "touchmove"];

export default function (app) {
  return class Lazy {
    constructor({
      preLoad,
      error,
      throttleWait,
      preLoadTop,
      dispatchEvent,
      loading,
      attempt,
      silent = true,
      listenEvents,
      observer,
      observerOptions,
    }) {
      this.mode = modeType.event;
      this.ListenerMap = new Map();
      this.TargetIndex = 0;
      this.TargetQueue = [];
      this.options = {
        silent: silent,
        dispatchEvent: !!dispatchEvent,
        throttleWait: throttleWait || 200,
        preLoad: preLoad || 1.3,
        preLoadTop: preLoadTop || 0,
        // error: error || DEFAULT_URL,
        // loading: loading || DEFAULT_URL,
        attempt: attempt || 3,
        ListenEvents: listenEvents || DEFAULT_EVENTS,
        supportWebp: supportWebp(),
        observer: !!observer,
      };
      this.lazyLoadHandler = throttle(this._lazyLoadHandler.bind(this), this.options.throttleWait);

      this.setMode(this.options.observer ? modeType.observer : modeType.event);
    }

    /*
     * add image listener to queue
     * @param  {DOM} el
     * @param  {object} binding vue directive binding
     * @param  {vnode} vnode vue directive vnode
     * @return
     */
    add(el, binding) {
      let { src, loading, error } = this._valueFormatter(binding.value);

      this._observer && this._observer.observe(el);

      const newListener = new ReactiveListener({
        el,
        loading,
        error,
        src,
        elRenderer: this._elRenderer.bind(this),
        options: this.options,
      });

      const $parent = scrollParent(el);

      if (inBrowser) {
        this._addListenerTarget(window);
        this._addListenerTarget($parent);
      }

      this.ListenerMap.set(el, newListener);
      this.lazyLoadHandler();
    }

    /**
     * update image src
     * @param  {DOM} el
     * @param  {object} vue directive binding
     * @return
     */
    update(el, binding, vnode) {
      let { src, loading, error } = this._valueFormatter(binding.value);
      const exist = this.ListenerMap.get(el);
      if (!exist) {
        this.add(el, binding, vnode);
      } else {
        exist.update({
          src,
          loading,
          error,
        });
      }
      if (this._observer) {
        this._observer.unobserve(el);
        this._observer.observe(el);
      }
      this.lazyLoadHandler();
    }

    /**
     * remove listener form list
     * @param  {DOM} el
     * @return
     */
    remove(el) {
      if (!el) return;
      this._observer && this._observer.unobserve(el);
      const existItem = this.ListenerMap.get(el);
      if (existItem) {
        this._removeListenerTarget(window);
        this._removeListenerTarget(existItem.$parent);
        this.ListenerMap.delete(el);
        existItem.$destroy();
      }
    }

    setMode(mode) {
      if (!hasIntersectionObserver && mode === modeType.observer) {
        mode = modeType.event;
      }

      this.mode = mode; // event or observer

      if (mode === modeType.observer) {
        this._initIntersectionObserver();
      }
    }

    /*
     *** Private functions ***
     */

    /*
     * add listener target
     * @param  {DOM} el listener target
     * @return
     */
    _addListenerTarget(el) {
      if (!el) return;
      let target = find(this.TargetQueue, (target) => target.el === el);
      if (!target) {
        target = {
          el: el,
          id: ++this.TargetIndex,
          childrenCount: 1,
          listened: true,
        };
        this.mode === modeType.event && this._initListen(target.el, true);
        this.TargetQueue.push(target);
      } else {
        target.childrenCount++;
      }
      return this.TargetIndex;
    }

    /*
     * remove listener target or reduce target childrenCount
     * @param  {DOM} el or window
     * @return
     */
    _removeListenerTarget(el) {
      this.TargetQueue.forEach((target, index) => {
        if (target.el === el) {
          target.childrenCount--;
          if (!target.childrenCount) {
            this._initListen(target.el, false);
            this.TargetQueue.splice(index, 1);
            target = null;
          }
        }
      });
    }

    /*
     * add or remove eventlistener
     * @param  {DOM} el DOM or Window
     * @param  {boolean} start flag
     * @return
     */
    _initListen(el, start) {
      this.options.ListenEvents.forEach((evt) => _[start ? "on" : "off"](el, evt, this.lazyLoadHandler));
    }

    /**
     * find nodes which in viewport and trigger load
     * @return
     */
    _lazyLoadHandler() {
      const freeList = [];
      this.ListenerMap.forEach((listener) => {
        if (!listener.el || !listener.el.parentNode) {
          freeList.push(listener);
        }
        const catIn = listener.checkInView();
        if (!catIn) return;
        listener.load();
      });
      freeList.forEach((item) => {
        this.ListenerMap.delete(el);
        item.$destroy();
      });
    }

    /**
     * init IntersectionObserver
     * set mode to observer
     * @return
     */
    _initIntersectionObserver() {
      if (!hasIntersectionObserver) return;
      this._observer = new IntersectionObserver(this._observerHandler.bind(this));
    }

    /**
     * init IntersectionObserver
     * @return
     */
    _observerHandler(entries, observer) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          let listener = this.ListenerMap.get(entry.target);
          if (listener.state.loaded) {
            return this._observer.unobserve(listener.el);
          }
          listener.load();
        }
      });
    }

    /**
     * set element attribute with image'url and state
     * @param  {object} lazyload listener object
     * @param  {string} state will be rendered
     * @param  {bool} inCache  is rendered from cache
     * @return
     */
    _elRenderer(listener, state, cache) {
      if (!listener.el) return;
      const { el } = listener;

      let src;
      switch (state) {
        case "loading":
          src = listener.loading;
          break;
        case "error":
          src = listener.error;
          break;
        default:
          src = listener.src;
          break;
      }

      listener.state.loaded = true;
      el.setAttribute("src", src);
    }

    /**
     * generate loading loaded error image url
     * @param {string} image's src
     * @return {object} image's loading, loaded, error url
     */
    _valueFormatter(value) {
      let src = value;
      let loading = this.options.loading;
      let error = this.options.error;

      return {
        src,
        loading,
        error,
      };
    }
  };
}
