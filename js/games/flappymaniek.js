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
            incrementHighscore();
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
        let div = document.createElement('div');

        let scoreEntry = highscores[i];
        if (scoreEntry.score && scoreEntry.date) {
            let timeDiff = Date.now() - new Date(scoreEntry.date).getTime();
            let minutes = Math.floor(timeDiff / (1000 * 60))
            let hours = Math.floor(minutes / 60);
            let days = Math.floor(hours / 24);
            let dateText = '';

            if (minutes < 1) {
                dateText = 'przed chwilą';
            } else if (minutes < 60) {
                let subtext = '';
                if (minutes === 1)
                    subtext = 'ę';
                else if (minutes < 5)
                    subtext = 'y';

                dateText = `${minutes} minut${subtext} temu`;
            } else if (hours < 24) {
                let subtext = '';
                if (hours === 1)
                    subtext = 'ę';
                else if (hours < 5)
                    subtext = 'y';

                dateText = `${hours} godzin${subtext} temu`;
            } else {
                let subtext = '';
                if (days === 1)
                    subtext = 'zień';
                else
                    subtext = 'ni';

                dateText = `${days} d${subtext} temu`;
            }

            
            let p = document.createElement('p');
            p.innerHTML = `#${i + 1}: ${scoreEntry.score} pkt`;
            let time = document.createElement('p');
            time.classList.add('scoreTime');
            time.innerHTML = `(${dateText})`;
            
            div.appendChild(p);
            div.appendChild(time);
        } else if (scoreEntry.score) {
            let p = document.createElement('p');
            p.innerText = `#${i + 1}: ${scoreEntry.score} pkt`;

            div.appendChild(p);
        } else if (scoreEntry) {
            let p = document.createElement('p');
            p.innerText = `#${i + 1}: ${scoreEntry} pkt`;

            div.appendChild(p);
        }

        highscoresList.appendChild(div);
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
    highscores.push({ score: currentScore, date: new Date() });
    highscores.sort((a, b) => {
        const scoreA = a.score !== undefined ? a.score : a;
        const scoreB = b.score !== undefined ? b.score : b;
        return scoreB - scoreA;
    });

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

