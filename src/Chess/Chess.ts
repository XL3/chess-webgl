import Renderer from "../Renderer/Renderer";

import {
    Square,
    Type,
    Color,
    Piece,
    C_Piece,
} from "../Chess/Piece";

export default class Chess {
    renderer: Renderer;
    canvas: HTMLCanvasElement;

    turn: Color;
    pieces: Array<Piece[]>;

    lmb_is_clicked: boolean;

    constructor() {
        // Create canvas
        const main = document.querySelector('#main');
        this.canvas = main.querySelector('#glCanvas');
        this.placePieces();

        this.renderer = new Renderer(this.canvas, this.pieces);

        // Add event handler
        window.onresize = () => this.renderer.resize();
    }

    setEventHandlers() {
        this.lmb_is_clicked = false;
        this.canvas.onmousedown = (ev: MouseEvent) => {
            if (ev.button == 0) {
                this.lmb_is_clicked = true;
            }
        }
        this.canvas.onmouseout = this.canvas.onmouseup = (ev: MouseEvent) => {
            this.lmb_is_clicked = false;
        }

        this.canvas.onmousemove = (ev: MouseEvent) => {
            // Holding
            if (this.lmb_is_clicked) {
                const dim = Renderer.getMinimumDimension();
                const file = Math.floor(8 * ev.offsetX / dim);
                const rank = 7 - Math.floor(8 * ev.offsetY / dim);

                // TODO Flip the board
                const sq = new Square();
                sq.fromCoordinates(file, rank);

                const comp = (piece: Piece) => (sq.file === piece.square.file) && (sq.rank === piece.square.rank);
                
                this.pieces.forEach(arr => {
                    const fd = arr.findIndex(comp);
                    if (fd != -1) {
                        console.log(`${arr[fd]}`);
                        arr.splice(fd, 1);
                    }
                });
            }
        }
    }
    placePieces() {
        this.pieces = [new Array<Piece>(8), new Array<Piece>(8)];

        // Kings and Queens
        this.pieces[Color.White][0] = new C_Piece('E1', Color.White, Type.King);
        this.pieces[Color.White][1] = new C_Piece('D1', Color.White, Type.Queen);

        this.pieces[Color.Black][0] = new C_Piece('E8', Color.Black, Type.King);
        this.pieces[Color.Black][1] = new C_Piece('D8', Color.Black, Type.Queen);


        // Rooks
        this.pieces[Color.White][2] = new C_Piece('H1', Color.White, Type.Rook);
        this.pieces[Color.White][3] = new C_Piece('A1', Color.White, Type.Rook);

        this.pieces[Color.Black][2] = new C_Piece('H8', Color.Black, Type.Rook);
        this.pieces[Color.Black][3] = new C_Piece('A8', Color.Black, Type.Rook);


        // Knights
        this.pieces[Color.White][4] = new C_Piece('G1', Color.White, Type.Knight);
        this.pieces[Color.White][5] = new C_Piece('B1', Color.White, Type.Knight);

        this.pieces[Color.Black][4] = new C_Piece('G8', Color.Black, Type.Knight);
        this.pieces[Color.Black][5] = new C_Piece('B8', Color.Black, Type.Knight);


        // Bishops
        this.pieces[Color.White][6] = new C_Piece('C1', Color.White, Type.Bishop);
        this.pieces[Color.White][7] = new C_Piece('F1', Color.White, Type.Bishop);

        this.pieces[Color.Black][6] = new C_Piece('C8', Color.Black, Type.Bishop);
        this.pieces[Color.Black][7] = new C_Piece('F8', Color.Black, Type.Bishop);

        // Pawns
        let pidx = 8;
        for (let i = 0; i < 8; i++, pidx++) {
            this.pieces[Color.White][pidx] = new C_Piece('', Color.White, Type.Pawn);
            this.pieces[Color.White][pidx].square.fromCoordinates(i, 1);

            this.pieces[Color.Black][pidx] = new C_Piece('', Color.Black, Type.Pawn);
            this.pieces[Color.Black][pidx].square.fromCoordinates(i, 6);
        }
    }

    async init() {
        this.setEventHandlers();

        await this.renderer.init();
        this.renderer.startRendering();

        this.turn = Color.White;
    }

}