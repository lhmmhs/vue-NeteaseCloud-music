import { request } from "@/utils";

export const requestPlaylistDetail = (id) => request.get(`/playlist/detail?id=${id}&timestamp=${+new Date()}`);

export const requestPlaylistComments = (id, limit, page) =>
  request.get(`/comment/playlist?id=${id}&limit=${limit}&offset=${limit * (page - 1)}&timestamp=${+new Date()}`);

export const requestPlaylitCatlist = () => request.get("/playlist/catlist");

// 精品歌单
export const requestTopPlaylistHighquality = (cat) => request.get(`/top/playlist/highquality?cat=${cat || "全部"}`);

// 分类歌单
export const requestTopPlaylist = (cat, limit, page) =>
  request.get(`/top/playlist?cat=${cat}&limit=${limit}&offset=${limit * page - 1}`);

export const requestPlaylistSubscribe = (id, t) =>
  request.post(`/playlist/subscribe?timestamp=${+new Date()}`, { id, t });
