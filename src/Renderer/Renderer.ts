import { Shader, shaders } from "./Shader";
import Square from "./Square";
import Texture from "./Texture";
import Matrix from "./Matrix"

export default class Renderer {
  aspect_ratio: number;

  gl: WebGL2RenderingContext;
  shader_program: WebGLShader;

  uniforms: {
    projection: WebGLUniformLocation,
    texture_sampler: WebGLUniformLocation,
    model: WebGLUniformLocation,
    view: WebGLUniformLocation,
    time: WebGLUniformLocation,
  }

  last_update: number;
  time_elapsed: number;
  dt: number;

  square: Square;
  textures: {
    board: Texture
    pieces?: Texture[][];
  };

  constructor(gl: WebGL2RenderingContext, aspect_ratio: number = 1) {
    this.gl = gl;
    this.aspect_ratio = aspect_ratio;
    this.dt = this.time_elapsed = this.last_update = 0;
  }

  async init() {
    // Init shaders
    this.shader_program = await Shader.createProgram(this.gl, shaders.texture);
    if (!this.shader_program) {
      throw new Error('Failed to create shader program');
    } else {
      this.gl.useProgram(this.shader_program);
    }

    // Set uniforms
    this.uniforms = {
      projection: this.gl.getUniformLocation(this.shader_program, 'projection'),
      texture_sampler: this.gl.getUniformLocation(this.shader_program, 'texture_sampler'),
      model: this.gl.getUniformLocation(this.shader_program, 'model'),
      view: this.gl.getUniformLocation(this.shader_program, 'view'),
      time: this.gl.getUniformLocation(this.shader_program, 'time'),
    }

    // Create textures and meshes
    // @ts-ignore
    const board_url = require('/assets/board.png');
    const board_img = await this.load_image(board_url);

    this.square = new Square(this.gl, this.shader_program);
    this.textures = { board: new Texture(this.gl, board_img) }


    // Send uniforms
    const model = Matrix.identity;
    this.gl.uniformMatrix4fv(this.uniforms.model, true, model);
    const view = Matrix.scale(2);
    this.gl.uniformMatrix4fv(this.uniforms.view, true, view);
    const projection = Matrix.orthographic(this.aspect_ratio);
    this.gl.uniformMatrix4fv(this.uniforms.projection, true, projection);

    // Begin render loop
    window.requestAnimationFrame(() => this.render());
  }

  async load_image(path: string): Promise<HTMLImageElement> {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.src = path;
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('Failed to load image'));
    });
  }

  drawBoard() {
    // this.textures.board.bind(0, this.uniforms.texture_sampler);
    this.square.draw();
  }

  render() {
    this.dt = Date.now() - this.last_update;
    this.last_update = Date.now();
    this.time_elapsed += this.dt / 1000;
    this.gl.uniform1f(this.uniforms.time, this.time_elapsed);

    this.gl.clearColor(0, 0, 0, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    this.drawBoard();

    window.requestAnimationFrame(() => this.render());
  }
}