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
  setPlayerShow(state, playerShow) {
    state.playerShow = playerShow;
  },
  setPlaylist(state, song) {
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
