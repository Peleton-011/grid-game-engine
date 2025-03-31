// Sudoku.ts
import { Board, Cell } from "../GridEngine";
import { RectangularTopology } from "../Topology";
import { RuleSet } from "../RulesEngine";
import {
	backtrackingSolver,
	randomBacktrackingSolver,
	solutionChecker,
} from "../Solver";

/**
 * Helper function to assign a region id to each cell.
 * Standard Sudoku regions (3x3 blocks) are defined by:
 * region = Math.floor(x / 3) + Math.floor(y / 3) * 3.
 */
function assignRegions(board: Board): void {
	board.cells.forEach((cell) => {
		const region = Math.floor(cell.x / 3) + Math.floor(cell.y / 3) * 3;
		cell.metadata.region = region;
	});
}

/**
 * SudokuRuleSet extends the base RuleSet to enforce:
 * - Unique numbers in each row, column, and 3x3 region.
 */
export class SudokuRuleSet extends RuleSet {
	validateMove(board: Board, cell: Cell, value: number): boolean {
		// Row check: same y coordinate.
		const rowCells = board.cells.filter(
			(c) => c.y === cell.y && c !== cell
		);
		if (rowCells.some((c) => c.value === value)) return false;

		// Column check: same x coordinate.
		const colCells = board.cells.filter(
			(c) => c.x === cell.x && c !== cell
		);
		if (colCells.some((c) => c.value === value)) return false;

		// Region check: using metadata.region.
		const region = cell.metadata.region;
		const regionCells = board.cells.filter(
			(c) => c.metadata.region === region && c !== cell
		);
		if (regionCells.some((c) => c.value === value)) return false;

		return true;
	}

	checkWin(board: Board): boolean {
		// Ensure no cell is empty.
		if (!board.cells.every((cell) => cell.value !== null)) return false;

		// Validate rows.
		for (let y = 0; y < board.height; y++) {
			const row = board.cells.filter((c) => c.y === y);
			const values = row.map((c) => c.value);
			if (new Set(values).size !== 9) return false;
		}

		// Validate columns.
		for (let x = 0; x < board.width; x++) {
			const col = board.cells.filter((c) => c.x === x);
			const values = col.map((c) => c.value);
			if (new Set(values).size !== 9) return false;
		}

		// Validate 3x3 regions.
		for (let region = 0; region < 9; region++) {
			const regionCells = board.cells.filter(
				(c) => c.metadata.region === region
			);
			const values = regionCells.map((c) => c.value);
			if (new Set(values).size !== 9) return false;
		}

		return true;
	}
}

/**
 * Utility function to pretty-print the board.
 */
export function printBoard(board: Board): void {
	for (let y = 0; y < board.height; y++) {
		let row = "";
		for (let x = 0; x < board.width; x++) {
			const cell = board.getCell(x, y);
			row += (cell?.value ?? ".") + " ";
			if ((x + 1) % 3 === 0 && x < board.width - 1) row += "| ";
		}
		console.log(row);
		if ((y + 1) % 3 === 0 && y < board.height - 1) {
			console.log("---------------------");
		}
	}
}

/**
 * Function to create a Sudoku board.
 * If an initial puzzle (9x9 array with null/0 for empty) is provided,
 * it is loaded into the board.
 */
export function createSudokuBoard(initialPuzzle?: (number | null)[][]): Board {
	const topology = new RectangularTopology();
	const board = new Board(topology, 9, 9);
	assignRegions(board);

	if (initialPuzzle) {
		for (let y = 0; y < 9; y++) {
			for (let x = 0; x < 9; x++) {
				const value = initialPuzzle[y][x];
				const cell = board.getCell(x, y);
				if (cell) {
					cell.value = value && value !== 0 ? value : null;
				}
			}
		}
	}
	return board;
}

export function fullSudokuBoard(): Board {
	const board = createSudokuBoard();
	const sudokuRules = new SudokuRuleSet();

	randomBacktrackingSolver(board, sudokuRules, 9);
	return board;
}

export function carveBoard(board: Board): {board: Board, voids: number[]} {
	const sudokuRules = new SudokuRuleSet();

	printBoard(board);

    const voids = []
	//For each cell in the board
	console.log(board.cells.length);
	for (let i = 0; i < board.cells.length; i++) {
		const newCells = board.cells.map((c, index) =>
			i === index ? { ...c, value: null } : { ...c }
		);

		if (
			solutionChecker(
				new Board(board.topology, board.width, board.height, {
					cells: newCells,
				}),
				sudokuRules,
				9
			).multipleSolutions
		) {
			continue; //If there are multiple solutions, try again
		}
		voids.push(i);
	}
	return {board, voids};
}

export function generateRandomPuzzle(): Board {
	const board = fullSudokuBoard();

	const carvedBoard = carveBoard(board);

    console.log(carvedBoard.voids);
    return carvedBoard.board;
}

/**
 * Example usage: Solve a sample Sudoku puzzle.
 */
export function runSudokuExample(): void {
	// A sample puzzle (0 or null indicates empty)
	const samplePuzzle: (number | null)[][] = [
		[5, 3, null, null, 7, null, null, null, null],
		[6, null, null, 1, 9, 5, null, null, null],
		[null, 9, 8, null, null, null, null, 6, null],
		[8, null, null, null, 6, null, null, null, 3],
		[4, null, null, 8, null, 3, null, null, 1],
		[7, null, null, null, 2, null, null, null, 6],
		[null, 6, null, null, null, null, 2, 8, null],
		[null, null, null, 4, 1, 9, null, null, 5],
		[null, null, null, null, 8, null, null, 7, 9],
	];

	const board = createSudokuBoard(samplePuzzle);
	const sudokuRules = new SudokuRuleSet();

	console.log("Initial Puzzle:");
	printBoard(board);

	// IMPORTANT: Use maxValue=9 for Sudoku.
	if (backtrackingSolver(board, sudokuRules, 9)) {
		console.log("\nSolved Puzzle:");
		printBoard(board);
		if (sudokuRules.checkWin(board)) {
			console.log("\nPuzzle solved correctly!");
		} else {
			console.error("\nSolution does not satisfy Sudoku constraints.");
		}
	} else {
		console.error("No solution found for the given puzzle.");
	}
}

export function runRandomSudoku(): void {
	const board = createSudokuBoard();
	const sudokuRules = new SudokuRuleSet();

	console.log("Unsolved Sudoku:");
	printBoard(board);

	if (randomBacktrackingSolver(board, sudokuRules, 9)) {
		console.log("Solved Sudoku:");
		printBoard(board);
	} else {
		console.error("No solution found for the given puzzle.");
	}
}

// Run the example if executed directly.
if (require.main === module) {
	runSudokuExample();
}
