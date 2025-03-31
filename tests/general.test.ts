
import { Board, Cell } from "../src/GridEngine";
import { RectangularTopology } from "../src/Topology";
import { RuleSet } from "../src/RulesEngine";
import { backtrackingSolver } from "../src/Solver";

// A dummy RuleSet for testing purposes that always allows a move.
class DummyRuleSet extends RuleSet {
  validateMove(board: Board, cell: Cell, value: number): boolean {
    // Always valid for testing purposes.
    return true;
  }
  checkWin(board: Board): boolean {
    // For testing, win if no cell is null.
    return board.cells.every(cell => cell.value !== null);
  }
}

describe("Grid Engine Tests", () => {
  test("Board should initialize with the correct number of cells", () => {
    const topology = new RectangularTopology();
    const width = 4;
    const height = 3;
    const board = new Board(topology, width, height);
    expect(board.cells.length).toBe(width * height);
  });

  test("getCell should return the correct cell based on coordinates", () => {
    const topology = new RectangularTopology();
    const board = new Board(topology, 3, 3);
    const cell = board.getCell(1, 1);
    expect(cell).toBeDefined();
    if (cell) {
      expect(cell.x).toBe(1);
      expect(cell.y).toBe(1);
    }
  });

  test("Each cell should be an instance of Cell", () => {
    const topology = new RectangularTopology();
    const board = new Board(topology, 2, 2);
    board.cells.forEach(cell => {
      expect(cell).toBeInstanceOf(Cell);
    });
  });
});

describe("Topology Tests", () => {
  test("RectangularTopology should initialize cells with proper coordinates", () => {
    const topology = new RectangularTopology();
    const width = 3;
    const height = 2;
    const board = new Board(topology, width, height);
    
    board.cells.forEach(cell => {
      expect(cell.x).toBeGreaterThanOrEqual(0);
      expect(cell.x).toBeLessThan(width);
      expect(cell.y).toBeGreaterThanOrEqual(0);
      expect(cell.y).toBeLessThan(height);
    });
  });

  test("getNeighbors should return valid neighbors for a center cell in a rectangular grid", () => {
    const topology = new RectangularTopology();
    const width = 3;
    const height = 3;
    const board = new Board(topology, width, height);
    
    // Get the center cell (1,1)
    const centerCell = board.getCell(1, 1);
    expect(centerCell).toBeDefined();
    if (!centerCell) return;
    
    const neighbors = topology.getNeighbors(centerCell, board.cells, width, height);
    
    // In a rectangular grid, center cell should have 4 neighbors (up, down, left, right)
    expect(neighbors.length).toBe(4);
    neighbors.forEach(neighbor => {
      const dx = Math.abs(neighbor.x - centerCell.x);
      const dy = Math.abs(neighbor.y - centerCell.y);
      expect((dx === 1 && dy === 0) || (dx === 0 && dy === 1)).toBeTruthy();
    });
  });

  // TODO: Add tests for other topologies (e.g., hexagonal grids, irregular grids) once implemented.
});

describe("Rules Engine Tests", () => {
  test("Default RuleSet checkWin returns false when board has null cells", () => {
    const topology = new RectangularTopology();
    const board = new Board(topology, 3, 3);
    const ruleSet = new DummyRuleSet();
    expect(ruleSet.checkWin(board)).toBe(false);
  });

  test("Default RuleSet checkWin returns true when board is complete", () => {
    const topology = new RectangularTopology();
    const board = new Board(topology, 3, 3);
    board.cells.forEach(cell => cell.value = 1);
    const ruleSet = new DummyRuleSet();
    expect(ruleSet.checkWin(board)).toBe(true);
  });

  test("validateMove should allow any move in DummyRuleSet", () => {
    const topology = new RectangularTopology();
    const board = new Board(topology, 3, 3);
    const cell = board.getCell(0, 0);
    const ruleSet = new DummyRuleSet();
    expect(cell).toBeDefined();
    if (cell) {
      expect(ruleSet.validateMove(board, cell, 5)).toBe(true);
    }
  });

  // TODO: Create tests for custom rule sets (like SudokuRuleSet) to ensure proper constraint enforcement.
});

describe("Solver Tests", () => {
  test("backtrackingSolver should solve a trivial complete board", () => {
    const topology = new RectangularTopology();
    const board = new Board(topology, 2, 2);
    board.cells.forEach(cell => cell.value = 1);
    const ruleSet = new DummyRuleSet();
    const solved = backtrackingSolver(board, ruleSet);
    expect(solved).toBe(true);
  });

  test("backtrackingSolver should fill an empty board using DummyRuleSet", () => {
    const topology = new RectangularTopology();
    const board = new Board(topology, 2, 2);
    board.cells.forEach(cell => cell.value = null);
    const ruleSet = new DummyRuleSet();
    const solved = backtrackingSolver(board, ruleSet);
    expect(solved).toBe(true);
    board.cells.forEach(cell => {
      expect(cell.value).not.toBeNull();
    });
  });

  // TODO: Add tests to check solver behavior with a rule set that restricts moves,
  // ensuring that the algorithm backtracks correctly and does not settle for an invalid board.
});

describe("Integration Tests", () => {
  test("Integration: Complete a board with custom SudokuRuleSet", () => {
    // A simplified custom Sudoku rule set for testing
    class SudokuRuleSet extends RuleSet {
      validateMove(board: Board, cell: Cell, value: number): boolean {
        // Check row uniqueness for simplicity.
        const rowCells = board.cells.filter(c => c.y === cell.y);
        return !rowCells.some(c => c.value === value);
      }
      checkWin(board: Board): boolean {
        // Check that no cell is null and that each row has unique values.
        for (const cell of board.cells) {
          if (cell.value === null) return false;
          const rowCells = board.cells.filter(c => c.y === cell.y);
          const values = rowCells.map(c => c.value);
          if (new Set(values).size !== rowCells.length) return false;
        }
        return true;
      }
    }
    
    const topology = new RectangularTopology();
    const board = new Board(topology, 3, 3);
    // Pre-fill some cells to simulate a partially complete board.
    board.cells[0].value = 1;
    board.cells[1].value = 2;
    board.cells[2].value = 3;
    const sudokuRules = new SudokuRuleSet();
    
    const solved = backtrackingSolver(board, sudokuRules);
    expect(solved).toBe(true);
    expect(sudokuRules.checkWin(board)).toBe(true);
  });
  
  // TODO: Consider integration tests for the puzzle generator (once implemented) and UI interactions.
});

describe("Logging and Debugging (Optional)", () => {
  test("Verbose mode should output logs (if implemented)", () => {
    // If a verbose logging feature is implemented, add tests to verify log outputs.
    expect(true).toBe(true);
  });
});

// Additional improvement points and missing test coverage:
// 1. Other Topologies: Tests for hexagonal and irregular grids when implemented.
// 2. Edge Cases: Test boards with irregular sizes (e.g., 1xN, Nx1) for neighbor calculation correctness.
// 3. Performance Benchmarks: Assess solver performance on larger boards.
// 4. UI Components: Integration tests simulating user interactions when UI modules are added.
// 5. Error Handling: Ensure invalid moves or configurations are handled gracefully.
// 6. Puzzle Generator: Once implemented, ensure generated puzzles have unique solutions and correct difficulty.
