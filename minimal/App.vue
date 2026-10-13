<template>
  <button @click="increment">state: {{ state.count }}</button>
</template>

<script>
import { reactive } from "./mvue";
export default {
  setup() {
    const state = reactive({
      count: 0,
    });
    const increment = () => {
      state.count++;
    };
    return {
      state,
      increment,
    };
  },
};
</script>
