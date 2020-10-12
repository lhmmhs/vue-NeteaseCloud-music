<template>
  <transition name="fade">
    <div v-if="playerShow" class="player">
      <div class="song">
        <div class="img-wrap" :class="{ paused: !playing }">
          <img class="song-img" :src="`${currentSong.picUrl}?param=250y250`" />
        </div>
        <div class="song-content">
          <h3 class="name-wrap">
            <span class="song-name">{{ currentSong.name }}</span>
            <router-link v-if="currentSong.mvid" :to="`/mv/${currentSong.mvid}`" class="mv-tag">MV</router-link>
          </h3>
          <div class="artists">
            <span>歌手：</span>
            <span v-for="artist in currentSong.artists">
              <router-link :to="`/artist/${artist.id}`" class="artist">
                {{ artist.name }}
              </router-link>
              <span class="slash">/</span>
            </span>
          </div>
          <scroller class="lyric" @init="initHandler" :data="data.lyric">
            <ul class="lrcs">
              <li class="lrc" v-for="(item, index) in data.lyric" :ref="setItemRef" :class="getLyricActive(index)">
                <p class="lrc-txt" v-for="content in item.contents">{{ content }}</p>
              </li>
            </ul>
          </scroller>
        </div>
      </div>
      <comments :id="currentSong.id" :type="'music'" />
    </div>
  </transition>
</template>

<script>
import { ref, computed, watch, onMounted, reactive, nextTick } from "vue";
import { useStore } from "vuex";
import { formatTime } from "@/utils";
import comments from "@/components/comments";
import scroller from "@/components/scroller";
import { lyricParser, mergeLrcTlyric } from "@/utils";
import { useRoute } from "vue-router";

export default {
  components: { comments, scroller },
  setup() {
    const route = useRoute();
    const store = useStore();

    let scroller = null;
    let itemRefs = [];

    const data = reactive({
      lyric: [],
    });

    const currentSong = computed(() => store.state.music.currentSong);
    const playerShow = computed(() => store.state.music.playerShow);
    const playing = computed(() => store.state.music.playing);
    const currentTime = computed(() => store.state.music.currentTime);
    const move = computed(() => store.state.music.move);
    const lyric = computed(() => store.state.music.lyric);

    const activeLyricIndex = computed(() => {
      let res = [];
      res = data.lyric.filter(({ time, content }) => currentTime.value * 1000 > time);
      return res.length === 0 ? -1 : res.length - 1;
    });

    watch(playerShow, () => {
      // 每次打开歌词界面，清空旧的dom引用
      // 因为每次打开都需要重新渲染
      itemRefs = [];

      const { tlyric, lrc, lyricUser, transUser } = lyricParser(lyric.value);
      data.lyric = mergeLrcTlyric(lrc, tlyric);

      nextTick(() => {
        // 防止新旧activeLyricIndex相同，不会滚动到指定位置
        scrollToActiveLyric();
      });
    });

    watch(
      () => route.path,
      () => {
        store.commit("music/setPlayerShow", false);
      }
    );

    watch(activeLyricIndex, (newIndex, oldIndex) => {
      if (!playerShow.value) return;
      if (newIndex !== oldIndex) {
        scrollToActiveLyric();
      }
    });

    function scrollToActiveLyric() {
      if (activeLyricIndex.value !== -1) {
        if (scroller && itemRefs[activeLyricIndex.value]) {
          scroller.scrollToElement(itemRefs[activeLyricIndex.value], 200, 0, true);
        }
      }
    }

    function getLyricActive(index) {
      return activeLyricIndex.value === index ? "active" : "";
    }

    function setItemRef(el) {
      //
      if (itemRefs.length < data.lyric.length) {
        itemRefs.push(el);
      }
    }

    function initHandler(bscroll) {
      scroller = bscroll;
    }

    return {
      playerShow,
      currentSong,
      playing,

      data,

      getLyricActive,
      setItemRef,
      initHandler,
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
.name-wrap
  margin-bottom: 16px
.mv-tag
  display: inline-block
  margin-left: 8px
  padding: 2px
  border: 1px solid
  color: #d33a31
  cursor: pointer
  font-weight: 100
.artists
  font-size: 14px
  margin-bottom: 20px
.artist
  font-size: 13px
  color: #4996d1
  margin: 0 6px
.slash
  font-size: 12px
.lyric
  position: relative
  height: 350px
  overflow: hidden
.lrcs
  padding: 16px 0
.lrc
  margin-bottom: 16px
  font-size: 13px
  &.active
    font-weight: 700
.lrc-txt
  margin-bottom: 8px
.fade-enter-active, .fade-leave-active
  transition: all 0.5s ease
.fade-enter-from, .fade-leave-to
  transform: translateY(100%)
</style>