<template>
  <div class="comments">
    <div class="list" v-if="hotComments && hotComments.length">
      <h3 class="title">精彩评论</h3>
      <comment :comments="hotComments" />
    </div>
    <div class="list" v-if="comments && comments.length">
      <h3 class="title">最新评论（{{ total }}）</h3>
      <comment :comments="comments" />
    </div>
  </div>
  <pager @currentPage="getPlaylistComments" :pageCount="Math.ceil(total / 20)" :pagerCount="7" />
</template>

<script>
import { inject } from "vue";
import pager from "@/components/pager";
import comment from "@/components/comment";

export default {
  props: ["comments", "total", "hotComments"],
  components: { pager, comment },
  setup(props) {
    const getPlaylistComments = inject("getPlaylistComments");

    return {
      getPlaylistComments,
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