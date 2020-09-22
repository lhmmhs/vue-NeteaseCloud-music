<template>
  <div class="header">
    <div></div>
    <div class="search-wrap">
      <input class="search" type="text" placeholder="搜索" />
    </div>
  </div>
</template>

<style lang="stylus" scoped>
.header
  display: flex
  align-items: center
  justify-content: space-between
  position: fixed
  left: 0
  right: 0
  top: 0
  height: 50px
  padding: 0 30px
  background: #f9f9f9
.search-wrap
  width: 160px
  height: 25px
  background: #ededed
.search
  height: 100%
  width: 100%
  padding: 0 20px
</style>