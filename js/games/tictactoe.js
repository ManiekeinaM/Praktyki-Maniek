const winnerBox = document.querySelector(".win-popup");
const winnerText = winnerBox.querySelector('.popupText');

const scoreTexts = {
    1: document.querySelector('.score.player .wins'),
    2: document.querySelector('.score.maniek .wins'),
}

const maniekFaces = {
    'default': './assets/maniek-faces/thinking.gif',
    'loss': './assets/maniek-faces/sad.gif',
    'win': './assets/maniek-faces/happy.gif',
}

const maniek = document.querySelector('img.maniek');
function setManiekMood(face) {
    let maniekFace = maniekFaces[face] || maniekFaces.default;
    maniek.src = maniekFace;
}

let PLAYER_COOKIE_NAME = 'tic_winsPlayer';
let MANIEK_COOKIE_NAME = 'tic_winsManiek'

let PLAYER_COOKIE = getCookie(PLAYER_COOKIE_NAME);
let MANIEK_COOKIE = getCookie(MANIEK_COOKIE_NAME);

// Set the scores here - 0 or automatically remembered thru cookies
let scores = {
    1: (PLAYER_COOKIE == '') ? 0 : PLAYER_COOKIE,
    2: (MANIEK_COOKIE == '') ? 0 : MANIEK_COOKIE,
}

scores[1] = parseInt(scores[1]);
scores[2] = parseInt(scores[2]);
updateScore(1); updateScore(2);


function updateCookie() {
    setCookie(PLAYER_COOKIE_NAME, scores[1], 9999);
    setCookie(MANIEK_COOKIE_NAME, scores[2], 9999);
    // console.log(document.cookie);
}


let gameBoard = document.getElementById("game-board");

let current_player = 1;
let MovesCount = 0;
let round = 1;

let board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
        let area = document.createElement("div");
        area.id = i + '_' + j;

        let img = document.createElement("img");
        img.src = './assets/empty.png';

        // Click on a button!
        area.addEventListener("click", e => {
            if (board[i][j] != 0) return;
            if (current_player == 2) return;
            let rememberedRound = round;

            setSquare(i, j, current_player);
            switchPlayer();

            setTimeout(() => {
                if (rememberedRound != round) return;

                botMove(board);
                switchPlayer();
            }, Math.random() * 500 + 500);
        })

        gameBoard.append(area);
        area.append(img);
    }
}

function switchPlayer() {
    if (current_player == 1) current_player = 2;
    else current_player = 1;

    return current_player;
}


let icons = {
    1: './assets/krzyzyk.png',
    2: './assets/kolko.png',
}
function setSquare(x, y, number) {
    if (winnerBox.style.display == "block") return;
    let square = document.getElementById(`${x}_${y}`);

    let img = square.querySelector("img");
    img.src = icons[number];

    // animacja
    img.style.transform = `scale(1.1)`;
    setTimeout(() => {
        img.style.transform = ``;
    }, 100);

    board[x][y] = number;

    let winner = checkWin();
    if (winner > 0)
        return showWinner(winner);


    MovesCount++;
    if (MovesCount >= 9) {
        showWinner(0);
    }
}

function checkWin() {
    // Rows and columns
    for (let i = 0; i < 3; i++) {
        // horizontal
        if (board[0][i] == board[1][i] && board[0][i] == board[2][i]) {
            return board[0][i];
        }

        // vertical
        if (board[i][0] == board[i][1] && board[i][0] == board[i][2]) {
            return board[i][0];
        }
    }

    // Diagonals
    if (board[0][0] == board[1][1] && board[1][1] == board[2][2]) return board[0][0];
    if (board[0][2] == board[1][1] && board[0][2] == board[2][0]) return board[0][2];

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
                    return { i, j };
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
                availableMoves.push({ i, j });
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

function updateScore(player) {
    scoreTexts[player].innerText = `${scores[player]} wygranych`;
}
function incrementScore(player) {
    scores[player] += 1;
    updateScore(player);

    updateCookie();
}

let winnerTexts = {
    0: "Remis",
    1: "Gracz wygrywa!",
    2: "Maniek wygrywa!"
}
function showWinner(winner) {
    // Show winner text
    winnerBox.style.display = "block";
    winnerText.innerHTML = winnerTexts[winner];

    // Set maniek face
    if (winner == 1)
        setManiekMood("loss");
    if (winner == 2)
        setManiekMood("win");

    // Increment winner's score
    if (winner == 0) { // remis
        // incrementScore(1);
        // incrementScore(2);
        return;
    }

    incrementScore(winner);



    // winnerText.innerHTML = `Gracz ${winner} wygrywa!`;
}

document.getElementById("resetBtn").addEventListener("click", e => {
    round += 1;
    MovesCount = 0;
    current_player = 1;

    setManiekMood("default");

    let imgs = document.querySelectorAll(".game-container div img");
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            imgs[i * 3 + j].src = "./assets/empty.png";
            board[i][j] = 0;
        }
    }
    winnerBox.style.display = "none";
}
)