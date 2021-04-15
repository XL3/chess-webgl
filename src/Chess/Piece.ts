enum Color {
  Black,
  White,
}

enum Type {
  King,
  Queen,
  Bishop,
  Knight,
  Rook,
  Pawn,
}

class Position {
  rank: number;
  file: number;
}

export default interface Piece {
  position: Position;
  color: Color,
  type: Type
}