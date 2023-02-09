import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
//import { createPinia } from "pinia";

//改为局部注册
// import Antd from "ant-design-vue/es";
//import "ant-design-vue/dist/antd.css";
import reg from "./reg";

import { message } from "ant-design-vue";

const app = createApp(App);
app.config.globalProperties.$message = message;

app.use(router);
//app.use(createPinia());

//改为局部注册
//app.use(Antd);
app.use(reg);

app.mount("#app");
