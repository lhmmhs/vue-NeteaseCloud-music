<template>
  <div class="play-bar">
    <div class="controls">
      <span class="icon-warp"><i class="iconfont icon-prev"></i></span>
      <span class="icon-warp"><i class="iconfont icon-play"></i></span>
      <span class="icon-warp"><i class="iconfont icon-next"></i></span>
    </div>
    <div class="song"></div>
    <div class="progress-bar">
      <div class="cur">
        <span ref="btn" class="btn"></span>
      </div>
    </div>
    <div class="right"></div>
    <audio :src="currentSongUrl" />
  </div>
</template>

<script>
import { ref, computed } from "vue";

export default {
  setup() {
    const btn = ref(null);
    const songUrl = ref("");

    return {
      btn,
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
.icon-play, .icon-paues
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
.progress-bar
  position: relative
  width: 40%
  height: 2px
  margin-left: 120px
  background: #ccc
.cur
  position: absolute
  left: 0
  top: 0
  height: 2px
  width: 10%
  background: #d33a31
.btn
  position: absolute
  top: 0
  bottom: 0
  right: 0
  z-index: 1
  width: 12px
  height: 12px
  margin: auto
  border-radius: 50%
  background: #d33a31
  cursor: pointer
</style>