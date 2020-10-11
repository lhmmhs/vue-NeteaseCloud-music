<template>
  <table>
    <div class="hidden-columns"><slot></slot></div>
    <table-header :columns="columns" />
    <table-body :columns="columns" :data="tableData" />
  </table>
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
  setup(props, { slots }) {
    const columns = slots.default();

    return {
      columns,
    };
  },
};
</script>

<style lang="stylus">
table
  width: 100%
  font-size: 13px
</style>