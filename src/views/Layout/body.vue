<template>
  <div class="main">
    <layoutMenu />
    <div class="page-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import layoutMenu from "./menu";
export default {
  components: { layoutMenu },
};
</script>

<style lang="stylus" scoped>
.main
  display: flex
  width: 100vw
  height: 100vh
  box-sizing: border-box
  padding: 50px 0 60px
.page-content
  flex: 1
  overflow-y: auto
</style>