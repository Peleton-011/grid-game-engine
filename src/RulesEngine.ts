import { Board } from "./GridEngine";

export class RuleSet {
  /**
   * validateMove is intended to check whether placing the given value in the cell
   * is valid according to the rule set.
   * Default implementation always returns true.
   */
  validateMove(board: Board, cell: any, value: number): boolean {
    return true;
  }

  /**
   * checkWin should return true if the board is in a winning state.
   * Default implementation considers a board won if all cells are non-null.
   */
  checkWin(board: Board): boolean {
    return board.cells.every(cell => cell.value !== null);
  }
}