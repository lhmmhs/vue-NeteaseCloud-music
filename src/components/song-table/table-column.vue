<script>
export default {
  props: {
    prop: String,
    label: String,
    width: String,
    formatter: Function,
    type: String,
  },

  render() {},
};
</script>

<style lang="stylus">
.cell
  padding: 0 10px
  overflow: hidden
  white-space: nowrap
  text-overflow: ellipsis
</style>