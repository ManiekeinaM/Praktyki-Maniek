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
    // console.log(canvas.width, canvas.offsetWidth);
    // console.log(scaleX, scaleY);
}
window.addEventListener('resize', () => {
    if (!isGameStillTheSame) return;

    resizeCanvas();
    updateScaleFactors();
});
resizeCanvas();
updateScaleFactors();

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function isCircleCollidingWithRect(circle, rect) {
    // closest point to the circle within the rectangle
    const closestX = clamp(circle.x, rect.x, rect.x + rect.width);
    const closestY = clamp(circle.y, rect.y, rect.y + rect.height);

    const distanceX = circle.x - closestX;
    const distanceY = circle.y - closestY;

    const distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);
    return distanceSquared < (circle.radius * circle.radius);
}

function resolveCircleRectCollision(circle, rect) {
    const closestX = clamp(circle.x, rect.x, rect.x + rect.width);
    const closestY = clamp(circle.y, rect.y, rect.y + rect.height);

    const distanceX = circle.x - closestX;
    const distanceY = circle.y - closestY;

    const distance = Math.sqrt((distanceX * distanceX) + (distanceY * distanceY));

    // if the distance is less than the circle's radius, there's a collision
    if (distance < circle.radius && distance !== 0) {
        const overlap = circle.radius - distance;

        // normalize the collision vector
        const collisionVectorX = distanceX / distance;
        const collisionVectorY = distanceY / distance;

        // resolve the collision with unit vector * overlap
        circle.x += collisionVectorX * overlap;
        circle.y += collisionVectorY * overlap;
    }
}

const Maniekball = new Image();
Maniekball.src = 'assets/hardestgame/maniekball.png';

const MAX_STEP_SIZE = 5; // pixels

const player = {
    x: GAME_WIDTH/2,
    y: GAME_HEIGHT/2,
    radius: 20,
    move: function(deltaX, deltaY) {
        const MAX_STEP_SIZE = this.radius/2;

        const distance = Math.sqrt(deltaX*deltaX + deltaY*deltaY);
        if (distance === 0) return;

        const steps = Math.ceil(distance / MAX_STEP_SIZE);
        const stepX = deltaX / steps;
        const stepY = deltaY / steps;

        for (let i=0; i<steps; i++) {
            const newX = this.x + stepX;
            const newY = this.y + stepY;
    
            const newCircle = { x: newX, y: newY, radius: this.radius };

            // theoretically if only using square walls: limit of collisions would be 2
            let collided = false;
            for (const rect of mergedObjects[1]) {
                if (isCircleCollidingWithRect(newCircle, rect)) {
                    resolveCircleRectCollision(newCircle, rect);
                    collided = true;
                }
            }

    
            if (!collided) {
                this.x = newX;
                this.y = newY;
            } else {
                this.x = newCircle.x;
                this.y = newCircle.y;
                break;
            }
        }
        

        // ensure the player stays within canvas boundaries
        this.x = clamp(this.x, this.radius, GAME_WIDTH-this.radius);
        this.y = clamp(this.y, this.radius, GAME_HEIGHT-this.radius);
    },
    draw: function() {
        // ctx.fillStyle = 'blue';
        // ctx.beginPath();
        // ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        // ctx.fill();

        ctx.drawImage(Maniekball, this.x-this.radius, this.y-this.radius, this.radius*2, this.radius*2);
    }
};

canvas.addEventListener('mousemove', e => {
    const deltaX = e.movementX * scaleX;
    const deltaY = e.movementY * scaleY;
    player.move(deltaX, deltaY);
})


///////////////////////   Level Grid Initialization   ///////////////////////
// Calculate number of rows and columns based on GRID_SIZE
const ROWS = Math.floor(GAME_HEIGHT / GRID_SIZE);
const COLS = Math.floor(GAME_WIDTH / GRID_SIZE);

