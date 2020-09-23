<template>
  <div class="discovery">
    <banner />
    <playlist />
    <new-song />
    <mv />
  </div>
</template>

<script>
import banner from "./banner";
import playlist from "./playlist";
import newSong from "./new-song";
import mv from "./mv";
export default {
  components: { banner, playlist, newSong, mv },
};
</script>

<style lang="stylus" scoped>
.discovery
  padding: 20px 100px
</style>