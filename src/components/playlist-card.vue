<template>
  <div class="playlist-card">
    <div class="img-wrap">
      <router-link class="palylist-link" :to="`/playlist/${id}`">
        <img class="playlist-img" :src="`${picUrl}?param=300y300`" />
      </router-link>
      <div class="play-count">{{ playCount }}</div>
    </div>
    <div class="playlist-content">
      <p :title="name" class="playlist-name">{{ name }}</p>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";

export default {
  props: ["id", "name", "picUrl", "playCount"],
};
</script>

<style lang="stylus" scoped>
.playlist-card
  width: 19%
  margin-right: 1%
  cursor: pointer
  &:nth-child(-n+5)
    margin-bottom: 20px
.play-count
  position: absolute
  left: 0
  top: 0
  right: 0
  z-index: 1
  padding: 5px 10px
  background: rgba(0, 0, 0, 0.4)
  font-size: 13px
  color: #fff
  text-align: right
.img-wrap
  position: relative
  overflow: hidden
  padding: 50% 0
  border-radius: 5px
.palylist-link
  position: absolute
  left: 0
  right: 0
  bottom: 0
  top: 0
.playlist-img
  display: block
  width: 100%
  height: auto
.playlist-content
  margin-top: 10px
  font-size: 13px
.playlist-name
  width: 95%
  white-space: nowrap
  overflow: hidden
  text-overflow: ellipsis
</style>