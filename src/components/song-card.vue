<template>
  <div class="song-card">
    <div class="order">{{ order + 1 > 9 ? order + 1 : "0" + (order + 1) }}</div>
    <div class="img-wrap">
      <img :src="`${picUrl}?param=60y60`" />
      <div class="play-icon-wrap">
        <i class="play-icon iconfont icon-play"></i>
      </div>
    </div>
    <div class="song-content">
      <p :title="name" class="song-name">{{ name }}</p>
      <p :title="artists" class="artists">{{ artists }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: ["order", "picUrl", "name", "artists"],
};
</script>

<style lang="stylus" scoped>
.song-card
  box-sizing: border-box
  display: flex
  align-items: center
  width: 50%
  padding: 8px 10px
  font-size: 13px
  cursor: pointer
  &:hover
    background: #f1f1f1
.img-wrap
  position: relative
  width: 60px
  height: 60px
  margin: 0 10px
  box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.2)
.play-icon-wrap
  position: absolute
  left: 0
  top: 0
  right: 0
  bottom: 0
  width: 30px
  height: 30px
  border-radius: 50%
  margin: auto
  display: flex
  align-items: center
  justify-content: center
  background: hsla(0, 0%, 100%, 0.4)
.play-icon
  font-size: 20px
  color: #d33a31
.song-content
  width: 70%
.song-name, .artists
  width: 90%
  padding: 2px 0
  white-space: nowrap
  overflow: hidden
  text-overflow: ellipsis
</style>