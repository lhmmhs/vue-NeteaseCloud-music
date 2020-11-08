<template>
  <div class="song-list">
    <h3>歌曲表单</h3>
    <song-table :tableData="nomalizeSongs" @row-dblclick="playSong">
      <song-table-column type="index" width="40px" />
      <song-table-column prop="picUrl" width="80px">
        <template v-slot:default="slotProps">
          <div class="img-wrap">
            <img class="song-img" v-lazy="`${slotProps.song.picUrl}?param=40y40`" />
            <div class="icon-play-wrap">
              <i class="iconfont icon-play"></i>
            </div>
          </div>
        </template>
      </song-table-column>
      <song-table-column prop="name" label="音乐标题" width="30%">
        <template v-slot:default="slotProps">
          <span>{{ slotProps.song.name }}</span>
          <router-link class="mv-tag" v-if="slotProps.song.mvid" :to="`/mv/${slotProps.song.mvid}`">MV</router-link>
        </template>
      </song-table-column>
      <song-table-column prop="duration" label="时长" :formatter="formatTime" width="5%" />
      <song-table-column prop="artists" label="歌手" width="25%">
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
.song-img
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
.artist
  margin-right: 4px
</style>