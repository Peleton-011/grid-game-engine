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

		console.log(values);
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
