<template>
  <div class="new-song">
    <h3>最新音乐</h3>
    <div class="new-song-list">
      <songCard
        v-bind="parseSong(song)"
        :order="index"
        v-for="(song, index) in songs"
        :key="song.id"
      />
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, ref } from "vue";
import { requestNewSong } from "@/api";
import songCard from "@/components/songCard";

export default {
  components: { newSongItem },
  setup() {
    const songs = ref([]);

    // methods
    const getNewSongs = async () => {
      let { result } = await requestNewSong();
      songs.value = result;
    };

    const parseSong = (songData) => {
      let {
        name,
        picUrl,
        song: { artists },
      } = songData;

      return {
        name,
        picUrl,
        singer: (artists || []).map((e) => e.name).join("/"),
      };
    };

    // lifecycle
    onMounted(getNewSongs);

    return {
      songs,
      parseSong,
    };
  },
};
</script>


<style lang="stylus" scoped>
.new-song
  margin-top: 50px
.new-song-list
  display: flex
  flex-wrap: wrap
  justify-content: space-between
  margin-top: 20px
</style>