<script>
export default {
  props: {
    prop: String,
    label: String,
    width: String,
    formatter: Function,
    type: String,
  },

  setup() {
    function renderHeader() {
      const { label } = this.props;
      return <div class="cell">{label}</div>;
    }

    function renderCell(data, index) {
      const { prop, formatter, type } = this.props;

      if (type && type === "index") {
        return <div class="cell">{++index < 10 ? "0" + index : index}</div>;
      }

      // slot
      if (this.children) {
        return <div class="cell">{this.children.default({ song: data })}</div>;
      }

      return <div class="cell">{formatter ? formatter(data[prop]) : data[prop]}</div>;
    }

    return {
      renderHeader,
      renderCell,
    };
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