<template>
  <div class="mv">
    <div class="video-wrap">
      <video class="video" :src="mvUrl" controls></video>
    </div>
    <h3 class="mv-name">{{ data.mvDetail.name }}</h3>
    <div>
      <span class="author">作者：{{ (data.mvDetail.artists || []).map((e) => e.name).join(" ") }}</span>
      <span class="publishTime">发布：{{ data.mvDetail.publishTime }}</span>
      <span class="playCount">播放：{{ data.mvDetail.playCount }}</span>
    </div>
    <comments :id="$route.params.id" :type="'mv'" />
  </div>
</template>

<script>
import { requestMvDetail, requestMvUrl, requestMvComments } from "@/api";
import { useRoute } from "vue-router";
import { reactive, onMounted, ref, watch } from "vue";
import comments from "@/components/comments";

export default {
  components: { comments },
  setup() {
    const route = useRoute();

    const data = reactive({
      mvDetail: {},
      comments: [],
      hotComments: [],
    });

    let mvUrl = ref("");

    watch(
      () => route.params.id,
      (id) => {
        getMvDetail(id);
        getMvUrl(id);
      }
    );

    const getMvDetail = async (id) => {
      const { data: mv } = await requestMvDetail(id);
      data.mvDetail = mv;
    };

    const getMvUrl = async (id) => {
      const { data } = await requestMvUrl(id);
      mvUrl.value = data.url;
    };

    onMounted(() => {
      getMvDetail(route.params.id);
      getMvUrl(route.params.id);
    });

    return { data, mvUrl };
  },
};
</script>

<style lang="stylus" scoped>
.mv
  padding: 20px 40px
.video-wrap
  width: 50%
.video
  width: 100%
  height: auto
.mv-name
  margin-top: 20px
.publishTime, .author, .playCount
  color: #bebebe
  font-size: 12px
  margin-right: 10px
</style>