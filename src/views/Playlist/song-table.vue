<template>
  <div class="song-list">
    <h3>歌曲表单</h3>
    <!-- <table>
      <thead class="thead">
        <tr class="row">
          <th class="th th-index"></th>
          <th class="th th-name">音乐标题</th>
          <th class="th th-dt">时长</th>
          <th class="th th-ar">歌手</th>
          <th class="th th-al">专辑</th>
        </tr>
      </thead>
      <tbody class="tbody">
        <tr class="row" v-for="(song, index) in songs" :key="song.id" @click="playSong(song)">
          <td class="td td-index">{{ getIndex(index + 1) }}</td>
          <td class="td td-name" :title="song.name">{{ song.name }}</td>
          <td class="td td-dt" :title="formatTime(song.dt)">{{ formatTime(song.dt) }}</td>
          <td class="td td-ar" :title="getArtists(song.ar)">{{ getArtists(song.ar) }}</td>
          <td class="td td-al" :title="song.al.name">{{ song.al.name }}</td>
        </tr>
      </tbody>
    </table> -->
    <song-table :tableData="nomalizeSongs">
      <song-table-column type="index" />
      <song-table-column prop="name" label="音乐标题" />
      <song-table-column prop="duration" label="时长" :formatter="formatTime" />
      <song-table-column prop="artists" label="歌手" :formatter="getArtists" />
      <song-table-column prop="album.name" label="专辑" />
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
table
  width: 100%
  font-size: 13px
.thead
  height: 50px
.th
  text-align: left
  padding: 0 10px
.th-index
  width: 6%
.th-dt
  width: 10%
.th-name, .th-ar, .th-al
  width: 28%
.td-name, .td-al, .td-ar
  max-width: 150px
.row
  height: 50px
  cursor: pointer
.tbody .row:nth-child(odd)
  background: #eee
.td
  padding: 0 10px
  white-space: nowrap
  overflow: hidden
  text-overflow: ellipsis
</style>