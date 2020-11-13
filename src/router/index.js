import { createRouter, createWebHashHistory } from "vue-router";
import Home from "@/views/Home";
const PlaylistDetail = () => import("@/views/PlaylistDetail");
const Playlist = () => import("@/views/Playlist");
const Mv = () => import("@/views/Mv");
const User = () => import("@/views/User");
const Artist = () => import("@/views/Artist");
const Artists = () => import("@/views/Artists");
const Album = () => import("@/views/Album");
const Mvs = () => import("@/views/Mvs");
const Login = () => import("@/views/Login");
const Search = () => import("@/views/Search");

const routes = [
  { path: "/", component: Home },
  { path: "/playlist/:id", component: PlaylistDetail },
  { path: "/mv/:id", component: Mv },
  { path: "/user/:uid", component: User },
  { path: "/artist/:id", component: Artist },
  { path: "/artists", component: Artists },
  { path: "/album/:id", component: Album },
  { path: "/playlist", component: Playlist },
  { path: "/Mvs", component: Mvs },
  { path: "/login", component: Login },
  { path: "/search/:keywords", component: Search },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
