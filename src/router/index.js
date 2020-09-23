import { createRouter, createWebHashHistory } from "vue-router"
import Home from "@/views/Home"
import FM from "@/views/FM"
import Playlist from "@/views/Playlist"

const routes = [
  { path: "/", component: Home },
  { path: "/FM", component: FM },
  { path: "/playlist/:id", component: Playlist },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
