<template>
  <div class="play-bar">
    <div class="controls">
      <span @click="prev" class="icon-wrap"><i class="iconfont icon-prev"></i></span>
      <span @click="play" class="icon-wrap">
        <i class="iconfont" :class="[playing ? 'icon-pause' : 'icon-play']"></i>
      </span>
      <span @click="next" class="icon-wrap"><i class="iconfont icon-next"></i></span>
    </div>

    <div class="song-progress">
      <div class="song">
        <div class="img-wrap">
          <div v-if="!currentSong.picUrl" class="img-loading"></div>
          <img v-else class="song-img" :src="`${currentSong.picUrl}?param=40y40`" />
          <div class="mask" @click="togglePlayerShow">
            <i class="iconfont icon-component" :class="[playerShow ? 'icon-shrink' : 'icon-open']"></i>
          </div>
        </div>
        <span class="duration">
          {{ currentSong.duration ? formatTime(currentSong.duration) : "00:00" }}
        </span>
        <span class="slash">/</span>
        <span class="currentTime">{{ formatTime(currentTime * 1000) }}</span>
      </div>

      <progress-bar
        ref="progressBar"
        :duration="currentSong.duration"
        :disabled="currentSong.url"
        @percent-change="onPercentChange"
        @mouse-up="onMouseup"
      />
    </div>

    <div class="right">
      <i class="iconfont" :class="['icon-' + playMode]" :title="playModeMap[playMode].name" @click="togglePlayMode"></i>
      <i class="iconfont icon-playlist" title="播放歌单" @click="togglePlaylistShow"></i>
    </div>

    <audio
      ref="audio"
      class="audio"
      :src="currentSong.url"
      @canplay="canplayHandler"
      @timeupdate="timeUpdateHandler"
      @ended="endedHandler"
      @pause="pauseHandler"
      @play="playHandler"
      @error="errorHandler"
    />
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, nextTick } from "vue";
import { useStore } from "vuex";
import { formatTime, playModeMap } from "@/utils";
import progressBar from "@/components/progress-bar";

function useControls(store, audio) {
  const currentSong = computed(() => store.state.music.currentSong);
  const playing = computed(() => store.state.music.playing);

  const prevSong = computed(() => store.getters["music/prevSong"]);
  const nextSong = computed(() => store.getters["music/nextSong"]);

  watch(playing, (playing) => {});

  function play() {
    if (!currentSong.value.url) return;

    if (playing.value) {
      pause();
    } else {
      audio.value.play();
    }
  }

  function next() {
    if (nextSong.value) {
      store.dispatch("music/playSong", nextSong.value);
    }
  }

  function prev() {
    if (prevSong.value) {
      store.dispatch("music/playSong", prevSong.value);
    }
  }

  function pause() {
    audio.value.pause();
  }

  return {
    playing,

    play,
    next,
    prev,
    pause,
  };
}

function useAudioEvents(store, audio, next, progressBar) {
  const currentSong = computed(() => store.state.music.currentSong);

  function canplayHandler(e) {
    store.commit("music/setPlayingState", true);
  }

  function endedHandler(e) {
    // 歌曲播放结束后
    next();
  }

  function timeUpdateHandler(e) {
    const currentTime = e.target.currentTime;
    store.commit("music/setCurrentTime", currentTime);
    progressBar.value.calcProgressBarCurWidth(currentTime, currentSong);
  }

  function pauseHandler(e) {
    store.commit("music/setPlayingState", false);
  }

  function playHandler(e) {
    store.commit("music/setPlayingState", true);
  }

  function errorHandler(e) {
    // 播放歌曲失败
  }

  watch(currentSong, () => {
    audio.value.currentTime = 0;
    audio.value.play();
  });

  return {
    audio,
    canplayHandler,
    playHandler,
    errorHandler,
    pauseHandler,
    timeUpdateHandler,
    endedHandler,
  };
}

function useToggleMode(store) {
  const playlistShow = computed(() => store.state.music.playlistShow);
  const playMode = computed(() => store.state.music.playMode);

  function togglePlaylistShow() {
    store.commit("music/setPlaylistShow", !playlistShow.value);
  }

  function togglePlayMode() {
    const modeKeys = Object.keys(playModeMap);
    const currentModeIndex = modeKeys.findIndex((key) => playModeMap[key].code === playMode.value);
    const nextIndex = (currentModeIndex + 1) % modeKeys.length;
    const nextModeKey = modeKeys[nextIndex];
    const nextMode = playModeMap[nextModeKey];
    store.commit("music/setPlayMode", nextMode.code);
  }

  return {
    playlistShow,
    playMode,
    togglePlaylistShow,
    togglePlayMode,
  };
}

