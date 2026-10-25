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

const CONNECTIONS = {
    "━": ["left", "right"],
    "┃": ["up", "down"],
    "┏": ["right", "down"],
    "┓": ["left", "down"],
    "┗": ["up", "right"],
    "┛": ["up", "left"],
    "⚡": ["left", "right", "up", "down"],
    "💡": ["left", "right", "up", "down"]
};

function getBoardSize() {

    if (level <= 5) return 5;
    if (level <= 10) return 6;
    if (level <= 20) return 8;
    if (level <= 30) return 10;
    if (level <= 50) return 15;

    return 25;
}

function randomTile() {

    const tiles = [
        "━",
        "┃",
        "┏",
        "┓",
        "┗",
        "┛"
    ];

    return tiles[
        Math.floor(Math.random() * tiles.length)
    ];
}

function scrambleTile(tile) {

    const rotateMap = {
        "━": "┃",
        "┃": "━",
        "┏": "┓",
        "┓": "┛",
        "┛": "┗",
        "┗": "┏"
    };

    let result = tile;

    const turns =
        Math.floor(
            Math.random() * 4
        );

    for (
        let i = 0;
        i < turns;
        i++
    ) {

        result =
            rotateMap[result] ||
            result;

    }

    return result;
}

function generateLevel() {

    size = getBoardSize();

    board.style.gridTemplateColumns =
        `repeat(${size}, 50px)`;

    cells =
        new Array(size * size)
        .fill("");

    for (
        let i = 0;
        i < cells.length;
        i++
    ) {
        cells[i] = randomTile();
    }

    const sourceRow =
        Math.floor(
            Math.random() * size
        );

    const bulbRow =
        Math.floor(
            Math.random() * size
        );

    const sourceIndex =
        sourceRow * size;

    const bulbIndex =
        bulbRow * size + (size - 1);

    cells[sourceIndex] = "⚡";
    cells[bulbIndex] = "💡";

    const burntCount =
        Math.min(
            Math.floor(level / 2),
            15
        );

    let placed = 0;

    while (
        placed < burntCount
    ) {

        const index =
            Math.floor(
                Math.random() *
                cells.length
            );

        if (
            cells[index] !== "⚡" &&
            cells[index] !== "💡"
        ) {

            cells[index] = "✖";
            placed++;

        }

    }

    for (
        let i = 0;
        i < cells.length;
        i++
    ) {

        if (
            cells[i] !== "⚡" &&
            cells[i] !== "💡" &&
            cells[i] !== "✖"
        ) {

            cells[i] =
                scrambleTile(
                    cells[i]
                );

        }

    }

}

function drawBoard() {

    board.innerHTML = "";

    cells.forEach(
        (cell, index) => {

            const div =
                document.createElement(
                    "div"
                );

            div.className =
                "cell";

            div.textContent =
                cell;

            if (
                cell === "✖"
            ) {
                div.classList.add(
                    "burnt"
                );
            }

            div.addEventListener(
                "click",
                () => {

                    if (
                        !solved
                    ) {
                        rotateWire(
                            index
                        );
                    }

                }
            );

            board.appendChild(div);

        }
    );

}

function rotateWire(index) {

    const value =
        cells[index];

    if (
        value === "⚡" ||
        value === "💡" ||
        value === "✖"
    ) {
        return;
    }

    const rotation = {

        "━": "┃",
        "┃": "━",

        "┏": "┓",
        "┓": "┛",
        "┛": "┗",
        "┗": "┏"

    };

    cells[index] =
        rotation[value];

    moves++;

    movesText.textContent =
        moves;

    drawBoard();

    checkWin();

}

function opposite(dir) {

    if (dir === "up")
        return "down";

    if (dir === "down")
        return "up";

    if (dir === "left")
        return "right";

    return "left";

}

function getNeighbor(index, dir) {

    const row =
        Math.floor(index / size);

    const col =
        index % size;

    if (
        dir === "up" &&
        row > 0
    ) {
        return index - size;
    }

    if (
        dir === "down" &&
        row < size - 1
    ) {
        return index + size;
    }

    if (
        dir === "left" &&
        col > 0
    ) {
        return index - 1;
    }

    if (
        dir === "right" &&
        col < size - 1
    ) {
        return index + 1;
    }

    return -1;

}

function powerReachesBulb() {

    const sourceIndex =
        cells.indexOf("⚡");

    if (
        sourceIndex === -1
    ) {
        return false;
    }

    const visited =
        new Set();

    const stack =
        [sourceIndex];

    while (
        stack.length > 0
    ) {

        const current =
            stack.pop();

        if (
            visited.has(current)
        ) continue;

        visited.add(current);

        if (
            cells[current] === "💡"
        ) {
            return true;
        }

        if (
            cells[current] === "✖"
        ) {
            continue;
        }

        const exits =
            CONNECTIONS[
                cells[current]
            ] || [];

        exits.forEach(
            dir => {

                const next =
                    getNeighbor(
                        current,
                        dir
                    );

                if (
                    next === -1
                ) {
                    return;
                }

                if (
                    cells[next] === "✖"
                ) {
                    return;
                }

                const nextExits =
                    CONNECTIONS[
                        cells[next]
                    ] || [];

                if (
                    nextExits.includes(
                        opposite(dir)
                    )
                ) {

                    stack.push(
                        next
                    );

                }

            }
        );

    }

    return false;

}

function rewardDiamond() {

    if (
        Math.random() <
        0.05
    ) {
        diamonds++;
    }

}

function checkWin() {

    if (solved)
        return;

    if (
        powerReachesBulb()
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
            "🎉 Power Restored!";

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