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

type Move = {
    file: number,
    rank: number
};

type Square_Compare = (f: number, r: number, ff: number, rf: number) => boolean;

export default class Chess {
    renderer: Renderer;
    canvas: HTMLCanvasElement;

    pieces: Piece[][][];
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

    getMoveDirection(from_sq: Square, to_sq: Square): Move {
        let file = to_sq.file - from_sq.file;
        file /= file !== 0 ? Math.abs(file) : 1;
        let rank = to_sq.rank - from_sq.rank;
        rank /= rank !== 0 ? Math.abs(rank) : 1;
        return { file, rank };
    }

    getMoveMagnitude(from_sq: Square, to_sq: Square): Move {
        let file = to_sq.file - from_sq.file;
        let rank = to_sq.rank - from_sq.rank;
        return { file: Math.abs(file), rank: Math.abs(rank) };
    }

    getBlockingPiece(from_sq: Square, to_sq: Square, md: Move, cmp: Square_Compare): Piece {
        for (let f = from_sq.file + md.file, r = from_sq.rank + md.rank;
            cmp(f, r, to_sq.file, to_sq.rank);
            f += md.file, r += md.rank) {

            const sq = Square.coordinatesToString(f, r);
            if (this.board[sq]) {
                return this.board[sq];
            };
        }
        return null;
    }

    isBlockedDiagonally(from_sq: Square, to_sq: Square): Piece {
        let md = this.getMoveDirection(from_sq, to_sq);

        // Not diagonally aligned
        if (md.file * md.rank === 0) return null;

        const comparator = (f: number, r: number, ff: number, rf: number) => f !== ff && r !== rf;
        return this.getBlockingPiece(from_sq, to_sq, md, comparator);
    }

    isBlockedLaterally(from_sq: Square, to_sq: Square): Piece {
        let md = this.getMoveDirection(from_sq, to_sq);

        // Not laterally aligned
        if (md.file * md.rank !== 0) return null;

        const comparator = (f: number, r: number, ff: number, rf: number) => f !== ff || r !== rf;
        return this.getBlockingPiece(from_sq, to_sq, md, comparator);
    }

    isBlocked(piece: Piece, from_sq: Square, to_sq: Square): Piece {
        switch (piece.type) {
            case Type.Queen:
            case Type.King:
                return this.isBlockedLaterally(from_sq, to_sq) || this.isBlockedDiagonally(from_sq, to_sq);

            case Type.Rook:
            case Type.Pawn:
                return this.isBlockedLaterally(from_sq, to_sq);

            case Type.Bishop:
                return this.isBlockedDiagonally(from_sq, to_sq);

            default: return null;
        }
    }

    isAlignedWithKing(attacking: Piece, pinned: Piece): boolean {
        const king = this.pieces[this.renderer.turn][Type.King][0];
        return this.isBlocked(attacking, attacking.square, king.square) == pinned;
    }

    getFurthestPiece(from_sq: Square, to_sq: Square): Piece {
        // Beyond the board
        const md = this.getMoveDirection(from_sq, to_sq);
        let beyond = new Square;
        beyond.file = to_sq.file + 9 * md.file;
        beyond.rank = to_sq.rank + 9 * md.rank;

        return this.isBlocked(this.renderer.held_piece, from_sq, beyond);
    }

    isLegalCastle(sq: Square): boolean {
        const hp = this.renderer.held_piece;

        // Not a king, any move is valid
        if (hp.type !== Type.King) return true;

        // Normal move
        const mag = this.getMoveMagnitude(hp.square, sq);
        if (mag.file < 2) return true;

        const blocking = this.getFurthestPiece(hp.square, sq);
        return blocking && blocking.type === Type.Rook;
    }

    isLegalPawnCapture(sq: Square): boolean {
        const hp = this.renderer.held_piece;
        if (hp.type !== Type.Pawn) return true;

        const taking = this.board[`${sq}`];
        const md = this.getMoveDirection(hp.square, sq);
        return !!taking || !taking && md.file === 0;
    }

    getPinningPiece(pinned: Piece): Piece {
        const opponent = this.pieces[1 - this.renderer.turn];

        for (let type of opponent) {
            if (!type) continue;
            for (let piece of type) {
                if (piece && this.isAlignedWithKing(piece, pinned)) {
                    return piece;
                }
            }
        }
        return null;
    }

    isStrictlyLegal(sq: Square): boolean {
        const hp = this.renderer.held_piece;
        const taking = this.board[`${sq}`];

        // Move takes a friendly piece
        if (taking && taking.color === this.renderer.turn) return false;

        // Path is blocked
        if (this.isBlocked(hp, hp.square, sq)) return false;

        if (!!this.getPinningPiece(hp)) return false;

        // Is not a legal castle
        if (!this.isLegalCastle(sq)) return false;

        // Is not a legal pawn capture
        if (!this.isLegalPawnCapture(sq)) return false;

        return true;
    }

    makeCastleMove(sq: Square) {
        const hp = this.renderer.held_piece;
        const mag = this.getMoveMagnitude(hp.square, sq);

        // Trivial king move
        if (mag.file < 2) {
            return;
        }

        const rook = this.getFurthestPiece(hp.square, sq);
        const md = this.getMoveDirection(hp.square, sq);

        let rook_sq = new Square;
        rook_sq.fromCoordinates(hp.square.file + md.file, hp.square.rank);
        this.movePiece(rook, rook_sq);
    }

    movePiece(piece: Piece, to_sq: Square) {
        const key = `${piece.square}`;
        piece.square = to_sq;

        this.board[key] = null;
        this.board[`${to_sq}`] = piece;
    }

    makeMoveIfLegal(sq: Square) {
        const hp = this.renderer.held_piece;

        // If a piece is held and a non-trivial move was made
        if (this.renderer.held_piece && !sq.compare(hp.square)) {
            if (hp.isPseudoLegal(sq) && this.isStrictlyLegal(sq)) {
                if (hp.type === Type.King) {
                    this.makeCastleMove(sq);
                }

                this.movePiece(hp, sq);
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
            this.makeMoveIfLegal(sq);
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

        this.pieces = [new Array<Piece[]>(Type.COUNT), new Array<Piece[]>(Type.COUNT)];
        this.pieces[Color.White][Type.Queen] = [this.board['d1']];
        this.pieces[Color.Black][Type.Queen] = [this.board['d8']];

        this.pieces[Color.White][Type.King] = [this.board['e1']]
        this.pieces[Color.Black][Type.King] = [this.board['e8']];

        this.pieces[Color.White][Type.Rook] = [this.board['a1'], this.board['h1']];
        this.pieces[Color.Black][Type.Rook] = [this.board['a8'], this.board['h8']];

        this.pieces[Color.White][Type.Bishop] = [this.board['c1'], this.board['f1']];
        this.pieces[Color.Black][Type.Bishop] = [this.board['c8'], this.board['f8']];
    }

    async init() {
        this.setEventHandlers();

        await this.renderer.init();

        this.renderer.turn = Color.White;
        this.renderer.startRendering();
    }

}