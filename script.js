let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");

let turnO = true; // true = AI's turn, false = Player's turn

const winPatterns = [
    [0, 1, 2], [0, 3, 6], [0, 4, 8],
    [1, 4, 7], [2, 5, 8], [2, 4, 6],
    [3, 4, 5], [6, 7, 8]
];

// Reset Game
const resetGame = () => {
    turnO = true;
    enableBoxes();
    msgContainer.classList.add("hide");

    if (turnO) {
        setTimeout(aiMove, 500); // AI starts first
    }
};

// Check for empty moves left
const isMovesLeft = () => {
    return [...boxes].some(box => box.innerText === "");
};

// Check winner
const checkWinner = () => {
    for (let pattern of winPatterns) {
        let pos1val = boxes[pattern[0]].innerText;
        let pos2val = boxes[pattern[1]].innerText;
        let pos3val = boxes[pattern[2]].innerText;

        if (pos1val !== "" && pos1val === pos2val && pos2val === pos3val) {
            showWinner(pos1val);
            return true;
        }
    }
    return false;
};

// Disable all boxes
const disableBoxes = () => {
    boxes.forEach(box => box.disabled = true);
};

// Enable all boxes
const enableBoxes = () => {
    boxes.forEach(box => {
        box.disabled = false;
        box.innerText = "";
    });
};

// Display winner message
const showWinner = (winner) => {
    msg.innerText = `Congratulations, Winner is ${winner}`;
    msgContainer.classList.remove("hide");
    disableBoxes();
};

// Minimax Algorithm for AI
const minimax = (board, isMaximizing) => {
    let winner = evaluate(board);
    if (winner !== 0) return winner;
    if (!isMovesLeft()) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = "O";
                bestScore = Math.max(bestScore, minimax(board, false));
                board[i] = ""; // Undo move
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = "X";
                bestScore = Math.min(bestScore, minimax(board, true));
                board[i] = ""; // Undo move
            }
        }
        return bestScore;
    }
};

// Evaluate the board state
const evaluate = (board) => {
    for (let pattern of winPatterns) {
        let [a, b, c] = pattern;
        if (board[a] !== "" && board[a] === board[b] && board[b] === board[c]) {
            return board[a] === "O" ? 1 : -1;
        }
    }
    return 0;
};

// Find the best AI move
const findBestMove = () => {
    let board = [...boxes].map(box => box.innerText);
    let bestScore = -Infinity;
    let bestMove = -1;

    for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
            board[i] = "O";
            let score = minimax(board, false);
            board[i] = ""; // Undo move

            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    return bestMove;
};

// AI Move
const aiMove = () => {
    let bestMove = findBestMove();
    if (bestMove !== -1) {
        boxes[bestMove].innerText = "O";
        boxes[bestMove].disabled = true;

        if (!checkWinner()) {
            turnO = false; // Switch to player
        }
    }
};

// Handle Player Move
boxes.forEach((box) => {
    box.addEventListener("click", () => {
        if (!turnO && box.innerText === "") {
            box.innerText = "X";
            box.disabled = true;

            if (!checkWinner()) {
                turnO = true; 
                setTimeout(aiMove, 500);
            }
        }
    });
});

newGameBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);

// AI plays first if set
setTimeout(aiMove, 500);
