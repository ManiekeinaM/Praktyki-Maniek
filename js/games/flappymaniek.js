// Get the game screen
const screen = document.querySelector('.flappymaniek .screen');

// Create the bird
const bird = document.createElement('img');
bird.src = 'assets/maniek-faces/screensaver-face.png';
bird.classList.add('bird');

bird.style.top = '50%';

screen.appendChild(bird);

// Game variables
let birdVelocity = 0;
const birdGravity = 48; 
const jumpVelocity = -22;
const PIPE_SPEED = 13; // em's per second
const PIPE_GAP = 12;

let lastTime = 0;
let pipeSpawnTimer = 0;
const pipeSpawnInterval = 1.5; // seconds

// Create the pipes
let pipes = [];

let EM_CONVERSION = emToPx(1);
let WIDTH_IN_EM = screen.offsetWidth / EM_CONVERSION;
let HEIGHT_IN_EM = screen.offsetHeight / EM_CONVERSION;
function emToPx(em) {
    const fontSize = parseFloat(getComputedStyle(screen).fontSize);
    return em * fontSize;
}

window.addEventListener('resize', () => {
    EM_CONVERSION = emToPx(1);
    WIDTH_IN_EM = screen.offsetWidth / EM_CONVERSION;
    HEIGHT_IN_EM = screen.offsetHeight / EM_CONVERSION;
});

let birdY = HEIGHT_IN_EM/2; 

const pipesDiv = document.querySelector('.flappymaniek .screen .pipes');
let latestPipe;

// Return pipe gap height, in ems, +- of the height +- pipe gap
function randomizePipeGap(fromTop = 0, fromBottom = 0) {
    const ACCOUNT_FOR_PIPEGAP = PIPE_GAP+1;
    const ELIGIBLE_HEIGHT = HEIGHT_IN_EM - ACCOUNT_FOR_PIPEGAP - fromTop - fromBottom;

    

    const gapPosition = Math.random() * ELIGIBLE_HEIGHT - ELIGIBLE_HEIGHT/2 + fromTop/2;
    //console.log(HEIGHT_IN_EM, ELIGIBLE_HEIGHT, gapPosition);
    //console.log(`lower bound: ${-ELIGIBLE_HEIGHT/2 + fromTop/2}, higher bound: ${ELIGIBLE_HEIGHT/2 + fromTop/2}`);

    //return -ELIGIBLE_HEIGHT/2 + fromTop/2; // higher bound (pipes always spawn at top)
    //return ELIGIBLE_HEIGHT/2 + fromTop/2; // higher bound (pipes always spawn at bottom)
    return gapPosition;
}
// Default pipe stats, unless specified otherwise
function createPipe(emDifference = pipeSpawnInterval*PIPE_SPEED, gapPosition = randomizePipeGap()) {
    let pipeContainer = document.createElement('div');
    pipeContainer.className = 'pipe-container';
    pipeContainer.style.position = 'absolute';
    pipeContainer.style.gap = `${PIPE_GAP}em`;

    if (!latestPipe)
        pipeContainer.style.left = `${WIDTH_IN_EM}em`; // Start just outside the right edge
    else {
        let lastPipeLeft = parseFloat(latestPipe.style.left);
        pipeContainer.style.left = `${lastPipeLeft + emDifference}em`;
    }
        

    let pipeTop = document.createElement('img');
    pipeTop.className = 'pipe top';
    pipeTop.src = 'assets/flappy/pipe-top.png';
    pipeContainer.appendChild(pipeTop);

    let pipeBottom = document.createElement('img');
    pipeBottom.className = 'pipe bottom';
    pipeBottom.src = 'assets/flappy/pipe-bottom.png';
    pipeContainer.appendChild(pipeBottom);

    pipesDiv.appendChild(pipeContainer);

    pipeContainer.style.top = `calc(${gapPosition}em + 50%)`;

    latestPipe = pipeContainer;
    let pipe = { container: pipeContainer, top: pipeTop, bottom: pipeBottom, givenPoints: false };
    pipes.push(pipe);
    return pipe;
}

const pipeLayouts = [
    {
        weight: 90, 
        layout: function() {
            createPipe();
        }
    }, // single pipe

    {
        weight: 5, 
        layout: function() {
            let pipeGap = randomizePipeGap(4);
            createPipe(undefined, pipeGap);
            createPipe(4, pipeGap-2);
            createPipe(4, pipeGap-4);
            createPipe(4, pipeGap-2);
            createPipe(4, pipeGap);
        }
    }, // 5x pipe, going up

    {
        weight: 5, 
        layout: function() {
            let pipeGap = randomizePipeGap(4);
            createPipe(undefined, pipeGap);
            createPipe(6, pipeGap-4);
            createPipe(6, pipeGap);
            createPipe(6, pipeGap-4);
        }
    }, // zig zag

    {
        weight: 3,
        layout: function() {
            let pipeGap = randomizePipeGap(6);
            createPipe(undefined, pipeGap);
            createPipe(4, pipeGap-2);
            createPipe(4, pipeGap-4);
            createPipe(4, pipeGap-6);
            createPipe(3, pipeGap-6);
            createPipe(3, pipeGap-6);
            createPipe(5, pipeGap-2);

        }
    }
]
function createRandomPipe() {
    if (pipes.length > 30)
        return;

    const totalWeight = pipeLayouts.reduce((sum, layout) => sum + layout.weight, 0);
    let random = Math.random() * totalWeight;
    for (let layout of pipeLayouts) {
        if (random < layout.weight) {
            layout.layout();
            return;
        }
        random -= layout.weight;
    }
    createPipe() // if nothing else was somehow chosen
}

