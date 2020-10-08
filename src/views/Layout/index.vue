<template>
  <layoutHeader />
  <layoutBody />
  <playBar />
  <player />
</template>

<script>
import layoutHeader from "./header";
import layoutBody from "./body";
import playBar from "./play-bar";
import player from "./player";
export default {
  components: { layoutHeader, layoutBody, playBar, player },
};
</script>

