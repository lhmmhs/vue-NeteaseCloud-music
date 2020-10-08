export default {
  setCurrentSong(state, song) {
    song.url = `https://music.163.com/song/media/outer/url?id=${song.id}.mp3 `;

    state.currentSong = song;
  },
  setPlayingState(state, playing) {
    console.log(playing);
    state.playing = playing;
  },
  setCurrentTime(state, time) {
    state.currentTime = time;
  },
};
