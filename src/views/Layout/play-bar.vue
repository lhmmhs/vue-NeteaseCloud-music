<template>
  <div class="play-bar">
    <div class="controls">
      <span @click="prev" class="icon-warp"><i class="iconfont icon-prev"></i></span>
      <span @click="play" class="icon-warp">
        <i class="iconfont" :class="[playing ? 'icon-pause' : 'icon-play']"></i>
      </span>
      <span @click="next" class="icon-warp"><i class="iconfont icon-next"></i></span>
    </div>
    <div class="song-progress">
      <div class="song">
        <div class="img-wrap">
          <div class="img-loading" v-if="!currentSong.song"></div>
          <img v-else class="song-img" :src="`${currentSong.picUrl}?param=40y40`" />
        </div>
        <span class="duration">
          {{ currentSong.song ? formatTime(currentSong.song.duration) : "00:00" }}
        </span>
        <span class="slash">/</span>
        <span class="currentTime">{{ formatTime(currentTime * 1000) }}</span>
      </div>
      <div
        ref="progressBarWrap"
        class="progress-bar-wrap"
        @mousemove="mousemoveHandler"
        @mousemover="mouseoutHandler"
      >
        <div ref="progressBar" class="cur" :style="{ width: progressBarCurWidth + 'px' }"></div>
        <button
          ref="btn"
          class="btn"
          @mousedown="mousedownHandler"
          @mouseup="mouseupHandler"
          :style="{ left: progressBarCurWidth + 'px' }"
        ></button>
      </div>
    </div>
    <div class="right"></div>
    <audio
      ref="audio"
      class="audio"
      :src="currentSong.url"
      @canplay.native="canplayHandler"
      @timeupdate.native="timeUpdateHandler"
      @ended.native="endHandler"
      @pause.native="pauseHandler"
      @play.native="playHandler"
    />
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, nextTick } from "vue";
import { useStore } from "vuex";
import { formatTime } from "@/utils";

export default {
  setup() {
    const store = useStore();

    const btn = ref(null);
    const audio = ref(null);
    const progressBarWrap = ref(null);
    const progressBar = ref(null);

    let progressBarWidth = 0;
    const progressBarCurWidth = ref(0);

    let btnClientX = 0;
    let btnOffsetLeft = 0;
    let move = false;

    const isShow = ref(false);

    const currentSong = computed(() => store.state.music.currentSong);
    const currentTime = computed(() => store.state.music.currentTime);
    const playing = computed(() => store.state.music.playing);

    // watch
    watch(currentSong, async (currentSong, prev) => {
      await audio.value.play();
    });

    watch(currentTime, async (currentTime, prev) => {
      calcProgressBarCurWidth(currentTime);
    });

    // evnet
    function canplayHandler(e) {
      store.commit("music/setPlayingState", true);
    }

    function endHandler(e) {
      store.commit("music/setPlayingState", false);
    }

    function timeUpdateHandler(e) {
      store.commit("music/setCurrentTime", e.target.currentTime);
    }

    function pauseHandler(e) {
      store.commit("music/setPlayingState", false);
    }

    function playHandler(e) {
      store.commit("music/setPlayingState", true);
    }

    function mousedownHandler(e) {
      move = true;
      btnClientX = e.clientX;
      btnOffsetLeft = e.target.offsetLeft;
    }

    function mouseupHandler(e) {
      move = false;
    }

    function mouseoutHandler(e) {
      move = false;
    }

    function mousemoveHandler(e) {
      if (!move) return;
      let clientX = e.clientX;
      let clacVlue = clientX - (btnClientX - btnOffsetLeft);
      if (clacVlue < 0) clacVlue = 0;
      else if (clacVlue > progressBarWidth) clacVlue = progressBarWidth;

      progressBarCurWidth.value = clacVlue;
    }

    // methods
    function percent(currentTime) {
      const { duration } = currentSong.value.song;
      return currentTime / Math.ceil(duration / 1000);
    }

    function calcProgressBarCurWidth(currentTime) {
      progressBarCurWidth.value = progressBarWidth * percent(currentTime);
    }

    function play() {
      if (!currentSong.value.url) return;

      if (playing.value) {
        pause();
      } else {
        audio.value.play();
      }
    }

    function next() {}

    function prev() {}

    function pause() {
      audio.value.pause();
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

      canplayHandler,
      endHandler,
      timeUpdateHandler,
      pauseHandler,
      playHandler,
      mousedownHandler,
      mouseupHandler,
      mousemoveHandler,
      mouseoutHandler,

      play,
      next,
      prev,
      formatTime,
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
  height: 60px
  padding: 0 20px
  background: #f9f9f9
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
.icon-warp:nth-child(2)
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
  height: 2px
  margin-left: 30px
  background: #ccc
.cur
  position: absolute
  left: 0
  top: 0
  height: 2px
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
.song-img
  display: block
.duration, .currentTime
  font-size: 14px
.slash
  margin: 0 4px
  font-size: 12px
.img-loading, .img-wrap
  width: 40px
  height: 40px
  margin-right: 10px
  background: #ebebeb
  box-shadow: 1px 1px 2px 2px #eee
.song-progress
  flex: 1
  display: flex
  justify-content: center
  align-items: center
  height: 100%
</style>