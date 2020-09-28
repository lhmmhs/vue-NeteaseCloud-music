<template>
  <div class="playlist">
    <detail :playlistDetail="data.playlistDetail" />
    <song-table :songs="data.playlistDetail.tracks" />
    <comments :id="id" :type="'playlist'" />
  </div>
</template>

<script>
import { onMounted, computed, ref, provide, reactive } from "vue";
import { useRoute } from "vue-router";
import { requestPlaylistDetail, requestPlaylistComments } from "@/api";
import detail from "./detail";
import songTable from "./song-table";
import comments from "./comments";

export default {
  components: { detail, songTable, comments },
  setup() {
    const {
      params: { id },
    } = useRoute();

    const data = reactive({
      playlistDetail: {},
    });

    const getPlaylistDetail = async () => {
      const { playlist } = await requestPlaylistDetail(id);
      data.playlistDetail = playlist;
    };

    onMounted(() => {
      getPlaylistDetail();
    });

    return {
      data,
      id,
    };
  },
};
</script>

<style lang="stylus" scoped>
.playlist
  padding: 20px 40px
.tab
  margin-top: 20px
  border-bottom: 2px solid #d33a31
.tab__item
  margin: 0 15px
</style>