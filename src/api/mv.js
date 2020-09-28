import { request } from "@/utils";

export const requestMvDetail = (id) => request.get(`/mv/detail?mvid=${id}`);

export const requestMvUrl = (id) => request.get(`/mv/url?id=${id}`);

export const requestMvComments = (id, limit, page) => request.get(`/comment/mv?id=${id}&limit=${limit}&offset=${limit * (page - 1)}`);
