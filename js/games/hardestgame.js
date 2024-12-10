const titleScreen = document.querySelector('div.titlescreen.hardestgame');
const enterGame = document.querySelector('button.enterGame');

///////////////////////   Canvas   ///////////////////////
const canvas = document.querySelector('#game-canvas');
const ctx = canvas.getContext('2d', {willReadFrequently: true});
ctx.imageSmoothingEnabled = false;
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
let width = canvas.width;
let height = canvas.height;

///////////////////////   Resizing   ///////////////////////
const GRID_SIZE = 40;
let GAME_WIDTH = 1000;
let GAME_HEIGHT = 800;
let scaleX = canvas.width / parseFloat(canvas.offsetWidth);
let scaleY = canvas.height / parseFloat(canvas.offsetHeight);

function resizeCanvas() {
    //const aspectRatio = GAME_WIDTH / GAME_HEIGHT;

    //console.log("resizing");
    canvas.width = GAME_WIDTH;
    canvas.height = GAME_HEIGHT;
    width = canvas.width;
    height = canvas.height;
}
function updateScaleFactors() {
    scaleX = canvas.width / parseFloat(canvas.offsetWidth);
    scaleY = canvas.height / parseFloat(canvas.offsetHeight);
}
window.addEventListener('resize', () => {
    if (!isGameStillTheSame) return;

    resizeCanvas();
    updateScaleFactors();
});
resizeCanvas();
updateScaleFactors();



const player = {
    x: GAME_WIDTH/2,
    y: GAME_HEIGHT/2,
    radius: 25,
    move: function(x, y) {
        this.x += x;
        if (this.x < this.radius) this.x = this.radius;
        if (this.x > GAME_WIDTH - this.radius) this.x = GAME_WIDTH - this.radius;
        this.y += y;
        if (this.y < this.radius) this.y = this.radius;
        if (this.y > GAME_HEIGHT - this.radius) this.y = GAME_HEIGHT - this.radius;
    },
    draw: function() {
        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        ctx.fill();
    }
};

canvas.addEventListener('mousemove', e => {
    const deltaX = e.movementX;
    const deltaY = e.movementY;
    player.move(deltaX, deltaY);
})


///////////////////////   Level Grid Initialization   ///////////////////////
// Calculate number of rows and columns based on GRID_SIZE
const ROWS = Math.floor(GAME_HEIGHT / GRID_SIZE);
const COLS = Math.floor(GAME_WIDTH / GRID_SIZE);

// TODO - add a level creator, import it manually into the levels
const OBJECT_IDS = {0: 'empty', 1: 'wall', 2: 'goal', 3: 'kill'};
const LEVEL_GRID = [];
for (let row = 0; row < ROWS; row++) {
    LEVEL_GRID[row] = [];
    for (let col = 0; col < COLS; col++) {
        LEVEL_GRID[row][col] = 0;
    }
}

LEVEL_GRID[4][4] = 1;
LEVEL_GRID[4][5] = 1;
LEVEL_GRID[5][4] = 1;
LEVEL_GRID[5][5] = 1;
LEVEL_GRID[5][6] = 1;
LEVEL_GRID[6][6] = 1;
LEVEL_GRID[6][7] = 1;


const _LEVEL_EDITOR_CONTROLS = document.querySelector('div.level-editor-controls');
let LEVEL_EDITOR_ENABLED = false;
document.addEventListener('keydown', e => {
    if (e.key != "F2") return;

    _LEVEL_EDITOR_CONTROLS.classList.toggle('hidden');
    LEVEL_EDITOR_ENABLED = !LEVEL_EDITOR_ENABLED;
    if (!LEVEL_EDITOR_ENABLED) return;


});



let mergedWalls = [];
function greedyMeshWalls() {
    mergedWalls = [];
    const processed = Array.from({ length: ROWS }, () => Array(COLS).fill(false));

    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (LEVEL_GRID[row][col] !== 1 || processed[row][col]) {
                continue;
            }

            // Determine the width of the rectangle
            let width = 1;
            while (
                col + width < COLS &&
                LEVEL_GRID[row][col + width] === 1 &&
                !processed[row][col + width]
            ) {
                width++;
            }

            // Determine the height of the rectangle
            let height = 1;
            let canExpand = true;
            while (canExpand && row + height < ROWS) {
                for (let i = 0; i < width; i++) {
                    if (
                        LEVEL_GRID[row + height][col + i] !== 1 ||
                        processed[row + height][col + i]
                    ) {
                        canExpand = false;
                        break;
                    }
                }
                if (canExpand) {
                    height++;
                }
            }

            // Mark the cells in the rectangle as processed
            for (let i = row; i < row + height; i++) {
                for (let j = col; j < col + width; j++) {
                    processed[i][j] = true;
                }
            }

            // Add the merged rectangle to the array
            mergedWalls.push({
                x: col * GRID_SIZE,
                y: row * GRID_SIZE,
                width: width * GRID_SIZE,
                height: height * GRID_SIZE,
            });
        }
    }
}
greedyMeshWalls();

const WALL_PADDING = 2;
function drawWalls() {
    // Draw purple stroke outlines for padding first
    ctx.strokeStyle = 'black';
    ctx.lineWidth = WALL_PADDING * 2; // Double the padding for overlap
    ctx.lineJoin = 'bevel'; // Sharp corners
    ctx.lineCap = 'butt'; // Default line cap

    mergedWalls.forEach(rect => {
        ctx.strokeRect(
            rect.x - WALL_PADDING / 2,
            rect.y - WALL_PADDING / 2,
            rect.width + WALL_PADDING,
            rect.height + WALL_PADDING
        );
    });

    // Then, fill walls with black on top of the padding
    ctx.fillStyle = 'purple';
    mergedWalls.forEach(rect => {
        ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    });
}



let shouldUpdateNavigation = true;
let isGameStillTheSame = false;
let playingGame = false;
enterGame.addEventListener('click', async e => {
    if (playingGame) return;
    playingGame = true;
    gamenavigation.classList.add('topLeft');
    await canvas.requestPointerLock();
})




// const MANIEK_FACE = 



let lastTime;
function gameLoop(currentTime) {
    requestAnimationFrame(gameLoop);

    const deltaTime = (currentTime - lastTime)/1000 
                    || 1/60;
    lastTime = currentTime;

    // UPDATES FOR GAME CHANGES
    {
        if (shouldUpdateNavigation) {
            if (playingGame && isGameStillTheSame && !isDocumentHidden) {
                // just enabled the game or smth
                shouldUpdateNavigation = false;
                gamenavigation.classList.add('topLeft');
                titleScreen.classList.add('hidden-game')
                canvas.classList.add('hardestgame-active');
            } else {
                gamenavigation.classList.remove('topLeft'); 
            }
        }
        
        if (CURRENT_GAME != "hardestgame") {
            if (isGameStillTheSame) {
                // just disabled the game
                ctx.clearRect(0, 0, width, height);
                shouldUpdateNavigation = true;
                canvas.classList.remove('hardestgame-active');
            }
            isGameStillTheSame = false;
            return;
        } else {
            
        }
        isGameStillTheSame = true;
    
        if (!playingGame) {
            return;
        }
    }
    
    // GAME
    ctx.clearRect(0, 0, width, height);

    drawWalls();

    player.draw();
}

requestAnimationFrame(gameLoop);