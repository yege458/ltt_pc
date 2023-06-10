import { createApp } from "vue";
import App from "./App.vue";
import "./assets/style/global.less";

import naiveUI from "./naiveUI";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

import router from "./router/index";
import { createPinia } from "pinia";

const instance = createApp(App);
document.documentElement.style.fontSize = 22 + "px";
// instance.use(ElementPlus);
instance.use(router).use(naiveUI).use(ElementPlus).use(createPinia()).mount("#app");
