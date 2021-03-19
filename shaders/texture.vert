#version 300 es
layout(location=0) in vec2 position;
layout(location=1) in vec2 texture_uv;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

out vec2 texture_uvs;

void main() {
  texture_uvs = texture_uv;

  vec4 pos = vec4(position, 0.0f, 1.0f);
  gl_Position = projection * view * model * pos;
}