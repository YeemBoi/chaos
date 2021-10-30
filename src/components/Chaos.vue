<template>
  <div>
    <b>Iterations</b>
    <input v-model="iterations" type="range" min="8" max="32" />
  </div>
  <BaseRenderer v-model="base" />
</template>

<script>
import { between } from "@/assets/geometry.js";
import BaseRenderer from "@/components/BaseRenderer.vue";
export default {
  name: "Chaos",
  components: { BaseRenderer },
  data() {
    return {
      base: {},
      currentIteration: 0,
      iterations: 8,
      pos: null,
    };
  },
  methods: {
    iterate() {
      this.base.canvas.fillRect(this.pos.x, this.pos.y, 1, 1);
      this.pos = between(
        this.pos,
        this.base.points[~~(this.base.points.length * Math.random())],
        this.base.jump
      );
      this.currentIteration++;
    },
    iterateAll() {
      this.base.canvas.clearRect(
        0,
        0,
        this.base.canvasRes,
        this.base.canvasRes
      );
      if (!this.base.points.length) {
        return;
      }
      this.pos = this.base.points[0];
      for (let i = 0; i < Math.pow(1.5, this.iterations); i++) {
        this.iterate();
      }
    },
  },
  watch: {
    iterations(val, oldVal) {
      if (val >= oldVal) {
        if (!this.pos) {
          if (!this.base.points.length) {
            return;
          }
          this.pos = this.base.points[0];
        }
        for (let i = Math.pow(1.5, oldVal); i < Math.pow(1.5, val); i++) {
          this.iterate();
        }
      } else {
        this.iterateAll();
      }
    },
    base(val) {
      this.base = val;
      this.iterateAll();
    },
  },
};
</script>
