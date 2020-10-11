
<script>
import { h } from "vue";

export default {
  props: ["columns", "data"],
  setup(props) {
    return () => (
      <tbody>
        {props.data.map((song, index) => (
          <tr class="row">
            {props.columns.map((vnode) => (
              <td>{vnode.type.methods.renderCell.call(vnode, song, index)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  },
};
</script>

<style lang="stylus">
.row
  height: 50px
</style>