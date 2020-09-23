<template>
  <div class="playlist">
    <detail v-bind="nomalizePlaylistDetail(playlistDetail)" />
    <div class="tab">
      <span class="tab__item">歌曲列表</span>
      <span class="tab__item">评论</span>
      <span class="tab__item">收藏者</span>
    </div>
    <div class="list">
      <song-table :songs="playlistDetail.tracks" />
    </div>
  </div>
</template>

<script>
import { onMounted, computed, ref } from "vue";
import { useRoute } from "vue-router";
import { requestPlaylistDetail } from "@/api";
import { nomalizePlaylistDetail } from "@/utils";
import detail from "./detail";
import songTable from "@/components/song-table";

export default {
  components: { detail, songTable },
  setup() {
    const {
      params: { id },
    } = useRoute();

    const playlistDetail = ref({});

    const getPlaylistDetail = async () => {
      const { playlist } = await requestPlaylistDetail(id);
      playlistDetail.value = playlist;
    };

    onMounted(getPlaylistDetail);

    return {
      playlistDetail,
      nomalizePlaylistDetail,
    };
  },
};
</script>

<style lang="stylus" scoped>
.playlist
  padding: 20px 40px
.tab
  margin: 30px 0 0 20px
.tab__item
  margin: 0 15px
</style>