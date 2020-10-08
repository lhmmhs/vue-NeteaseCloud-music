<template>
  <transition name="fade">
    <div v-if="show" class="player">
      <div class="song-content">
        <div class="img-wrap">
          <img class="song-img" :src="`${currentSong.picUrl}?param=250y250`" />
        </div>
        <div class="lyric"></div>
      </div>
    </div>
  </transition>
</template>

<script>
import { ref, computed, watch, onMounted, reactive } from "vue";
import { useStore } from "vuex";
import { formatTime } from "@/utils";
import { requestLyric, requestMusicComments } from "@/api";

export default {
  setup() {
    const store = useStore();

    const data = reactive({
      lyric: [],
    });

    const currentSong = computed(() => store.state.music.currentSong);
    const show = computed(() => store.state.music.show);

    const getLyric = async () => {
      const lyric = await requestLyric(currentSong.value.id);
    };

    return {
      show,
      currentSong,
    };
  },
};
</script>

<style lang="stylus" scoped>
.player
  position: fixed
  left: 0
  right: 0
  bottom: 60px
  top: 50px
  padding: 0 200px
  z-index: 3
  background: #f9f9f9
.song-content
  display: flex
  justify-content: space-between
.img-wrap
  display: flex
  justify-content: center
  align-items: center
  width: 300px
  height: 300px
  border-radius: 50%
  overflow: hidden
  background: linear-gradient(-45deg, #333540, #070708, #333540)
  box-shadow: 0 0 4px 4px #ccc
  animation: turn 25s linear infinite
@keyframes turn
  0%
    -webkit-transform: rotate(0deg)
  25%
    -webkit-transform: rotate(90deg)
  50%
    -webkit-transform: rotate(180deg)
  75%
    -webkit-transform: rotate(270deg)
  100%
    -webkit-transform: rotate(360deg)
.song-img
  width: 230px
  height: 230px
  border-radius: 50%
  box-shadow: 0 0 4px 4px #000
.lyric
  flex: 1
.fade-enter-active, .fade-leave-active
  transition: all 0.3s ease
.fade-enter-from, .fade-leave-to
  transform: translateY(100%)
</style>