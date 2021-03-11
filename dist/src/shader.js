load_shader = async (gl, type, source) => {
  const shader_source = await (await fetch(source)).text();

  const shader = gl.createShader(type);
  gl.shaderSource(shader, shader_source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(`An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`);
    gl.deleteShader(shader);
    return null;
  }

  return shader;

};

init_shader = async (gl, vss, fss) => {
  const vertex_shader = await load_shader(gl, gl.VERTEX_SHADER, vss);
  const fragment_shader = await load_shader(gl, gl.FRAGMENT_SHADER, fss);

  const shader_program = gl.createProgram();
  gl.attachShader(shader_program, vertex_shader);
  gl.attachShader(shader_program, fragment_shader);
  gl.linkProgram(shader_program);

  if (!gl.getProgramParameter(shader_program, gl.LINK_STATUS)) {
    alert(`Unable to initialize the shader program: ${gl.getProgramInfoLog(shader_program)}`);
    return null;
  }

  return shader_program;
};
