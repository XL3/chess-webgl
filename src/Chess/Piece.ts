export enum Color {
    White,
    Black,
}

export enum Type {
    King,
    Queen,
    Bishop,
    Knight,
    Rook,
    Pawn,
    COUNT,
}

export enum Augment {
    blank,
    dot,
    outline,
}

export type Augment_Square = {
    file: number,
    rank: number,
    augment: Augment
}

export class Square {
    file: number;
    rank: number;

    get i() {
        return Square.coordinatesToIndex(this.file, this.rank);
    }

    constructor(square: string = '') {
        if (square == '') {
            square = 'a1';
        }
        this.fromString(square);
    }

    static coordinatesToString(file: number, rank: number): string {
        let f = 'a'.charCodeAt(0) + file;
        let r = 1 + rank;
        return `${String.fromCharCode(f)}${r}`;
    }

    static stringToIndex(square: string): number {
        let file = square[0].charCodeAt(0) - 'a'.charCodeAt(0);
        let rank = square[1].charCodeAt(0) - '1'.charCodeAt(0);

        return Square.coordinatesToIndex(file, rank);
    }

    static coordinatesToIndex(file: number, rank: number): number {
        return file * 8 + rank;
    }

    fromCoordinates(file: number, rank: number) {
        this.file = file;
        this.rank = rank;
    }

    fromString(square: string) {
        this.file = square[0].charCodeAt(0) - 'a'.charCodeAt(0);
        this.rank = square[1].charCodeAt(0) - '1'.charCodeAt(0);
    }

    toString(): string {
        return Square.coordinatesToString(this.file, this.rank);
    }

    compare(sq: Square): boolean {
        if (!sq) return false;
        return this.file == sq.file && this.rank == sq.rank;
    }

    coincideLaterally(sq: Square): boolean {
        let coin = false;

        coin = coin || this.file == sq.file;
        coin = coin || this.rank == sq.rank;
        return coin;
    }

    static mainDiagonal(sq: Square): number {
        return sq.rank - sq.file;
    }

    static secDiagonal(sq: Square): number {
        return sq.rank + sq.file;
    }

    coincideDiagonally(sq: Square): boolean {
        let coin = false;

        coin = coin || Square.mainDiagonal(this) == Square.mainDiagonal(sq);
        coin = coin || Square.secDiagonal(this) == Square.secDiagonal(sq);
        return coin;
    }
}

export class Piece {
    square: Square;
    color: Color;
    type: Type;
    taken: boolean;

    constructor(square: string, color: Color, type: Type) {
        this.square = new Square(square);
        this.color = color;
        this.type = type;
        this.taken = false;
    }

    isPseudoLegal(sq: Square): boolean {
        switch (this.type) {
            case Type.King:
                return this.processKing(sq);
            case Type.Queen:
                return this.processQueen(sq);
            case Type.Knight:
                return this.processKnight(sq);
            case Type.Bishop:
                return this.processBishop(sq);
            case Type.Rook:
                return this.processRook(sq);
            case Type.Pawn:
                return this.processPawn(sq);
            default: break;
        }

        return false;
    }

    processKing(sq: Square): boolean {
        const df = (sq: Square) => Math.abs(this.square.file - sq.file);
        const dr = (sq: Square) => Math.abs(this.square.rank - sq.rank);
        if (dr(sq) > 1) return false;

        if (df(sq) <= 1)
            return true;

        // White
        // On first rank
        if (this.color == Color.White && this.square.rank == 0) {
            if (df(sq) == 2)
                return true;
        }

        // Black
        // On eighth rank
        if (this.color == Color.Black && this.square.rank == 7) {
            if (df(sq) == 2)
                return true;
        }

        return false;
    }

    processQueen(sq: Square): boolean {
        return this.square.coincideDiagonally(sq) || this.square.coincideLaterally(sq);
    }

    processKnight(sq: Square): boolean {
        const drank = [1, 2, 2, 1, -1, -2, -2, -1];
        const dfile = [2, 1, -1, -2, -2, -1, 1, 2];

        let coin = false;

        for (let i = 0; i < drank.length; i++) {
            coin = (sq.rank - this.square.rank) == drank[i];
            coin = coin && (sq.file - this.square.file) == dfile[i];

            if (coin) return true;
        }
        return false;
    }
    processBishop(sq: Square): boolean {
        return this.square.coincideDiagonally(sq);
    }
    processRook(sq: Square): boolean {
        return this.square.coincideLaterally(sq);
    }
    processPawn(sq: Square): boolean {
        // White pawns advance forward in ranks
        let direction = this.color == Color.White ? 1 : -1;
        let starting = this.color == Color.White ? 1 : 6;

        const isStartingAdvance = (sq: Square) => this.square.rank == starting && sq.rank == starting + 2 * direction;
        const isNormalAdvance = (sq: Square) => sq.rank - this.square.rank == direction;

        const isLegal = (sq: Square) => Math.abs(sq.file - this.square.file) <= 1;
        const isCapture = (sq: Square) => Math.abs(sq.file - this.square.file) == 1;

        let coin = false;
        coin = coin || isStartingAdvance(sq) && !isCapture(sq);
        coin = coin || isNormalAdvance(sq);

        // Other advances
        return coin && isLegal(sq);
    }

    toString(): string {
        return `[${this.square}] ${Color[this.color]} ${Type[this.type]}`;
    }
}

export type Board = Array<Piece>;