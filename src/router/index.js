import { createRouter, createWebHashHistory } from "vue-router"
import Home from "@/views/Home"
import FM from "@/views/FM"

const routes = [
  { path: "/", component: Home },
  { path: "/FM", component: FM },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
