<template>
  <div ref="scroller">
    <slot></slot>
  </div>
</template>

<script>
import { onMounted, ref, watch } from "vue";
import BScroll from "@better-scroll/core";
import MouseWheel from "@better-scroll/mouse-wheel";
import ScrollBar from "@better-scroll/scroll-bar";
BScroll.use(ScrollBar);
BScroll.use(MouseWheel);

const options = {
  scrollY: true,
  mouseWheel: true,
  scrollbar: true,
};

export default {
  props: ["data"],
  setup(props, { emit }) {
    const scroller = ref(null);
    let bscroll = null;

    watch(
      () => props.data,
      () => {
        bscroll.refresh();
      }
    );

    function initScroll() {
      bscroll = new BScroll(scroller.value, options);
    }

    onMounted(() => {
      initScroll();
      emit("init", bscroll);
    });

    return {
      scroller,
    };
  },
};
</script>

