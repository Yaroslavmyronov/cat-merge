import { BoardCell, BoardResponse } from '@/lib/types/board';

export interface BoardState extends Omit<BoardResponse, 'cells'> {
  cells: (BoardCell | null)[];
}

export function normalize(data: BoardResponse): BoardState {
  return {
    ...data,
    cells: [...data.cells]
      .sort((a, b) => a.index - b.index)
      .map((c) => (c.unitLevel > 0 ? c : null)),
  };
}
