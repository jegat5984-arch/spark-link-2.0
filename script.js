const board = document.getElementById("game-board");
const statusText = document.getElementById("status");
const levelText = document.getElementById("level");
const movesText = document.getElementById("moves");
const coinsText = document.getElementById("coins");
const nextLevelBtn = document.getElementById("nextLevelBtn");

let level = 1;
let coins = 0;
let diamonds = 0;
let moves = 0;
let solved = false;

let size = 5;
let cells = [];

function getBoardSize() {
    if (level <= 5) return 5;
    if (level <= 10) return 6;
    if (level <= 20) return 8;
    if (level <= 30) return 10;
    if (level <= 50) return 15;
    return 25;
}

function generateLevel() {

    size = getBoardSize();

    board.style.gridTemplateColumns =
        `repeat(${size}, 50px)`;

    cells = new Array(size * size).fill("");

    cells[0] = "⚡";

    for (let c = 1; c < size - 1; c++) {
        cells[c] = "━";
    }

    cells[size - 1] = "┓";

    for (let r = 1; r < size - 1; r++) {
        cells[r * size + (size - 1)] = "┃";
    }

    cells[cells.length - 1] = "💡";

    const extras = [
        "━", "┃", "┏", "┓", "┗", "┛"
    ];

    for (let i = 0; i < cells.length; i++) {

        if (cells[i] === "") {

            cells[i] =
                extras[
                    Math.floor(
                        Math.random() *
                        extras.length
                    )
                ];

        }

    }
}

function drawBoard() {

    board.innerHTML = "";

    cells.forEach((cell, index) => {

        const div =
            document.createElement("div");

        div.className = "cell";
        div.textContent = cell;

        div.addEventListener("click", () => {

            if (!solved) {
                rotateWire(index);
            }

        });

        board.appendChild(div);

    });

}

function rotateWire(index) {

    const value = cells[index];

    if (
        value === "⚡" ||
        value === "💡"
    ) {
        return;
    }

    const rotations = {

        "━": "┃",
        "┃": "━",

        "┏": "┓",
        "┓": "┛",
        "┛": "┗",
        "┗": "┏"

    };

    cells[index] = rotations[value];

    moves++;

    movesText.textContent = moves;

    drawBoard();
}

function loadLevel() {

    solved = false;
    moves = 0;

    generateLevel();

    levelText.textContent = level;
    movesText.textContent = moves;
    coinsText.textContent =
        `${coins} 💎 ${diamonds}`;

    drawBoard();
}

loadLevel();