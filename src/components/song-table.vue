<template>
  <table>
    <thead>
      <th>音乐标题</th>
      <th>歌手</th>
      <th>专辑</th>
      <th>时长</th>
    </thead>
    <tbody>
      <tr v-for="song in songs" :key="song.id">
        <td class="song-td">{{song.name}}</td>
        <td class="song-td">{{(song.ar || []).map(e => e.name).join('/')}}</td>
        <td class="song-td">{{song.al.name}}</td>
        <td
          class="song-td duration"
        >{{Math.floor(song.dt / 1000 / 60)+":"+(Math.floor(song.dt / 1000) % 60)}}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: ["songs"],
};
</script>

<style lang="stylus" scoped>
.song-td
  text-align: center
.duration
  width: 100px
</style>