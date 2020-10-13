<template>
  <div class="playlist" v-if="playlistShow">
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
        <song-table-column prop="name" label="音乐标题" width="45%">
          <template v-slot:default="slotProps">
            <span>{{ slotProps.song.name }}</span>
            <router-link class="mv-tag" v-if="slotProps.song.mvid" :to="`/mv/${slotProps.song.mvid}`">
              <i class="iconfont icon-mv"></i>
            </router-link>
          </template>
        </song-table-column>
        <song-table-column prop="artists" label="歌手" :formatter="getArtists" width="40%" />
        <song-table-column prop="duration" label="时长" :formatter="formatTime" width="15%" />
      </song-table>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, nextTick } from "vue";
import { useStore } from "vuex";
import { formatTime, getArtists } from "@/utils";
import songTable from "@/components/song-table/table";
import songTableColumn from "@/components/song-table/table-column";

export default {
  components: { songTable, songTableColumn },
  setup() {
    const store = useStore();

    const playlist = computed(() => store.state.music.playlist);
    const playlistShow = computed(() => store.state.music.playlistShow);

    function playSong(song) {
      store.dispatch("music/playSong", song);
    }

    return {
      playlist,
      playlistShow,

      playSong,

      formatTime,
      getArtists,
    };
  },
};
</script>


<style lang="stylus" scoped>
.playlist
  position: fixed
  right: 0
  top: 50px
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
.playlist-songs
  overflow-y: auto
.remove
  line-height: 40px
.icon-remove
  vertical-align: -2px
  font-size: 17px
</style>