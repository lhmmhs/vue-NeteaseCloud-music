export default {
  async playSong({ commit, state }, rawSong) {
    // 1.单曲循环
    // 2.歌单中只有1首歌曲
    // 触发watch
    const song = Object.assign({}, rawSong);
    commit("setCurrentSong", song);
    // 不在播放列表内的歌曲才添加
    if (state.playlist.every((item) => item.id !== song.id)) {
      commit("setPlaylist", song);
    }
  },
};
