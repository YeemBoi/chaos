<template>
  <BaseRenderer v-model="base" base-id="chaos">
    <label for="chaosIterations">Iterations</label>
    <input
      id="chaosIterations"
      v-model="iterations"
      type="range"
      min="8"
      max="32"
    />
    <label for="pixelScale">Pixel scale</label>
    <input id="pixelScale" v-model="pixelScale" type="number" min="1" max="5" />
  </BaseRenderer>
</template>

<script>
import { ratioBetween } from "@/assets/geometry.js";
import BaseRenderer from "@/components/BaseRenderer.vue";
export default {
  name: "Chaos",
  components: { BaseRenderer },
  data() {
    return {
      base: {},
      currentIteration: 0,
      iterations: 16,
      pixelScale: 2,
      pos: null,
    };
  },
  computed: {
    scaledPoints() {
      return this.base.points.map((point) => ({
        x: point.x / this.pixelScale,
        y: point.y / this.pixelScale,
      }));
    },
  },
  methods: {
    iterate() {
      this.base.canvas.fillRect(
        Math.round(this.pos.x) * this.pixelScale,
        Math.round(this.pos.y) * this.pixelScale,
        this.pixelScale,
        this.pixelScale
      );
      this.pos = ratioBetween(
        this.scaledPoints[~~(this.scaledPoints.length * Math.random())],
        this.pos,
        this.base.jump
      );
      this.currentIteration++;
    },
    iterateAll() {
      this.base.canvas.clearRect(0, 0, this.base.res, this.base.res);
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
    pixelScale(val) {
      this.pixelScale = val;
      this.iterateAll();
    },
  },
};
</script>
