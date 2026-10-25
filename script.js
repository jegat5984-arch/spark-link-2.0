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
        Math.floor(
            Math.random() * tiles.length
        )
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

    const count =
        Math.floor(
            Math.random() * 4
        );

    let result = tile;

    for (let i = 0; i < count; i++) {

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

    // SOURCE

    cells[0] = "⚡";

    // TOP ROW PATH

    for (let c = 1; c < size - 1; c++) {

        cells[c] = "━";

    }

    // TOP RIGHT CORNER

    cells[size - 1] = "┓";

    // RIGHT WALL DOWN

    for (
        let r = 1;
        r < size - 1;
        r++
    ) {

        cells[
            (r * size)
            + (size - 1)
        ] = "┃";

    }

    // BULB

    cells[
        cells.length - 1
    ] = "💡";

    // RANDOM FILL

    for (
        let i = 0;
        i < cells.length;
        i++
    ) {

        if (
            cells[i] === ""
        ) {

            cells[i] =
                randomTile();

        }

    }

    // SAFE PATH

    const safe =
        new Set();

    for (
        let c = 0;
        c < size;
        c++
    ) {

        safe.add(c);

    }

    for (
        let r = 0;
        r < size;
        r++
    ) {

        safe.add(
            r * size
            + (size - 1)
        );

    }

    // BURNT WIRES

    const burntCount =
        Math.min(
            Math.floor(level / 2),
            15
        );

    let placed = 0;

    while (
        placed < burntCount
    ) {

        const randomIndex =
            Math.floor(
                Math.random() *
                cells.length
            );

        if (
            !safe.has(
                randomIndex
            ) &&
            cells[randomIndex] !==
                "⚡" &&
            cells[randomIndex] !==
                "💡"
        ) {

            cells[randomIndex] =
                "✖";

            placed++;

        }

    }

    // SCRAMBLE EVERYTHING
    // except source bulb burnt

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

            board.appendChild(
                div
            );

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

}

function rewardDiamond() {

    if (
        Math.random() <
        0.05
    ) {

        diamonds++;

    }

}

function checkSolvedPath() {

    const lastColumn =
        size - 1;

    for (
        let c = 1;
        c < size - 1;
        c++
    ) {

        if (
            cells[c] !==
            "━"
        ) {

            return false;

        }

    }

    if (
        cells[size - 1] !==
        "┓"
    ) {

        return false;

    }

    for (
        let r = 1;
        r < size - 1;
        r++
    ) {

        const index =
            (r * size)
            + lastColumn;

        if (
            cells[index] !==
            "┃"
        ) {

            return false;

        }

    }

    return true;

}

function checkWin() {

    if (
        solved
    ) return;

    if (
        checkSolvedPath()
    ) {

        solved = true;

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

        statusText.textContent =
            "🎉 Power Restored!";

        coinsText.textContent =
            `${coins} 💎 ${diamonds}`;

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

    const observer =
        new MutationObserver(
            checkWin
        );

    observer.observe(
        board,
        {
            childList: true,
            subtree: true
        }
    );

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