export function renderHeader() {
  const { label } = this.props;
  return <div class="cell">{label}</div>;
}

export function renderCell(data, index) {
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
