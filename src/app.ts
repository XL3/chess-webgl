import Matrix from "./Matrix"
import { Shader, shaders } from "./Shader";
import Square from "./Square";
import Texture from "./Texture";

const init = async () => {
  // Create canvas and add event handler
  const main = document.querySelector('#main');
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
  const shader_program = await Shader.createProgram(gl, shaders.texture);
  if (!shader_program) return null;

  // Send uniforms
  gl.useProgram(shader_program);
  const uniforms = {
    projection: gl.getUniformLocation(shader_program, 'projection'),
    texture_sampler: gl.getUniformLocation(shader_program, 'texture_sampler'),
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

const load_image = async (path: string) => new Promise<HTMLImageElement>((resolve, reject) => {
  const image = new Image();
  image.src = path;
  image.onload = () => resolve(image);
  image.onerror = () => reject(new Error('Failed to load image'));
});


window.onload = async () => {
  const { gl, shader_program, uniforms } = await init();
  const square = new Square(gl, shader_program);
  const board_img = await load_image(require('/assets/board.png'));
  const board = new Texture(gl, board_img);
  board.bind(gl, 0, uniforms.texture_sampler);

  let time = 0;
  let last_update = Date.now();
  let dt = 0;
  const render = () => {
    dt = Date.now() - last_update;
    last_update = Date.now();

    time += dt / 1000;
    let model = Matrix.identity;

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.uniform1f(uniforms.time, time);
    gl.uniformMatrix4fv(uniforms.model, true, model);

    square.draw(gl);

    window.requestAnimationFrame(render);
  }

  window.requestAnimationFrame(render);
};