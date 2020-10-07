import { request } from "@/utils";

export const requestUserDetail = (uid) => request(`/user/detail?uid=${uid}`);

// 听歌排行
export const requestUserRecord = (uid) => request(`/user/record?uid=${uid}`);

// 用户歌单
export const requestUserPlaylist = (uid) => request(`/user/playlist?uid=${uid}`);
