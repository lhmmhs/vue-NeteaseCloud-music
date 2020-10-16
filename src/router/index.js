import { createRouter, createWebHashHistory } from "vue-router";
import Home from "@/views/Home";
import Fm from "@/views/FM";
import PlaylistDetail from "@/views/PlaylistDetail";
import Playlist from "@/views/Playlist";
import Mv from "@/views/Mv";
import User from "@/views/User";
import Artist from "@/views/Artist";
import Album from "@/views/Album";
import Mvs from "@/views/Mvs";

const routes = [
  { path: "/", component: Home },
  { path: "/FM", component: Fm },
  { path: "/playlist/:id", component: PlaylistDetail },
  { path: "/mv/:id", component: Mv },
  { path: "/user/:uid", component: User },
  { path: "/artist/:id", component: Artist },
  { path: "/album/:id", component: Album },
  { path: "/playlist", component: Playlist },
  { path: "/Mvs", component: Mvs },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
