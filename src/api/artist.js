import { request } from "@/utils";

export const requestArtists = (id) => request.get(`/artists?id=${id}`);

export const requestArtistAlbum = (id) => request.get(`/artist/album?id=${id}`);

export const requestArtistMv = (id) => request.get(`/artist/mv?id=${id}`);
