const board = document.getElementById("game-board");
const statusText = document.getElementById("status");
const levelText = document.getElementById("level");
const movesText = document.getElementById("moves");
const coinsText = document.getElementById("coins");
const nextLevelBtn = document.getElementById("nextLevelBtn");

let level = Number(localStorage.getItem("sparkLevel")) || 1;
let coins = Number(localStorage.getItem("sparkCoins")) || 0;
let diamonds = Number(localStorage.getItem("sparkDiamonds")) || 0;

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

function randomWire() {

    const list = [
        "━",
        "┃",
        "┏",
        "┓",
        "┗",
        "┛"
    ];

    return list[
        Math.floor(
            Math.random() * list.length
        )
    ];
}

function generateLevel() {

    size = getBoardSize();

    board.style.gridTemplateColumns =
        `repeat(${size}, 50px)`;

    cells = [];

    for (let i = 0; i < size * size; i++) {
        cells.push(randomWire());
    }

    cells[0] = "⚡";
    cells[cells.length - 1] = "💡";

    const burntCount =
        Math.min(
            Math.floor(level / 2),
            size * 2
        );

    for (let i = 0; i < burntCount; i++) {

        const index =
            Math.floor(
                Math.random() * cells.length
            );

        if (
            cells[index] !== "⚡" &&
            cells[index] !== "💡"
        ) {

            cells[index] = "✖";

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
        );

        board.appendChild(div);

    });

}

function rotateWire(index) {

    const value = cells[index];

    if (
        value === "⚡" ||
        value === "💡" ||
        value === "✖"
    ) {
        return;
    }

    const rotations = {

        "━": "┃",
        "┃": "┏",
        "┏": "┓",
        "┓": "┛",
        "┛": "┗",
        "┗": "━"

    };

    cells[index] =
        rotations[value];

    moves++;

    movesText.textContent = moves;

    drawBoard();

    checkWin();
}

function rewardDiamond() {

    const chance = Math.random();

    if (chance < 0.05) {

        diamonds++;

        localStorage.setItem(
            "sparkDiamonds",
            diamonds
        );

        statusText.textContent +=
            " 💎 Bonus Diamond!";
    }
}

function checkWin() {

    const targetMoves =
        Math.floor(
            (size * size) / 2
        );

    if (
        moves >= targetMoves &&
        !solved
    ) {

        solved = true;

        document
            .querySelectorAll(".cell")
            .forEach(cell => {

                if (
                    cell.textContent === "💡"
                ) {

                    cell.classList.add(
                        "bulb-on"
                    );

                }

            });

        coins += 10;

        if (
            level % 10 === 0
        ) {

            diamonds++;

        }

        rewardDiamond();

        localStorage.setItem(
            "sparkCoins",
            coins
        );

        localStorage.setItem(
            "sparkDiamonds",
            diamonds
        );

        coinsText.textContent =
            `${coins} 💎 ${diamonds}`;

        statusText.textContent =
            "🎉 Level Complete!";

        nextLevelBtn.style.display =
            "inline-block";

    }
}

function loadLevel() {

    solved = false;
    moves = 0;

    generateLevel();

    levelText.textContent =
        level;

    movesText.textContent =
        moves;

    coinsText.textContent =
        `${coins} 💎 ${diamonds}`;

    statusText.textContent =
        "Restore power to the bulb!";

    nextLevelBtn.style.display =
        "none";

    drawBoard();

}

nextLevelBtn.addEventListener(
    "click",
    () => {

        level++;

        localStorage.setItem(
            "sparkLevel",
            level
        );

        loadLevel();

    }
);

loadLevel();