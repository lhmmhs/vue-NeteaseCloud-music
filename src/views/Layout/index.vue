<template>
  <div class="layout">
    <layoutHeader />
    <layoutBody />
    <playBar />
  </div>
</template>

<script>
import layoutHeader from "./header";
import layoutBody from "./body";
import playBar from "./play-bar";
export default {
  components: { layoutHeader, layoutBody, playBar },
};
</script>

