<script>
export default {
  props: {
    prop: String,
    label: String,
    width: String,
    formatter: Function,
    type: String,
  },

  methods: {
    renderHeader() {
      const { label } = this.props;
      return <div class="cell">{label}</div>;
    },
    renderCell(data, index) {
      const { prop, formatter, type } = this.props;

      if (type && type === "index") {
        return <div class="cell">{++index < 10 ? "0" + index : index}</div>;
      }

      // slot
      if (this.children) {
        return <div class="cell">{this.children.default({ song: data })}</div>;
      }

      const deep = (props, data) => {
        props.forEach((prop) => (data = data[prop]));
        return data;
      };

      // 嵌套属性
      let value = prop.split(".").length > 1 ? deep(prop.split("."), data) : data[prop];
      return <div class="cell">{formatter ? formatter(value) : value}</div>;
    },
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