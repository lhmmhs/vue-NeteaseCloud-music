
<script>
export default {
  props: ["columns", "data"],
  emits: ["row-dblclick"],

  setup(props, { emit }) {
    const dblclick = (song) => {
      emit("row-dblclick", song);
    };

    // 问题：
    // 1.动态渲染的数据，事件获取不到
    // 2.冒泡

    return () => (
      <tbody>
        {props.data.map((song, index) => {
          return (
            <tr class="row" onDblclick={dblclick.bind(null, song)}>
              {props.columns.map((vnode) => {
                const { width } = vnode.props;
                return (
                  <td class="column" style={{ width }}>
                    {vnode.type.methods.renderCell.call(vnode, song, index)}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    );
  },
};
</script>

<style lang="stylus">
.row
  height: 60px
  &:hover
    background: #f9f9f9
</style>