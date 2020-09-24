import { request } from "@/utils"

export const requestPlaylistDetail = (id) =>
  request.get(`/playlist/detail?id=${id}`)

export const requestPlaylistComments = (id, limit, offset) =>
  request.get(`/comment/playlist?id=${id}&limit=${limit}&offset=${offset}`)
