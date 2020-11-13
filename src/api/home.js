import { request } from "@/utils";

export const requestBanner = () => request.get("/banner?type=0");

export const requestNewSong = () => request.get("/personalized/newsong");

export const requestMvs = () => request.get("/personalized/mv");

export const requestPlaylist = () => request.get("/personalized?limit=10");

export const requestSongDetail = (id) => request.get(`/song/detail?ids=${id}`);

export const requestSearchSuggest = (keywords) => request.get(`/search/suggest?keywords=${keywords}`);

export const requestSearch = (keywords, limit, page) =>
  request.get(`/search?keywords=${keywords}&limit=${limit}&offset=${limit * (page - 1)}`);
