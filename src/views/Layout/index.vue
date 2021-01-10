<template>
  <layoutHeader />
  <layoutBody />
  <playBar />
  <player />
  <playlist />
  <login />
</template>

<script>
import layoutHeader from "./header";
import layoutBody from "./body";
import playBar from "./play-bar";
import player from "./player";
import playlist from "./playlist";
import login from "./login";
export default {
  components: { layoutHeader, layoutBody, playBar, player, playlist, login },
};
</script>

