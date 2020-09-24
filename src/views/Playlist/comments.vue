<template>
  <div class="comments">
    <h3>评论 共{{total}}条</h3>
    <div>
      <div class="comment" v-for="comment in comments">
        <div class="avatar-wrap">
          <img :src="`${comment.user.avatarUrl}?param=40y40`" />
        </div>
        <div class="content">
          <div class="user-name">{{comment.user.nickname}}</div>
          <p class="comment-content">{{comment.content}}</p>

          <div class="content-bar">
            <p class="create">{{formatDate(comment.time)}}</p>
            <div class="actions">
              <i class="iconfont icon-compoent icon-good"></i>
              <span class="like-count">{{comment.likedCount}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <pager :pageCount="Math.floor(total/20)" :pagerCount="7" />
</template>

<script>
import { formatDate } from "@/utils";
import pager from "@/components/pager";

export default {
  props: ["comments", "total"],
  components: { pager },
  setup() {
    return {
      formatDate,
    };
  },
};
</script>

<style lang="stylus" scoped>
.comments
  margin-top: 50px
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
  color: #4996d1
  cursor: pointer
  font-size: 13px
.comment-content
  margin-top: 10px
  line-height: 1.4
  font-size: 14px
  color: #333
.replied-content
  font-size: 13px
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