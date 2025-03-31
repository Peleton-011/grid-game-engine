import { Cell, Topology } from "./GridEngine";

export class RectangularTopology implements Topology {
  initializeCells(width: number, height: number, options?: any): Cell[] {
    const cells: Cell[] = [];
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        cells.push(new Cell(x, y));
      }
    }
    return cells;
  }

  getNeighbors(cell: Cell, cells: Cell[], width: number, height: number): Cell[] {
    const directions = [
      { dx: 0, dy: -1 }, // up
      { dx: 1, dy: 0 },  // right
      { dx: 0, dy: 1 },  // down
      { dx: -1, dy: 0 }  // left
    ];
    const neighbors: Cell[] = [];
    for (const { dx, dy } of directions) {
      const neighbor = cells.find(c => c.x === cell.x + dx && c.y === cell.y + dy);
      if (neighbor) {
        neighbors.push(neighbor);
      }
    }
    return neighbors;
  }
}