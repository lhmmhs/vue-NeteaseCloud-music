<template>
  <div class="modal" v-if="show">
    <div class="message-box">
      <div class="message-box-header">
        <span>{{ title }}</span>
      </div>
      <div class="message-box-content">
        <p>{{ message }}</p>
      </div>
      <div class="message-box-footer">
        <btn @click="onClick">确定</btn>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
export default {
  props: {
    title: String,
    message: String,
  },
  setup() {
    const show = ref(false);

    const onClick = () => {
      show.value = false;
    };

    return {
      show,
      onClick,
    };
  },
};
</script>

<style lang="stylus" scoped>
.modal
  display: flex
  align-items: center
  justify-content: center
  position: fixed
  left: 0
  right: 0
  bottom: 0
  top: 0
  z-index: 10
  background: rgba(0, 0, 0, 0.5)
.message-box
  width: 420px
  background: #fff
</style>