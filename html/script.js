const grid = document.getElementById("grid");
const scoreDisplay = document.getElementById("score");
const restartButton = document.getElementById("restartButton");

let board = [];
let score = 0;

// Image mapping for tile values
const imageMap = {
	2: "../images/2.png",
	4: "../images/4.png",
	8: "../images/8.png",
	16: "../images/16.png",
	32: "../images/32.png",
	64: "../images/64.jpg",
	128: "../images/128.png",
	256: "../images/256.png",
	512: "../images/512.png",
	1024: "../images/1024.png",
	2048: "../images/2048.png",
};

function init() {
	board = [
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
	];
	score = 0;
	updateBoard();
	addRandomTile();
	addRandomTile();
}

function addRandomTile() {
	let emptyTiles = [];
	for (let r = 0; r < 4; r++) {
		for (let c = 0; c < 4; c++) {
			if (board[r][c] === 0) {
				emptyTiles.push({ r, c });
			}
		}
	}
	if (emptyTiles.length > 0) {
		const { r, c } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
		board[r][c] = Math.random() < 0.9 ? 2 : 4;
	}
}

function updateBoard() {
	grid.innerHTML = "";
	board.forEach((row) => {
		row.forEach((value) => {
			const cell = document.createElement("div");
			cell.classList.add("cell");
			if (value > 0) {
				cell.style.backgroundImage = `url(${imageMap[value]})`;
				cell.style.backgroundSize = "cover"; // Ensure the image covers the cell
				cell.textContent = ""; // Clear text content since we are using images
			} else {
				cell.style.backgroundImage = ""; // Clear background image for empty cells
			}
			grid.appendChild(cell);
		});
	});
	scoreDisplay.textContent = score;
}

function slide(row) {
	const newRow = row.filter((value) => value !== 0);
	for (let i = 0; i < newRow.length - 1; i++) {
		if (newRow[i] === newRow[i + 1]) {
			newRow[i] *= 2;
			score += newRow[i];
			newRow[i + 1] = 0;
		}
	}
	return newRow.filter((value) => value !== 0);
}

function move(direction) {
	let moved = false;

	if (direction === "left") {
		for (let r = 0; r < 4; r++) {
			const originalRow = [...board[r]];
			board[r] = slide(board[r]);
			while (board[r].length < 4) {
				board[r].push(0);
			}
			if (JSON.stringify(originalRow) !== JSON.stringify(board[r])) {
				moved = true;
			}
		}
	} else if (direction === "right") {
		for (let r = 0; r < 4; r++) {
			const originalRow = [...board[r]];
			board[r] = slide(board[r].reverse()).reverse();
			while (board[r].length < 4) {
				board[r].unshift(0);
			}
			if (JSON.stringify(originalRow) !== JSON.stringify(board[r])) {
				moved = true;
			}
		}
	} else if (direction === "up") {
		for (let c = 0; c < 4; c++) {
			const originalColumn = board.map((row) => row[c]);
			const newColumn = slide(originalColumn);
			for (let r = 0; r < 4; r++) {
				board[r][c] = newColumn[r] || 0;
			}
			if (JSON.stringify(originalColumn) !== JSON.stringify(newColumn)) {
				moved = true;
			}
		}
	} else if (direction === "down") {
		for (let c = 0; c < 4; c++) {
			const originalColumn = board.map((row) => row[c]);
			const newColumn = slide(originalColumn.reverse()).reverse();
			for (let r = 0; r < 4; r++) {
				board[r][c] = newColumn[r] || 0;
			}
			if (JSON.stringify(originalColumn) !== JSON.stringify(newColumn)) {
				moved = true;
			}
		}
	}

	if (moved) {
		addRandomTile();
		updateBoard();
		checkGameOver();
	}
}

function checkGameOver() {
	const isGameOver = board.flat().every((value) => value !== 0);
	if (isGameOver) {
		alert("Game Over! Your score: " + score);
		init();
	}
}

document.addEventListener("keydown", (event) => {
	if (event.key === "ArrowLeft") {
		move("left");
	} else if (event.key === "ArrowRight") {
		move("right");
	} else if (event.key === "ArrowUp") {
		move("up");
	} else if (event.key === "ArrowDown") {
		move("down");
	}
});

restartButton.addEventListener("click", init);

// Initialize the game
init();
