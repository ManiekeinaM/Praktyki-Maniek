let gameBoard = document.getElementById("game-board");
current_player = 1;
let board_area = [[],[],[]];
    for(let i=0; i<3; i++) {
        for(let j=0; j<3; j++) {
            board_area[i][j] = -1;
        }
    }


for(let i=0; i<3; i++) {
    for(let j=0; j<3; j++) {
        let area = document.createElement("button");
        area.id = i+'_'+j;
        gameBoard.append(area);
        area.addEventListener("click", e => {
            if(board_area[i][j] != 1 && board_area[i][j] != 2){
            board_area[i][j] = current_player;
            area.innerHTML = current_player;
            let winner = check_board();
            if(winner > 0) alert(winner);
            (current_player==1)? current_player = 2 : current_player = 1;
            };
        })
    }
}

function check_board() {
    
    for(let i=0; i<3; i++) {
        if(board_area[i][0] == board_area[i][1] && board_area[i][0] == board_area[i][2]) {
            return (board_area[i][0]);
        }

        if(board_area[0][i] == board_area[1][i] && board_area[0][i] == board_area[2][i]) {
            return board_area[0][i];
        }
    }

    if(board_area[0][0] == board_area[1][1] && board_area[1][1] == board_area[2][2]) return board_area[0][0];

    if(board_area[0][2] == board_area[1][1] && board_area[0][2] == board_area[2][0]) return board_area[0][2];
    return -1;
}

