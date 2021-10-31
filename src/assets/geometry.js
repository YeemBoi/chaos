class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

function midpoint(points) {
  return new Point(
    points.reduce((a, point) => a + point.x, 0) / points.length,
    points.reduce((a, point) => a + point.y, 0) / points.length
  );
}

function ratioBetween(a, b, ratio) {
  return new Point(
    a.x * ratio + b.x * (1 - ratio),
    a.y * ratio + b.y * (1 - ratio)
  );
}

function fixFloat(n) {
  return Math.round(n * 1e12) / 1e12;
}

function regularPolygon(n, center, radius) {
  const vertices = [];
  const angleStep = (2 * Math.PI) / n;
  for (let i = 0; i < n; i++) {
    vertices.push(
      new Point(
        center.x + fixFloat(Math.cos(angleStep * i) * radius),
        center.y + fixFloat(Math.sin(angleStep * i) * radius)
      )
    );
  }
  return vertices;
}

function childPolygons(vertices, jump) {
  const children = [];
  for (const corner of vertices) {
    let newPolygon = [];
    for (const vertex of vertices) {
      newPolygon.push(ratioBetween(corner, vertex, jump));
    }
    children.push(newPolygon);
  }
  return children;
}

export {
  Point,
  midpoint,
  ratioBetween,
  fixFloat,
  regularPolygon,
  childPolygons,
};