let CURRENT_LEVEL = 1;
const LEVELS = {
    1: [[2,3,1],[2,4,1],[2,9,1],[2,10,1],[2,11,1],[2,12,1],[2,13,1],[2,14,1],[2,15,1],[2,20,1],[2,21,1],[3,4,1],[3,5,1],[3,9,1],[3,10,2],[3,11,2],[3,12,2],[3,13,2],[3,14,2],[3,15,1],[3,19,1],[3,20,1],[4,4,1],[4,5,1],[4,8,1],[4,9,1],[4,10,1],[4,11,1],[4,12,2],[4,13,1],[4,14,1],[4,15,1],[4,16,1],[4,19,1],[4,20,1],[5,5,1],[5,6,1],[5,8,1],[5,16,1],[5,18,1],[5,19,1],[6,5,1],[6,6,1],[6,7,1],[6,8,1],[6,16,1],[6,17,1],[6,18,1],[6,19,1],[7,5,1],[7,6,1],[7,7,1],[7,8,1],[7,16,1],[7,17,1],[7,18,1],[7,19,1],[8,6,1],[8,7,1],[8,8,1],[8,16,1],[8,17,1],[8,18,1],[9,6,1],[9,7,1],[9,8,1],[9,16,1],[9,17,1],[9,18,1],[10,7,1],[10,8,1],[10,16,1],[10,17,1],[11,8,1],[11,16,1],[12,8,1],[12,16,1],[13,8,1],[13,16,1],[14,8,1],[14,16,1],[15,8,1],[15,16,1],[16,8,1],[16,16,1],[17,8,1],[17,16,1],[18,8,1],[18,9,1],[18,10,1],[18,11,1],[18,12,1],[18,13,1],[18,14,1],[18,15,1],[18,16,1]],
    2: [[0,0,1],[0,1,1],[0,2,1],[0,3,1],[0,4,1],[0,5,1],[0,6,1],[0,7,1],[0,8,1],[0,9,1],[0,10,1],[0,11,1],[0,12,1],[0,13,1],[0,14,1],[0,15,1],[0,16,1],[0,17,1],[0,18,1],[0,19,1],[0,20,1],[0,21,1],[0,22,1],[0,23,1],[0,24,1],[1,0,1],[1,24,1],[2,0,1],[2,1,1],[2,2,1],[2,3,1],[2,4,1],[2,5,1],[2,6,1],[2,12,1],[2,13,1],[2,14,1],[2,15,1],[2,16,1],[2,17,1],[2,24,1],[3,0,1],[3,1,1],[3,6,1],[3,12,1],[3,17,1],[3,24,1],[4,0,1],[4,1,1],[4,3,1],[4,4,1],[4,6,1],[4,12,1],[4,14,1],[4,15,1],[4,17,1],[4,24,1],[5,0,1],[5,1,1],[5,3,1],[5,4,1],[5,6,1],[5,12,1],[5,14,1],[5,15,1],[5,17,1],[5,24,1],[6,0,1],[6,1,1],[6,6,1],[6,12,1],[6,17,1],[6,24,1],[7,0,1],[7,1,1],[7,2,1],[7,3,1],[7,4,1],[7,5,1],[7,6,1],[7,12,1],[7,13,1],[7,14,1],[7,15,1],[7,16,1],[7,17,1],[7,24,1],[8,0,1],[8,24,1],[9,0,1],[9,24,1],[10,0,1],[10,24,1],[11,0,1],[11,1,1],[11,2,1],[11,3,1],[11,15,1],[11,16,1],[11,17,1],[11,24,1],[12,0,1],[12,1,1],[12,2,1],[12,3,1],[12,15,1],[12,16,1],[12,17,1],[12,24,1],[13,0,1],[13,1,1],[13,2,1],[13,3,1],[13,4,1],[13,5,1],[13,6,1],[13,7,1],[13,8,1],[13,9,1],[13,10,1],[13,11,1],[13,12,1],[13,13,1],[13,14,1],[13,15,1],[13,16,1],[13,17,1],[13,24,1],[14,0,1],[14,4,1],[14,5,1],[14,6,1],[14,7,1],[14,8,1],[14,9,1],[14,10,1],[14,11,1],[14,12,1],[14,13,1],[14,14,1],[14,24,1],[15,0,1],[15,4,1],[15,5,1],[15,6,1],[15,7,1],[15,8,1],[15,9,1],[15,10,1],[15,11,1],[15,12,1],[15,13,1],[15,14,1],[15,24,1],[16,0,1],[16,24,1],[17,0,1],[17,24,1],[18,0,1],[18,24,1],[19,0,1],[19,1,1],[19,2,1],[19,3,1],[19,4,1],[19,5,1],[19,6,1],[19,7,1],[19,8,1],[19,9,1],[19,10,1],[19,11,1],[19,12,1],[19,13,1],[19,14,1],[19,15,1],[19,16,1],[19,17,1],[19,18,1],[19,19,1],[19,20,1],[19,21,1],[19,22,1],[19,23,1],[19,24,1]],
};

