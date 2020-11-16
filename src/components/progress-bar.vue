<template>
  <div
    ref="progressBarWrapper"
    class="progress-bar-wrap"
    @mousemove="mousemoveHandler"
    @mouseleave="mouseleaveHandler"
    @mouseup="mouseupHandler"
  >
    <div class="progress" @click="clickProgressBar"></div>
    <div ref="progressBar" class="cur" @click="clickProgressBar" :style="{ width: progressBarCurWidth + 'px' }"></div>
    <button
      ref="progressBarBtn"
      class="btn"
      :style="{ left: progressBarCurWidth + 'px' }"
      @mousedown="mousedownHandler"
    ></button>
  </div>
</template>

<script>
import { computed, onMounted, ref } from "vue";

export default {
  props: ["disabled", "duration"],
  emits: ["percent-change"],
  setup(props, { emit }) {
    const progressBarBtn = ref(null);
    const progressBarWrapper = ref(null);
    const progressBar = ref(null);
    const progressBarCurWidth = ref(0);

    let progressBarWidth = 0;
    let btnClientX = 0;
    let btnOffsetLeft = 0;
    let move = false;

    function mousedownHandler(e) {
      if (!props.disabled) return;
      move = true;
      btnClientX = e.clientX;
      btnOffsetLeft = e.target.offsetLeft;
    }

    function mouseupHandler(e) {
      if (!props.disabled) return;
      move = false;
    }

    function mouseleaveHandler(e) {
      move = false;
    }

    function mousemoveHandler(e) {
      if (!move) return;
      let clientX = e.clientX;
      let clacValue = clientX - (btnClientX - btnOffsetLeft);
      if (clacValue < 0) clacValue = 0;
      else if (clacValue > progressBarWidth) clacValue = progressBarWidth;

      progressBarCurWidth.value = clacValue;
      calcCurrentTime(clacValue);
    }

    function clickProgressBar(e) {
      if (!props.disabled) return;

      let clientX = e.clientX;
      let left = e.target.getBoundingClientRect().left;
      let currentWidth = clientX - left;
      progressBarCurWidth.value = currentWidth;
      calcCurrentTime(currentWidth);
    }

    function calcPercentByTime(currentTime) {
      return currentTime / Math.ceil(props.duration / 1000);
    }

    function calcProgressBarCurWidth(currentTime, currentSong) {
      if (move) return;
      progressBarCurWidth.value = progressBarWidth * calcPercentByTime(currentTime);
    }

    function calcPercentByWidth(width) {
      return width / progressBarWidth;
    }

    function calcCurrentTime(width) {
      emit("percent-change", width / progressBarWidth);
    }

    onMounted(() => {
      progressBarWidth = progressBarWrapper.value.offsetWidth;
    });

    return {
      clickProgressBar,
      progressBarCurWidth,
      progressBarWrapper,
      progressBarBtn,
      mousedownHandler,
      mousemoveHandler,
      mouseleaveHandler,
      mouseupHandler,

      calcProgressBarCurWidth,
    };
  },
};
</script>

<style lang="stylus" scoped>
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
  height: 3px
  background: #ccc
  cursor: pointer
.cur
  position: absolute
  top: 0
  bottom: 0
  left: 0
  top: 0
  height: 3px
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
</style>