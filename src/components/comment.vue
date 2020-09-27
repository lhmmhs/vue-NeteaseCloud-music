<template>
  <div class="comment" v-for="comment in comments">
    <div class="avatar-wrap">
      <img :src="`${comment.user.avatarUrl}?param=40y40`" />
    </div>
    <div class="content">
      <p class="comment-content">
        <span class="user-name">{{ comment.user.nickname }}：</span>
        <span class="text">{{ comment.content }}</span>
      </p>
      <div class="replied" v-if="comment.beReplied.length">
        <span class="user-name">{{ comment.beReplied[0].user.nickname }}：</span>
        <span class="text">{{ comment.beReplied[0].content }}</span>
      </div>
      <div class="content-bar">
        <p class="create">{{ formatDate(comment.time) }}</p>
        <div class="actions">
          <i class="iconfont icon-compoent icon-good"></i>
          <span class="like-count">{{ comment.likedCount }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDate } from "@/utils";

export default {
  props: ["comments"],
  setup() {
    return { formatDate };
  },
};
</script>

<style lang="stylus" scoped>
.comment
  display: flex
  padding-top: 15px
.avatar-wrap
  width: 40px
  height: 40px
  border-radius: 5px
  overflow: hidden
.content
  flex: 1
  margin-left: 15px
.user-name
  margin-right: 6px
  color: #4996d1
  cursor: pointer
  font-size: 13px
.text
  margin-top: 10px
  line-height: 1.4
  font-size: 13px
  color: #333
.replied
  margin-top: 10px
  padding: 6px 10px
  font-size: 12px
  background: #e6e5e6
  border-radius: 5px
.content-bar
  display: flex
  justify-content: space-between
  margin-top: 10px
  padding-bottom: 15px
  border-bottom: 1px solid #eee
.create
  font-size: 12px
  color: #999
.like-count
  display: inline-block
  width: 20px
  text-align: center
  color: #999
  font-size: 12px
.icon-compoent
  cursor: pointer
</style>