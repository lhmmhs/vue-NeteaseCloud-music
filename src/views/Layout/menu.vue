<template>
  <div class="menu">
    <router-link class="link" to="/">发现音乐</router-link>
    <router-link class="link" to="/FM">私人FM</router-link>
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
  cursor: pointer
  &.router-link-exact-active
    background: #e7e7e7
  &:hover
    background: #e2e2e2
</style>