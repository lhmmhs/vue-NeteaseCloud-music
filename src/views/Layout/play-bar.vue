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
      <div
        ref="progressBarWrap"
        class="progress-bar-wrap"
        @mousemove="mousemoveHandler"
        @mouseleave="mouseleaveHandler"
        @mouseup="mouseupHandler"
      >
        <div class="progress" @click="progressChange"></div>
        <div ref="progressBar" class="cur" @click="progressChange" :style="{ width: progressBarCurWidth + 'px' }"></div>
        <button
          ref="btn"
          class="btn"
          @mousedown="mousedownHandler"
          :style="{ left: progressBarCurWidth + 'px' }"
        ></button>
      </div>
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
      @ended="endHandler"
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

export default {
  setup() {
    const store = useStore();

    // dom
    const btn = ref(null);
    const audio = ref(null);
    const progressBarWrap = ref(null);
    const progressBar = ref(null);

    // ref
    const progressBarCurWidth = ref(0);

    let progressBarWidth = 0;
    let btnClientX = 0;
    let btnOffsetLeft = 0;

    const currentSong = computed(() => store.state.music.currentSong);
    const currentTime = computed(() => store.state.music.currentTime);
    const playing = computed(() => store.state.music.playing);
    const move = computed(() => store.state.music.move);
    const playerShow = computed(() => store.state.music.playerShow);
    const playlistShow = computed(() => store.state.music.playlistShow);
    const playMode = computed(() => store.state.music.playMode);
    const prevSong = computed(() => store.getters["music/prevSong"]);
    const nextSong = computed(() => store.getters["music/nextSong"]);

    // watch
    watch(currentSong, (newSong, prevSong) => {
      audio.value.currentTime = 0;
      _play();
    });

    // evnet
    function canplayHandler(e) {
      store.commit("music/setPlayingState", true);
    }

    function endHandler(e) {
      // 歌曲播放结束后
      next();
    }

    function timeUpdateHandler(e) {
      const currentTime = e.target.currentTime;
      store.commit("music/setCurrentTime", currentTime);
      calcProgressBarCurWidth(currentTime);
    }

    function pauseHandler(e) {
      store.commit("music/setPlayingState", false);
    }

    function playHandler(e) {
      store.commit("music/setPlayingState", true);
    }

    function mousedownHandler(e) {
      if (!currentSong.value.url) return;
      store.commit("music/setMove", true);
      btnClientX = e.clientX;
      btnOffsetLeft = e.target.offsetLeft;
    }

    function mouseupHandler(e) {
      if (!currentSong.value.url) return;
      // 1.有播放中的歌曲
      // 2.未移动
      if (currentSong.value.url && !move.value) return;

      // 1.暂停
      // 2.结束
      // 先播放音乐
      if (!playing.value) {
        _play();
      }
      audio.value.currentTime = currentTime.value;
      store.commit("music/setCurrentTimeByMove", currentTime.value);
      store.commit("music/setMove", false);
    }

    function mouseleaveHandler(e) {
      store.commit("music/setMove", false);
    }

    function mousemoveHandler(e) {
      if (!move.value) return;
      let clientX = e.clientX;
      let clacValue = clientX - (btnClientX - btnOffsetLeft);
      if (clacValue < 0) clacValue = 0;
      else if (clacValue > progressBarWidth) clacValue = progressBarWidth;

      progressBarCurWidth.value = clacValue;
      calcCurrentTime(clacValue);
    }

    function errorHandler(e) {
      // 播放歌曲失败
    }

    function progressChange(e) {
      if (!currentSong.value.url) return;

      let clientX = e.clientX;
      let left = e.target.getBoundingClientRect().left;
      let clacValue = clientX - left;
      progressBarCurWidth.value = clacValue;
      calcCurrentTime(clacValue);
      if (!playing.value) {
        _play();
      }
      audio.value.currentTime = currentTime.value;
    }

    // methods
    // 通过时间计算百分比
    function percentByTime(currentTime) {
      const { duration } = currentSong.value;
      return currentTime / Math.ceil(duration / 1000);
    }

    // 通过时间百分比计算进度条宽度
    function calcProgressBarCurWidth(currentTime) {
      if (move.value) return;
      progressBarCurWidth.value = progressBarWidth * percentByTime(currentTime);
    }

    // 通过宽度计算百分比
    function percentByWidth(width) {
      return width / progressBarWidth;
    }

    // 通过宽度百分比计算歌曲当前播放的时间
    function calcCurrentTime(width) {
      store.commit("music/setCurrentTimeByMove", percentByWidth(width) * (currentSong.value.duration / 1000));
    }

    function play() {
      if (!currentSong.value.url) return;

      if (playing.value) {
        pause();
      } else {
        _play();
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

    const _play = async () => {
      try {
        await audio.value.play();
      } catch (error) {
        // 播放歌曲失败
      }
    };

    function togglePlayerShow() {
      if (!currentSong.value.url) return;
      store.commit("music/setPlayerShow", !playerShow.value);
    }

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

    // life
    onMounted(() => {
      progressBarWidth = progressBarWrap.value.offsetWidth;
    });

    return {
      btn,
      audio,
      progressBar,
      progressBarWrap,

      progressBarCurWidth,

      // computed
      currentSong,
      currentTime,
      playing,
      playerShow,
      playMode,

      canplayHandler,
      endHandler,
      timeUpdateHandler,
      pauseHandler,
      playHandler,
      mousedownHandler,
      mouseupHandler,
      mousemoveHandler,
      mouseleaveHandler,
      errorHandler,
      progressChange,

      play,
      next,
      prev,
      togglePlayMode,
      togglePlayerShow,
      togglePlaylistShow,
      formatTime,

      playModeMap,
    };
  },
};
</script>

<style lang="stylus" scoped>
.play-bar
  display: flex
  align-items: center
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
.progress-bar-wrap
  position: relative
  width: 40%
  height: 100%
.progress
  position: absolute
  top: 0
  bottom: 0
  left: 0
  right: 0
  margin: auto
  height: 2px
  background: #ccc
  cursor: pointer
.cur
  position: absolute
  top: 0
  bottom: 0
  left: 0
  top: 0
  height: 2px
  margin: auto
  background: #d33a31
  cursor: pointer
.btn
  position: absolute
  left: 0
  top: 0
  bottom: 0
  z-index: 1
  width: 12px
  height: 12px
  margin: auto
  border-radius: 50%
  background: #d33a31
  cursor: pointer
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