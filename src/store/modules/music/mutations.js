export default {
  setCurrentSong(state, song) {
    state.currentSong = song;
  },
  setPlayingState(state, playing) {
    state.playing = playing;
  },
  setCurrentTime(state, time) {
    if (state.move) return;
    state.currentTime = time;
  },
  // 通过移动按钮改变歌曲当前播放时间
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
    state.playlist.unshift(song);
  },
  setPlaylistShow(state, playlistShow) {
    state.playlistShow = playlistShow;
  },
  setPlayMode(state, mode) {
    state.playMode = mode;
  },
};
