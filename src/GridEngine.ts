export class Cell {
	x: number;
	y: number;
	value: number | null;
	metadata: Record<string, any>;

	constructor(x: number, y: number, value: number | null = null) {
		this.x = x;
		this.y = y;
		this.value = value;
		this.metadata = {};
	}
}

export interface Topology {
	initializeCells(width: number, height: number, options?: any): Cell[];
	getNeighbors(
		cell: Cell,
		cells: Cell[],
		width: number,
		height: number
	): Cell[];
}

export class Board {
	topology: Topology;
	cells: Cell[];
	width: number;
	height: number;

	constructor(
		topology: Topology,
		width: number,
		height: number,
		options?: any
	) {
		this.topology = topology;
		this.width = width;
		this.height = height;
		this.cells = topology.initializeCells(width, height, options);
	}

	getCell(x: number, y: number): Cell | undefined {
		return this.cells.find((cell) => cell.x === x && cell.y === y);
	}
}
