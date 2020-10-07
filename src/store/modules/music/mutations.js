export default {
  setCurrentSong(state, id) {
    state.currentSongUrl = `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
  },
};
