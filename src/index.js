import { createApp, h } from "vue";
import App from "./App";
import router from "@/router";
import store from "@/store";
import "@/style/reset.stylus";
import btn from "@/components/button";
import lazyLoad from "@/plugin/lazyLoad";

const app = createApp({
  render: () => h(App),
});

app.use(lazyLoad, {
  observer: true,
});

app.component("btn", btn);

app.use(router);
app.use(store);
app.mount("#app");
