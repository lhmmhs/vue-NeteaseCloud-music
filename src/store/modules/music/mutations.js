export default {
  setCurrentSong(state, song) {
    state.currentSong = song;
  },
  setPlayingState(state, playing) {
    state.playing = playing;
  },
  setCurrentTime(state, time) {
    // 歌曲播放状态移动状态同时存在，都会执行该mutation
    // 在移动情况直接禁止执行，防止歌曲当前时间乱跳bug
    if (state.move) return;
    state.currentTime = time;
  },
  setCurrentTimeByMove(state, time) {
    state.currentTime = time;
  },
  setMove(state, move) {
    state.move = move;
  },
  setPlayerShow(state, playerShow) {
    state.playerShow = playerShow;
  },
  setPlaylist(state, song) {
    if (typeof song === "number") {
      state.playlist.forEach((item, index) => {
        if (item.id === song) {
          state.playlist.splice(index, 1);
        }
      });

      return;
    }

    if (Array.isArray(song)) {
      state.playlist = song;
    } else {
      state.playlist.unshift(song);
    }
  },
  setPlaylistShow(state, playlistShow) {
    state.playlistShow = playlistShow;
  },
  setPlayMode(state, mode) {
    state.playMode = mode;
  },
};
