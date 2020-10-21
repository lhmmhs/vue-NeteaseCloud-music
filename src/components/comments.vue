<template>
  <div class="comments">
    <div class="comment-form">
      <div class="textarea-wrap">
        <textarea v-model="commentConten" class="textarea"></textarea>
      </div>
      <div class="comment-action">
        <btn @click="comment">发送</btn>
      </div>
    </div>

    <div class="list" v-if="data.hotComments && data.hotComments.length">
      <h3 class="title">精彩评论</h3>
      <comment
        v-for="comment in data.hotComments"
        :comment="comment"
        :id="comment.commentId"
        @like="commentLike(comment)"
      />
    </div>
    <div class="list" v-if="data.comments && data.comments.length">
      <h3 class="title">最新评论（{{ commentsTotal }}）</h3>
      <comment
        v-for="comment in data.comments"
        :comment="comment"
        :id="comment.commentId"
        @like="commentLike(comment)"
      />
    </div>
  </div>
  <pager @currentPage="currentPageChange" :pageCount="Math.ceil(commentsTotal / 20)" :pagerCount="7" />
</template>

<script>
import { computed, inject, onMounted, reactive, ref, watch } from "vue";
import pager from "@/components/pager";
import comment from "@/components/comment";
import {
  requestPlaylistComments,
  requestMvComments,
  requestMusicComments,
  requestAlbumComments,
  requestCommentLike,
  requestComment,
} from "@/api";
import { useStore } from "vuex";

const MUSIC_TYPE = "music";
const PLAYLIST_TYPE = "playlist";
const MV_TYPE = "mv";
const ALBUM_TYPE = "album";

const commentRequestMap = {
  [PLAYLIST_TYPE]: requestPlaylistComments,
  [MUSIC_TYPE]: requestMusicComments,
  [MV_TYPE]: requestMvComments,
  [ALBUM_TYPE]: requestAlbumComments,
};

const commentTypeMap = {
  [PLAYLIST_TYPE]: 2,
  [MUSIC_TYPE]: 0,
  [MV_TYPE]: 1,
  [ALBUM_TYPE]: 3,
};

export default {
  props: ["id", "type"],
  components: { pager, comment },
  setup(props) {
    const store = useStore();

    const status = computed(() => store.state.user.status);

    const commentRequest = commentRequestMap[props.type];
    const commentType = commentTypeMap[props.type];

    const data = reactive({
      comments: [],
      hotComments: [],
    });

    let commentsTotal = ref(0);
    let commentConten = ref("");

    watch(
      () => props.id,
      (id) => {
        getComments(id, 1);
      }
    );

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

    const commentLike = async (comment) => {
      if (!status.value) return;
      let t = comment.liked ? 0 : 1;
      const { code } = await requestCommentLike(props.id, comment.commentId, commentType, t);
      if (code === 200) {
        comment.liked ? --comment.likedCount : ++comment.likedCount;
        comment.liked = !comment.liked;
      }
    };

    const comment = async () => {
      if (!status.value) return;
      if (commentConten.value.trim() === "") return;

      const { code, comment } = await requestComment(props.id, commentConten.value, commentType, 1);
      if (code === 200) {
        commentConten.value = "";
        comment.beReplied = [];
        comment.liked = false;
        comment.likedCount = 0;
        data.comments.unshift(comment);
      }
    };

    onMounted(() => {
      getComments(props.id, 1);
    });

    return {
      data,
      commentsTotal,
      currentPageChange,
      commentLike,
      comment,
      commentConten,
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
.comment-form
  padding: 20px
  background: #f9f9f9
.textarea
  display: block
  width: 100%
  height: 100px
  padding: 10px
  border: 1px solid #cdcdcd
  border-radius: 2px
  resize: none
  box-sizing: border-box
  &:focus
    outline: none
.comment-action
  margin-top: 10px
  text-align: right
  .button
    margin-left: 10px
</style>