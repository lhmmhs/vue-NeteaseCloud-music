
<script>
import { renderHeader } from "./render-helper";

export default {
  props: ["columns"],
  setup(props) {
    return () => (
      <thead>
        <tr>
          {props.columns.map((vnode) => {
            const { width } = vnode.props;
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