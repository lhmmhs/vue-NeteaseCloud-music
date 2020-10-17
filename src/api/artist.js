import { request } from "@/utils";

export const requestArtists = (id, limit, page) =>
  request.get(`/artists?id=${id}&limit=${limit}&offset=${limit * (page - 1)}`);

export const requestArtistAlbum = (id, limit, page) =>
  request.get(`/artist/album?id=${id}&limit=${limit}&offset=${limit * (page - 1)}`);

export const requestArtistMv = (id, limit, page) =>
  request.get(`/artist/mv?id=${id}&limit=${limit}&offset=${limit * (page - 1)}`);

export const requestArtistList = (initial, type, area, limit) =>
  request.get(`/artist/list?initial=${initial}&limit=${limit}&type=${type}&area=${area}`);
