import { request } from "@/utils";

export const requestAlbumDetail = (id) => request.get(`/album/detail?id=${id}`);

export const requestAlbum = (id) => request.get(`/album?id=${id}`);

export const requestAlbumComments = (id, limit, page) =>
  request.get(`/comment/album?id=${id}&limit=${limit}&offset=${limit * (page - 1)}&timestamp=${+new Date()}`);
