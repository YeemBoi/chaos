<template>
  <BaseRenderer v-model="base" base-id="standard">
    <label for="standardIterations"
      >Iterations <button @click="iterations++">Iterate</button></label
    >
    <input
      id="standardIterations"
      v-model="iterations"
      type="number"
      min="1"
      max="10"
    />
  </BaseRenderer>
</template>

<script>
import { childPolygons } from "@/assets/geometry.js";
import BaseRenderer from "@/components/BaseRenderer.vue";
export default {
  name: "Basic",
  components: { BaseRenderer },
  data() {
    return {
      base: {},
      iterations: 1,
      currentIteration: 0,
      polygons: [],
    };
  },
  computed: {
    actualJump() {
      return this.base.jump;
    },
    renderedPoints() {
      let n = this.base.points.length;
      if (this.base.includeCenter) {
        n--;
      }
      if (this.base.includeSides) {
        n /= 2;
      }
      return n;
    },
  },
  methods: {
    iterate() {
      while (this.currentIteration < this.iterations) {
        this.currentIteration++;
        const oldPolygons = this.polygons;
        this.polygons = [];
        for (const polygon of oldPolygons) {
          this.polygons.push(...childPolygons(polygon, this.actualJump));
        }
      }
      this.base.canvas.clearRect(0, 0, this.base.res, this.base.res);
      for (const polygon of this.polygons) {
        this.base.canvas.beginPath();
        for (let i = 0; i < this.renderedPoints; i++) {
          this.base.canvas.lineTo(polygon[i].x, polygon[i].y);
        }
        this.base.canvas.fill();
      }
    },
    iterateAll() {
      this.currentIteration = 0;
      this.polygons = [this.base.points];
      this.iterate();
    },
  },
  watch: {
    iterations(val, oldVal) {
      this.iterations = val;
      if (val >= oldVal) {
        this.iterate();
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
