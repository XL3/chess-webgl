import Renderer from "../Renderer/Renderer";

import {
    Square,
    Type,
    Color,
    Piece,
    Board,
    Augment
} from "../Chess/Piece";

import csq from "./Chess_Squares";

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
    last_advance: Square;

    constructor() {
        // Create canvas
        const main = document.querySelector('#main');
        this.canvas = main.querySelector('#glCanvas');

        this.board = new Array<Piece>(64);
        this.renderer = new Renderer(this.canvas, this.board);
        this.placePieces();

        // Add event handler
        window.onresize = () => this.renderer.resize();
        this.last_advance = null;
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

            const sq = Square.coordinatesToIndex(f, r);
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

    isLegalCastle(piece: Piece, sq: Square): boolean {
        // Not a king, any move is valid
        if (piece.type !== Type.King) return true;

        // Normal move
        const mag = this.getMoveMagnitude(piece.square, sq);
        if (mag.file < 2) return true;

        const blocking = this.getFurthestPiece(piece.square, sq);
        return blocking && blocking.type === Type.Rook;
    }

    isLegalPawnCapture(piece: Piece, sq: Square): boolean {
        if (piece.type !== Type.Pawn) return true;

        const taking = this.board[sq.idx];
        const md = this.getMoveDirection(piece.square, sq);

        // Trivial move
        if (!taking && md.file === 0) return true;

        // En peasant
        if (!taking && md.file !== 0) {
            const peasant = this.board[Square.coordinatesToIndex(sq.file, sq.rank - md.rank)];
            return !!peasant && peasant.square.compare(this.last_advance);
        }

        return !!taking;
    }

    getPinningPiece(pinned: Piece): Piece {
        const opponent = this.pieces[1 - this.renderer.turn];

        for (let type of opponent) {
            if (!type) continue;
            for (let pinning of type) {
                if (!pinning || pinning.type === Type.King) continue;
                if (this.isAlignedWithKing(pinning, pinned)) {
                    return pinning;
                }
            }
        }
        return null;
    }

    movesOutOfPin(piece: Piece, sq: Square): boolean {
        // Move is essentially valid, unless it moves out of pin
        // So we simulate making the move and see if everything works
        const pinning = this.getPinningPiece(piece);
        if (!pinning) return false;

        // Store taken piece
        const taking = this.board[sq.idx];
        this.board[sq.idx] = piece;

        const result = this.isAlignedWithKing(pinning, this.board[sq.idx]);
        // Revert move
        this.board[sq.idx] = taking;

        return result;
    }

    isStrictlyLegal(piece: Piece, sq: Square): boolean {
        const taking = this.board[sq.idx];

        // Move takes a friendly piece
        if (taking && taking.color === this.renderer.turn) return false;

        // Path is blocked
        if (this.isBlocked(piece, piece.square, sq)) return false;

        // Is not a legal castle
        if (!this.isLegalCastle(piece, sq)) return false;

        // Is not a legal pawn capture
        if (!this.isLegalPawnCapture(piece, sq)) return false;

        // Piece is pinned
        if (this.movesOutOfPin(piece, sq)) return false;
        return true;
    }

    makeCastleMove(piece: Piece, sq: Square) {
        const mag = this.getMoveMagnitude(piece.square, sq);

        // Trivial king move
        if (mag.file < 2) return; 

        const rook = this.getFurthestPiece(piece.square, sq);
        const md = this.getMoveDirection(piece.square, sq);

        let rook_sq = new Square;
        rook_sq.fromCoordinates(piece.square.file + md.file, piece.square.rank);
        this.movePiece(rook, rook_sq);
    }

    takeEnPeasant(piece: Piece, sq: Square) {
        const md = this.getMoveDirection(piece.square, sq);
        const id = Square.coordinatesToIndex(sq.file, sq.rank - md.rank);

        // Trivial pawn move
        if (md.file === 0) return;

        if (this.renderer.turn === Color.White && sq.rank === 5 || this.renderer.turn === Color.Black && sq.rank === 1) {
            const taking = this.board[id];
            if (taking.square.compare(this.last_advance)) {
                this.board[id] = null;
            }
        }
    }

    movePiece(piece: Piece, to_sq: Square) {
        const key = piece.square.idx;
        piece.square = to_sq;

        this.board[key] = null;
        this.board[to_sq.idx] = piece;
    }

    getAllLegalMoves(): Square[] {
        const hp = this.renderer.held_piece;

        const legal: Array<Square> = [];

        for (let file = 0; file < 8; file++) {
            for (let rank = 0; rank < 8; rank++) {
                const sq = new Square;
                sq.fromCoordinates(file, rank);

                // No move
                if (sq.compare(hp.square)) continue;

                if (hp.isPseudoLegal(sq) && this.isStrictlyLegal(hp, sq)) {
                    legal.push(sq);
                }
            }
        }
        return legal;
    }

    makeMoveIfLegal(sq: Square) {
        const hp = this.renderer.held_piece;

        // If a piece is held and a non-trivial move was made
        if (hp && !sq.compare(hp.square)) {
            if (hp.isPseudoLegal(sq) && this.isStrictlyLegal(hp, sq)) {
                if (hp.type === Type.King) {
                    this.makeCastleMove(hp, sq);
                }

                if (hp.type === Type.Pawn) {
                    this.takeEnPeasant(hp, sq);
                    this.last_advance = sq;
                } else {
                    this.last_advance = null;
                }

                this.movePiece(hp, sq);
                setTimeout(() => this.renderer.turn = 1 - this.renderer.turn, 225);
            }
        }

        this.renderer.augments = [];
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
                    const piece = this.board[sq.idx];

                    if (piece && piece.color === this.renderer.turn) {
                        this.renderer.held_piece = piece;
                        this.renderer.held_at.x = ev.offsetX;
                        this.renderer.held_at.y = ev.offsetY;

                        const legal = this.getAllLegalMoves();
                        this.renderer.augments = legal.map(move => ({
                            file: move.file,
                            rank: move.rank,
                            augment: this.board[move.idx] ? Augment.outline: Augment.dot
                        }));
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
        const cti = Square.coordinatesToIndex;

        // Kings and Queens
        this.board[csq.e1] = new Piece('e1', Color.White, Type.King);
        this.board[csq.d1] = new Piece('d1', Color.White, Type.Queen);

        this.board[csq.e8] = new Piece('e8', Color.Black, Type.King);
        this.board[csq.d8] = new Piece('d8', Color.Black, Type.Queen);


        // Rooks
        this.board[csq.h1] = new Piece('h1', Color.White, Type.Rook);
        this.board[csq.a1] = new Piece('a1', Color.White, Type.Rook);

        this.board[csq.h8] = new Piece('h8', Color.Black, Type.Rook);
        this.board[csq.a8] = new Piece('a8', Color.Black, Type.Rook);


        // Knights
        this.board[csq.g1] = new Piece('g1', Color.White, Type.Knight);
        this.board[csq.b1] = new Piece('b1', Color.White, Type.Knight);

        this.board[csq.g8] = new Piece('g8', Color.Black, Type.Knight);
        this.board[csq.b8] = new Piece('b8', Color.Black, Type.Knight);


        // Bishops
        this.board[csq.c1] = new Piece('c1', Color.White, Type.Bishop);
        this.board[csq.f1] = new Piece('f1', Color.White, Type.Bishop);

        this.board[csq.c8] = new Piece('c8', Color.Black, Type.Bishop);
        this.board[csq.f8] = new Piece('f8', Color.Black, Type.Bishop);

        // Pawns
        for (let i = 0; i < 8; i++) {
            let sq = Square.coordinatesToString(i, 1);
            this.board[cti(i, 1)] = new Piece(sq, Color.White, Type.Pawn);

            sq = Square.coordinatesToString(i, 6);
            this.board[cti(i, 6)] = new Piece(sq, Color.Black, Type.Pawn);
        }

        this.pieces = [new Array<Piece[]>(Type.COUNT), new Array<Piece[]>(Type.COUNT)];
        this.pieces[Color.White][Type.Queen] = [this.board[csq.d1]];
        this.pieces[Color.Black][Type.Queen] = [this.board[csq.d8]];

        this.pieces[Color.White][Type.King] = [this.board[csq.e1]]
        this.pieces[Color.Black][Type.King] = [this.board[csq.e8]];

        this.pieces[Color.White][Type.Rook] = [this.board[csq.a1], this.board[csq.h1]];
        this.pieces[Color.Black][Type.Rook] = [this.board[csq.a8], this.board[csq.h8]];

        this.pieces[Color.White][Type.Bishop] = [this.board[csq.c1], this.board[csq.f1]];
        this.pieces[Color.Black][Type.Bishop] = [this.board[csq.c8], this.board[csq.f8]];
    }

    async init() {
        this.setEventHandlers();

        await this.renderer.init();

        this.renderer.turn = Color.White;
        this.renderer.startRendering();
    }

}