import { createApp, reactive, h } from "./mvue.js";

// const app = createApp({
//   setup() {
//     const state = reactive({ count: 10 });
//     const increment = () => state.count++;
//     return { state, increment };
//   },
//   render({ state, increment }) {
//     return h("button", increment, "hello" + state.count);
//   },
// });

import App from "./App.vue";

const app = createApp(App);

app.mount("#app");
