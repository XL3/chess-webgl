class Shader {
  private static async compile(gl: WebGL2RenderingContext, type: number, source: string): Promise<WebGLShader> {
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

  static async createProgram(gl: WebGL2RenderingContext, shader: { vertex: string, fragment: string }): Promise<WebGLProgram> {
    const vertex_shader = await Shader.compile(gl, gl.VERTEX_SHADER, shader.vertex);
    const fragment_shader = await Shader.compile(gl, gl.FRAGMENT_SHADER, shader.fragment);

    const shader_program = gl.createProgram();
    gl.attachShader(shader_program, vertex_shader);
    gl.attachShader(shader_program, fragment_shader);
    gl.linkProgram(shader_program);

    if (!gl.getProgramParameter(shader_program, gl.LINK_STATUS)) {
      alert(`Unable to initialize the shader program: ${gl.getProgramInfoLog(shader_program)}`);
      return null;
    }

    return shader_program;
  }
};

const shaders = {
  color: {
    vertex: require('/shaders/color.vert'),
    fragment: require('/shaders/color.frag'),
  }
};

export { Shader, shaders };
