import { request } from "@/utils";

export const requestLyric = (id) => request.get(`/lyric?id=${id}`);

export const requestMusicComments = (id, limit, page) =>
  request.get(`/comment/music?id=${id}&limit=${limit}&offset=${limit * (page - 1)}`);
