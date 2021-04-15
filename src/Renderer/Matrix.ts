export default class Matrix {
  static identity: Float32Array = new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ]);

  static scale(factor: number) {
    const scaled = this.identity.map((x: number) => factor * x);
    scaled[15] = 1;
    return scaled;
  }

  static orthographic(aspect_ratio: number, near: number = 0, far: number = 100): Float32Array {
    let left = -1;
    let right = 1;
    let bottom = -1;
    let top = 1;

    if (aspect_ratio > 1) {
      left *= aspect_ratio;
      right *= aspect_ratio;
    } else {
      bottom *= 1 / aspect_ratio;
      top *= 1 / aspect_ratio;
    }

    return new Float32Array([
      2 / (right - left), 0, 0, (left + right) / (left - right),
      0, 2 / (top - bottom), 0, (bottom + top) / (bottom - top),
      0, 0, 2 / (near - far), (near + far) / (near - far),
      0, 0, 0, 1,
    ]);
  }

  static rotation(theta: number, axis: number = 3): Float32Array {
    let c = Math.cos(theta);
    let s = Math.sin(theta);

    // Rotation matrix
    switch (axis) {
      case 0:
        return new Float32Array([
          1, 0, 0, 0,
          0, c, -s, 0,
          0, s, s, 0,
          0, 0, 0, 1,
        ]);

      case 1:
        return new Float32Array([
          c, 0, s, 0,
          0, 1, 0, 0,
          -s, 0, c, 0,
          0, 0, 0, 1,
        ]);

      case 2:
        return new Float32Array([
          c, -s, 0, 0,
          s, c, 0, 0,
          0, 0, 1, 0,
          0, 0, 0, 1,
        ]);

      default:
        return this.identity;
    }
  }
}