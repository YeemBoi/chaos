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
        <b>Iterations</b>
        <input v-model="iterations" type="range" min="7" max="32" />
      </div>
      <div>
        <b>Jump</b>
        <input v-model="jump" type="range" min="0" max="1" step="any" />
        <div>
          <button
            v-for="preset in jumpPresets"
            @click="jump = preset.value"
            :key="preset.text"
          >
            {{ preset.text }}
          </button>
        </div>
        <div>
          <b>Include sides</b>
          <input v-model="includeSides" type="checkbox" />
        </div>
      </div>
    </div>
    <div class="flex-child">
      <canvas ref="canvas" :height="res" :width="res" />
    </div>
  </div>
</template>

<script>
import { Point, between, regularPolygon } from "@/assets/geometry.js";
export default {
  name: "Chaos",
  data() {
    return {
      currentIteration: 0,
      iterations: 8,
      res: 512,
      jump: 1 / 2,
      includeSides: false,
      pos: null,
      verticesText: "0,0 0,10 10,5",
      regularNGon: 3,
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
    vertices() {
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
          if (i == oldLen - 1) {
            secondPoint = points[0];
          } else {
            secondPoint = points[i + 1];
          }
          points.push(between(points[i], secondPoint, 1 / 2));
        }
      }
      return points;
    },
    canvas() {
      return this.$refs.canvas.getContext("2d");
    },
  },
  methods: {
    iterate() {
      this.canvas.fillRect(this.pos.x, this.pos.y, 1, 1);
      this.pos = between(
        this.pos,
        this.vertices[~~(this.vertices.length * Math.random())],
        this.jump
      );
      this.currentIteration++;
    },
    iterateAll() {
      this.canvas.clearRect(0, 0, this.res, this.res);
      if (!this.vertices.length) {
        return;
      }
      this.pos = this.vertices[0];
      for (let i = 0; i < Math.pow(1.5, this.iterations); i++) {
        this.iterate();
      }
    },
  },
  watch: {
    regularNGon(val) {
      this.verticesText = regularPolygon(val, new Point(5, 5), 5)
        .map((point) => `${point.x},${point.y}`)
        .join(" ");
    },
    iterations(newVal, oldVal) {
      if (newVal >= oldVal) {
        if (!this.pos) {
          if (!this.vertices.length) {
            return;
          }
          this.pos = this.vertices[0];
        }
        for (let i = Math.pow(1.5, oldVal); i < Math.pow(1.5, newVal); i++) {
          this.iterate();
        }
      } else {
        this.iterateAll();
      }
    },
    verticesText(val) {
      this.verticesText = val;
      this.iterateAll();
    },
    jump(val) {
      this.jump = val;
      this.iterateAll();
    },
    includeSides(val) {
      this.includeSides = val;
      this.iterateAll();
    },
    res(val) {
      this.res = val;
      this.iterateAll();
    },
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
