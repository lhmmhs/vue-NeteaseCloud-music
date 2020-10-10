export default {
  setCurrentSong(state, song) {
    song.url = `https://music.163.com/song/media/outer/url?id=${song.id}.mp3 `;
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
  setLyric(state, lyric) {
    state.lyric = lyric;
  },
  setPlaylist(state, song) {
    state.playlist.push(song);
  },
};
