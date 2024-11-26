// Get the game screen
const screen = document.querySelector('.flappymaniek .screen');

// Create the bird
const bird = document.createElement('img');
bird.src = 'assets/maniek-faces/screensaver-face.png';
bird.classList.add('bird');

bird.style.top = '50%';

screen.appendChild(bird);

// Create the pipes
let pipes = [];

const pipesDiv = document.querySelector('.flappymaniek .screen .pipes');
function createPipe() {
    let pipeContainer = document.createElement('div');
    pipeContainer.className = 'pipe-container';
    pipeContainer.style.right = `-10%`; // start offscreen

    let pipeTop = document.createElement('img');
    pipeTop.className = 'pipe top';
    pipeTop.src = 'assets/flappy/pipe-top.png';
    pipeContainer.appendChild(pipeTop);

    let pipeBottom = document.createElement('img');
    pipeBottom.className = 'pipe bottom';
    pipeBottom.src = 'assets/flappy/pipe-bottom.png';
    pipeContainer.appendChild(pipeBottom);

    pipesDiv.appendChild(pipeContainer);

    let gapPosition = Math.round(Math.random() * 60 - 30);
    pipeContainer.style.top = `${50 + gapPosition}%`;

    let gapSize = bird.offsetHeight * 4;
    pipeContainer.style.gap = `${gapSize}px`;

    pipes.push({ container: pipeContainer, top: pipeTop, bottom: pipeBottom, givenPoints: false });
}

function movePipes(deltaTime) {
    for (let i = 0; i < pipes.length; i++) {
        let pipe = pipes[i];
        let container = pipe.container;

        let right = parseFloat(container.style.right);
        right += pipeSpeed * deltaTime;

        container.style.right = `${right}%`;

        if (!pipe.givenPoints && right > 70) {
            pipe.givenPoints = true;
            incrementHighscore();
        }

        if (right > 100) {
            // Pipe is out of the screen
            pipesDiv.removeChild(container);
            pipes.splice(i, 1);
            i--;
        }
    }
}

// Game variables
let birdY = 50; // percent!
let birdVelocity = 0;
const birdGravity = 160; 
const jumpVelocity = -70;
const pipeSpeed = 25; 

let lastTime = 0;
let pipeSpawnTimer = 0;
const pipeSpawnInterval = 1.5; // seconds


function collisionDetection() {
    const birdRect = bird.getBoundingClientRect();
    const screenRect = screen.getBoundingClientRect();

    // Check if bird collides with the ground or top of the screen
    if (birdRect.top <= screenRect.top || birdRect.bottom >= screenRect.bottom) {
        return true;
    }

    // Calculate bird's hitbox (slightly smaller than the actual image)
    const hitboxPadding = 0.1; // 10% padding
    const hitboxLeft = birdRect.left + birdRect.width * hitboxPadding;
    const hitboxRight = birdRect.right - birdRect.width * hitboxPadding;
    const hitboxTop = birdRect.top + birdRect.height * hitboxPadding;
    const hitboxBottom = birdRect.bottom - birdRect.height * hitboxPadding;

    // Check if bird collides with a pipe
    for (let pipe of pipes) {
        const pipeTopRect = pipe.top.getBoundingClientRect();
        const pipeBottomRect = pipe.bottom.getBoundingClientRect();

        // Early exit if pipe is not in collision range
        if (hitboxRight < pipeTopRect.left || hitboxLeft > pipeTopRect.right) {
            continue;
        }

        // Check collision with top pipe
        if (hitboxTop < pipeTopRect.bottom) {
            return true;
        }

        // Check collision with bottom pipe
        if (hitboxBottom > pipeBottomRect.top) {
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
        // pipesDiv.removeChild(pipe.top);
        // pipesDiv.removeChild(pipe.bottom);
    }
    pipes = [];

    // Reset bird parameters
    birdY = 50;
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
        birdY += 2;
        bird.style.top = `${birdY}%`;
        bird.classList.add('falling');

        // Stop the animation when the bird hits the ground
        if (birdY >= 96) {
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
    birdVelocity = Math.min(birdVelocity, 300); // Cap max velocity
    birdY += birdVelocity * deltaTime;
    bird.style.top = `${birdY}%`;

    // Move pipes
    movePipes(deltaTime);

    // Spawn pipes
    pipeSpawnTimer += deltaTime;
    if (pipeSpawnTimer >= pipeSpawnInterval) {
        createPipe();
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

