import Lazy from "./lazy";

export default {
  /*
   * install function
   * @param  {app} app
   * @param  {object} options  lazyload options
   */
  install(app, options = {}) {
    const LazyClass = Lazy(app);
    const lazy = new LazyClass(options);

    app.directive("lazy", {
      beforeMount: lazy.init.bind(lazy),
      mounted: lazy.add.bind(lazy),
      unmounted: lazy.remove.bind(lazy),
    });
  },
};
