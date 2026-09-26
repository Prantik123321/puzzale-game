// ==========================================
// MILANTI PUZZLE
// ==========================================

// Your 3 puzzle images
const levels = [
    {
        image: "https://i.postimg.cc/SR3sRYKY/Whats-App-Image-2026-09-19-at-10-12-59.jpg",
        rows: 3,
        cols: 3
    },

    {
        image: "https://i.postimg.cc/25kzz7wC/image.png",
        rows: 4,
        cols: 4
    },

    {
        image: "https://i.postimg.cc/MZDmH6qJ/image.png",
        rows: 5,
        cols: 5
    }
];

let currentLevel = 0;

let pieces = [];
let selected = null;

let moves = 0;

let seconds = 0;
let timerInterval = null;

const puzzle = document.getElementById("puzzle");
const movesText = document.getElementById("moves");
const timerText = document.getElementById("timer");
const levelText = document.getElementById("levelText");

const resetBtn = document.getElementById("resetBtn");

const message = document.getElementById("message");
const winInfo = document.getElementById("winInfo");
const nextBtn = document.getElementById("nextBtn");


// ==========================================
// START
// ==========================================

loadLevel(currentLevel);


// ==========================================
// LOAD LEVEL
// ==========================================

function loadLevel(levelIndex) {

    stopTimer();

    currentLevel = levelIndex;

    const level = levels[currentLevel];

    pieces = [];
    selected = null;

    moves = 0;
    seconds = 0;

    movesText.textContent = "0";
    timerText.textContent = "00:00";

    levelText.textContent =
        `Level ${currentLevel + 1}`;

    puzzle.innerHTML = "";

    puzzle.style.gridTemplateColumns =
        `repeat(${level.cols}, 1fr)`;

    puzzle.style.gridTemplateRows =
        `repeat(${level.rows}, 1fr)`;


    const totalPieces =
        level.rows * level.cols;


    // Create pieces
    for (let i = 0; i < totalPieces; i++) {

        pieces.push({
            correct: i,
            current: i
        });
    }


    // Shuffle
    shufflePieces();


    // Render
    renderPuzzle();

    startTimer();
}


// ==========================================
// SHUFFLE
// ==========================================

function shufflePieces() {

    let shuffled;

    do {

        shuffled = [...pieces];

        for (let i = shuffled.length - 1; i > 0; i--) {

            const j =
                Math.floor(Math.random() * (i + 1));

            [shuffled[i], shuffled[j]] =
                [shuffled[j], shuffled[i]];
        }

    } while (isAlreadySolved(shuffled));


    pieces = shuffled;
}


// ==========================================
// CHECK ALREADY SOLVED
// ==========================================

function isAlreadySolved(array) {

    return array.every(
        (piece, index) =>
            piece.correct === index
    );
}


// ==========================================
// RENDER
// ==========================================

function renderPuzzle() {

    puzzle.innerHTML = "";

    const level = levels[currentLevel];

    pieces.forEach((piece, index) => {

        const div =
            document.createElement("div");

        div.className = "piece";

        /*
            Every piece uses the SAME image.

            background-size:
            full image scaled to puzzle.

            background-position:
            selects the correct part.
        */

        div.style.backgroundImage =
            `url("${level.image}")`;

        div.style.backgroundSize =
            `${level.cols * 100}% ${level.rows * 100}%`;


        const correctPosition =
            piece.correct;

        const correctRow =
            Math.floor(correctPosition / level.cols);

        const correctCol =
            correctPosition % level.cols;


        /*
            Calculate background position.
        */

        const x =
            level.cols === 1
                ? 0
                : (correctCol / (level.cols - 1)) * 100;

        const y =
            level.rows === 1
                ? 0
                : (correctRow / (level.rows - 1)) * 100;


        div.style.backgroundPosition =
            `${x}% ${y}%`;


        div.dataset.index = index;


        div.addEventListener(
            "click",
            () => selectPiece(index)
        );


        puzzle.appendChild(div);
    });
}


// ==========================================
// SELECT PIECE
// ==========================================

function selectPiece(index) {

    const allPieces =
        document.querySelectorAll(".piece");


    // First piece
    if (selected === null) {

        selected = index;

        allPieces[index]
            .classList.add("selected");

        return;
    }


    // Same piece
    if (selected === index) {

        allPieces[index]
            .classList.remove("selected");

        selected = null;

        return;
    }


    // Swap
    swapPieces(selected, index);

    allPieces.forEach(
        p => p.classList.remove("selected")
    );

    selected = null;

    moves++;

    movesText.textContent = moves;

    renderPuzzle();

    checkWin();
}


// ==========================================
// SWAP
// ==========================================

function swapPieces(a, b) {

    [pieces[a], pieces[b]] =
        [pieces[b], pieces[a]];
}


// ==========================================
// CHECK WIN
// ==========================================

function checkWin() {

    const solved =
        pieces.every(
            (piece, index) =>
                piece.correct === index
        );


    if (!solved) return;


    stopTimer();

    const levelNumber =
        currentLevel + 1;


    winInfo.textContent =
        `Completed in ${moves} moves • ${formatTime(seconds)}`;


    if (currentLevel < levels.length - 1) {

        nextBtn.textContent =
            "Next Level →";

    } else {

        nextBtn.textContent =
            "Play Again 🔄";
    }


    message.classList.remove("hidden");
}


// ==========================================
// NEXT LEVEL
// ==========================================

nextBtn.addEventListener(
    "click",
    () => {

        message.classList.add("hidden");


        if (currentLevel < levels.length - 1) {

            loadLevel(currentLevel + 1);

        } else {

            loadLevel(0);
        }
    }
);


// ==========================================
// RESET
// ==========================================

resetBtn.addEventListener(
    "click",
    () => {

        message.classList.add("hidden");

        loadLevel(currentLevel);
    }
);


// ==========================================
// TIMER
// ==========================================

function startTimer() {

    stopTimer();

    timerInterval =
        setInterval(() => {

            seconds++;

            timerText.textContent =
                formatTime(seconds);

        }, 1000);
}


function stopTimer() {

    if (timerInterval !== null) {

        clearInterval(timerInterval);

        timerInterval = null;
    }
}


function formatTime(totalSeconds) {

    const minutes =
        Math.floor(totalSeconds / 60);

    const secondsLeft =
        totalSeconds % 60;

    return (
        String(minutes).padStart(2, "0")
        + ":" +
        String(secondsLeft).padStart(2, "0")
    );
}
