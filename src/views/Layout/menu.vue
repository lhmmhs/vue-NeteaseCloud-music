<template>
  <div class="menu">
    <router-link class="link" to="/">发现音乐</router-link>
    <router-link class="link" to="/playlist">推荐歌单</router-link>
    <router-link class="link" to="/mvs">最新mv</router-link>
    <router-link class="link" to="/artists">歌手</router-link>
  </div>
</template>

<style lang="stylus" scoped>
.menu
  width: 260px
  height: 100%
  box-sizing: border-box
  background: #ededed
.link
  display: block
  height: 45px
  padding: 12px 20px
  box-sizing: border-box
  font-size: 14px
  cursor: pointer
  &.router-link-exact-active
    background: #e7e7e7
  &:hover
    background: #e2e2e2
</style>