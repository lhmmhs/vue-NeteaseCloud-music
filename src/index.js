import { createApp, h } from "vue";
import App from "./App";
import router from "@/router";
import store from "@/store";
import "@/style/reset.stylus";
import { requestLoginStatus } from "@/api";
import btn from "@/components/button";

const app = createApp({
  render: () => h(App),
});

(async () => {
  const { code, profile } = await requestLoginStatus();

  if (code === 200) {
    store.commit("user/setProfile", profile);
    store.commit("user/setStatus", true);
  } else if (code === 301) {
    // 未登录
  }
})();

app.component("btn", btn);

app.use(router);
app.use(store);
app.mount("#app");
