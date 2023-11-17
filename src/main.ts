import "./style/index.scss";
// Import all of Bootstrap's JS
// import * as bootstrap from "bootstrap";
import FontIcon from "./utils/fontIcon/fontIcon";
import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.component("FontIcon", FontIcon); //全局字体图标渲染方式,自适应渲染class\unicode\svg

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);

app.use(router);

app.mount("#app");
