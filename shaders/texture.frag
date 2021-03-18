#version 300 es
precision highp float;

in vec2 texture_uvs;
uniform sampler2D texture_sampler;

uniform float time;
out vec4 color;

void main() {
  color = texture(texture_sampler, texture_uvs);
}