<template>
  <div class="mv">
    <div class="content">
      <div class="video-wrap">
        <video class="video" :src="mvUrl" controls></video>
      </div>
      <h3 class="mv-name">{{ data.mvDetail.name }}</h3>
      <div>
        <span class="author">作者：{{ (data.mvDetail.artists || []).map((e) => e.name).join(" ") }}</span>
        <span class="publishTime">发布：{{ data.mvDetail.publishTime }}</span>
        <span class="playCount">播放：{{ data.mvDetail.playCount }}</span>
      </div>
    </div>
    <div class="recommend"></div>
  </div>
</template>

<script>
import { requestMvDetail, requestMvUrl, requestMvComments } from "@/api";
import { useRoute } from "vue-router";
import { reactive, onMounted, ref } from "vue";

export default {
  setup() {
    const {
      params: { id },
    } = useRoute();

    const data = reactive({
      mvDetail: {},
      comments: [],
      hotComments: [],
    });

    let mvUrl = ref("");

    const getMvDetail = async () => {
      const { data: mv } = await requestMvDetail(id);

      data.mvDetail = mv;
    };

    const getMvUrl = async () => {
      const { data } = await requestMvUrl(id);

      mvUrl.value = data.url;
    };

    onMounted(() => {
      getMvDetail();
      getMvUrl();
    });

    return { data, mvUrl };
  },
};
</script>

<style lang="stylus" scoped>
.mv
  display: flex
  padding: 20px 40px
.content
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