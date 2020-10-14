<template>
  <div class="song-card">
    <div class="order">{{ order + 1 > 9 ? order + 1 : "0" + (order + 1) }}</div>
    <div class="img-wrap" @click="onClick">
      <img :src="`${picUrl}?param=60y60`" />
      <div class="play-icon-wrap">
        <i class="play-icon iconfont icon-play"></i>
      </div>
    </div>
    <div class="song-content">
      <p :title="name" class="song-name">{{ name }}</p>
      <p class="artists">
        <router-link class="artist" v-for="artist in artists" :to="`/artist/${artist.id}`">{{
          artist.name
        }}</router-link>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: ["order", "picUrl", "name", "artists"],
  emits: ["playSong"],
  setup(props, { emit }) {
    const onClick = () => {
      emit("playSong");
    };
    return { onClick };
  },
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
  &:hover
    background: #f1f1f1
.img-wrap
  position: relative
  width: 60px
  height: 60px
  margin: 0 10px
  box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.2)
  cursor: pointer
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
.artist
  margin-right: 4px
</style>