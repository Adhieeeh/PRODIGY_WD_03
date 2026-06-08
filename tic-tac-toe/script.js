const boardElement = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const statusElement = document.getElementById('status');
const resetBtn = document.getElementById('resetBtn');

let board = ["", "", "", "", "", "", "", "", ""];
let isGameActive = true;

const HUMAN = "X";
const AI = "O";


const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6]             
];

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetBtn.addEventListener('click', restartGame);

function handleCellClick(e) {
    const clickedCell = e.target;
    const index = parseInt(clickedCell.getAttribute('data-index'));

    if (board[index] !== "" || !isGameActive) return;

    makeMove(index, HUMAN);

    if (checkWin(HUMAN)) {
        endGame("You Win! 🎉");
    } else if (board.every(cell => cell !== "")) {
        endGame("It's a Tie! 🤝");
    } else {
  
        isGameActive = false; 
        statusElement.textContent = "AI is thinking...";
        setTimeout(aiTurn, 500);
    }
}

function makeMove(index, player) {
    board[index] = player;
    cells[index].textContent = player;
    cells[index].classList.add(player === HUMAN ? 'x-marker' : 'o-marker');
}

function aiTurn() {
    let move = findBestMove();
    makeMove(move, AI);

    if (checkWin(AI)) {
        endGame("AI Wins! 🤖");
    } else if (board.every(cell => cell !== "")) {
        endGame("It's a Tie! 🤝");
    } else {
        isGameActive = true;
        statusElement.textContent = "Your Turn (X)";
    }
}


function findBestMove() {
    for (let player of [AI, HUMAN]) {
        for (let combo of WINNING_COMBINATIONS) {
            const [a, b, c] = combo;
            const values = [board[a], board[b], board[c]];
            
           
            if (values.filter(v => v === player).length === 2 && values.includes("")) {
                const emptyIndex = combo[values.indexOf("")];
                return emptyIndex;
            }
        }
    }

  
    let availableMoves = board.map((val, idx) => val === "" ? idx : null).filter(val => val !== null);
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

function checkWin(player) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => board[index] === player);
    });
}

function endGame(message) {
    statusElement.textContent = message;
    isGameActive = false;
}

function restartGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    isGameActive = true;
    statusElement.textContent = "Your Turn (X)";
    cells.forEach(cell => {
        cell.textContent = "";
        cell.className = "cell"; 
    });
}