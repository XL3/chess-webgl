exports.orthographic = (aspect_ratio, near = 0, far = 100) => {
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
};

exports.rotation = (theta, axis = 2) => {
  let c = Math.cos(theta);
  let s = Math.sin(theta);

  // Rotation matrix
  if (axis == 2) {
    return new Float32Array([
      c, -s, 0, 0,
      s, c, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ]);
  }
};

exports.identity = () => new Float32Array([
  1, 0, 0, 0,
  0, 1, 0, 0,
  0, 0, 0, 0,
  0, 0, 0, 1,
]);