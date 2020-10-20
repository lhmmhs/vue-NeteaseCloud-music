import { request } from "@/utils";

export const requestMvDetail = (id) => request.get(`/mv/detail?mvid=${id}`);

export const requestMvUrl = (id) => request.get(`/mv/url?id=${id}`);

export const requestMvComments = (id, limit, page) =>
  request.get(`/comment/mv?id=${id}&limit=${limit}&offset=${limit * (page - 1)}&timestamp=${+new Date()}`);

export const requestMvAll = (area, type, order, limit, page) =>
  request.get(`mv/all?area=${area}&type=${type}&order=${order}&limit=${limit}&offset=${limit * (page - 1)}`);
