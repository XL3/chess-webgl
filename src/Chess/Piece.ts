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

export class Square {
  file: number;
  rank: number;

  constructor(square: string = '') {
    if (square === '') {
      square = 'A1';
    }
    this.fromString(square);
  }

  fromCoordinates(file: number, rank: number) {
    this.file = file;
    this.rank = rank;
  }

  fromString(square: string) {
    this.file = square[0].charCodeAt(0) - 'A'.charCodeAt(0);
    this.rank = square[1].charCodeAt(0) - '1'.charCodeAt(0);
  }

  toString(): string {
    let file = 'A'.charCodeAt(0) + this.file;
    let rank = 1 + this.rank;
    return `${String.fromCharCode(file)}${rank}`;
  }
}

export interface Piece {
  square: Square;
  color: Color;
  type: Type;

  can_move(Square): boolean;
}

export class C_Piece implements Piece {
  square: Square;
  color: Color;
  type: Type;

  constructor(square: string, color: Color, type: Type) {
    this.square = new Square(square);
    this.color = color;
    this.type = type;
  }

  can_move(square: Square): boolean {
    return true;
  }

  toString(): string {
    return `[${this.square}] ${Color[this.color]} ${Type[this.type]}`;
  }
}