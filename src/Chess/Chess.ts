import Renderer from "../Renderer/Renderer";

import {
    Square,
    Type,
    Color,
    Piece,
    Board
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
    board: Board;

    constructor() {
        // Create canvas
        const main = document.querySelector('#main');
        this.canvas = main.querySelector('#glCanvas');

        this.board = {};
        this.renderer = new Renderer(this.canvas, this.board);

        this.placePieces();

        // Add event handler
        window.onresize = () => this.renderer.resize();
    }

    isBlocked(sq: Square): Piece {
        const from_sq = this.renderer.held_piece.square;

        let dfile = sq.file - from_sq.file;
        dfile /= Math.abs(dfile);
        let drank = sq.rank - from_sq.rank;
        drank /= Math.abs(drank);

        for (let f = from_sq.file + dfile, r = from_sq.rank + drank;
            f !== sq.file, r !== sq.rank; 
            f += dfile, r += drank) {

            console.log(f, r);
            if (this.board[Square.coordinatesToString(f, r)]) {
                return this.board[Square.coordinatesToString(f, r)];
            };
        }

        return null;
    }

    isStrictlyLegal(sq: Square): boolean {
        // Path is blocked
        if (this.isBlocked(sq)) return false;

        // Move takes a friendly piece
        const taking = this.board[`${sq}`];
        if (taking && taking.color === this.renderer.turn) return false;

        // Piece is pinned
        return true;
    }

    makeMove(sq: Square) {
        const hp = this.renderer.held_piece;

        // If a piece is held and a non-trivial move was made
        if (this.renderer.held_piece && !sq.compare(hp.square)) {
            if (hp.isPseudoLegal(sq) && this.isStrictlyLegal(sq)) {
                const key = `${hp.square}`;
                hp.square = sq;

                this.board[key] = null;
                this.board[`${sq}`] = hp;

                setTimeout(() => this.renderer.turn = 1 - this.renderer.turn, 225);
            }
        }

        this.renderer.held_piece = undefined;
    }
    setEventHandlers() {
        this.renderer.held_piece = undefined;
        this.renderer.held_at = { x: 0, y: 0 };

        this.canvas.oncontextmenu = (ev: MouseEvent) => ev.preventDefault();

        this.canvas.onmousedown = (ev: MouseEvent) => {
            switch (ev.button) {
                case MouseEvent_Button.main:
                    const sq = this.renderer.findSquare(ev.offsetX, ev.offsetY);
                    const piece = this.board[`${sq}`];

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
        // Kings and Queens
        this.board['e1'] = new Piece('e1', Color.White, Type.King);
        this.board['d1'] = new Piece('d1', Color.White, Type.Queen);

        this.board['e8'] = new Piece('e8', Color.Black, Type.King);
        this.board['d8'] = new Piece('d8', Color.Black, Type.Queen);


        // Rooks
        this.board['h1'] = new Piece('h1', Color.White, Type.Rook);
        this.board['a1'] = new Piece('a1', Color.White, Type.Rook);

        this.board['h8'] = new Piece('h8', Color.Black, Type.Rook);
        this.board['a8'] = new Piece('a8', Color.Black, Type.Rook);


        // Knights
        this.board['g1'] = new Piece('g1', Color.White, Type.Knight);
        this.board['b1'] = new Piece('b1', Color.White, Type.Knight);

        this.board['g8'] = new Piece('g8', Color.Black, Type.Knight);
        this.board['b8'] = new Piece('b8', Color.Black, Type.Knight);


        // Bishops
        this.board['c1'] = new Piece('c1', Color.White, Type.Bishop);
        this.board['f1'] = new Piece('f1', Color.White, Type.Bishop);

        this.board['c8'] = new Piece('c8', Color.Black, Type.Bishop);
        this.board['f8'] = new Piece('f8', Color.Black, Type.Bishop);

        // Pawns
        for (let i = 0; i < 8; i++) {
            let sq = Square.coordinatesToString(i, 1);
            this.board[sq] = new Piece(sq, Color.White, Type.Pawn);

            sq = Square.coordinatesToString(i, 6);
            this.board[sq] = new Piece(sq, Color.Black, Type.Pawn);
        }
    }

    async init() {
        this.setEventHandlers();

        await this.renderer.init();

        this.renderer.turn = Color.White;
        this.renderer.startRendering();
    }

}