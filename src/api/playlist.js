import { request } from "@/utils"

export const requestPlaylistDetail = (id) =>
  request.get(`/playlist/detail?id=${id}`)
