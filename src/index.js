import { createApp, h } from "vue"
import App from "./App"
import router from "@/router"
import "@/style/reset.stylus"

const app = createApp({
  render: () => h(App),
})

app.use(router)
app.mount("#app")
