
let board = [];
for (let i=0; i<3; i++) {
    if (board[i][i] == board[i+1][i] && board[i][i] == board[i+2][i]) {
        console.log("You win!")
    }
    if (board[i][i] == board[i][i+1] && board[i][i] == board[i][i+2]) {
        console.log("You win!")
    }
}
if (board[0][0] == board[1][1] && board[0][0] == board[2][2]) {
    console.log("You win!")
}
if (board[0][2] == board[1][1] && board[0][2] == board[2][0]) {
    console.log("You win!")
}

