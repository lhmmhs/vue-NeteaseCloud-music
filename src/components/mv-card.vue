<template>
  <div class="mv-card">
    <div class="play-count">{{ playCount }}</div>
    <div class="img-wrap">
      <router-link :to="`/mv/${id}`">
        <img class="mv-img" :src="`${picUrl}?param=500y260`" />
        <div class="play-icon-wrap">
          <i class="play-icon iconfont icon-play"></i>
        </div>
      </router-link>
    </div>
    <div class="mv-content">
      <p :title="name" class="mv-name">{{ name }}</p>
      <p :title="artists" class="artists">{{ artists }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: ["id", "picUrl", "name", "artists", "playCount"],
};
</script>


<style lang="stylus" scoped>
.mv-card
  position: relative
  width: 24%
.play-count
  position: absolute
  top: 5px
  right: 5px
  z-index: 1
  font-size: 13px
  color: #fff
.img-wrap
  position: relative
  overflow: hidden
  border-radius: 5px
  cursor: pointer
  &:hover
    .play-icon-wrap
      display: flex
.play-icon-wrap
  position: absolute
  left: 0
  top: 0
  right: 0
  bottom: 0
  width: 50px
  height: 50px
  margin: auto
  border-radius: 50%
  display: none
  align-items: center
  justify-content: center
  background: hsla(0, 0%, 100%, 0.4)
.play-icon
  font-size: 30px
  color: #d33a31
.mv-img
  display: block
  width: 100%
  height: auto
.mv-content
  margin-top: 10px
  font-size: 13px
.mv-name, .artists
  width: 95%
  white-space: nowrap
  overflow: hidden
  text-overflow: ellipsis
.artists
  font-size: 12px
  color: #333
</style>
