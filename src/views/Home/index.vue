<template>
  <div class="discovery">
    <banner />
    <new-song />
    <mv />
  </div>
</template>

<script>
import banner from "./banner";
import newSong from "./new-song";
import mv from "./mv";
export default {
  components: { banner, newSong, mv },
};
</script>