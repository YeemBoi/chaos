<template>
  <h2>Standard</h2>
  <Standard />
  <h2>Chaos Game</h2>
  <Chaos />
</template>

<script>
import Chaos from "@/components/Chaos.vue";
import Standard from "@/components/Standard.vue";

export default {
  name: "App",
  components: {
    Chaos,
    Standard,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 32px;
}
</style>
