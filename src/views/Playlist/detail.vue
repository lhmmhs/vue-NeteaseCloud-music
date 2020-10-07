<template>
  <div class="detail" v-if="playlistDetail.coverImgUrl">
    <div class="img-wrap">
      <img :src="`${playlistDetail.coverImgUrl}?param=200y200`" />
    </div>
    <div class="content">
      <h2 class="title">{{ playlistDetail.name }}</h2>
      <div class="creator">
        <img class="creator__avatar" :src="`${playlistDetail.creator.avatarUrl}?param=40y40`" />
        <span class="creator__name">{{ playlistDetail.creator.nickname }}</span>
      </div>
      <div class="create">{{ formatDate(playlistDetail.createTime) }} 创建</div>
      <div class="tags">标签：{{ (playlistDetail.tags || []).map((e) => e).join("/") }}</div>
      <!-- <div class="description">{{description}}</div> -->
    </div>
  </div>
</template>

<script>
import { formatDate } from "@/utils";

export default {
  props: ["playlistDetail"],
  setup(props) {
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
  box-shadow: 1px 1px 2px #ccc
  border-radius: 5px
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