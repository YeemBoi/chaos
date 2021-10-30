<template>
  <h2>Standard</h2>
  <Basic />
  <h2>Chaos Game</h2>
  <Chaos />
</template>

<script>
import Chaos from "@/components/Chaos.vue";
import Basic from "@/components/Basic.vue";

export default {
  name: "App",
  components: {
    Chaos,
    Basic,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 60px;
}

h2 {
  margin-bottom: 0px;
}
</style>
