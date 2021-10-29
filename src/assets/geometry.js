class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Polygon {
  constructor(vertices, depth) {
    if (vertices.length && Array.isArray(vertices[0])) {
      this.vertices = vertices.map((vertex) => new Point(...vertex));
    } else {
      this.vertices = vertices;
    }
    this.depth = depth;
  }

  children(maxDepth) {
    const children = [];
    for (let i = 0; i < this.vertices.length; i++) {
      const child = new Polygon([this.vertices[i]], this.depth + 1);
      for (let j = 0; j < this.vertices.length; j++) {
        if (i !== j) {
          child.vertices.push(between(this.vertices[i], this.vertices[j], 1 / 2));
        }
      }
      if (this.depth < maxDepth) {
        children.push(...child.children(maxDepth));
      } else {
        children.push(child);
      }
    }
    return children;
  }
}

function between(a, b, ratio) {
  return new Point((a.x + b.x) * ratio, (a.y + b.y) * ratio);
}

function regularPolygon(n, center, radius) {
  const vertices = [];
  const angleStep = (2 * Math.PI / n);
  for (let i = 0; i < n; i++) {
    vertices.push(
      new Point(
        center.x + Math.cos(angleStep * i) * radius,
        center.y + Math.sin(angleStep * i) * radius
      )
    );
  }
  return vertices;
}

export { Point, Polygon, between, regularPolygon };
