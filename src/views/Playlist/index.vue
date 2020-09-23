<template>
  <div class="playlist">
    <detail v-bind="nomalizePlaylistDetail(playlistDetail)" />
    <div class="list"></div>
  </div>
</template>

<script>
import { onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { requestPlaylistDetail } from "@/api";
import { nomalizePlaylistDetail } from "@/utils";
import detail from "./detail";

export default {
  components: { detail },
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
</style>