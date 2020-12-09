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
import btn from "@/components/button";

export default {
  components: { btn },
  props: {
    title: String,
    message: String,
    callback: Function,
  },
  setup(props) {
    const show = ref(false);

    const onClick = () => {
      show.value = false;
      props.callback && props.callback();
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
  padding-bottom: 10px
  border: 1px solid #ebeef5
  border-radius: 4px
  background: #fff
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
.message-box-header
  padding: 15px 15px 10px
  font-size: 18px
  line-height: 1
.message-box-content
  padding: 15px 10px
  font-size: 14px
  line-height: 24px
.message-box-footer
  padding: 5px 15px 0
  text-align: right
</style>
