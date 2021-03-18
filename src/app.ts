import Matrix from "./Matrix"
import { Shader, shaders } from "./Shader";
import Square from "./Square";

declare global {
  interface Window {
    rotating: boolean;
  }
}

const init = async () => {
  // Create canvas and add event handler
  const main = document.querySelector('#main');
  window.rotating = false;
  main.addEventListener('keydown', (e) => {
    let kbevt = <KeyboardEvent>e;
    if (kbevt.key == 'r') {
      window.rotating = !window.rotating
    }
  });

  const glCanvas: HTMLCanvasElement = main.querySelector('#glCanvas');
  glCanvas.width = 900;
  glCanvas.height = 600;
  const aspect_ratio = glCanvas.width / glCanvas.height;

  // Request WebGL context
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

  // Create shader program
  const shader_program = await Shader.createProgram(gl, shaders.color);
  if (!shader_program) return null;


  // Send uniforms
  gl.useProgram(shader_program);
  const uniforms = {
    projection: gl.getUniformLocation(shader_program, 'projection'),
    model: gl.getUniformLocation(shader_program, 'model'),
    view: gl.getUniformLocation(shader_program, 'view'),
    time: gl.getUniformLocation(shader_program, 'time'),
  };

  const projection = Matrix.orthographic(aspect_ratio);
  gl.uniformMatrix4fv(uniforms.projection, true, projection);
  const view = Matrix.identity;
  gl.uniformMatrix4fv(uniforms.view, true, view);

  return { gl, shader_program, uniforms };
}

window.onload = async () => {
  const { gl, shader_program, uniforms } = await init();
  const square = new Square(gl, shader_program);

  let time = 0;
  let last_update = Date.now();
  let dt = 0;
  const render = () => {
    dt = Date.now() - last_update;
    last_update = Date.now();

    if (window.rotating) time += dt / 1000;
    let model = Matrix.rotation(time, 2);

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.uniform1f(uniforms.time, time);
    gl.uniformMatrix4fv(uniforms.model, true, model);

    square.draw(gl);

    window.requestAnimationFrame(render);
  }

  window.requestAnimationFrame(render);
};