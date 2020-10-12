<template>
  <table cellspacing="0">
    <table-header :columns="columns" />
    <table-body :columns="columns" :data="tableData" @row-dblclick="rowDblClick" />
  </table>
  <div class="hidden-columns"><slot></slot></div>
</template>

<script>
import tableHeader from "./table-header";
import tableBody from "./table-body";

export default {
  props: {
    tableData: {
      type: Array,
      default: () => [],
    },
  },
  components: { tableHeader, tableBody },
  emits: ["row-dblclick"],
  setup(props, { slots, emit }) {
    const columns = slots.default();

    const rowDblClick = (row) => {
      emit("row-dblclick", row);
    };

    return {
      columns,
      rowDblClick,
    };
  },
};
</script>

<style lang="stylus">
table
  width: 100%
  font-size: 13px
  table-layout: fixed
.hidden-columns
  display: none
</style>