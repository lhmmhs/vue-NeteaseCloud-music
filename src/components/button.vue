<template>
  <button class="button" @click="clickHandler">
    <slot></slot>
  </button>
</template>

<script>
export default {
  emits: ["click"],
  setup(props, { emit }) {
    const clickHandler = (e) => {
      emit("click", e);
    };

    return {
      clickHandler,
    };
  },
};
</script>

<style lang="stylus">
.button
  height: 30px
  line-height: 30px
  padding: 0 10px
  cursor: pointer
  border: 1px solid #c3c3c3
  background: linear-gradient(#fefefe, #f3f3f3)
  border-radius: 2px
</style>