function movePipes(deltaTime) {
    for (let i = 0; i < pipes.length; i++) {
        let pipe = pipes[i];
        let container = pipe.container;

        // Get the current left position in pixels
        let currentLeft = parseFloat(container.style.left);

        // Calculate the new left position
        let newLeft = currentLeft - PIPE_SPEED * deltaTime;

        // Update the pipe's position
        container.style.left = `${newLeft}em`;

        // Remove the pipe if it goes off-screen
        if (newLeft < -4) {
            pipesDiv.removeChild(container);
            pipes.splice(i, 1);
            i--;
            continue;
        }

        // Check if the bird passed through the gap
        if (newLeft < 5 && !pipe.givenPoints) {
            incrementScore();
            pipe.givenPoints = true;
        }
    }
}


function collisionDetection() {
    const birdRect = bird.getBoundingClientRect();
    const collisionMargin = 0.75 * EM_CONVERSION;

    let birdTop = parseFloat(bird.style.top);
    if (birdTop < -1 || birdTop > HEIGHT_IN_EM)
        return true;

    for (let pipe of pipes) {
        const pipeTopRect = pipe.top.getBoundingClientRect();
        const pipeBottomRect = pipe.bottom.getBoundingClientRect();

        if (
            birdRect.right > pipeTopRect.left+collisionMargin &&
            birdRect.left < pipeTopRect.right - collisionMargin &&
            (birdRect.top < pipeTopRect.bottom - collisionMargin || birdRect.bottom > pipeBottomRect.top + collisionMargin)
        ) {
            return true;
        }
    }

    return false;
}


// Highscore system
let currentScore = 0;

import { HighScores } from '../highscores.js';
const highscoresList = document.querySelector('.flappymaniek.highscores > .highscoresList');
const highscoreManager = new HighScores(highscoresList);

const gameover = document.querySelector('.flappymaniek .screen .gameover');
const highscore = document.querySelector('.flappymaniek .screen .highscore');

highscoreManager.updateHighscores();

function incrementScore() {
    currentScore++;
    highscore.innerText = currentScore;
}

// Game loop
let running = false;
let frameCount = 0;
let fallInterval;

let restartDebounce = false;
function restart() {
    if (restartDebounce) return;

    // Reset pipes
    for (let i = 0; i < pipes.length; i++) {
        let pipe = pipes[i];
        pipesDiv.removeChild(pipe.container);
    }
    pipes = [];
    latestPipe = null;

    // Reset bird parameters
    birdY = HEIGHT_IN_EM/2;
    birdVelocity = jumpVelocity;
    running = true;
    frameCount = 0;

    gameover.classList.add('hidden');
    highscore.classList.add('playing');

    // Reset highscore
    highscore.innerText = `0`;
    currentScore = 0;
    highscoreManager.updateHighscores();

    if (fallInterval) {
        // Stop falling animation
        clearInterval(fallInterval);
        bird.classList.remove('falling');
    }

    lastTime = performance.now();
    pipeSpawnTimer = 0;
}


function death() {
    running = false;
    gameover.classList.remove('hidden');
    highscore.classList.remove('playing');

    highscore.innerText = `${currentScore}`

    // Add the current score to the high scores
    highscoreManager.addScore(currentScore);

    highscoreManager.updateHighscores();

    // Add falling animation
    fallInterval = setInterval(() => {
        birdY += 1;
        bird.style.top = `${birdY}em`;
        bird.classList.add('falling');

        // Stop the animation when the bird hits the ground
        if (birdY >= HEIGHT_IN_EM) {
            clearInterval(fallInterval);
        }
    }, 20);

    restartDebounce = true;
    setTimeout(() => {
        restartDebounce = false;
    }, 1000);
}

function gameLoop(currentTime) {
    const deltaTime = (currentTime - lastTime)/1000 
                    || 1/60;
    lastTime = currentTime;

    if (CURRENT_GAME != "flappymaniek") {
        requestAnimationFrame(gameLoop);
        return;
    };
    if (!running) {
        requestAnimationFrame(gameLoop);
        return;
    }


    // Update bird position
    birdVelocity += birdGravity * deltaTime;
    birdVelocity = Math.min(birdVelocity, 60); // Cap max velocity
    birdY += birdVelocity * deltaTime;
    bird.style.top = `${birdY}em`;

    // Move pipes
    movePipes(deltaTime);

    // Spawn pipes
    pipeSpawnTimer += deltaTime;
    if (pipeSpawnTimer >= pipeSpawnInterval) {
        createRandomPipe();
        pipeSpawnTimer = 0;
    }

    // Detect collision
    let dead = collisionDetection();
    if (dead)
        death();

    // Continue the game loop
    requestAnimationFrame(gameLoop);
}



screen.addEventListener('click', e => {
    if (running) {
        birdVelocity = jumpVelocity;
    }

    if (!running)
        restart();
});

// Start the game loop
lastTime = performance.now();
requestAnimationFrame(gameLoop);

