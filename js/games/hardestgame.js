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
const GAME_WIDTH = 1280 - 96;
const GAME_HEIGHT = 1024 - 96;

function resizeCanvas() {
    const aspectRatio = GAME_WIDTH / GAME_HEIGHT;
    let newWidth = canvas.innerWidth;
    let newHeight = canvas.innerHeight;

    if (newWidth / newHeight > aspectRatio) {
        newWidth = newHeight * aspectRatio;
    } else {
        newHeight = newWidth / aspectRatio;
    }

    canvas.width = `${newWidth}`;
    canvas.height = `${newHeight}`;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Scale factor for drawing
let scaleX = canvas.width / parseFloat(canvas.style.width);
let scaleY = canvas.height / parseFloat(canvas.style.height);

// Update scale factors on resize
window.addEventListener('resize', () => {
    scaleX = canvas.width / parseFloat(canvas.style.width);
    scaleY = canvas.height / parseFloat(canvas.style.height);
});


// TODO - add a level creator, import it manually into the levels
const LEVELS = [];

let shouldUpdateNavigation = true;
let isGameStillTheSame = false;
let playingGame = false;
enterGame.addEventListener('click', e => {
    if (playingGame) return;
    playingGame = true;
    gamenavigation.classList.add('topLeft');
})



// const MANIEK_FACE = 






let lastTime;
function gameLoop(currentTime) {
    const deltaTime = (currentTime - lastTime)/1000 
                    || 1/60;
    lastTime = currentTime;

    // UPDATES FOR GAME CHANGES
    {
        if (shouldUpdateNavigation) {
            if (playingGame && isGameStillTheSame && !isDocumentHidden) {
                shouldUpdateNavigation = false;
                gamenavigation.classList.add('topLeft');
                titleScreen.classList.add('hidden-game')
            } else {
                gamenavigation.classList.remove('topLeft'); 
            }
        }
        
        if (CURRENT_GAME != "hardestgame") {
            if (isGameStillTheSame) {
                ctx.clearRect(0, 0, width, height);
                shouldUpdateNavigation = true;
            }
            isGameStillTheSame = false;
            requestAnimationFrame(gameLoop);
            return;
        }
        isGameStillTheSame = true;
    
        if (!playingGame) {
            requestAnimationFrame(gameLoop);
            return;
        }
    }
    
    // GAME




    ctx.fillStyle = 'black';
    ctx.fillRect(50,50,100,100);

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);