<template>
  <div class="playlist">
    <h3>推荐歌单</h3>
    <div class="list">
      <playlist-card
        v-for="item in playlist"
        :key="item.id"
        :id="item.id"
        :name="item.name"
        :picUrl="item.picUrl"
        :playCount="formatPlayCount(item.playCount)"
      />
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, ref } from "vue";
import { requestPlaylist } from "@/api";
import playlistCard from "@/components/playlist-card";
import { formatPlayCount } from "@/utils";

export default {
  components: { playlistCard },
  setup() {
    const playlist = ref([]);

    // method
    const getPlaylist = async () => {
      const { result } = await requestPlaylist();
      playlist.value = result;
    };

    // lifecycle
    onMounted(getPlaylist);

    return {
      playlist,
      formatPlayCount,
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