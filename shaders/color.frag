#version 300 es
precision highp float;

uniform float time;

out vec4 color;

vec3 hsv2rgb(vec3 c)
{
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
  vec3 HSV = vec3(0.5 * cos(time/4.f) + 0.5,
                  0.7f,
                  1.f);

  color = vec4(hsv2rgb(HSV), 1.f);
}