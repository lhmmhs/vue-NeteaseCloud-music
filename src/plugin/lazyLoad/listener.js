export default class ReactiveListener {
  constructor({ el, src, error, loading, options, elRenderer }) {
    this.el = el;
    this.src = src;
    this.error = error;
    this.loading = loading;

    this.naturalHeight = 0;
    this.naturalWidth = 0;

    this.options = options;

    this.rect = null;

    this.elRenderer = elRenderer;

    this.initState();
  }

  /*
   * init listener state
   * @return
   */
  initState() {
    if ("dataset" in this.el) {
      this.el.dataset.src = this.src;
    } else {
      this.el.setAttribute("data-src", this.src);
    }

    this.state = {
      loading: false,
      error: false,
      loaded: false,
      rendered: false,
    };
  }

  /*
   * get el node rect
   * @return
   */
  getRect() {
    this.rect = this.el.getBoundingClientRect();
  }

  /*
   *  check el is in view
   * @return {Boolean} el is in view
   */
  checkInView() {
    this.getRect();
    return (
      this.rect.top < window.innerHeight * this.options.preLoad &&
      this.rect.bottom > this.options.preLoadTop &&
      this.rect.left < window.innerWidth * this.options.preLoad &&
      this.rect.right > 0
    );
  }
  /*
   * try load image and  render it
   * @return
   */
  load() {
    this.render("loaded", false);
  }

  /*
   * render image
   * @param  {String} state to render // ['loading', 'src', 'error']
   * @param  {String} is form cache
   * @return
   */
  render(state, cache) {
    this.elRenderer(this, state, cache);
  }

  /*
   * $destroy
   * @return
   */
  $destroy() {
    this.el = null;
    this.src = null;
    this.error = null;
    this.loading = null;
  }
}
