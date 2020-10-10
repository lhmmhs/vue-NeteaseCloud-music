<template>
  <div class="song-list">
    <h3>歌曲表单</h3>
    <table cellspacing="0" cellpadding="0" border="0">
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
    </table>
  </div>
</template>

<script>
import { computed } from "vue";
import { formatTime, getArtists } from "@/utils";
import { useStore } from "vuex";

export default {
  props: ["songs"],
  setup(props) {
    const store = useStore();

    const playlist = computed(() => store.state.music.playlist);

    const getIndex = (index) => {
      return index < 10 ? "0" + index : index;
    };

    function playSong(song) {}

    return {
      getIndex,
      getArtists,
      formatTime,
      playSong,
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