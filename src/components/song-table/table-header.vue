
<script>
import { h } from "vue";

export default {
  props: ["columns"],
  setup(props) {
    return () => (
      <thead>
        <tr>
          {props.columns.map((vnode) => (
            <th>{vnode.type.methods.renderHeader.call(vnode)}</th>
          ))}
        </tr>
      </thead>
    );
  },
};
</script>

<style lang="stylus"></style>