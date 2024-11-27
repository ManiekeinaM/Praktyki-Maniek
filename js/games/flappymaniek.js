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
console.log(birdY);

const pipesDiv = document.querySelector('.flappymaniek .screen .pipes');
let latestPipe;

function randomizePipeGap() {
    return 50 + Math.round(Math.random() * 60 - 30);
}
// Default pipe stats, unless specified otherwise
function createPipe(emDifference = pipeSpawnInterval*PIPE_SPEED, gapPosition = randomizePipeGap()) {
    let pipeContainer = document.createElement('div');
    pipeContainer.className = 'pipe-container';
    pipeContainer.style.position = 'absolute';

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

    pipeContainer.style.top = `${gapPosition}%`

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
            createPipe();
            let lastPipeGap = parseFloat(latestPipe.style.top);
            createPipe(4, lastPipeGap-6);
            createPipe(4, lastPipeGap-12);
            createPipe(4, lastPipeGap-6);
            createPipe(4, lastPipeGap);
        }
    }, // 5x pipe, going up

    {
        weight: 5, 
        layout: function() {
            createPipe();
            let lastPipeGap = parseFloat(latestPipe.style.top);
            createPipe(6, lastPipeGap-10);
            createPipe(6, lastPipeGap);
            createPipe(6, lastPipeGap-10);
        }
    }, // zig zag

    {
        weight: 3,
        layout: function() {
            createPipe();
            let lastPipeGap = parseFloat(latestPipe.style.top);
            createPipe(4, lastPipeGap-8);
            createPipe(4, lastPipeGap-16);
            createPipe(4, lastPipeGap-24);
            createPipe(3, lastPipeGap-24);
            createPipe(3, lastPipeGap-24);
            createPipe(5, lastPipeGap-8);

        }
    }
]
function createRandomPipe() {
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
            incrementHighscore();
            pipe.givenPoints = true;
        }
    }
}


function collisionDetection() {
    const birdRect = bird.getBoundingClientRect();
    const collisionMargin = 10;

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


// Highscore

let currentScore = 0;

const gameover = document.querySelector('.flappymaniek .screen .gameover');
const highscore = document.querySelector('.flappymaniek .screen .highscore');
const highscoresList = document.querySelector('#highscoresList');

const HIGHSCORES_COOKIE_NAME = 'flappy-highscores';
let highscores = JSON.parse(getCookie(HIGHSCORES_COOKIE_NAME) || '[]');

function updateHighscores() {
    highscoresList.innerHTML = '';

    for (let i = 0; i < highscores.length; i++) {
        let score = highscores[i];

        let p = document.createElement('p');
        p.innerText = `#${i + 1}: ${score} pkt`;
        highscoresList.appendChild(p);
    }

}
updateHighscores();

function incrementHighscore() {
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
    updateHighscores();

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

    // Add the current score to the high scores and sort the array in descending order
    highscores.push(currentScore);
    highscores.sort((a, b) => b - a);

    // Keep only the top 5 scores
    highscores = highscores.slice(0, 5);

    // Store the high scores in a cookie
    setCookie(HIGHSCORES_COOKIE_NAME, JSON.stringify(highscores), 9999);

    updateHighscores();

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
    if (CURRENT_GAME != "flappymaniek") {
        requestAnimationFrame(gameLoop);
        return;
    };
    if (!running) {
        requestAnimationFrame(gameLoop);
        return;
    }

    const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
    /*
    // testing framerate cap
    if (deltaTime < 1/10) {
        requestAnimationFrame(gameLoop);
        return;
    }
    */
    lastTime = currentTime;


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

