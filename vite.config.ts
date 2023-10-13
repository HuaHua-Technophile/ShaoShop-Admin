import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [
        ElementPlusResolver({
          //importStyle配置样式引入方式，自动引入修改主题色设置此属性
          // importStyle可以配置element-plus的样式引入方式，它默认是css，利用scss变量修改主题时，需要将这个属性设置为scss
          importStyle: "sass",
        }),
      ],
    }),
  ],
  /* 因为按需导入时,仅导入每个组件的style,而在全局main.ts中写的scss覆盖就不会生效
  如果要在vite按需导入的同时修改elementPlus主题色,必须写明以下css内容 
  // https://juejin.cn/post/7264952002706096164#heading-3
  // https://element-plus.org/zh-CN/guide/theming.html#%E5%A6%82%E4%BD%95%E8%A6%86%E7%9B%96%E5%AE%83%EF%BC%9F:~:text=%E5%A6%82%E6%9E%9C%E4%BD%A0%E6%AD%A3%E5%9C%A8,%E7%9A%84%E7%BB%84%E4%BB%B6%E3%80%82
  */
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "./src/style/primaryColor.scss";`,
      },
    },
  },
});
