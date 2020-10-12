<template>
  <div class="song-list">
    <h3>歌曲表单</h3>
    <song-table :tableData="nomalizeSongs" @row-dblclick="playSong">
      <song-table-column type="index" width="40px" />
      <song-table-column prop="picUrl" width="80px">
        <template v-slot:default="slotProps">
          <img class="song-img" :src="`${slotProps.song.picUrl}?param=40y40`" />
        </template>
      </song-table-column>
      <song-table-column prop="name" label="音乐标题" width="30%">
        <template v-slot:default="slotProps">
          <span>{{ slotProps.song.name }}</span>
          <router-link class="mv-tag" v-if="slotProps.song.mvid" :to="`/mv/${slotProps.song.mvid}`">MV</router-link>
        </template>
      </song-table-column>
      <song-table-column prop="duration" label="时长" :formatter="formatTime" width="5%" />
      <song-table-column prop="artists" label="歌手" :formatter="getArtists" width="25%" />
      <song-table-column prop="album.name" label="专辑" width="25%" />
    </song-table>
  </div>
</template>

<script>
import { watch, ref } from "vue";
import { formatTime, getArtists, songUrl } from "@/utils";
import { useStore } from "vuex";
import songTable from "@/components/song-table/table";
import songTableColumn from "@/components/song-table/table-column";

export default {
  props: {
    songs: {
      type: Array,
      default: () => [],
    },
  },
  components: { songTable, songTableColumn },
  setup(props) {
    const store = useStore();

    let nomalizeSongs = ref([]);

    const nomalize = (rawSong) => {
      const { al, ar, dt, id, name, mv } = rawSong;
      return {
        id,
        name,
        picUrl: al.picUrl,
        album: al,
        duration: dt,
        artists: ar,
        url: songUrl(id),
        mvid: mv,
      };
    };

    function playSong(song) {
      store.dispatch("music/playSong", song);
    }

    watch(
      () => props.songs,
      (songs) => {
        nomalizeSongs.value = songs.map((song) => nomalize(song));
      }
    );

    return {
      getArtists,
      formatTime,
      playSong,
      nomalizeSongs,
    };
  },
};
</script>

<style lang="stylus" scoped>
.song-list
  margin-top: 50px
.song-img
  display: block
  margin: auto
  border-radius: 5px
.mv-tag
  display: inline-block
  margin-left: 8px
  padding: 2px
  border: 1px solid
  color: #d33a31
  cursor: pointer
  font-size: 12px
</style>