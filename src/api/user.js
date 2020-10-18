import { request } from "@/utils";

export const requestUserDetail = (uid) => request.get(`/user/detail?uid=${uid}`);

// 听歌排行
export const requestUserRecord = (uid) => request.get(`/user/record?uid=${uid}`);

// 用户歌单
export const requestUserPlaylist = (uid) => request.get(`/user/playlist?uid=${uid}`);

export const requestLoginCellphone = (phone, password) =>
  request.get(`/login/cellphone?phone=${phone}&password=${password}`);

// 登录刷新
export const requestLoginRefresh = () => request.get("/login/refresh");

// 登录状态
export const requestLoginStatus = () => request.get("/login/status");

// 关注/取消关注用户
export const requestFollow = (id, t) => request.post("/follow", { id, t });

// 用户关注列表
export const requestUserFollows = (uid) => request.get(`/user/follows?uid=${uid}`);
