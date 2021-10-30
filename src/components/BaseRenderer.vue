<template>
  <div class="flex-container">
    <form class="flex-child" action="javascript:void(0)">
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
    <canvas
      class="flex-child"
      ref="canvas"
      :height="canvasRes"
      :width="canvasRes"
    />
  </div>
</template>
<script>
import { Point, regularPolygon, between } from "@/assets/geometry.js";

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
    scaleFactor() {
      return this.res / 10;
    },
    canvasRes() {
      return this.res;
    },
    points() {
      const points = [];
      for (const coords of this.verticesText.split(" ")) {
        if (coords.includes(",")) {
          const xandy = coords.split(",").map(parseFloat);
          points.push(
            new Point(xandy[0] * this.scaleFactor, xandy[1] * this.scaleFactor)
          );
        }
      }
      if (this.includeSides) {
        const oldLen = points.length;
        for (let i = 0; i < oldLen; i++) {
          let secondPoint;
          if (i === oldLen - 1) {
            secondPoint = points[0];
          } else {
            secondPoint = points[i + 1];
          }
          points.push(between(points[i], secondPoint, 1 / 2));
        }
      }
      if (this.includeCenter) {
        points.push(
          new Point(
            points.reduce((a, point) => a + point.x, 0) / points.length,
            points.reduce((a, point) => a + point.y, 0) / points.length
          )
        );
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
        canvasRes: this.canvasRes,
        points: this.points,
        includeCenter: this.includeCenter,
        includeSides: this.includeSides,
        jump: this.jump,
      });
    },
  },
  watch: {
    regularNGon(val) {
      this.verticesText = regularPolygon(val, new Point(5, 5), 5)
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
  width: 100%;
  height: 100%;
}

.flex-child {
  flex: 1;
}

/*
canvas  {
  transform-origin: top;
  transform: scale(2);
}
*/
</style>