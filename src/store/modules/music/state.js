import { playModeMap } from "@/utils/config";

export default {
  // 当前播放歌曲
  currentSong: {},
  // 播放状态
  playing: false,
  // 播放进度
  currentTime: 0,
  // player show
  playerShow: false,
  // 播放列表
  playlist: [],
  //
  playlistShow: false,
  // 播放模式
  playMode: playModeMap.sequence.code,
};
