<template>
  <div class="album">
    <div class="album-detail">
      <div class="album-img-wrap">
        <img class="album-img" v-if="data.album.picUrl" :src="`${data.album.picUrl}?param=170y170`" />
        <div class="album-img-loading" v-else />
      </div>
      <div class="album-content">
        <div class="album-name">{{ data.album.name }}</div>
        <div class="album-artists">
          歌手：
          <router-link class="artist" v-for="artist in data.album.artists" :to="`/artist/${artist.id}`">
            {{ artist.name }}
          </router-link>
        </div>
        <div class="publish-time">发行时间：{{ formatDate(data.album.publishTime, "-") === "00:00" && "今天" }}</div>
        <div class="company">发行公司：{{ data.album.company || null }}</div>
      </div>
    </div>
    <div class="album-songs">
      <h3 class="title">专辑歌曲</h3>
      <song-table :tableData="data.songs" @row-dblclick="playSong">
        <song-table-column type="index" width="5%"></song-table-column>
        <song-table-column width="6%">
          <template v-slot:default="slotProps">
            <div class="img-wrap">
              <img class="al-img" :src="`${slotProps.song.al.picUrl}?param=40y40`" />
              <div class="icon-play-wrap">
                <i class="iconfont icon-play"></i>
              </div>
            </div>
          </template>
        </song-table-column>
        <song-table-column label="音乐标题" width="15%">
          <template v-slot:default="slotProps">
            <span>{{ slotProps.song.name }}</span>
            <router-link class="mv-tag" v-if="slotProps.song.mv" :to="`/mv/${slotProps.song.mv}`">MV</router-link>
          </template>
        </song-table-column>
        <song-table-column prop="dt" label="时长" :formatter="formatTime" width="15%" />
        <song-table-column label="歌手" width="50%">
          <template v-slot:default="slotProps">
            <router-link class="ar" v-for="ar in slotProps.song.ar" :to="`/artist/${ar.id}`">
              {{ ar.name }}
            </router-link>
          </template>
        </song-table-column>
      </song-table>
    </div>
    <comments :id="id" type="album" />
  </div>
</template>

<script>
import { requestAlbumDetail, requestAlbum } from "@/api";
import { useRoute } from "vue-router";
import { onMounted, reactive, watch } from "vue";
import { formatDate, formatTime, songUrl } from "@/utils";
import songTable from "@/components/song-table/table";
import songTableColumn from "@/components/song-table/table-column";
import comments from "@/components/comments";
import { useStore } from "vuex";

export default {
  components: { songTable, songTableColumn, comments },
  setup() {
    const route = useRoute();
    const store = useStore();

    const data = reactive({
      album: {},
      songs: [],
    });

    const getAlbumDetail = async (id) => {
      const data = await requestAlbumDetail(id);
    };

    const getAlbum = async (id) => {
      const { album, songs } = await requestAlbum(id);
      data.album = album;
      data.songs = songs;
    };

    const playSong = (rawSong) => {
      const { al, ar, dt, id, name, mv } = rawSong;

      const song = {
        id,
        name,
        picUrl: al.picUrl,
        album: al,
        duration: dt,
        artists: ar,
        url: songUrl(id),
        mvid: mv,
      };

      store.dispatch("music/playSong", song);
    };

    onMounted(() => {
      // getAlbumDetail(route.params.id);
      getAlbum(route.params.id);
    });

    return {
      id: route.params.id,
      data,
      formatDate,
      formatTime,
      playSong,
    };
  },
};
</script>

<style lang="stylus" scoped>
.album
  padding: 40px 20px
.album-detail
  display: flex
.album-img
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.2)
.album-img-wrap
  width: 170px
  height: 170px
  background: #f9f9f9
.album-content
  margin-left: 20px
  font-size: 13px
.album-name
  font-weight: 700
  margin-bottom: 10px
  font-size: 24px
.artist
  color: #4996d1
  margin-right: 10px
.album-artists, .publish-time
  margin-bottom: 4px
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
.album-songs
  margin-top: 50px
.title
  padding-bottom: 15px
  margin-bottom: 15px
  border-bottom: 1px solid #eee
.ar
  margin-right: 10px
</style>