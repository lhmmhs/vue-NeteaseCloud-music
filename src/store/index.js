import { Store } from "vuex";
import music from "./modules/music";
import user from "./modules/user";

const store = new Store({
  modules: {
    music,
    user,
  },
});

export default store;
