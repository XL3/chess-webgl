import Renderer from "../Renderer/Renderer";

import {
    Square,
    Type,
    Color,
    Piece,
} from "../Chess/Piece";

enum MouseEvent_Button {
    main, // Left
    auxiliary, // Middle
    secondary, // Right
    fourth, // Browser back
    fifth, // Browser forward
}

export default class Chess {
    renderer: Renderer;
    canvas: HTMLCanvasElement;

    pieces: Array<Piece[]>;

    constructor() {
        // Create canvas
        const main = document.querySelector('#main');
        this.canvas = main.querySelector('#glCanvas');
        this.placePieces();

        this.renderer = new Renderer(this.canvas, this.pieces);

        // Add event handler
        window.onresize = () => this.renderer.resize();
    }


    findPiece(sq: Square): Piece {
        const comp = (piece: Piece) => sq.compare(piece.square);

        let piece: Piece = this.pieces[Color.White].find(comp)
            || this.pieces[Color.Black].find(comp);

        return piece;
    }

    // @todo Add a square to piece map to make diagonal checks easier
    isDiagonallyBlocked(piece: Piece): boolean {
        return false;
    }

    isStrictlyLegal(sq: Square, taking?: Piece): boolean {
        if (taking && taking.color === this.renderer.turn) return false;

        return true;
    }

    makeMove(sq: Square) {
        const hp = this.renderer.held_piece;
        const taking = this.findPiece(sq);

        // If a piece is held and a non-trivial move was made
        if (this.renderer.held_piece && !sq.compare(hp.square)) {
            if (hp.isPseudoLegal(sq) && this.isStrictlyLegal(sq, taking)) {
                if (taking) this.takePiece(taking);

                hp.square = sq;
                setTimeout(() => this.renderer.turn = 1 - this.renderer.turn, 225);
            }
        }

        this.renderer.held_piece = undefined;
    }

    takePiece(piece: Piece) {
        // Same instance
        const pred = p => piece == p;

        let at = this.pieces[piece.color].findIndex(pred);
        this.pieces[piece.color].splice(at, 1);
    }

    setEventHandlers() {
        this.renderer.held_piece = undefined;
        this.renderer.held_at = { x: 0, y: 0 };

        this.canvas.oncontextmenu = (ev: MouseEvent) => ev.preventDefault();

        this.canvas.onmousedown = (ev: MouseEvent) => {
            switch (ev.button) {
                case MouseEvent_Button.main:
                    const sq = this.renderer.findSquare(ev.offsetX, ev.offsetY);
                    const piece = this.findPiece(sq);
                    if (piece && piece.color === this.renderer.turn) {
                        this.renderer.held_piece = piece;
                        this.renderer.held_at.x = ev.offsetX;
                        this.renderer.held_at.y = ev.offsetY;
                    }
                    break;

                case MouseEvent_Button.secondary:
                    this.canvas.onmouseout(ev);
                    break;

                default: break;
            }
        }
        this.canvas.onmousemove = (ev: MouseEvent) => {
            // Holding
            if (this.renderer.held_piece) {
                this.renderer.held_at.x = ev.offsetX;
                this.renderer.held_at.y = ev.offsetY;
            }
        }
        this.canvas.onmouseout = (ev: MouseEvent) => {
            this.renderer.held_piece = undefined;
        }
        this.canvas.onmouseup = (ev: MouseEvent) => {
            const sq = this.renderer.findSquare(ev.offsetX, ev.offsetY);
            this.makeMove(sq);
        }
    }

    placePieces() {
        this.pieces = [new Array<Piece>(8), new Array<Piece>(8)];

        // Kings and Queens
        this.pieces[Color.White][0] = new Piece('e1', Color.White, Type.King);
        this.pieces[Color.White][1] = new Piece('d1', Color.White, Type.Queen);

        this.pieces[Color.Black][0] = new Piece('e8', Color.Black, Type.King);
        this.pieces[Color.Black][1] = new Piece('d8', Color.Black, Type.Queen);


        // Rooks
        this.pieces[Color.White][2] = new Piece('h1', Color.White, Type.Rook);
        this.pieces[Color.White][3] = new Piece('a1', Color.White, Type.Rook);

        this.pieces[Color.Black][2] = new Piece('h8', Color.Black, Type.Rook);
        this.pieces[Color.Black][3] = new Piece('a8', Color.Black, Type.Rook);


        // Knights
        this.pieces[Color.White][4] = new Piece('g1', Color.White, Type.Knight);
        this.pieces[Color.White][5] = new Piece('b1', Color.White, Type.Knight);

        this.pieces[Color.Black][4] = new Piece('g8', Color.Black, Type.Knight);
        this.pieces[Color.Black][5] = new Piece('b8', Color.Black, Type.Knight);


        // Bishops
        this.pieces[Color.White][6] = new Piece('c1', Color.White, Type.Bishop);
        this.pieces[Color.White][7] = new Piece('f1', Color.White, Type.Bishop);

        this.pieces[Color.Black][6] = new Piece('c8', Color.Black, Type.Bishop);
        this.pieces[Color.Black][7] = new Piece('f8', Color.Black, Type.Bishop);

        // Pawns
        let pidx = 8;
        for (let i = 0; i < 8; i++, pidx++) {
            this.pieces[Color.White][pidx] = new Piece('', Color.White, Type.Pawn);
            this.pieces[Color.White][pidx].square.fromCoordinates(i, 1);

            this.pieces[Color.Black][pidx] = new Piece('', Color.Black, Type.Pawn);
            this.pieces[Color.Black][pidx].square.fromCoordinates(i, 6);
        }
    }

    async init() {
        this.setEventHandlers();

        await this.renderer.init();
        this.renderer.startRendering();

        this.renderer.turn = Color.White;
    }

}