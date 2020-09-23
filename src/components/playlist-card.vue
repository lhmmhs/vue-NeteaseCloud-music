<template>
  <div class="playlist-card" @click="onClickCard">
    <div class="play-count">{{playCount}}</div>
    <div class="img-wrap">
      <img class="playlist-img" :src="`${picUrl}?param=300y300`" />
      <div class="play-icon-wrap">
        <i class="play-icon iconfont icon-play"></i>
      </div>
      <p class="copywriter">{{copywriter}}</p>
    </div>
    <div class="playlist-content">
      <p :title="name" class="playlist-name">{{ name }}</p>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";

export default {
  props: ["id", "name", "picUrl", "copywriter", "playCount"],
  setup(props) {
    const router = useRouter();

    const onClickCard = () => {
      router.push(`/playlist/${props.id}`);
    };

    return {
      onClickCard,
    };
  },
};
</script>

<style lang="stylus" scoped>
.playlist-card
  position: relative
  width: 19%
  cursor: pointer
  &:nth-child(-n+5)
    margin-bottom: 20px
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
.copywriter
  position: absolute
  left: 0
  bottom: 0
  right: 0
  font-size: 12px
  color: #fff
  padding: 5px
  background: rgba(0, 0, 0, 0.4)
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