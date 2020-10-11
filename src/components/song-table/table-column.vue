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
      const { label, width } = this.props;
      return (
        <div class="cell" style={{ width }}>
          {label}
        </div>
      );
    },
    renderCell(data, index) {
      const { prop, formatter, type, width } = this.props;

      // 编号
      if (type && type === "index") {
        return (
          <div class="cell" style={{ width }}>
            {++index < 10 ? "0" + index : index}
          </div>
        );
      }

      const deep = (props, data) => {
        props.forEach((prop) => (data = data[prop]));
        return data;
      };

      let value = prop.split(".").length > 1 ? deep(prop.split("."), data) : data[prop];
      return (
        <div class="cell" style={{ width }}>
          {formatter ? formatter(value) : value}
        </div>
      );
    },
  },
  render() {
    return <div></div>;
  },
};
</script>

<style lang="stylus"></style>