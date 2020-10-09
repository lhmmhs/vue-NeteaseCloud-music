<template>
  <transition name="fade">
    <div v-if="show" class="player">
      <div class="song">
        <div class="img-wrap" :class="{ paused: !playing }">
          <img class="song-img" :src="`${currentSong.picUrl}?param=250y250`" />
        </div>
        <div class="song-content">
          <h3 class="song-name">{{ currentSong.name }}</h3>
          <div class="artists">
            <span>歌手：</span>
            <span class="artist" v-for="artist in currentSong.song.artists">{{ artist.name }}</span>
          </div>
          <div class="lyric">
            <ul class="lrcs">
              <li class="lrc" v-for="item in data.lyric" :ref="setItemRef">
                <p class="lrc-txt" v-for="content in item.contents">{{ content }}</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <comments :id="currentSong.id" :type="'music'" />
    </div>
  </transition>
</template>

<script>
import { ref, computed, watch, onMounted, reactive, onBeforeUpdate, onUpdated } from "vue";
import { useStore } from "vuex";
import { formatTime } from "@/utils";
import { requestLyric, requestMusicComments } from "@/api";
import comments from "@/components/comments";
import { lyricParser, mergeLrcTlyric } from "@/utils";
import { useRoute } from "vue-router";

export default {
  components: { comments },
  setup() {
    const route = useRoute();
    const store = useStore();

    let itemRefs = [];

    const data = reactive({
      lyric: [],
    });

    const currentSong = computed(() => store.state.music.currentSong);
    const show = computed(() => store.state.music.show);
    const playing = computed(() => store.state.music.playing);
    const currentTime = computed(() => store.state.music.currentTime);
    const move = computed(() => store.state.music.move);

    const activeLyricIndex = ref(-1);

    function lyricActiveIndex(time) {
      let currentTime = time * 1000;
      let res = [];
      res = data.lyric.filter(({ time, content }) => currentTime > time);
      activeLyricIndex.value = res.length === 0 ? -1 : res.length - 1;
    }

    watch(show, () => {
      getLyric();
    });

    watch(
      () => route.path,
      () => {
        store.commit("music/setShow", false);
      }
    );

    watch(currentSong, () => {
      // 切换新歌 清空已存在的dom引用
      itemRefs = [];
    });

    watch(currentTime, (time, prev) => {
      if (!show.value) return;
      if (move.value) return;

      lyricActiveIndex(time);
    });

    watch(activeLyricIndex, (newIndex, oldIndex) => {
      if (newIndex !== oldIndex) {
        console.log(itemRefs[newIndex]);
      }
    });

    const setItemRef = (el) => {
      itemRefs.push(el);
    };

    const getLyric = async () => {
      const lyric = await requestLyric(currentSong.value.id);
      const { tlyric, lrc, lyricUser, transUser } = lyricParser(lyric);

      data.lyric = mergeLrcTlyric(lrc, tlyric);
    };

    onMounted(() => {
      console.log("player mounted");
    });

    return {
      show,
      currentSong,
      playing,

      data,
      setItemRef,
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
  padding: 20px 200px
  z-index: 3
  background: #f9f9f9
  overflow-y: auto
.song
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
.img-wrap.paused
  animation-play-state: paused
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
.song-content
  flex: 1
  margin-left: 100px
.song-name
  margin-bottom: 16px
.artists
  font-size: 14px
  margin-bottom: 20px
.artist
  font-size: 13px
  color: #4996d1
  margin-right: 6px
.lyric
  height: 350px
  overflow-y: auto
.lrcs
  padding: 16px 0
.lrc
  margin-bottom: 16px
  font-size: 13px
.lrc-txt
  margin-bottom: 8px
.fade-enter-active, .fade-leave-active
  transition: all 0.5s ease
.fade-enter-from, .fade-leave-to
  transform: translateY(100%)
</style>