const OBJECT_IDS = {0: 'empty', 1: 'wall', 2: 'goal', 3: 'kill'};
const LEVEL_GRID = [];
for (let row = 0; row < ROWS; row++) {
    LEVEL_GRID[row] = [];
    for (let col = 0; col < COLS; col++) {
        LEVEL_GRID[row][col] = 0;
    }
}

// object_id: [objects]
// const CURRENT_OBJECTS = {};

function loadLevel(level) {
    // clear level of everything
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            LEVEL_GRID[row][col] = 0;
        }
    }

    for (const object of LEVELS[level]) {
        LEVEL_GRID[object[0]][object[1]] = object[2];
        // CURRENT_OBJECTS[object[2]] = object;
    }

    greedyMeshObjects();
}


const mergedObjects = {
    1: [], // Walls
    2: [], // Goals
    3: []  // Kill squares
    // Add more object types here if needed
};

function greedyMeshObjects() {
    // Clear previous merged objects
    for (let key in mergedObjects) {
        mergedObjects[key] = [];
    }

    const processed = Array.from({ length: ROWS }, () => Array(COLS).fill(false));

    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const objectType = LEVEL_GRID[row][col];
            if (objectType === 0 || processed[row][col] || !mergedObjects.hasOwnProperty(objectType)) {
                continue;
            }

            // Determine the width of the rectangle
            let width = 1;
            while (
                col + width < COLS &&
                LEVEL_GRID[row][col + width] === objectType &&
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
                        LEVEL_GRID[row + height][col + i] !== objectType ||
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

            // Add the merged rectangle to the respective subarray
            mergedObjects[objectType].push({
                x: col * GRID_SIZE,
                y: row * GRID_SIZE,
                width: width * GRID_SIZE,
                height: height * GRID_SIZE,
            });
        }
    }
}

greedyMeshObjects();

const WALL_PADDING = 2;
const STROKE_COLOR = 'black';
const COLORS = {
    1: 'purple',                // Walls
    2: 'rgba(0, 255, 0, 0.5)',  // Goals (Light Green)
    3: 'rgba(255, 0, 0, 0.5)'   // Kill squares (Light Red)
};
const WALL_COLOR = 'purple';
function drawSolidObjects() {
    for (const [objectType, rectangles] of Object.entries(mergedObjects)) {
        if (objectType === '1') { // Walls
            // Draw stroke outlines for padding first
            ctx.strokeStyle = STROKE_COLOR;
            ctx.lineWidth = WALL_PADDING * 2;
            ctx.lineJoin = 'bevel';

            rectangles.forEach(rect => {
                ctx.strokeRect(
                    rect.x - WALL_PADDING / 2,
                    rect.y - WALL_PADDING / 2,
                    rect.width + WALL_PADDING,
                    rect.height + WALL_PADDING
                );
            });

            // Then, fill walls with wall color on top of the padding
            ctx.fillStyle = COLORS[objectType];
            rectangles.forEach(rect => {
                ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
            });
        } else { // Other object types
            ctx.fillStyle = COLORS[objectType];
            rectangles.forEach(rect => {
                ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
            });
        }
    }
}


const BALL_RADIUS = 10;
class Ball {
    constructor(x, y, speed, movePoints) {
        this.baseX = x;
        this.baseY = y;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.movePoints = movePoints;
        this.currentMovePoint = -1;
    }

