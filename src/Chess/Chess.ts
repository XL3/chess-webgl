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

export default class Chess {
    renderer: Renderer;
    canvas: HTMLCanvasElement;

    pieces: Piece[][][];
    board: Board;
    just_advanced: Square;
    legal: Square[];
    king_has_moved: boolean[];

    constructor() {
        // Create canvas
        const main = document.querySelector('#main');
        this.canvas = main.querySelector('#glCanvas');

        this.board = new Array<Piece>(64);
        this.renderer = new Renderer(this.canvas, this.board);

        this.just_advanced = null;
        this.king_has_moved = [false, false];
        this.pieces = [new Array<Piece[]>(Type.COUNT), new Array<Piece[]>(Type.COUNT)];
    }

    get king() {
        return this.pieces[this.renderer.turn][Type.King][0];
    }

    getMoveDirection(from_sq: Square, to_sq: Square): Move {
        let file = to_sq.file - from_sq.file;
        file /= file != 0 ? Math.abs(file) : 1;
        let rank = to_sq.rank - from_sq.rank;
        rank /= rank != 0 ? Math.abs(rank) : 1;
        return { file, rank };
    }

    getMoveMagnitude(from_sq: Square, to_sq: Square): Move {
        let file = to_sq.file - from_sq.file;
        let rank = to_sq.rank - from_sq.rank;
        return { file: Math.abs(file), rank: Math.abs(rank) };
    }

    getBlockingPiece(from_sq: Square, to_sq: Square, md: Move): Piece {
        let f: number, r: number;
        const cti = Square.coordinatesToIndex;

        for (f = from_sq.file + md.file, r = from_sq.rank + md.rank;
            f != to_sq.file || r != to_sq.rank;
            f += md.file, r += md.rank) {

            if (this.board[cti(f, r)]) {
                return this.board[cti(f, r)];
            }
        }
        return this.board[cti(f, r)];
    }

    getRookInDirection(piece: Piece, sq: Square): Piece {
        // Check each rook
        const [long, short] = this.pieces[piece.color][Type.Rook];
        const { file: short_file } = this.getMoveDirection(piece.square, short.square);
        const { file } = this.getMoveDirection(piece.square, sq);
        return short_file == file ? short : long;
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

    isBlocked(piece: Piece, from_sq: Square, to_sq: Square): Piece {
        if (!piece) return null;
        let md = this.getMoveDirection(from_sq, to_sq);

        switch (piece.type) {
            case Type.Queen:
            case Type.Pawn:
                return this.getBlockingPiece(from_sq, to_sq, md);

            case Type.Rook:
                // Lateral move
                if (md.file * md.rank == 0) return this.getBlockingPiece(from_sq, to_sq, md);
                return null;

            case Type.Bishop:
                // Diagonal move
                if (md.file * md.rank != 0) return this.getBlockingPiece(from_sq, to_sq, md);
                return null;

            default:
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

        const single_advance_b = this.renderer.turn == Color.Black && sq.rank == 2;
        const single_advance_w = this.renderer.turn == Color.White && sq.rank == 5;

        // En peasant
        if (!taking && md.file != 0 && (single_advance_b || single_advance_w)) {
            const i = Square.coordinatesToIndex(sq.file, sq.rank - md.rank);
            const peasant = this.board[i];
            return !!peasant && peasant.square.compare(this.just_advanced);
        }
        return !!taking;
    }

    isInCheck(piece?: Piece): boolean {
        const opponent = this.pieces[1 - this.renderer.turn];

        // Check the piece we just moved first
        if (piece && piece.isPseudoLegal(this.king.square)) {
            if (this.isStrictlyLegal(piece, this.king.square)) {
                return true;
            }
        }

        for (let type of opponent) {
            if (!type) continue;
            for (let attacking of type) {
                if (!attacking || attacking.taken || attacking == piece) continue;
                if (attacking.isPseudoLegal(this.king.square)) {
                    if (this.isStrictlyLegal(attacking, this.king.square)) {
                        return true;
                    }
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
        const replaced = this.movePiece(piece, sq);

        const in_check = this.isInCheck();

        this.movePiece(piece, old_sq);
        if (replaced) {
            this.movePiece(replaced, sq);
        }

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

        const single_advance_w = this.renderer.turn == Color.White && sq.rank == 5;
        const single_advance_b = this.renderer.turn == Color.Black && sq.rank == 2;

        if (single_advance_w || single_advance_b) {
            const i = Square.coordinatesToIndex(sq.file, sq.rank - md.rank);
            const taking = this.board[i];
            if (taking && taking.square.compare(this.just_advanced)) {
                this.board[i] = null;
            }
        }
    }

    makeMoveIfLegal(piece: Piece, sq: Square) {
        // If a piece is held and a non-trivial move was made
        if (!piece || sq.compare(piece.square)) return;

        // If a legal move was made
        if (!this.legal.find(s => sq.compare(s))) return;

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
        setTimeout(() => this.verifyCheck(piece), 225);
    }

    verifyCheck(piece: Piece) {
        this.renderer.turn = 1 - this.renderer.turn;
        const player = this.pieces[this.renderer.turn];

        if (this.isInCheck(piece)) {
            const has_moves = player.some(type => type.some(p => this.getAllLegalMoves(p).length > 0));
            if (!has_moves) {
                const checkmate = new Event('checkmate');
                document.dispatchEvent(checkmate);
            }
        }
    }

    pickupPiece(ev: MouseEvent) {
        const sq = this.renderer.findSquare(ev.offsetX, ev.offsetY);
        const piece = this.board[sq.i];

        if (piece && piece.color == this.renderer.turn) {
            this.legal = this.getAllLegalMoves(piece);
            if (this.legal.length == 0) return;

            this.renderer.augments = this.legal.map(move => ({
                file: move.file,
                rank: move.rank,
                augment: this.board[move.i] ? Augment.outline : Augment.dot
            }));

            this.renderer.held_piece = piece;
            this.renderer.held_at.x = ev.offsetX;
            this.renderer.held_at.y = ev.offsetY;
        }
    }

    movePiece(piece: Piece, to_sq: Square): Piece {
        if (piece.square) {
            const i = piece.square.i;
            this.board[i] = null;
        }

        const replaced = this.board[to_sq.i];
        if (replaced) {
            replaced.taken = true;
        }

        this.board[to_sq.i] = piece;
        piece.square = to_sq;
        piece.taken = false;
        return replaced;
    }

    dropPiece() {
        this.renderer.augments = [];
        this.legal = [];
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

    setEventHandlers() {
        this.renderer.held_piece = undefined;
        this.renderer.held_at = { x: 0, y: 0 };

        this.canvas.oncontextmenu = (ev: MouseEvent) => ev.preventDefault();

        this.canvas.onmousedown = (ev: MouseEvent) => {
            switch (ev.button) {
                case MouseEvent_Button.main:
                    this.pickupPiece(ev);
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

        window.onresize = () => this.renderer.resize();

        document.addEventListener('checkmate', () => {
            alert('Checkmate!');
        });
    }
    async init() {
        this.placePieces();
        this.setEventHandlers();

        await this.renderer.init();
        this.renderer.turn = Color.White;
        this.renderer.startRendering();
    }

}