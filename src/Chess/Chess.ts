import Renderer from "../Renderer/Renderer";

import {
    Square,
    Type,
    Color,
    Piece,
    Board,
    Augment
} from "./Piece";

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
    just_advanced: Square;
    king_has_moved: boolean[];
    in_check: boolean;

    constructor() {
        // Create canvas
        const main = document.querySelector('#main');
        this.canvas = main.querySelector('#glCanvas');

        this.board = new Array<Piece>(64);
        this.renderer = new Renderer(this.canvas, this.board);
        this.placePieces();

        // Add event handler
        window.onresize = () => this.renderer.resize();
        this.just_advanced = null;
        this.king_has_moved = [false, false];
    }

    get king() {
        return this.pieces[this.renderer.turn][Type.King][0];
    }

    getMoveDirection(from_sq: Square, to_sq: Square): Move {
        let file = to_sq.file - from_sq.file;
        file /= file != 0 ? Math.abs(file) : 1;
        let rank = to_sq.rank - from_sq.rank;
        rank /= rank != 0 ? Math.abs(rank) : 1;
        return {file, rank};
    }

    getMoveMagnitude(from_sq: Square, to_sq: Square): Move {
        let file = to_sq.file - from_sq.file;
        let rank = to_sq.rank - from_sq.rank;
        return {file: Math.abs(file), rank: Math.abs(rank)};
    }

    getBlockingPiece(from_sq: Square, to_sq: Square, md: Move, cmp: Square_Compare): Piece {
        let f: number, r: number;
        const cti = Square.coordinatesToIndex;

        for (f = from_sq.file + md.file, r = from_sq.rank + md.rank;
             cmp(f, r, to_sq.file, to_sq.rank);
             f += md.file, r += md.rank) {

            if (this.board[cti(f, r)]) {
                return this.board[cti(f, r)];
            }
        }
        return this.board[cti(f, r)];
    }

    isBlockedDiagonally(from_sq: Square, to_sq: Square): Piece {
        let md = this.getMoveDirection(from_sq, to_sq);

        // Not diagonally aligned
        if (md.file * md.rank == 0) return null;

        // @todo Clean this up
        const comparator = (f: number, r: number, ff: number, rf: number) => f != ff || r != rf;
        return this.getBlockingPiece(from_sq, to_sq, md, comparator);
    }

    isBlockedLaterally(from_sq: Square, to_sq: Square): Piece {
        let md = this.getMoveDirection(from_sq, to_sq);

        // Not laterally aligned
        if (md.file * md.rank != 0) return null;

        const comparator = (f: number, r: number, ff: number, rf: number) => f != ff || r != rf;
        return this.getBlockingPiece(from_sq, to_sq, md, comparator);
    }

    isBlocked(piece: Piece, from_sq: Square, to_sq: Square): Piece {
        if (!piece) return null;
        switch (piece.type) {
            case Type.Queen:
                return this.isBlockedLaterally(from_sq, to_sq) || this.isBlockedDiagonally(from_sq, to_sq);

            case Type.Rook:
                return this.isBlockedLaterally(from_sq, to_sq);

            case Type.Bishop:
                return this.isBlockedDiagonally(from_sq, to_sq);

            default:
                // @note Pawns just move forwards
                return this.board[to_sq.i];
        }
    }

    isLegalCastle(piece: Piece, sq: Square): boolean {
        // Not a king, any move is valid
        if (piece.type != Type.King) return true;

        // Normal move
        const mag = this.getMoveMagnitude(piece.square, sq);
        if (mag.file < 2) return true;

        // King has previously moved
        if (this.king_has_moved[piece.color]) return false;

        const rook = this.getRookInDirection(piece, sq);
        const king = this.isBlocked(rook, rook.square, piece.square);
        return king && king == piece;
    }

    isLegalPawnCapture(piece: Piece, sq: Square): boolean {
        if (piece.type != Type.Pawn) return true;

        const taking = this.board[sq.i];
        const md = this.getMoveDirection(piece.square, sq);

        // Pawns cannot capture forwards
        if (taking && md.file == 0) return false;

        // Trivial move
        if (!taking && md.file == 0) return true;

        // En peasant
        if (!taking && md.file != 0) {
            const peasant = this.board[Square.coordinatesToIndex(sq.file, sq.rank - md.rank)];
            return !!peasant && peasant.square.compare(this.just_advanced);
        }
        return !!taking;
    }

    isInCheck(): boolean {
        const opponent = this.pieces[1 - this.renderer.turn];

        for (let type of opponent) {
            if (!type) continue;
            for (let attacking of type) {
                if (!attacking) continue;
                if (!attacking.isPseudoLegal(this.king.square)) continue;
                if (this.isStrictlyLegal(attacking, this.king.square)) {
                    return true;
                }
            }
        }
        return false;
    }

    putsKingInCheck(piece: Piece, sq: Square): boolean {
        // Move is essentially valid, unless it steps into check
        // by moving a pinned piece or moving the king into a state where he's checked
        // So we simulate making the move and see if everything works
        const old_sq = piece.square;
        this.board[old_sq.i] = null;

        const temp = this.board[sq.i];
        this.board[sq.i] = piece;
        piece.square = sq;

        const in_check = this.isInCheck();

        this.board[old_sq.i] = piece;
        piece.square = old_sq;
        this.board[sq.i] = temp;
        return in_check;
    }

    isStrictlyLegal(piece: Piece, sq: Square): boolean {
        const taking = this.board[sq.i];

        // Move takes a friendly piece
        if (taking && taking.color == piece.color) return false;

        // Path is blocked
        if (this.isBlocked(piece, piece.square, sq) != taking) return false;

        // Is not a legal castle
        if (!this.isLegalCastle(piece, sq)) return false;

        // Is not a legal pawn capture
        if (!this.isLegalPawnCapture(piece, sq)) return false;

        // Puts king into check
        return !this.putsKingInCheck(piece, sq);
    }

    getRookInDirection(piece: Piece, sq: Square): Piece {
        // Check each rook
        const [long, short] = this.pieces[piece.color][Type.Rook];
        const {file: short_file} = this.getMoveDirection(piece.square, short.square);
        const {file} = this.getMoveDirection(piece.square, sq);
        return short_file == file ? short : long;
    }

    makeCastleMove(piece: Piece, sq: Square) {
        const mag = this.getMoveMagnitude(piece.square, sq);

        // Trivial king move
        if (mag.file < 2) return;

        const rook = this.getRookInDirection(piece, sq);
        const md = this.getMoveDirection(piece.square, sq);

        let rook_sq = new Square;
        rook_sq.fromCoordinates(piece.square.file + md.file, piece.square.rank);
        this.movePiece(rook, rook_sq);
    }

    takeEnPeasant(piece: Piece, sq: Square) {
        const md = this.getMoveDirection(piece.square, sq);

        // Trivial pawn move
        if (md.file == 0) return;

        if (this.renderer.turn == Color.White && sq.rank == 5 || this.renderer.turn == Color.Black && sq.rank == 1) {
            const i = Square.coordinatesToIndex(sq.file, sq.rank - md.rank);
            const taking = this.board[i];
            if (taking && taking.square.compare(this.just_advanced)) {
                this.board[i] = null;
            }
        }
    }

    movePiece(piece: Piece, to_sq: Square) {
        const key = piece.square.i;
        piece.square = to_sq;

        this.board[key] = null;
        this.board[to_sq.i] = piece;
    }

    getAllLegalMoves(piece: Piece): Square[] {
        const legal: Array<Square> = [];

        for (let file = 0; file < 8; file++) {
            for (let rank = 0; rank < 8; rank++) {
                const sq = new Square;
                sq.fromCoordinates(file, rank);

                // Trivial move
                if (sq.compare(piece.square)) continue;

                // Pseudo-legal
                if (!piece.isPseudoLegal(sq)) continue;

                if (this.isStrictlyLegal(piece, sq)) {
                    legal.push(sq);
                }
            }
        }
        return legal;
    }

    makeMoveIfLegal(piece: Piece, sq: Square) {
        // If a piece is held and a non-trivial move was made
        if (!piece || sq.compare(piece.square)) return;

        // If a legal move was made
        if (!piece.isPseudoLegal(sq) || !this.isStrictlyLegal(piece, sq)) return;

        if (piece.type == Type.King) {
            this.makeCastleMove(piece, sq);
            this.king_has_moved[this.renderer.turn] = true;
        }

        if (piece.type == Type.Pawn) {
            this.takeEnPeasant(piece, sq);
            this.just_advanced = sq;
        } else {
            this.just_advanced = null;
        }

        this.movePiece(piece, sq);
        setTimeout(() => this.verifyCheck(), 225);
    }

    verifyCheck() {
        this.renderer.turn = 1 - this.renderer.turn;
        const player = this.pieces[this.renderer.turn];

        this.in_check = this.isInCheck();
        if (this.in_check) {
            const has_moves = player.some(type => type.some(p => this.getAllLegalMoves(p).length > 0));
            if (!has_moves) {
                const checkmate = new Event('checkmate');
                document.dispatchEvent(checkmate);
            }
        }
    }


    setEventHandlers() {
        this.renderer.held_piece = undefined;
        this.renderer.held_at = {x: 0, y: 0};

        this.canvas.oncontextmenu = (ev: MouseEvent) => ev.preventDefault();

        this.canvas.onmousedown = (ev: MouseEvent) => {
            switch (ev.button) {
                case MouseEvent_Button.main:
                    const sq = this.renderer.findSquare(ev.offsetX, ev.offsetY);
                    const piece = this.board[sq.i];

                    if (piece && piece.color == this.renderer.turn) {
                        const legal = this.getAllLegalMoves(piece);
                        if (!legal.length) return;

                        this.renderer.augments = legal.map(move => ({
                            file: move.file,
                            rank: move.rank,
                            augment: this.board[move.i] ? Augment.outline : Augment.dot
                        }));

                        this.renderer.held_piece = piece;
                        this.renderer.held_at.x = ev.offsetX;
                        this.renderer.held_at.y = ev.offsetY;
                    }
                    break;

                case MouseEvent_Button.secondary:
                    this.dropPiece();
                    break;

                default:
                    break;
            }
        }
        this.canvas.onmousemove = (ev: MouseEvent) => {
            // Holding
            if (this.renderer.held_piece) {
                this.renderer.held_at.x = ev.offsetX;
                this.renderer.held_at.y = ev.offsetY;
            }
        }
        this.canvas.onmouseout = (_: MouseEvent) => {
            this.dropPiece();
        }

        this.canvas.onmouseup = (ev: MouseEvent) => {
            const hp = this.renderer.held_piece;
            if (!hp) return;

            const sq = this.renderer.findSquare(ev.offsetX, ev.offsetY);
            this.makeMoveIfLegal(hp, sq);
            this.dropPiece();
        }
    }

    dropPiece() {
        this.renderer.augments = [];
        this.renderer.held_piece = undefined;
    };

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

        this.pieces = [new Array<Piece[]>(Type.COUNT), new Array<Piece[]>(Type.COUNT)];
        this.pieces[Color.White][Type.Pawn] = [];
        this.pieces[Color.Black][Type.Pawn] = [];

        // Pawns
        for (let i = 0; i < 8; i++) {
            let sq = Square.coordinatesToString(i, 1);
            this.board[cti(i, 1)] = new Piece(sq, Color.White, Type.Pawn);
            this.pieces[Color.White][Type.Pawn].push(this.board[cti(i, 1)]);

            sq = Square.coordinatesToString(i, 6);
            this.board[cti(i, 6)] = new Piece(sq, Color.Black, Type.Pawn);
            this.pieces[Color.Black][Type.Pawn].push(this.board[cti(i, 6)]);
        }

        this.pieces[Color.White][Type.Queen] = [this.board[csq.d1]];
        this.pieces[Color.Black][Type.Queen] = [this.board[csq.d8]];

        this.pieces[Color.White][Type.King] = [this.board[csq.e1]]
        this.pieces[Color.Black][Type.King] = [this.board[csq.e8]];

        this.pieces[Color.White][Type.Rook] = [this.board[csq.a1], this.board[csq.h1]];
        this.pieces[Color.Black][Type.Rook] = [this.board[csq.a8], this.board[csq.h8]];

        this.pieces[Color.White][Type.Bishop] = [this.board[csq.c1], this.board[csq.f1]];
        this.pieces[Color.Black][Type.Bishop] = [this.board[csq.c8], this.board[csq.f8]];

        this.pieces[Color.White][Type.Knight] = [this.board[csq.b1], this.board[csq.g1]];
        this.pieces[Color.Black][Type.Knight] = [this.board[csq.b8], this.board[csq.g8]];
    }

    async init() {
        this.setEventHandlers();

        await this.renderer.init();

        this.renderer.turn = Color.White;
        this.renderer.startRendering();
    }

}