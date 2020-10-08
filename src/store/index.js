import Vuex from "vuex";
import music from "./modules/music";

const store = new Vuex.Store({
  modules: {
    music,
  },
});

export default store;
