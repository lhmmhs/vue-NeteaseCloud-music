<template>
  <div class="new-song-item">
    <div>{{(order+1) > 9 ? order+1 : "0" + (order+1) }}</div>
    <div class="img-wrap">
      <img :src="`${picUrl}?param=60y60`" />
    </div>
    <div class="song-content">
      <p class="song-name">{{ name }}</p>
      <p class="singer">{{ singer }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: ["order", "picUrl", "name", "singer"],
};
</script>

<style lang="stylus" scoped>
.new-song-item
  box-sizing: border-box
  display: flex
  align-items: center
  width: 50%
  padding: 8px 10px
  font-size: 13px
  &:hover
    background: #f1f1f1
.img-wrap
  width: 60px
  height: 60px
  margin: 0 10px
  box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2)
.song-name, .singer
  padding: 2px 0
</style>