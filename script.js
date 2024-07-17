const selectBox = document.querySelector(".select-box"),
    playBoard = document.querySelector(".play-board"),
    players = document.querySelector(".players"),
    allBox = document.querySelectorAll("section span"),
    resultBox = document.querySelector(".result-box"),
    wonText = resultBox.querySelector(".won-text"),
    replayBtn = resultBox.querySelector("button");

let currentPlayer = "X";
let gameActive = true;
const playerSymbol = "X";
const computerSymbol = "O";
let playAgainstComputer = false; // Flag to track game mode

window.onload = () => {
    for (let i = 0; i < allBox.length; i++) {
        allBox[i].setAttribute("onclick", "clickedBox(this)");
    }
}

selectBox.querySelector(".options .againstComputer").onclick = () => {
    playAgainstComputer = true; // Set flag to true for computer mode
    selectBox.classList.add("hide");
    playBoard.classList.add("show");
    players.classList.add("active", "playerX");
    updatePlayerIndicator();
}

selectBox.querySelector(".options .againstOpponent").onclick = () => {
    playAgainstComputer = false; // Set flag to false for opponent mode
    selectBox.classList.add("hide");
    playBoard.classList.add("show");
    players.classList.add("active", "playerX");
    updatePlayerIndicator();
}

function clickedBox(element) {
    if (!gameActive || element.childElementCount > 0) return;

    element.innerHTML = currentPlayer === "X" ? `<i class="fas fa-times"></i>` : `<i class="far fa-circle"></i>`;
    element.setAttribute("id", currentPlayer);
    element.style.pointerEvents = "none";

    if (selectWinner()) {
        endGame(`Player <p>${currentPlayer}</p> won the game!`);
        return;
    }

    if (isDraw()) {
        endGame("Match has been drawn!");
        return;
    }

    if (playAgainstComputer && currentPlayer === playerSymbol) {
        currentPlayer = computerSymbol;
        updatePlayerIndicator();
        playBoard.style.pointerEvents = "none";
        setTimeout(bot, 700);
    } else {
        // Switch player
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        updatePlayerIndicator();
    }
}

function bot() {
    let board = Array.from(allBox).map(box => box.id || '');
    let bestScore = -Infinity;
    let bestMove;

    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = computerSymbol;
            let score = minimax(board, 0, false);
            board[i] = '';
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    allBox[bestMove].innerHTML = `<i class="far fa-circle"></i>`;
    allBox[bestMove].setAttribute("id", computerSymbol);
    allBox[bestMove].style.pointerEvents = "none";

    if (selectWinner()) {
        endGame(`Player <p>${computerSymbol}</p> won the game!`);
        return;
    }

    if (isDraw()) {
        endGame("Match has been drawn!");
        return;
    }

    currentPlayer = playerSymbol;
    updatePlayerIndicator();
    playBoard.style.pointerEvents = "auto";
}

function minimax(board, depth, isMaximizing) {
    let result = checkWinner(board);
    if (result !== null) {
        return result === computerSymbol ? 1 : result === playerSymbol ? -1 : 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = computerSymbol;
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = playerSymbol;
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWinner(board) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let pattern of winPatterns) {
        if (board[pattern[0]] && board[pattern[0]] === board[pattern[1]] && board[pattern[0]] === board[pattern[2]]) {
            return board[pattern[0]];
        }
    }

    if (board.includes('')) {
        return null;
    }

    return 'tie';
}

function updatePlayerIndicator() {
    const slider = players.querySelector(".slider");
    if (currentPlayer === playerSymbol) {
        players.classList.add("playerX");
        players.classList.remove("playerO");
        slider.style.left = "0";
    } else {
        players.classList.add("playerO");
        players.classList.remove("playerX");
        slider.style.left = "50%";
    }
}

function selectWinner() {
    let winPatterns = [
        [1, 2, 3], [4, 5, 6], [7, 8, 9],
        [1, 4, 7], [2, 5, 8], [3, 6, 9],
        [1, 5, 9], [3, 5, 7]
    ];

    for (let pattern of winPatterns) {
        if (checkIdSign(...pattern, currentPlayer)) {
            return true;
        }
    }
    return false;
}

function checkIdSign(val1, val2, val3, sign) {
    return getIdVal(val1) === sign && getIdVal(val2) === sign && getIdVal(val3) === sign;
}

function getIdVal(classname) {
    return document.querySelector(".box" + classname).id;
}

function isDraw() {
    return Array.from(allBox).every(box => box.childElementCount > 0);
}

function endGame(message) {
    gameActive = false;
    setTimeout(() => {
        resultBox.classList.add("show");
        playBoard.classList.remove("show");
        wonText.innerHTML = message;
    }, 500);
}

replayBtn.onclick = () => {
    window.location.reload();
}
