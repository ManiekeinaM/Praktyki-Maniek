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
let GAME_WIDTH = 1000;
let GAME_HEIGHT = 800;
let scaleX = canvas.width / parseFloat(canvas.style.width);
let scaleY = canvas.height / parseFloat(canvas.style.height);

function resizeCanvas() {
    const aspectRatio = GAME_WIDTH / GAME_HEIGHT;

    console.log("resizing");
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    width = canvas.width;
    height = canvas.height;
}
function updateScaleFactors() {
    scaleX = canvas.width / parseFloat(canvas.style.width);
    scaleY = canvas.height / parseFloat(canvas.style.height);
}
window.addEventListener('resize', () => {
    resizeCanvas();
    updateScaleFactors();
});
resizeCanvas();
updateScaleFactors();

canvas.addEventListener('mousemove', e => {
    const deltaX = e.movementX;
    const deltaY = e.movementY;
    player.x += deltaX;
    player.y += deltaY;
})




// TODO - add a level creator, import it manually into the levels
const LEVELS = [];

let shouldUpdateNavigation = true;
let isGameStillTheSame = false;
let playingGame = false;
enterGame.addEventListener('click', async e => {
    if (playingGame) return;
    playingGame = true;
    gamenavigation.classList.add('topLeft');
    await canvas.requestPointerLock();
})



const player = {
    x: GAME_WIDTH/2,
    y: GAME_HEIGHT/2,
    radius: 25,
    move: function(x, y) {
        this.x += x;
        if (this.x < 0) this.x = 0;
        if (this.x > GAME_WIDTH) this.x = GAME_WIDTH;
        this.y += y;
        if (this.y < 0) this.y = 0;
        if (this.y > GAME_WIDTH) this.y = GAME_WIDTH;
    },
    draw: function() {
        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        ctx.fill();
    }
};


// const MANIEK_FACE = 




let level1 = new Image();
level1.src = 'assets/hardestgame/level1-test.png';

let lastTime;
function gameLoop(currentTime) {
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
                console.log("this thing");
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
            requestAnimationFrame(gameLoop);
            return;
        } else {
            
        }
        isGameStillTheSame = true;
    
        if (!playingGame) {
            requestAnimationFrame(gameLoop);
            return;
        }
    }
    
    // GAME
    // console.log("gaming");
    ctx.clearRect(0, 0, width, height);

    ctx.drawImage(level1, 0, 0, GAME_WIDTH, GAME_HEIGHT);
    player.draw();

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);