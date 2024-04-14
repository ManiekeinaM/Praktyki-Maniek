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
    pipeContainer.style.right = `-10%`;

    let pipeTop = document.createElement('img');
    pipeTop.className = 'pipe top';
    pipeTop.src = 'assets/pipe-top.png';
    pipeContainer.appendChild(pipeTop);

    let pipeBottom = document.createElement('img');
    pipeBottom.className = 'pipe bottom';
    pipeBottom.src = 'assets/pipe-bottom.png';
    pipeContainer.appendChild(pipeBottom);

    pipesDiv.appendChild(pipeContainer);

    let gapPosition = Math.round(Math.random() * 60 - 30);
    pipeContainer.style.top = `${50 + gapPosition}%`;

    pipes.push({ container: pipeContainer, top: pipeTop, bottom: pipeBottom, givenPoints: false });

}

let pipeSpeed = 0.4; // percent!

function movePipes() {
    for (let i = 0; i < pipes.length; i++) {
        let pipe = pipes[i];
        let container = pipe.container;


        let right = parseFloat(container.style.right);
        right += pipeSpeed;

        container.style.right = `${right}%`;

        if (!pipe.givenPoints && right > 70) {
            pipe.givenPoints = true;
            incrementHighscore();
        }

        if (right > 100) {
            // Pipe is out of the screen
            pipesDiv.removeChild(container);
            // pipesDiv.removeChild(bottomPipe);
            // pipesDiv.removeChild(topPipe);

            // Remove pipe from array
            pipes.splice(i, 1);
            i--;
        }
    }
}

// Game variables

let birdY = 50; // percent!
let birdVelocity = 0;
const birdGravity = 0.05;
const jumpHeight = -1.25;


function collisionDetection() {
    // Check if bird collides with a pipe
    let checkedPipes = 0;
    for (let i = 0; i < pipes.length; i++) {
        let pipe = pipes[i];

        let container = pipe.container;
        let right = parseFloat(container.style.right);

        if (right > 75) continue;
        checkedPipes++;


        if (checkedPipes == 1 && right > 61.5 && right < 75) {
            // Inside the bounds of a pipe. Check if the bird is inside the gap
            let gapTop = parseFloat(container.style.top);
            let difference = Math.abs(birdY - gapTop);

            if (difference > 11) return true;

            break;
        }
    }

    // Check if bird collides with the ground or top of the screen
    if (birdY < -10 || birdY > 95) {
        return true;
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
        p.innerText = `#${i + 1}: ${score}`;
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
    birdVelocity = jumpHeight;
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
}


function death() {
    running = false;
    gameover.classList.remove('hidden');
    highscore.classList.remove('playing');

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


function gameLoop() {
    if (CURRENT_GAME != "flappymaniek") {
        requestAnimationFrame(gameLoop);
        return;
    };
    if (!running) {
        requestAnimationFrame(gameLoop);
        return;
    }

    frameCount++;

    // Update bird position
    birdVelocity += birdGravity;
    birdVelocity = Math.min(birdVelocity, 1);
    birdY += birdVelocity;
    bird.style.top = `${birdY}%`;

    // Detect collision
    let dead = collisionDetection();
    if (dead)
        death();

    // Create pipes every 100 frames
    if (frameCount % 100 == 0) {
        // console.log("Creating pipe");
        createPipe();
    }

    // Move pipes
    movePipes();

    // Continue the game loop
    requestAnimationFrame(gameLoop);
}

screen.addEventListener('click', e => {

    if (running) {
        birdVelocity = jumpHeight;
    }

    if (!running)
        restart();
});

// Start the game loop
gameLoop();