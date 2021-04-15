import { Shader, shaders } from "./Shader";
import Mesh_Square from "./Mesh_Square";
import { Texture, Texture_Image } from "./Texture";
import Matrix from "./Matrix";

import {
  Square,
  Type,
  Color,
  Piece,
  King,
} from "../Chess/Piece";

export default class Renderer {
  BOARD_SIZE: number;

  gl: WebGL2RenderingContext;
  shader_program: WebGLShader;

  uniforms: {
    projection: WebGLUniformLocation,
    texture_sampler: WebGLUniformLocation,
    model: WebGLUniformLocation,
    view: WebGLUniformLocation,
    time: WebGLUniformLocation,
  }

  matrices: {
    model: Float32Array;
    view: Float32Array;
    projection: Float32Array;
  }

  last_update: number;
  time_elapsed: number;
  dt: number;

  square: Mesh_Square;
  textures: {
    board: Texture
    pieces?: Texture[][];
  };

  constructor(gl: WebGL2RenderingContext, board_size: number = 1) {
    this.gl = gl;
    this.BOARD_SIZE = board_size;
    this.dt = this.time_elapsed = this.last_update = 0;
  }

  async init() {
    // Initialize shaders
    this.shader_program = await Shader.create_program(this.gl, shaders.texture);
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
    this.square = new Mesh_Square(this.gl, this.shader_program);
    await this.load_textures();

    // Upload uniforms
    this.matrices = {
      model: Matrix.identity,
      view: Matrix.scale(0.25),
      projection: Matrix.identity,
    }
    this.gl.uniformMatrix4fv(this.uniforms.model, true, this.matrices.model);
    this.gl.uniformMatrix4fv(this.uniforms.view, true, this.matrices.view);
    this.gl.uniformMatrix4fv(this.uniforms.projection, true, this.matrices.projection);

    // Begin render loop
    window.requestAnimationFrame(() => this.render());
  }

  async load_textures() {
    // @ts-ignore
    const board_url = require('/assets/board.png');
    const board_img = await load_image(board_url);

    // @ts-ignore
    const piece_url = require('/assets/chess-pieces.png');
    const piece_img = await load_image(piece_url);

    let images: Texture_Image[][] = [
      new Array<Texture_Image>(Type.COUNT),
      new Array<Texture_Image>(Type.COUNT),
    ];

    const SQUARE_SIZE = this.BOARD_SIZE / 8;
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < Type.COUNT; j++) {
        images[i][j] = {
          element: piece_img,
          x: j * SQUARE_SIZE,
          y: i * SQUARE_SIZE,
          width: SQUARE_SIZE,
          height: SQUARE_SIZE,
        };
      }
    }

    this.textures = {
      board: new Texture(this.gl, {
        element: board_img,
        x: 0, y: 0,
        width: board_img.width, height: board_img.height
      }),

      pieces: [
        images[Color.White].map((image) => new Texture(this.gl, image)),
        images[Color.Black].map((image) => new Texture(this.gl, image)),
      ]
    }
  }

  draw_board() {
    this.textures.board.bind(0, this.uniforms.texture_sampler);
    this.matrices.model = Matrix.scale(8);
    this.gl.uniformMatrix4fv(this.uniforms.model, true, this.matrices.model);
    this.square.draw();
  }

  draw_piece(piece: Piece) {
    const t = {
      x: -3.5 + piece.square.file,
      y: -3.5 + piece.square.rank,
    };

    this.textures.pieces[piece.color][piece.type].bind(0, this.uniforms.texture_sampler);
    this.matrices.model = Matrix.translate(t);
    this.gl.uniformMatrix4fv(this.uniforms.model, true, this.matrices.model);
    this.square.draw();
  }

  render() {
    this.dt = Date.now() - this.last_update;
    this.last_update = Date.now();
    this.time_elapsed += this.dt / 1000;
    this.gl.uniform1f(this.uniforms.time, this.time_elapsed);

    this.gl.clearColor(0, 0, 0, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    this.draw_board();

    const b = new King(new Square(7, 7), Color.Black);
    const w = new King(new Square(0, 0), Color.White);
    this.draw_piece(w);
    this.draw_piece(b);

    window.requestAnimationFrame(() => this.render());
  }
}
const load_image = async (path: string) => new Promise<HTMLImageElement>(
  (resolve, reject) => {
    const image = new Image();
    image.src = path;
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Failed to load image'));
  }
);
