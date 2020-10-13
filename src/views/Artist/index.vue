<template>
  <div class="artist">
    <h2>{{ data.artist.name }}</h2>
    <div class="artist-img-wrap">
      <img v-if="data.artist.picUrl" :src="`${data.artist.picUrl}?param=640y300`" />
      <div v-else class="img-loading"></div>
    </div>
    <div class="tabs">
      <span>热门作品</span>
      <span>所有专辑</span>
      <span>相关MV</span>
    </div>

    <div class="hot-song">
      <song-table :tableData="data.hotSongs" @row-dblclick="playSong">
        <song-table-column width="5%">
          <template v-slot:default="slotProps">
            <div class="img-wrap">
              <img class="al-img" :src="`${slotProps.song.al.picUrl}?param=40y40`" />
              <div class="icon-play-wrap">
                <i class="iconfont icon-play"></i>
              </div>
            </div>
          </template>
        </song-table-column>
        <song-table-column label="音乐标题" width="45%">
          <template v-slot:default="slotProps">
            <span>{{ slotProps.song.name }}</span>
            <router-link class="mv-tag" v-if="slotProps.song.mv" :to="`/mv/${slotProps.song.mv}`">MV</router-link>
          </template>
        </song-table-column>
        <song-table-column prop="dt" label="时长" :formatter="formatTime" width="15%" />
        <song-table-column label="专辑" width="30%">
          <template v-slot:default="slotProps">
            <router-link :to="`/album/${slotProps.song.al.id}`">{{ slotProps.song.al.name }}</router-link>
          </template>
        </song-table-column>
      </song-table>
    </div>
  </div>
</template>

<script>
import { useRoute } from "vue-router";
import { requestArtists, requestArtistAlbum, requestArtistMv } from "@/api";
import { onMounted, reactive, watch } from "vue";
import { formatTime } from "@/utils";
import songTable from "@/components/song-table/table";
import songTableColumn from "@/components/song-table/table-column";

export default {
  components: { songTable, songTableColumn },
  setup() {
    const route = useRoute();

    const data = reactive({
      artist: {},
      hotSongs: [],
      albums: [],
      mvs: [],
    });

    watch(
      () => route.params,
      (params) => {}
    );

    const getArtists = async (id) => {
      const { artist, hotSongs } = await requestArtists(id);
      data.artist = artist;
      data.hotSongs = hotSongs;
    };

    const getArtistAlbum = async (id) => {
      const { hotAlbums } = await requestArtistAlbum(id);
      data.albums = hotAlbums;
    };

    const getArtistMv = async (id) => {
      const { mvs } = await requestArtistMv(id);
      data.mvs = mvs;
    };

    const playSong = () => {};

    onMounted(() => {
      getArtists(route.params.id);
      getArtistAlbum(route.params.id);
      getArtistMv(route.params.id);
    });

    return {
      data,

      playSong,
      formatTime,
    };
  },
};
</script>

<style lang="stylus" scoped>
.img-loading
  width: 640px
  height: 300px
  background: #eee
.mv-tag
  display: inline-block
  margin-left: 8px
  padding: 2px
  border: 1px solid
  color: #d33a31
  cursor: pointer
  font-size: 12px
.img-wrap
  position: relative
  width: 40px
  cursor: pointer
  box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.2)
.al-img
  display: block
  margin: auto
.icon-play
  font-size: 14px
  color: #d33a31
.icon-play-wrap
  position: absolute
  left: 0
  right: 0
  bottom: 0
  top: 0
  width: 20px
  height: 20px
  margin: auto
  background: rgba(255, 255, 255, 0.7)
  border-radius: 50%
  display: flex
  align-items: center
  justify-content: center
</style>