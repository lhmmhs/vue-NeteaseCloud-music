export default {
  playSong({ commit, state }, song) {
    commit("setCurrentSong", song);
  },
};
