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

export enum Square_Augment {
    blank,
    dot,
    outline,
}

export class Square {
    file: number;
    rank: number;
    augment: Square_Augment;

    constructor(square: string = '') {
        if (square === '') {
            square = 'a1';
        }
        this.augment = Square_Augment.blank;
        this.fromString(square);
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
        let file = 'A'.charCodeAt(0) + this.file;
        let rank = 1 + this.rank;
        return `${String.fromCharCode(file)}${rank}`;
    }

    compare(sq: Square): boolean {
        return this.file === sq.file && this.rank === sq.rank;
    }

    coincideLaterally(sq: Square): boolean {
        let coin = false;

        coin = coin || this.file === sq.file;
        coin = coin || this.rank === sq.rank;
        return coin;
    }

    coincideDiagonally(sq: Square): boolean {
        const main_diagonal = (sq: Square): Number => Math.abs(this.rank - this.file);
        const sec_diagonal = (sq: Square): Number => this.rank + this.file;

        let coin = false;

        coin = coin || main_diagonal(this) === main_diagonal(sq);
        coin = coin || sec_diagonal(this) === sec_diagonal(sq);
        return coin;
    }
}

export class Piece {
    square: Square;
    color: Color;
    type: Type;

    constructor(square: string, color: Color, type: Type) {
        this.square = new Square(square);
        this.color = color;
        this.type = type;
    }

    canMovePseudoLegal(sq: Square): boolean {
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
        if (df(sq) <= 1 && Math.abs(this.square.rank - sq.rank) <= 1)
            return true;

        // White
        // On first rank
        if (this.color === Color.White && this.square.rank === 0) {
            if (df(sq) === 2)
                return true;
        }

        // Black
        // On eighth rank
        if (this.color === Color.Black && this.square.rank === 7) {
            if (df(sq) === 2)
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
            coin = coin && (sq.file - this.square.file) === dfile[i];
            
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
        let coin = false;
        // White pawns advance forward in ranks
        let direction = this.color === Color.White ? 1 : -1;
        let starting = this.color === Color.White ? 1 : 6;

        // Initial advance
        coin = coin || (this.square.rank === starting && sq.rank === starting + 2 * direction);
        coin = coin 
            || ((sq.rank - this.square.rank === direction) 
                && (Math.abs(sq.file - this.square.file) <= 1));

        // Other advances
        return coin;
    }

    toString(): string {
        return `[${this.square}] ${Color[this.color]} ${Type[this.type]}`;
    }
}