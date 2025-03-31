import { Board } from "./GridEngine";
import { RuleSet } from "./RulesEngine";

/**
 * A simple backtracking solver that attempts to fill the board.
 * It iterates over all cells that are null and assigns values from 1 to board.cells.length.
 * If a move is valid according to the provided ruleSet, it recurses until completion.
 */
export function backtrackingSolver(
	board: Board,
	ruleSet: RuleSet,
	maxValue?: number,
	options?: any
): boolean {
	const max = maxValue || board.cells.length;
	function solveRecursive(options?: any): boolean {
		const emptyCell = board.cells.find((c) => c.value === null);
		if (!emptyCell) return true; // Board is complete

		// Try possible values from 1 to board.cells.length (as an upper bound)
		for (let val = 1; val <= max; val++) {
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

export function randomBacktrackingSolver(
	board: Board,
	ruleSet: RuleSet,
	maxValue?: number,
	options?: any
): boolean {
	const max = maxValue || board.cells.length;
	function solveRecursive(options?: any): boolean {
		const emptyCell = board.cells.find((c) => c.value === null);
		if (!emptyCell) return true; // Board is complete

		// Try possible values from 1 to board.cells.length (as an upper bound)
		const values = Array.from({ length: max }, (_, i) => i + 1);
		values.sort(() => Math.random() - 0.5);

		for (const val of values) {
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

// Helper functions and such vv

export interface SolverResult {
  solutionFound: boolean;
  multipleSolutions: boolean;
}

/**
 * A backtracking solver that attempts to fill the board.
 * It recurses over empty cells, trying values from 1 to maxValue.
 * If more than one complete solution is found, it sets multipleSolutions to true.
 *
 * @param board The board to solve.
 * @param ruleSet The rule set to validate moves.
 * @param maxValue The maximum allowed value (defaults to board.cells.length if not provided).
 * @param options Optional extra options (currently unused).
 * @returns An object indicating if a solution was found and if multiple solutions exist.
 */
export function solutionChecker(
  board: Board,
  ruleSet: RuleSet,
  maxValue?: number,
  options?: any
): SolverResult {
  const max = maxValue || board.cells.length;
  const cellValues = Array.from({ length: max }, (_, i) => i + 1);
  let solutionCount = 0;

  /**
   * Internal recursive function.
   * Returns true immediately if a second solution is found (to abort further searching).
   */
  function solveRecursive(): boolean {
    const emptyCell = board.cells.find((c) => c.value === null);
    if (!emptyCell) {
      // Board is complete – we've found a solution.
      solutionCount++;
      // If more than one solution is found, we can stop further searching.
      return solutionCount >= 2;
    }

    for (const val of cellValues) {
      if (ruleSet.validateMove(board, emptyCell, val)) {
        emptyCell.value = val;
        // If a branch finds a second solution, bubble up the signal.
        if (solveRecursive()) {
          return true;
        }
        // Backtrack.
        emptyCell.value = null;
      }
    }
    return false;
  }

  // Begin recursive solving.
  solveRecursive();

  return {
    solutionFound: solutionCount > 0,
    multipleSolutions: solutionCount > 1,
  };
}
