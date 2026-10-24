const board = document.getElementById("game-board");
const statusText = document.getElementById("status");
const levelText = document.getElementById("level");
const movesText = document.getElementById("moves");
const coinsText = document.getElementById("coins");
const nextLevelBtn = document.getElementById("nextLevelBtn");

let level = 1;
let moves = 0;
let coins = 0;
let solved = false;

let size = 5;
let cells = [];

function getBoardSize() {

    if (level <= 5) return 5;
    if (level <= 15) return 6;
    if (level <= 30) return 7;
    if (level <= 50) return 8;
    if (level <= 80) return 9;

    return 10;

}

function randomWire() {

    const wires = [
        "━",
        "┃",
        "┏",
        "┓",
        "┗",
        "┛"
    ];

    return wires[
        Math.floor(
            Math.random() * wires.length
        )
    ];

}

function generateLevel() {

    size = getBoardSize();

    board.style.gridTemplateColumns =
        `repeat(${size}, 60px)`;

    cells = [];

    for (let i = 0; i < size * size; i++) {

        cells.push(
            randomWire()
        );

    }

    cells[0] = "⚡";

    cells[cells.length - 1] = "💡";

    const burntCount =
        Math.min(
            Math.floor(level / 2),
            12
        );

    for (let i = 0; i < burntCount; i++) {

        const randomIndex =
            Math.floor(
                Math.random() * cells.length
            );

        if (
            cells[randomIndex] !== "⚡" &&
            cells[randomIndex] !== "💡"
        ) {

            cells[randomIndex] = "✖";

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

        if (cell === "✖") {
            div.classList.add("burnt");
        }

        div.addEventListener(
            "click",
            () => {

                if (!solved) {
                    rotateWire(index);
                }

            }
        