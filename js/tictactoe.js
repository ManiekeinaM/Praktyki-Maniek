const winnerBox = document.getElementById("winPopup");
const winnerText = document.getElementById("popupText");
let gameBoard = document.getElementById("game-board");
current_player = 1;
let MovesCount = 0;

let board = [[0,0,0],[0,0,0],[0,0,0]];

for(let i=0; i<3; i++) {
    for(let j=0; j<3; j++) {
        let area = document.createElement("div");
        area.id = i+'_'+j;

        let img = document.createElement("img");
        img.src = './assets/empty.png';

        // Click on a button!
        area.addEventListener("click", e => {
            if (board[i][j] != 0) return;

            setSquare(i, j, current_player);

            botMove(board);
            // Switch player
            // if (current_player == 1) current_player = 2;
            // else current_player = 1;
        })

        gameBoard.append(area);
        area.append(img);
    }
}

let icons = {
    1: './assets/krzyzyk.png',
    2: './assets/kolko.png',
}
function setSquare(x, y, number) {
    if(winnerBox.style.display == "block") return;
    let square = document.getElementById(`${x}_${y}`);

    let img = square.querySelector("img");
    img.src = icons[number];

    board[x][y] = number;

    let winner = checkWin();
    if (winner > 0) {
        // lekki delay
        return showWinner(winner);
    }

    MovesCount++;
    if(MovesCount==9) {
        showWinner(0);
    }
}

function checkWin() {
    // Rows and columns
    for(let i=0; i<3; i++) {
        // horizontal
        if(board[0][i] == board[1][i] && board[0][i] == board[2][i]) {
            return board[0][i];
        }

        // vertical
        if(board[i][0] == board[i][1] && board[i][0] == board[i][2]) {
            return board[i][0];
        }
    }

    // Diagonals
    if(board[0][0] == board[1][1] && board[1][1] == board[2][2]) return board[0][0];
    if(board[0][2] == board[1][1] && board[0][2] == board[2][0]) return board[0][2];

    // No one won yet
    return 0;
}



function findWinningMove(pseudoBoard, player) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (pseudoBoard[i][j] == 0) {
                pseudoBoard[i][j] = player;
                if (checkWin(pseudoBoard) == player) {
                    pseudoBoard[i][j] = 0;
                    return {i, j};
                }
                pseudoBoard[i][j] = 0;
            }
        }
    }
    return null;
}

function findRandomMove(board) {
    let availableMoves = [];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === 0) {
                availableMoves.push({i, j});
            }
        }
    }
    if (availableMoves.length === 0) {
        return null;
    }
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

function botMove(board) {
    let move = findWinningMove(board, 2) || findWinningMove(board, 1) || findRandomMove(board);
    if (move) {
        setSquare(move.i, move.j, 2);
    }
}

function showWinner(winner) {
    MovesCount = 0;
    winnerBox.style.display = "block";
    if(winner == 0){
        winnerText.innerHTML = "Remis";
        return;
    }
    winnerText.innerHTML = `Gracz ${winner} wygrywa!`;
}

document.getElementById("resetBtn").addEventListener("click", e => {
    let imgs = document.querySelectorAll(".game-container div img");
    for(let i=0; i<3; i++) {
        for(let j=0; j<3; j++) {
            imgs[i*3+j].src = "./assets/empty.png";
            board[i][j] = 0;
        }
    }    
    winnerBox.style.display = "none";
}
)