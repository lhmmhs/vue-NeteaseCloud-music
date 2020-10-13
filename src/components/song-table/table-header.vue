
<script>
import { h } from "vue";

export default {
  props: ["columns"],
  setup(props) {
    return () => (
      <thead>
        <tr>
          {props.columns.map((vnode) => {
            const { width } = vnode.props;
            const { renderHeader } = vnode.type.setup();
            return <th style={{ width }}>{renderHeader.call(vnode)}</th>;
          })}
        </tr>
      </thead>
    );
  },
};
</script>

<style lang="stylus">
th
  text-align: left
  height: 50px
</style>