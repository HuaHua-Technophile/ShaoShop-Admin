import { iconType } from "./types";
import { h, defineComponent, Component } from "vue";
import fontIcon from "./fontIcon";

// 将fonticon渲染为组件返回,,常用于elementPlus一些支持组件的图标使用
export const renderFontIcon = (icon: any, attrs?: iconType): Component => {
  return defineComponent({
    name: "FontIcon",
    render() {
      return h(fontIcon, {
        icon: icon,
        ...attrs,
      });
    },
  });
};
