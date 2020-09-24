<template>
  <div class="playlist">
    <detail v-bind="nomalizePlaylistDetail(playlistDetail)" />
    <song-table :songs="playlistDetail.tracks" />
    <comments :comments="playlistComments" :total="playlistCommentsTotal" />
  </div>
</template>

<script>
import { onMounted, computed, ref } from "vue";
import { useRoute } from "vue-router";
import { requestPlaylistDetail, requestPlaylistComments } from "@/api";
import { nomalizePlaylistDetail } from "@/utils";
import detail from "./detail";
import songTable from "./song-table";
import comments from "./comments";

export default {
  components: { detail, songTable, comments },
  setup() {
    const {
      params: { id },
    } = useRoute();

    const playlistDetail = ref({});
    const playlistComments = ref([]);
    const playlistCommentsTotal = ref(0);

    const getPlaylistDetail = async () => {
      const { playlist } = await requestPlaylistDetail(id);
      playlistDetail.value = playlist;
    };

    const getPlaylistComments = async () => {
      const { comments, total } = await requestPlaylistComments(id, 20, 0);
      playlistComments.value = comments;
      playlistCommentsTotal.value = total;
    };

    onMounted(() => {
      // getPlaylistDetail();
      getPlaylistComments();
    });

    return {
      playlistDetail,
      playlistComments,
      playlistCommentsTotal,

      nomalizePlaylistDetail,
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