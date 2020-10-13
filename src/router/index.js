import { createRouter, createWebHashHistory } from "vue-router";
import Home from "@/views/Home";
import Fm from "@/views/FM";
import Playlist from "@/views/Playlist";
import Mv from "@/views/Mv";
import User from "@/views/User";
import Artist from "@/views/Artist";

const routes = [
  { path: "/", component: Home },
  { path: "/FM", component: Fm },
  { path: "/playlist/:id", component: Playlist },
  { path: "/mv/:id", component: Mv },
  { path: "/user/:uid", component: User },
  { path: "/artist/:id", component: Artist },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
