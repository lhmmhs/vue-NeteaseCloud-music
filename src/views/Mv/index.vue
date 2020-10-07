<template>
  <div class="mv">
    <div class="left">
      <div class="video-wrap">
        <video class="video" :src="mvUrl" controls></video>
      </div>
      <h3 class="mv-name">{{ data.mvDetail.name }}</h3>
      <div>
        <span class="author">作者：{{ (data.mvDetail.artists || []).map((e) => e.name).join(" ") }}</span>
        <span class="publishTime">发布：{{ data.mvDetail.publishTime }}</span>
        <span class="playCount">播放：{{ data.mvDetail.playCount }}</span>
      </div>
      <comments :id="id" :type="'mv'" />
    </div>
  </div>
</template>

<script>
import { requestMvDetail, requestMvUrl, requestMvComments } from "@/api";
import { useRoute } from "vue-router";
import { reactive, onMounted, ref } from "vue";
import comments from "@/components/comments";

export default {
  components: { comments },
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

    return { data, mvUrl, id };
  },
};
</script>

<style lang="stylus" scoped>
.mv
  display: flex
  padding: 20px 40px
.left
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