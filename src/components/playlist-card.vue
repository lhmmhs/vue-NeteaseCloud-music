<template>
  <div class="playlist-card">
    <div class="img-wrap">
      <router-link :to="`/playlist/${id}`">
        <img class="playlist-img" :src="`${picUrl}?param=300y300`" />
        <!-- <div class="play-icon-wrap">
          <i class="play-icon iconfont icon-play"></i>
        </div> -->
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
  border-radius: 5px
.play-icon
  font-size: 16px
  color: #fff
.play-icon-wrap
  position: absolute
  bottom: 10px
  right: 10px
  display: flex
  justify-content: center
  align-items: center
  width: 30px
  height: 30px
  border: 2px solid #ffffff
  border-radius: 50%
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