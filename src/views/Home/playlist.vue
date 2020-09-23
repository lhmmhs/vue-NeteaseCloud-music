<template>
  <div class="playlist">
    <h3>推荐歌单</h3>
    <div class="list">
      <playlist-card v-bind="nomalizePlaylist(item)" v-for="item in playlist" :key="item.id" />
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, ref } from "vue";
import { requestPlaylist } from "@/api";
import playlistCard from "@/components/playlist-card";
import { nomalizePlaylist } from "@/utils";

export default {
  components: { playlistCard },
  setup() {
    const playlist = ref([]);

    const getPlaylist = async () => {
      const { result } = await requestPlaylist();
      playlist.value = result;
    };

    onMounted(getPlaylist);

    return {
      playlist,
      nomalizePlaylist,
    };
  },
};
</script>

<style lang="stylus" scoped>
.playlist
  margin-top: 50px
.list
  display: flex
  flex-wrap: wrap
  justify-content: space-between
  margin-top: 20px
</style>