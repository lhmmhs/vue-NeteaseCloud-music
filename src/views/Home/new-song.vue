<template>
  <div class="new-song">
    <h3>最新音乐</h3>
    <div class="list">
      <song-card
        v-bind="nomalizeSong(song)"
        :order="index"
        v-for="(song, index) in songs"
        :key="song.id"
        @click.native="setCurrentSong(song.id)"
      />
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, ref } from "vue";
import { requestNewSong } from "@/api";
import songCard from "@/components/song-card";
import { nomalizeSong } from "@/utils";
import { mapMutations } from "vuex";

export default {
  components: { songCard },
  setup() {
    const songs = ref([]);

    // methods
    const getNewSongs = async () => {
      let { result } = await requestNewSong();
      songs.value = result;
    };

    const setCurrentSong = (id) => {
      console.log(id);
    };

    const mutations = { ...mapMutations("music", ["setCurrentSong"]) };

    console.log(mutations);
    // lifecycle
    onMounted(getNewSongs);

    return {
      songs,
      nomalizeSong,
      // setCurrentSong,
      ...mapMutations("music", ["setCurrentSong"]),
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