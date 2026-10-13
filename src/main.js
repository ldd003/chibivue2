import { createApp } from "../packages/index.js";

import App from "./App.vue";
console.log("APP", App);

const app = createApp(App);

app.mount("#app");
