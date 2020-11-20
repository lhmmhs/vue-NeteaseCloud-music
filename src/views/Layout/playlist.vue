<template>
  <transition name="fade">
    <div ref="parent" class="playlist" v-show="playlistShow">
      <div class="playlist-title">播放列表</div>
      <div class="playlist-bar">
        <div class="total">总共{{ playlist.length }}首</div>
        <div class="remove">
          <i class="iconfont icon-remove"></i>
          <span>清空</span>
        </div>
      </div>
      <div class="playlist-songs">
        <song-table :tableData="playlist" @row-dblclick="playSong">
          <song-table-column label="音乐标题" width="45%">
            <template v-slot:default="slotProps">
              <span>{{ slotProps.song.name }}</span>
              <router-link class="mv-tag" v-if="slotProps.song.mvid" :to="`/mv/${slotProps.song.mvid}`">
                <i class="iconfont icon-mv"></i>
              </router-link>
            </template>
          </song-table-column>
          <song-table-column label="歌手" width="40%">
            <template v-slot:default="{ song: { artists } }">
              <router-link v-for="ar in artists" :to="`/artist/${ar.id}`"> {{ ar.name }} </router-link>
            </template>
          </song-table-column>
          <song-table-column prop="duration" label="时长" :formatter="formatTime" width="15%" />
        </song-table>
      </div>
    </div>
  </transition>
</template>

<script>
import { computed, ref, watch } from "vue";
import { useStore } from "vuex";
import { formatTime } from "@/utils";
import songTable from "@/components/song-table/table";
import songTableColumn from "@/components/song-table/table-column";
import { useRoute } from "vue-router";

export default {
  components: { songTable, songTableColumn },
  setup() {
    const store = useStore();
    const route = useRoute();

    const playlist = computed(() => store.state.music.playlist);
    const playlistShow = computed(() => store.state.music.playlistShow);

    watch(
      () => route.path,
      () => {
        store.commit("music/setPlaylistShow", false);
      }
    );

    const parent = ref(null);
    const playBar = document.querySelector(".play-bar");

    const clickEvent = (e) => {
      if (parent.value.contains(e.target)) return;
      if (playBar.contains(e.target)) return;
      store.commit("music/setPlaylistShow", false);
    };

    const bindClick = () => {
      document.addEventListener("mousedown", clickEvent);
    };
    const removeClick = () => {
      document.removeEventListener("mousedown", clickEvent);
    };

    watch(playlistShow, (show) => {
      if (show) {
        bindClick();
      } else {
        removeClick();
      }
    });

    function playSong(song) {
      store.dispatch("music/playSong", song);
    }

    return {
      playlist,
      playlistShow,
      parent,
      playSong,

      formatTime,
    };
  },
};
</script>


<style lang="stylus" scoped>
.playlist
  display: flex
  flex-direction: column
  position: fixed
  right: 0
  top: 0
  bottom: 60px
  z-index: 4
  width: 380px
  font-size: 13px
  background: #fff
  box-shadow: -1px 0 4px rgba(0, 0, 0, 0.2)
  >>> .row
    height: 30px
    font-size: 12px
  >>> .mv-tag
    color: #d33a31
    vertical-align: -2px
  .mv-tag:hover
    text-decoration: none
.playlist-title
  text-align: center
  height: 45px
  line-height: 45px
.playlist-bar
  display: flex
  height: 40px
  padding: 0 20px
  justify-content: space-between
  align-items: center
  border-bottom: 1px solid #ccc
.playlist-songs
  flex: 1
  overflow-y: auto
  &::-webkit-scrollbar
    width: 0
.remove
  line-height: 40px
.icon-remove
  vertical-align: -2px
  font-size: 17px
.fade-enter-active, .fade-leave-active
  transition: all 0.5s ease
.fade-enter-from, .fade-leave-to
  transform: translateX(100%)
</style>