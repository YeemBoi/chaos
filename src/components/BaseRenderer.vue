<template>
  <div class="flex-container">
    <form action="javascript:void(0)">
      <slot />
      <label for="res">Resolution</label>
      <input id="res" v-model="res" type="number" />
      <label for="verticesText">Vertices</label>
      <input id="verticesText" v-model="verticesText" type="text" />

      <label for="regularNGon">Or regular n-gon:</label>
      <input id="regularNGon" v-model="regularNGon" type="number" min="3" />
      <label for="jump">Jump</label>
      <input
        id="jump"
        v-model="jump"
        type="range"
        :min="1 / 4"
        :max="3 / 4"
        step="any"
      />
      <div>
        <button
          v-for="preset in jumpPresets"
          @click="jump = preset.value"
          :key="preset.text"
        >
          {{ preset.text }}
        </button>
      </div>
      <label for="includeSides"
        >Include sides
        <input id="includeSides" v-model="includeSides" type="checkbox"
      /></label>
      <label for="includeCenter"
        >Include center
        <input id="includeCenter" v-model="includeCenter" type="checkbox"
      /></label>
    </form>
    <canvas ref="canvas" :height="res" :width="res" />
  </div>
</template>
<script>
import { regularPolygon, midpoint } from "@/assets/geometry.js";

export default {
  props: ["modelValue"],
  name: "BaseRenderer",
  emits: ["update:modelValue"],
  data() {
    return {
      res: 512,
      verticesText: "",
      regularNGon: 3,
      jump: 1 / 2,
      includeSides: false,
      includeCenter: false,
      resTimeout: null,
      jumpPresets: [
        {
          text: "1/2",
          value: 1 / 2,
        },
        {
          text: "2/3",
          value: 2 / 3,
        },
        {
          text: "1/Φ",
          value: 2 / (1 + Math.sqrt(5)),
        },
      ],
    };
  },
  computed: {
    points() {
      const points = [];
      for (const coords of this.verticesText.split(" ")) {
        if (coords.includes(",")) {
          points.push(this.scaleToPoint(...coords.split(",").map(parseFloat)));
        }
      }
      if (this.includeSides) {
        const oldLen = points.length;
        for (let i = 0; i < oldLen; i++) {
          points.push(
            midpoint([points[i], points[i === oldLen - 1 ? 0 : i + 1]])
          );
        }
      }
      if (this.includeCenter) {
        points.push(midpoint(points));
      }
      return points;
    },
    canvas() {
      return this.$refs.canvas.getContext("2d");
    },
  },
  methods: {
    emitAll() {
      this.$emit("update:modelValue", {
        canvas: this.canvas,
        res: this.res,
        points: this.points,
        includeCenter: this.includeCenter,
        includeSides: this.includeSides,
        jump: this.jump,
      });
    },
    scaleToPoint(x, y) {
      return { x: x * this.res / 10, y: y * this.res / 10 };
    },
  },
  watch: {
    regularNGon(val) {
      this.verticesText = regularPolygon(val, { x: 5, y: 5 }, 5)
        .map((point) => `${point.x},${point.y}`)
        .join("  ");
    },
    verticesText(val) {
      this.verticesText = val;
      this.emitAll();
    },
    jump(val) {
      this.jump = val;
      this.emitAll();
    },
    includeSides(val) {
      this.includeSides = val;
      this.emitAll();
    },
    includeCenter(val) {
      this.includeCenter = val;
      this.emitAll();
    },
    res(val) {
      this.res = val;
      if (this.resTimeout) {
        clearTimeout(this.resTimeout);
      }
      this.resTimeout = setTimeout(this.emitAll, 200);
    },
  },
  mounted() {
    this.verticesText = "0,0  0,10  10,5";
    this.emitAll();
  },
};
</script>

<style>
label {
  padding-top: 12px;
  font-weight: bold;
  display: block;
}
</style>

<style scoped>
.flex-container {
  display: flex;
  flex-flow: row wrap;
  align-items: top;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
}
form {
  flex-grow: 0;
  margin-right: 12px;
}

canvas {
  flex-grow: 1;
  max-height: 100vh;
  max-width: 100vh;
}
</style>