<template>
  <div class="new-song">
    <h3>最新音乐</h3>
    <div class="list">
      <song-card
        v-for="(song, index) in songs"
        :order="index"
        :picUrl="song.picUrl"
        :name="song.name"
        :artists="song.song.artists"
        @playSong="playSong(song)"
      />
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, ref } from "vue";
import { requestNewSong } from "@/api";
import songCard from "@/components/song-card";
import { nomalizeSong, songUrl } from "@/utils";
import { useStore } from "vuex";

export default {
  components: { songCard },
  setup() {
    const store = useStore();

    const songs = ref([]);

    // methods
    const getNewSongs = async () => {
      let { result } = await requestNewSong();
      songs.value = result;
    };

    const playSong = (rawSong) => {
      const {
        id,
        name,
        picUrl,
        song: { artists, duration, album, mvid },
      } = rawSong;

      const song = {
        id,
        name,
        picUrl,
        artists,
        duration,
        album,
        url: songUrl(id),
        mvid,
      };

      store.dispatch("music/playSong", song);
    };

    // lifecycle
    onMounted(getNewSongs);

    return {
      songs,
      nomalizeSong,
      playSong,
    };
  },
};
</script>


<style lang="stylus" scoped>
.new-song
  margin-top: 50px
.list
  display: flex
  flex-wrap: wrap
  justify-content: space-between
  margin-top: 20px
</style>