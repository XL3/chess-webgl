const init = async (main) => {
  const glCanvas = main.querySelector('#glCanvas');
  glCanvas.width = 900;
  glCanvas.height = 600;

  const gl = glCanvas.getContext("webgl2", {
    preserveDrawingBuffer: true,
    alpha: true,
    antialias: true,
    depth: true,
    powerPreference: "high-performance",
    premultipliedAlpha: false,
    stencil: true
  });
  if (!gl) return null;

  const shader_program = await init_shader(gl, '../shaders/color.vert', '../shaders/color.frag');
  if (!shader_program) return null;

  return { gl, shader_program, aspect_ratio: glCanvas.width / glCanvas.height };
}

window.onload = async () => {
  const main = document.querySelector('#main');
  let rotating = false;
  main.addEventListener('keydown', (e) => {
    if (e.key == 'r') {
      rotating = !rotating
    }
  });

  const { gl, shader_program, aspect_ratio } = await init(main);
  gl.useProgram(shader_program);

  const uniforms = {
    time: gl.getUniformLocation(shader_program, 'time'),
    model: gl.getUniformLocation(shader_program, 'model'),
    view: gl.getUniformLocation(shader_program, 'view'),
    projection: gl.getUniformLocation(shader_program, 'projection'),
  };

  const view = identity();
  gl.uniformMatrix4fv(uniforms.view, true, view);

  const projection = orthographic(aspect_ratio);
  gl.uniformMatrix4fv(uniforms.projection, true, projection);

  const square = Square(gl, shader_program);

  let time = 0;
  const render = () => {
    if (rotating) time += 0.008;
    let model = rotation(time);

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.uniform1f(uniforms.time, time);
    gl.uniformMatrix4fv(uniforms.model, true, model);

    gl.bindVertexArray(square.vao);
    gl.drawElements(gl.TRIANGLES, square.count, square.type, 0);

    window.requestAnimationFrame(render);
  }

  window.requestAnimationFrame(render);
};