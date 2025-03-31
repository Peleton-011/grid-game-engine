import { Board } from "./GridEngine";
import { RectangularTopology } from "./Topology";
import { RuleSet } from "./RulesEngine";
import { backtrackingSolver } from "./Solver";

import {
	runRandomSudoku,
	runSudokuExample,
	createSudokuBoard,
	printBoard,
    generateRandomPuzzle,
} from "./Games/Sudoku";

try {
	const sudokuBoard = generateRandomPuzzle();
    printBoard(sudokuBoard);
	console.log("Sudoku board solved:");
} catch (err) {
	console.error(err);
}

/*
// Define a simple rule set that allows any value (for demonstration)
class SimpleRuleSet extends RuleSet {
  validateMove(board: Board, cell: any, value: number): boolean {
    return true; // No restrictions in this example
  }
}

// Initialize a 3x3 board with rectangular topology
const topology = new RectangularTopology();
const board = new Board(topology, 3, 3);

// Instantiate the rule set
const ruleSet = new SimpleRuleSet();

// Solve the board using backtracking
const solved = backtrackingSolver(board, ruleSet);

console.log("Solved:", solved);
console.log("Final Board State:");
console.log(board.cells.map(cell => `[${cell.x},${cell.y}]: ${cell.value}`).join("\n"));
*/
