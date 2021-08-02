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
}

export interface Piece {
  square: Square;
  color: Color;
  type: Type;

  can_move(Square): boolean;
}


export class King implements Piece {
  square: Square;
  color: Color;
  type: Type;

  constructor(square: Square, color: Color) {
    this.square = square;
    this.color = color;
    this.type = Type.King;
  }

  can_move(square: Square): boolean {
    return true;
  }
}