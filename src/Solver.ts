import { Board } from "./GridEngine";
import { RuleSet } from "./RulesEngine";

/**
 * A simple backtracking solver that attempts to fill the board.
 * It iterates over all cells that are null and assigns values from 1 to board.cells.length.
 * If a move is valid according to the provided ruleSet, it recurses until completion.
 */
export function backtrackingSolver(board: Board, ruleSet: RuleSet): boolean {
  function solveRecursive(): boolean {
    const emptyCell = board.cells.find(c => c.value === null);
    if (!emptyCell) return true; // Board is complete

    // Try possible values from 1 to board.cells.length (as an upper bound)
    for (let val = 1; val <= board.cells.length; val++) {
      if (ruleSet.validateMove(board, emptyCell, val)) {
        emptyCell.value = val;
        if (solveRecursive()) return true;
        emptyCell.value = null;
      }
    }
    return false;
  }
  return solveRecursive();
}
