<template>
  <div class="playlist">
    <detail v-bind="nomalizePlaylistDetail(playlistDetail)" />
    <song-table :songs="playlistDetail.tracks" />
    <comments :comments="playlistComments" :hotComments="playlistHotComments" :total="playlistCommentsTotal" />
  </div>
</template>

<script>
import { onMounted, computed, ref, provide } from "vue";
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
    const playlistHotComments = ref([]);
    const playlistCommentsTotal = ref(0);

    const getPlaylistDetail = async () => {
      const { playlist } = await requestPlaylistDetail(id);
      playlistDetail.value = playlist;
    };

    const getPlaylistComments = async (id, page) => {
      const { comments, hotComments, total } = await requestPlaylistComments(id, 20, page);
      playlistComments.value = comments;
      playlistHotComments.value = hotComments;
      playlistCommentsTotal.value = total;
    };

    onMounted(() => {
      getPlaylistDetail();
      getPlaylistComments(id, 1);
    });

    const getPlaylistCommentsWrapper = (id) => {
      return function (page) {
        getPlaylistComments(id, page);
      };
    };

    provide("getPlaylistComments", getPlaylistCommentsWrapper(id));

    return {
      playlistDetail,
      playlistComments,
      playlistCommentsTotal,
      playlistHotComments,

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