<template>
  <div class="detail" v-if="coverImgUrl">
    <div class="img-wrap">
      <img :src="`${coverImgUrl}?param=200y200`" />
    </div>
    <div class="content">
      <h2 class="title">{{name}}</h2>
      <div class="creator">
        <img class="creator__avatar" :src="`${creator.avatarUrl}?param=40y40`" />
        <span class="creator__name">{{creator.nickname}}</span>
      </div>
      <div class="create">{{formatDate(createTime)}} 创建</div>
      <div class="tags">标签：{{tags}}</div>
      <!-- <div class="description">{{description}}</div> -->
    </div>
  </div>
</template>

<script>
import { formatDate } from "@/utils";

export default {
  props: [
    "creator",
    "coverImgUrl",
    "createTime",
    "description",
    "name",
    "tags",
  ],
  setup() {
    return {
      formatDate,
    };
  },
};
</script>

<style lang="stylus" scoped>
.detail
  display: flex
.img-wrap
  width: 200px
  height: 200px
.content
  margin-left: 20px
.title
  font-size: 20px
.creator
  display: flex
  align-items: center
  margin-top: 10px
.creator__avatar
  width: 40px
  height: 40px
  margin-right: 10px
  border-radius: 50%
  overflow: hidden
.create
  margin-top: 10px
.tags
  margin-top: 10px
  font-size: 14px
</style>