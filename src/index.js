import { createApp, h } from "vue";
import App from "./App";
import router from "@/router";
import store from "@/store";
import "@/style/reset.stylus";
import btn from "@/components/button";

const app = createApp({
  render: () => h(App),
});

app.component("btn", btn);

app.use(router);
app.use(store);
app.mount("#app");
