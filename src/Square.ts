export default class Square {
  vao: WebGLVertexArrayObject;
  count: number;
  type: number;

  constructor(gl: WebGL2RenderingContext, shader_program: WebGLProgram) {
    this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);

    const side = 1;
    const position = {
      location: gl.getAttribLocation(shader_program, 'position'),
      buffer: gl.createBuffer(),
      data: new Float32Array([
        -side / 2, -side / 2,
        side / 2, -side / 2,
        side / 2, side / 2,
        -side / 2, side / 2
      ]),
    };
    gl.bindBuffer(gl.ARRAY_BUFFER, position.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, position.data, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(position.location);
    gl.vertexAttribPointer(position.location, 2, gl.FLOAT, false, 0, 0);

    const texture_uv = {
      location: gl.getAttribLocation(shader_program, 'texture_uv'),
      buffer: gl.createBuffer(),
      data: new Uint32Array([
        0, 1,
        1, 1,
        1, 0,
        0, 0
      ]),
    };
    gl.bindBuffer(gl.ARRAY_BUFFER, texture_uv.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, texture_uv.data, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(texture_uv.location);
    gl.vertexAttribPointer(texture_uv.location, 2, gl.UNSIGNED_INT, false, 0, 0);


    const elements = {
      buffer: gl.createBuffer(),
      data: new Int32Array([
        0, 1, 2,
        2, 3, 0
      ]),
    };
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elements.buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, elements.data, gl.STATIC_DRAW);

    this.count = elements.data.length;
    this.type = gl.UNSIGNED_INT;
  }

  draw(gl: WebGL2RenderingContext): void {
    gl.bindVertexArray(this.vao);
    gl.drawElements(gl.TRIANGLES, this.count, this.type, 0);
  }
};