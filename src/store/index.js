import Vuex from "vuex";
import musicModule from "./modules/music";

const store = new Vuex.Store({
  modules: {
    music: musicModule,
  },
});

export default store;
