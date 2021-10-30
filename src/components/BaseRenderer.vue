<template>
  <div class="flex-container">
    <div class="flex-child">
      <div>
        <b>Resolution</b>
        <input v-model="res" type="number" />
      </div>
      <div>
        <b>Vertices</b>
        <input v-model="verticesText" type="text" />
      </div>
      <div>
        <b>Or regular n-gon:</b>
        <input v-model="regularNGon" type="number" min="3" />
      </div>
      <div>
        <b>Jump</b>
        <input
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
      </div>
      <div>
        <b>Include sides</b>
        <input v-model="includeSides" type="checkbox" />
      </div>
      <div>
        <b>Include center</b>
        <input v-model="includeCenter" type="checkbox" />
      </div>
    </div>
    <div class="flex-child">
      <canvas ref="canvas" :height="canvasRes" :width="canvasRes" />
    </div>
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
          text: "1/3",
          value: 1 / 3,
        },
        {
          text: "2/3",
          value: 2 / 3,
        },
        /*
        {
          text: "19/50",
          value: 19 / 50,
        },
        {
          text: "1/4",
          value: 1 / 4,
        },
        */
        {
          text: "1/Φ",
          value: 1 / (1 + Math.sqrt(5)) / 2,
        },
        /*{
          text: "1/Φ but with sqrt(7)",
          value: 1 / (1 + Math.sqrt(7)) / 2,
        },
        */
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

<style scoped>
.flex-container {
  display: flex;
  flex-flow: row wrap;
  /*align-items: center;*/
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