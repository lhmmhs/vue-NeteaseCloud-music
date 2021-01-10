import { Store } from "vuex";
import music from "./modules/music";
import user from "./modules/user";

const store = new Store({
  state: {
    login: false,
  },
  mutations: {
    setLogin(state, login) {
      state.login = login;
    },
  },
  modules: {
    music,
    user,
  },
});

export default store;