    move(dt) {
        if (this.movePoints.length === 0) return;

        // console.log(this.currentMovePoint);

        let nextPoint = {x: this.baseX, y: this.baseY};
        if (this.currentMovePoint === -1)
            nextPoint = {x: this.baseX, y: this.baseY};
        else {
            nextPoint.x += this.movePoints[this.currentMovePoint].x;
            nextPoint.y += this.movePoints[this.currentMovePoint].y;
        }  


        const deltaX = nextPoint.x - this.x;
        const deltaY = nextPoint.y - this.y; // Corrected line
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (distance < this.speed * dt) {
            this.x = nextPoint.x;
            this.y = nextPoint.y;
            this.currentMovePoint++;
            if (this.currentMovePoint >= this.movePoints.length) {
                this.currentMovePoint = -1; // Loop
            }
        } else {
            this.x += (deltaX / distance) * this.speed * dt;
            this.y += (deltaY / distance) * this.speed * dt;
        }
    }

    draw() {
        ctx.fillStyle = 'rgb(230,0,0)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, BALL_RADIUS, 0, Math.PI*2);
        ctx.fill();

        // Add a small stroke
        ctx.strokeStyle = 'rgb(100,10,10)';
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    drawMovePoints() {
        ctx.fillStyle = 'pink';
        ctx.beginPath();
        ctx.arc(this.baseX, this.baseY, 5, 0, Math.PI*2);
        ctx.fill();
        // draw text of the movepoint number
        ctx.fillStyle = 'black';
        ctx.fillText(-1, this.baseX, this.baseY);

        for (const point of this.movePoints) {
            ctx.fillStyle = 'pink';
            ctx.beginPath();
            ctx.arc(point.x + this.baseX, point.y + this.baseY, 5, 0, Math.PI*2);
            ctx.fill();
            // draw text of the movepoint number
            ctx.fillStyle = 'black';
            ctx.fillText(this.movePoints.indexOf(point), point.x + this.baseX, point.y + this.baseY);
        }
    }
}

let balls = [];
const sideToSide = [{x: 260, y: 0}];
balls.push(new Ball(370, 320, 100, sideToSide));
balls.push(new Ball(370, 340, 125, sideToSide));
balls.push(new Ball(370, 360, 150, sideToSide));
balls.push(new Ball(370, 380, 175, sideToSide));
balls.push(new Ball(370, 400, 200, sideToSide));



let shouldUpdateNavigation = true;
let isGameStillTheSame = false;
let playingGame = false;
enterGame.addEventListener('click', async e => {
    if (playingGame) return;
    playingGame = true;
    gamenavigation.classList.add('topLeft');
    startGame();
    await canvas.requestPointerLock();
})


function startGame() {
    loadLevel(CURRENT_LEVEL);
}

///////////////////////   Level editor   ///////////////////////

function exportWalls() {
    const wallsArray = [];
    for (let row = 0; row < LEVEL_GRID.length; row++) {
        for (let col = 0; col < LEVEL_GRID[row].length; col++) {
            let objectId = LEVEL_GRID[row][col];
            if (objectId === 0) continue;
            wallsArray.push([row, col, objectId]);
        }
    }

    // Convert the array of wall objects into a formatted string
    const exportString = `${JSON.stringify(wallsArray)},`;
    navigator.clipboard.writeText(exportString);

    alert('Level exported and copied to clipboard!');
}


function shiftBlocks(direction) {
    const deltaRow = direction === 'up' ? -1 : direction === 'down' ? 1 : 0;
    const deltaCol = direction === 'left' ? -1 : direction === 'right' ? 1 : 0;

    const newGrid = [];
    for (let row = 0; row < ROWS; row++) {
        newGrid[row] = [];
        for (let col = 0; col < COLS; col++) {
            newGrid[row][col] = 0;
        }
    }

    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const object = LEVEL_GRID[row][col];
            if (object !== 0) {
                const newRow = row + deltaRow;
                const newCol = col + deltaCol;

                // Check boundaries
                if (newRow >= 0 && newRow < ROWS && newCol >= 0 && newCol < COLS) {
                    if (newGrid[newRow][newCol] === 0) { // Check if target cell is empty
                        newGrid[newRow][newCol] = object;
                    }
                    // If target cell is occupied, you can decide to overwrite or skip
                    // Currently, it skips moving this block to prevent overlap
                }
                // If out of bounds, skip moving this block
            }
        }
    }

    // Update the LEVEL_GRID
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            LEVEL_GRID[row][col] = newGrid[row][col];
        }
    }

    greedyMeshObjects();
}




