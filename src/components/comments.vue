<template>
  <div class="comments">
    <div class="list" v-if="data.hotComments && data.hotComments.length">
      <h3 class="title">精彩评论</h3>
      <comment :comments="data.hotComments" />
    </div>
    <div class="list" v-if="data.comments && data.comments.length">
      <h3 class="title">最新评论（{{ commentsTotal }}）</h3>
      <comment :comments="data.comments" />
    </div>
  </div>
  <pager @currentPage="currentPageChange" :pageCount="Math.ceil(commentsTotal / 20)" :pagerCount="7" />
</template>

<script>
import { inject, onMounted, reactive, ref } from "vue";
import pager from "@/components/pager";
import comment from "@/components/comment";
import { requestPlaylistComments, requestMvComments } from "@/api";

const SONG_TYPE = "song";
const PLAYLIST_TYPE = "playlist";
const MV_TYPE = "mv";

export default {
  props: ["id", "type"],
  components: { pager, comment },
  setup(props) {
    const commentRequestMap = {
      [PLAYLIST_TYPE]: requestPlaylistComments,
      // [SONG_TYPE]: requestSongComments,
      [MV_TYPE]: requestMvComments,
    };
    const commentRequest = commentRequestMap[props.type];

    const data = reactive({
      comments: [],
      hotComments: [],
    });

    let commentsTotal = ref(0);

    const getComments = async (id, page) => {
      const { comments, hotComments, total } = await commentRequest(id, 20, page);

      data.comments = comments;
      data.hotComments = hotComments;
      commentsTotal.value = total;
    };

    const currentPageChange = ((id) => {
      return function (page) {
        getComments(id, page);
      };
    })(props.id);

    onMounted(() => {
      getComments(props.id, 1);
    });

    return {
      data,
      commentsTotal,
      currentPageChange,
    };
  },
};
</script>

<style lang="stylus" scoped>
.comments
  margin-top: 50px
.title
  margin: 40px 0 0 0
  padding-bottom: 15px
  border-bottom: 1px solid #eee
</style>