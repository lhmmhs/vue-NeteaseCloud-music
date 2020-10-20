import { request } from "@/utils";

export const requestUserDetail = (uid) => request.get(`/user/detail?uid=${uid}&timestamp=${+new Date()}`);

// 听歌排行
export const requestUserRecord = (uid) => request.get(`/user/record?uid=${uid}`);

// 用户歌单
export const requestUserPlaylist = (uid) => request.get(`/user/playlist?uid=${uid}&timestamp=${+new Date()}`);

export const requestLoginCellphone = (phone, password) =>
  request.get(`/login/cellphone?phone=${phone}&password=${password}`);

// 登录刷新
export const requestLoginRefresh = () => request.get("/login/refresh");

// 登录状态
export const requestLoginStatus = () => request.get(`/login/status?timestamp=${+new Date()}`);

// 关注/取消关注用户
export const requestFollow = (id, t) => request.post(`/follow?timestamp=${+new Date()}`, { id, t });

// 用户关注列表
export const requestUserFollows = (uid) => request.get(`/user/follows?uid=${uid}`);

// 评论点赞
export const requestCommentLike = (id, cid, type, t) =>
  request.post(`/comment/like?timestamp=${+new Date()}`, { id, cid, type, t });
