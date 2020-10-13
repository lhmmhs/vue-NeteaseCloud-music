<template>
  <layoutHeader />
  <layoutBody />
  <playBar />
  <player />
  <playlist />
</template>

<script>
import layoutHeader from "./header";
import layoutBody from "./body";
import playBar from "./play-bar";
import player from "./player";
import playlist from "./playlist";
export default {
  components: { layoutHeader, layoutBody, playBar, player, playlist },
};
</script>

