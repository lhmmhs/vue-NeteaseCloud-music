import { requestLyric } from "@/api";

export default {
  async playSong({ commit, state }, song) {
    if (song.id === state.currentSong.id) return;

    commit("setCurrentSong", song);
    commit("setPlaylist", song);
    // 请求歌曲歌词
    const lyric = await requestLyric(song.id);
    commit("setLyric", lyric);
  },
};
