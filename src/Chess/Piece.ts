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
  rank: number;
  file: number;

  constructor(rank: number = 0, file: number = 0) {
    this.rank = rank;
    this.file = file;
  }

  public toString(): string {
    let rank = 1 + this.rank;
    let file = 'A'.charCodeAt(0) + this.file;
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

  constructor(square: Square, color: Color, type: Type) {
    this.square = square;
    this.color = color;
    this.type = type;
  }

  can_move(square: Square): boolean {
    return true;
  }
}