let CURRENT_OBJECT = 1;
function toggleObject(row, col) {
    if (LEVEL_GRID[row][col] === CURRENT_OBJECT) {
        LEVEL_GRID[row][col] = 0;
    } else {
        LEVEL_GRID[row][col] = CURRENT_OBJECT;
    }

    greedyMeshObjects();
}

const _LEVEL_EDITOR_CONTROLS = document.querySelector('div.level-editor-controls');
let LEVEL_EDITOR_ENABLED = false;
document.addEventListener('keydown', e => {
    if (LEVEL_EDITOR_ENABLED) {
        // if key is within object ids, set current object to that id
        if (OBJECT_IDS.hasOwnProperty(e.key)) {
            CURRENT_OBJECT = parseInt(e.key);
            return;
        }

        // Handle arrow keys for shifting blocks
        switch (e.key) {
            case 'ArrowUp':
                shiftBlocks('up');
                break;
            case 'ArrowDown':
                shiftBlocks('down');
                break;
            case 'ArrowLeft':
                shiftBlocks('left');
                break;
            case 'ArrowRight':
                shiftBlocks('right');
                break;
            default:
                break;
        }
    }
    

    if (e.key != "F2") return;

    _LEVEL_EDITOR_CONTROLS.classList.toggle('hidden');
    LEVEL_EDITOR_ENABLED = !LEVEL_EDITOR_ENABLED;
    if (!LEVEL_EDITOR_ENABLED) return;
});

// left click = add/remove a wall
canvas.addEventListener('click', (e) => {
    if (!LEVEL_EDITOR_ENABLED) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    const col = Math.floor(mouseX / GRID_SIZE);
    const row = Math.floor(mouseY / GRID_SIZE);

    toggleObject(row, col);
});

const _EXPORT_BUTTON = _LEVEL_EDITOR_CONTROLS.querySelector('#export-level');
_EXPORT_BUTTON.addEventListener('click', exportWalls);


function drawCheckeredBackground() {
    // const rows = canvas.height / GRID_SIZE;
    // const cols = canvas.width / GRID_SIZE;
    
    // Draw first
    for (let y = 0; y < canvas.height; y += GRID_SIZE * 2) {
        for (let x = 0; x < canvas.width; x += GRID_SIZE * 2) {
            ctx.fillStyle = 'rgba(224,218,254,0.65)';
            ctx.fillRect(x, y, GRID_SIZE, GRID_SIZE);
            ctx.fillRect(x + GRID_SIZE, y + GRID_SIZE, GRID_SIZE, GRID_SIZE);
        }
    }

    // Draw second
    for (let y = 0; y < canvas.height; y += GRID_SIZE * 2) {
        for (let x = -GRID_SIZE; x < canvas.width; x += GRID_SIZE * 2) {
            ctx.fillStyle = 'rgba(240,240,255,0.65)';
            ctx.fillRect(x, y, GRID_SIZE, GRID_SIZE);
            ctx.fillRect(x + GRID_SIZE, y + GRID_SIZE, GRID_SIZE, GRID_SIZE);
        }
    }
}

function drawLevelText() {
    ctx.fillStyle = 'white';
    ctx.font = `64px Determination Mono`;
    ctx.textAlign = "center";
    ctx.fillText(`LEVEL ${CURRENT_LEVEL}`, width/2, 50);
}

let isDocumentHidden = false;
let IGNORE_NEXT_DT = false;
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        isDocumentHidden = true;
    } else {
        isDocumentHidden = false;
        IGNORE_NEXT_DT = true;
    }
});

let lastTime;
let gameLoopId;
function gameLoop(currentTime) {
    gameLoopId = requestAnimationFrame(gameLoop);

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

                resizeCanvas();
                updateScaleFactors();
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
    drawCheckeredBackground();

    drawSolidObjects();

    player.draw();

    for (const ball of balls) {
        ball.move(deltaTime);
        ball.draw();
    }
    
    
    drawLevelText();

    
}

gameLoopId = requestAnimationFrame(gameLoop);

document.addEventListener('gameSwitch', e => {
    const gameName = e.detail;
    if (gameName == "hardestgame") {
        gameLoopId = requestAnimationFrame(animate);
    } else {
        cancelAnimationFrame(gameLoopId);
        gameLoopId = null;
    }
})
