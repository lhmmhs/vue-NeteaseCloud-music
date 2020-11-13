<template>
  <div class="search">
    <div class="search-header">
      <span class="keywords">{{ $route.params.keywords }}</span>
      <span class="count">相关结果共{{ data.songCount }}条</span>
    </div>

    <song-table :tableData="data.songs" @row-dblclick="playSong">
      <song-table-column type="index" width="40px" />
      <song-table-column label="音乐标题" width="40%">
        <template v-slot:default="slotProps">
          <span>{{ slotProps.song.name }}</span>
          <router-link class="mv-tag" v-if="slotProps.song.mvid" :to="`/mv/${slotProps.song.mvid}`">MV</router-link>
        </template>
      </song-table-column>
      <song-table-column prop="duration" label="时长" :formatter="formatTime" width="5%" />
      <song-table-column label="歌手" width="25%">
        <template v-slot:default="slotProps">
          <router-link class="artist" v-for="artist in slotProps.song.artists" :to="`/artist/${artist.id}`">
            {{ artist.name }}
          </router-link>
        </template>
      </song-table-column>
      <song-table-column label="专辑" width="25%">
        <template v-slot:default="slotProps">
          <router-link :to="`/album/${slotProps.song.album.id}`">{{ slotProps.song.album.name }}</router-link>
        </template>
      </song-table-column>
    </song-table>

    <pager
      :current-page="data.currentPage"
      @current-page="currentPageHandler"
      :page-count="Math.ceil(data.songCount / data.pageSize)"
    />
  </div>
</template>

<script>
import { requestSearch } from "@/api";
import { onMounted, reactive, watch } from "vue";
import { useRoute } from "vue-router";
import songTable from "@/components/song-table/table";
import songTableColumn from "@/components/song-table/table-column";
import pager from "@/components/pager";
import { formatTime, nomalizeSong } from "@/utils";
import { useStore } from "vuex";

export default {
  components: { songTable, songTableColumn, pager },
  setup() {
    const route = useRoute();
    const store = useStore();

    watch(
      () => route.params.keywords,
      (keywords) => {
        data.currentPage = 1;
        getRequest(route.params.keywords, 1);
      }
    );

    const data = reactive({
      songs: [],
      songCount: 0,
      currentPage: 1,
      pageSize: 30,
    });

    const getRequest = async (keywords, page) => {
      const {
        result: { songs, songCount },
      } = await requestSearch(keywords, data.pageSize, page);

      data.songs = songs;
      data.songCount = songCount;
    };

    const playSong = (rawSong) => {
      const { id, name, album, artists, duration, mvid } = rawSong;
      const song = nomalizeSong(id, name, album.artist.img1v1Url, artists, duration, album, mvid);
      store.dispatch("music/playSong", song);
    };

    const currentPageHandler = (page) => {
      data.currentPage = page;
      getRequest(route.params.keywords, page);
    };

    onMounted(() => {
      getRequest(route.params.keywords, data.currentPage);
    });

    return {
      data,
      formatTime,
      playSong,
      currentPageHandler,
    };
  },
};
</script>

<style lang="stylus" scoped>
.search
  padding: 20px 40px
  >>> .row
    height: 40px
.search-header
  margin-bottom: 20px
  padding-bottom: 20px
  border-bottom: 1px solid #ededed
.keywords
  margin-right: 5px
  font-size: 20px
  font-weight: 700
</style> 