import { createVNode, render } from "vue";
import messageBox from "./message-box";

let instance;

const initInstance = () => {
  const vnode = createVNode(messageBox);
  render(vnode, document.body);
  instance = vnode.component;
};

const MessageBox = (options) => {
  if (!instance) {
    initInstance();
  }
  const vmProps = instance.props;
  const vmState = instance.setupState;
  for (let key in options) {
    vmProps[key] = options[key];
  }
  vmState.show = true;
};

const message = (options) => {
  MessageBox(options);
};

export default message;
