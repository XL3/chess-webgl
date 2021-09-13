// @ts-ignore
import board_white_url from "url:/assets/board-white.png";
// @ts-ignore
import board_black_url from "url:/assets/board-black.png";
// @ts-ignore
import piece_url from "url:/assets/chess-pieces.png";

import { Shader, shaders } from "./Shader";
import Mesh_Square from "./Mesh_Square";
import { Texture, Texture_Image } from "./Texture";
import Matrix from "./Matrix";

import {
    Square,
    Type,
    Color,
    Piece,
} from "../Chess/Piece";

export default class Renderer {
    static BOARD_SIZE: number = 640;
    static SQUARE_SIZE: number = 640 / 8;

    gl: WebGL2RenderingContext;
    canvas: HTMLCanvasElement;
    shader_program: WebGLShader;
    pieces: Array<Piece[]>;
    turn: Color;

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
    move_delay: number;

    square: Mesh_Square;
    textures: {
        board: Texture[];
        pieces: Texture[][];
    };

    held_piece: Piece;
    held_at: {
        x: number;
        y: number;
    };

    drawBoard() {
        this.matrices.model = Matrix.scale(Renderer.BOARD_SIZE);

        this.textures.board[this.turn].bind(0, this.uniforms.texture_sampler);
        this.gl.uniformMatrix4fv(this.uniforms.model, true, this.matrices.model);
        this.square.draw();
    }

    drawPiece(piece: Piece) {
        // Offset to lower left square
        let translate = { x: -4 * Renderer.SQUARE_SIZE, y: -4 * Renderer.SQUARE_SIZE };

        if (this.held_piece && piece == this.held_piece) {
            translate.x += this.held_at.x;
            translate.y += this.held_at.y;
            translate.y = -translate.y;

        } else {
            // Offset to middle of lower left square
            translate.x += Renderer.SQUARE_SIZE * (piece.square.file + 0.5);
            translate.y += Renderer.SQUARE_SIZE * (piece.square.rank + 0.5);
            if (this.turn == Color.Black) {
                translate.y = -translate.y;
            }
        }


        this.textures.pieces[piece.color][piece.type].bind(0, this.uniforms.texture_sampler);
        let model = Matrix.scale(Renderer.SQUARE_SIZE);
        model = Matrix.translate(translate, model);

        this.matrices.model = model;
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

        this.drawBoard();
        for (let color of this.pieces) {
            color
                .filter(p => this.held_piece != p)
                .forEach(p => this.drawPiece(p));
        }
        if (this.held_piece) {
            this.drawPiece(this.held_piece);
        }

        window.requestAnimationFrame(() => this.render());
    }

    async loadTextures() {
        const board_white_img = await Renderer.loadImage(board_white_url);
        const board_black_img = await Renderer.loadImage(board_black_url);
        const piece_img = await Renderer.loadImage(piece_url);

        let images: Texture_Image[][] = [
            new Array<Texture_Image>(Type.COUNT),
            new Array<Texture_Image>(Type.COUNT),
        ];

        const SQUARE_SIZE = Renderer.BOARD_SIZE / 8;
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
            board: [
                    new Texture(this.gl, {
                        element: board_white_img,
                        x: 0, y: 0,
                        width: board_white_img.width, height: board_white_img.height
                    }),
                    new Texture(this.gl, {
                        element: board_black_img,
                        x: 0, y: 0,
                        width: board_black_img.width, height: board_black_img.height
                    })
            ],

            pieces: [
                images[Color.White].map((image) => new Texture(this.gl, image)),
                images[Color.Black].map((image) => new Texture(this.gl, image)),
            ]
        }
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
        await this.loadTextures();

        // Upload uniforms
        this.matrices = {
            model: Matrix.identity,
            view: Matrix.identity,
            projection: Matrix.orthographic({
                left: -Renderer.BOARD_SIZE / 2,
                right: Renderer.BOARD_SIZE / 2,
                top: Renderer.BOARD_SIZE / 2,
                bottom: -Renderer.BOARD_SIZE / 2,
                near: 0,
                far: 1
            }),
        }
        this.gl.uniformMatrix4fv(this.uniforms.model, true, this.matrices.model);
        this.gl.uniformMatrix4fv(this.uniforms.view, true, this.matrices.view);
        this.gl.uniformMatrix4fv(this.uniforms.projection, true, this.matrices.projection);
    }

    resize() {
        const dim = Renderer.getMinimumDimension();

        this.gl.viewport(0, 0, dim, dim);

        this.canvas.width = dim;
        this.canvas.height = dim;
    }

    startRendering() {
        // Begin render loop
        window.requestAnimationFrame(() => this.render());
    }

    static async loadImage(path: string): Promise<HTMLImageElement> {
        return new Promise<HTMLImageElement>(
            (resolve, reject) => {
                const image = new Image();
                image.src = path;
                image.onload = () => resolve(image);
                image.onerror = () => reject(new Error('Failed to load image'));
            });
    }

    static getMinimumDimension(): number {
        let width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        let height = (window.innerHeight > 0) ? window.innerHeight : screen.height;

        width *= 0.8;
        height *= 0.8;

        return Math.min(width, height, Renderer.BOARD_SIZE);
    }

    constructor(canvas: HTMLCanvasElement, pieces: Array<Piece[]>) {
        // Request WebGL context
        const gl = canvas.getContext("webgl2", {
            preserveDrawingBuffer: true,
            alpha: true,
            antialias: true,
            depth: true,
            powerPreference: "high-performance",
            premultipliedAlpha: false,
            stencil: true
        });


        if (!gl) return null;
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.BLEND);

        this.gl = gl;
        this.canvas = canvas;
        this.dt = this.time_elapsed = this.last_update = 0;

        this.pieces = pieces;
        this.resize();
    }
}