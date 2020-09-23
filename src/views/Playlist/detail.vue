<template>
  <div class="detail" v-if="coverImgUrl">
    <div class="img-wrap">
      <img :src="`${coverImgUrl}?param=200y200`" />
    </div>
    <div class="content">
      <div class="title">{{name}}</div>
      <div class="creator">
        <img class="creator__avatar" :src="`${creator.avatarUrl}?param=40y40`" />
        <span class="creator__name">{{creator.nickname}}</span>
        <span class="creator__birthday">{{formatDate(creator.birthday)}}</span>
      </div>
      <div class="create">{{formatDate(createTime)}}</div>
      <div class="tags">{{tags}}</div>
      <div class="description">{{description}}</div>
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
</style>