function usePlayer(store) {
  const playerShow = computed(() => store.state.music.playerShow);
  const currentSong = computed(() => store.state.music.currentSong);

  function togglePlayerShow() {
    if (!currentSong.value.url) return;
    store.commit("music/setPlayerShow", !playerShow.value);
  }

  return {
    playerShow,
    togglePlayerShow,
  };
}

function useProgressBar(store, audio) {
  const currentSong = computed(() => store.state.music.currentSong);
  const playing = computed(() => store.state.music.playing);

  function onPercentChange({ percent, move }) {
    let currentTime = percent * (currentSong.value.duration / 1000);

    if (!playing.value && !move) {
      audio.value.play();
    }

    if (move) {
      store.commit("music/setCurrentTime", currentTime);
    } else {
      audio.value.currentTime = currentTime;
    }
  }

  function onMouseup(move) {
    const currentTime = computed(() => store.state.music.currentTime);

    if (!playing.value) {
      audio.value.play();
    }

    audio.value.currentTime = currentTime.value;
  }

  return {
    onPercentChange,
    onMouseup,
  };
}

export default {
  components: { progressBar },
  setup() {
    const store = useStore();

    const currentSong = computed(() => store.state.music.currentSong);
    const currentTime = computed(() => store.state.music.currentTime);

    const audio = ref(null);
    const progressBar = ref(null);

    const { playing, play, next, prev, pause } = useControls(store, audio);

    const { canplayHandler, playHandler, errorHandler, pauseHandler, timeUpdateHandler, endedHandler } = useAudioEvents(
      store,
      audio,
      next,
      progressBar
    );

    const { onPercentChange, onMouseup } = useProgressBar(store, audio);

    const { playlistShow, playMode, togglePlaylistShow, togglePlayMode } = useToggleMode(store);

    const { playerShow, togglePlayerShow } = usePlayer(store);

    return {
      currentSong,
      currentTime,
      progressBar,

      audio,
      playing,
      canplayHandler,
      endedHandler,
      timeUpdateHandler,
      pauseHandler,
      playHandler,
      errorHandler,

      play,
      next,
      prev,
      pause,

      playerShow,
      togglePlaylistShow,

      playMode,
      playModeMap,
      togglePlayMode,
      togglePlayerShow,

      onPercentChange,
      onMouseup,

      formatTime,
    };
  },
};
</script>

<style lang="stylus" scoped>
.play-bar
  display: flex
  align-items: center
  justify-content: space-between
  position: fixed
  left: 0
  right: 0
  bottom: 0
  z-index: 5
  height: 60px
  padding: 0 20px
  background: #f9f9f9
  box-shadow: 2px 2px 4px #000
.controls
  display: inline-flex
  align-items: center
  height: 100%
.icon-prev, .icon-next
  cursor: pointer
  font-size: 24px
  color: #d33a31
.icon-play, .icon-pause
  cursor: pointer
  font-size: 22px
  color: #fff
.icon-wrap:nth-child(2)
  cursor: pointer
  display: flex
  justify-content: center
  align-items: center
  width: 40px
  height: 40px
  margin: 0 10px
  border-radius: 50%
  background: #d33a31
.song
  height: 100%
  display: flex
  align-items: center
  margin-right: 30px
.duration, .currentTime
  font-size: 14px
.slash
  margin: 0 4px
  font-size: 12px
.img-loading, .img-wrap
  position: relative
  width: 40px
  height: 40px
  margin-right: 10px
  background: #ebebeb
  box-shadow: 1px 1px 2px 2px #eee
.song-img
  display: block
.mask
  display: flex
  align-items: center
  justify-content: center
  position: absolute
  left: 0
  top: 0
  bottom: 0
  right: 0
  background: rgba(0, 0, 0, 0.4)
  cursor: pointer
.icon-component
  color: #ffffff
  font-size: 18px
.song-progress
  flex: 1
  display: flex
  justify-content: center
  align-items: center
  height: 100%
.icon-playlist, .icon-sequence, .icon-loop, .icon-random
  margin-right: 25px
  font-size: 22px
  cursor: pointer
</style>