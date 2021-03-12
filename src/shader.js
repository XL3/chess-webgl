compile_shader = async (gl, type, source) => {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(`An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`);
    gl.deleteShader(shader);
    return null;
  }

  return shader;

};

exports.create_shader_program = async (gl, vss, fss) => {
  const vertex_shader = await compile_shader(gl, gl.VERTEX_SHADER, vss);
  const fragment_shader = await compile_shader(gl, gl.FRAGMENT_SHADER, fss);

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

exports.shaders = {
  color: {
    vertex: require('/shaders/color.vert'),
    fragment: require('/shaders/color.frag'),
  }
};