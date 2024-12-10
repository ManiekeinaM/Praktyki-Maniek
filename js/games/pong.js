const gameOverlay = document.querySelector('#game-overlay'); // pause menu

// Set up canvas
const canvas = document.querySelector('#game-canvas');
const ctx = canvas.getContext('2d', {willReadFrequently: true});
ctx.imageSmoothingEnabled = false;
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
let width = canvas.width;
let height = canvas.height;

let speedMultiplier = isSmallMobile ? 0.5 : 1;

const rocketTimes = {
    left: document.querySelector('.rocket-timer-left > .rocket-time'),
    right: document.querySelector('.rocket-timer-right > .rocket-time')
}

const pongScores = {left: 0, right: 0};
const SCORE_FOR_LB = {
    normal: 0,
    onelife: 0,
};
function addScore(side, amount) {
    pongScores[side] += amount;
    updateScores();

    if (side == 'left') {
        if (pongScores.right == 0)
            SCORE_FOR_LB.onelife += amount;
        SCORE_FOR_LB.normal += amount;
    }

    checkResults();
}

const SCORE_TEXT = {
    'left': document.querySelector('.left-score'),
    'lefth1': document.querySelector('.left-score > h1'),
    'right': document.querySelector('.right-score'),
    'righth1': document.querySelector('.right-score > h1')
}
function updateScores() {
    SCORE_TEXT.lefth1.textContent = pongScores.left;
    SCORE_TEXT.righth1.textContent = pongScores.right;

    if (pongScores.left > pongScores.right) {
        SCORE_TEXT.left.classList.add('winning');
    } else if (pongScores.right > pongScores.left) {
        SCORE_TEXT.right.classList.add('winning');
    } else {
        SCORE_TEXT.left.classList.remove('winning');
        SCORE_TEXT.right.classList.remove('winning');
    }
}


import { HighScores } from '../highscores.js';

// Initialize highscore managers
const HIGHSCORE_MANAGERS = [
    // aiType: {normal: highscoreManagerNormal, onelife: highscoreManagerOnelife}
];
for (let i=0; i<3; i++) {
    const normal = document.querySelector(`.highscoresList[data-highscorecookie="pong-mode${i}"]`);
    const onelife = document.querySelector(`.highscoresList[data-highscorecookie="pong-mode${i}-onelife"]`);
    // console.log(normal, onelife);
    HIGHSCORE_MANAGERS[i] = {normal: new HighScores(normal), onelife: new HighScores(onelife)};
    HIGHSCORE_MANAGERS[i].normal.updateHighscores();
    HIGHSCORE_MANAGERS[i].onelife.updateHighscores();
}

let SCORE_GOAL = 50;
let IN_FREEPLAY = false;
function checkResults() {
    if (IN_FREEPLAY) {
        if (pongScores.right > pongScores.left)
            return endGame(); // enemy passed player, end game
        return;
    };

    if (pongScores.left >= SCORE_GOAL) {
        return endGame(true);
    } else if (pongScores.right >= SCORE_GOAL) {
        return endGame(false);
    }
}

//////////////////////////////////////////   IMPORTANT VARIABLES   //////////////////////////////////////////
let isGameStillPong = false;
let isGamePaused = false;
let isInMenu = true; // starting menu for gamemode selection
let isInEndState = false; // menu for restarting game or continuing
let shouldUpdateNavigation = true;
let shouldUpdateScoreboardOnRestart = false;


const _ENDGAME = document.querySelector('.endedGame');
const _GAMERESULT = _ENDGAME.querySelector('.gameResult');
const _FREEPLAY = _ENDGAME.querySelector('.pause-buttons > .freeplay');
// console.log(_ENDGAME, _GAMERESULT, _FREEPLAY)
function endGame(didWin) {
    isInEndState = true;
    shouldUpdateNavigation = true;
    if (IN_FREEPLAY) {
        // lose in freeplay (enemy passed player)
        _GAMERESULT.textContent = `Ostateczny wynik: [${pongScores.left}:${pongScores.right}]`;
        _GAMERESULT.style.color = 'orange';
        _FREEPLAY.style.display = 'none';
        saveHighscores();
    } else if (didWin) {
        // win
        _GAMERESULT.textContent = `Wygrana! [${pongScores.left}:${pongScores.right}]`;
        _GAMERESULT.style.color = 'lightgreen';
        _FREEPLAY.style.display = '';
        // Update scores on next game start
        shouldUpdateScoreboardOnRestart = true;
    } else {
        // lose
        _GAMERESULT.textContent = `Przegrana [${pongScores.left}:${pongScores.right}]`;
        _GAMERESULT.style.color = 'red';
        _FREEPLAY.style.display = 'none';
        saveHighscores();
    }


}

function saveHighscores() {
    const managerNormal = HIGHSCORE_MANAGERS[aiType].normal;
    const managerOnelife = HIGHSCORE_MANAGERS[aiType].onelife;
    managerNormal.addScore(SCORE_FOR_LB.normal);
    managerOnelife.addScore(SCORE_FOR_LB.onelife);
    managerNormal.updateHighscores();
    managerOnelife.updateHighscores();
}

_FREEPLAY.addEventListener('click', e => {
    IN_FREEPLAY = true;
    isInEndState = false;
    shouldUpdateNavigation = true;
});


// QUADTREE IMPLEMENTATION
class Rectangle {
    constructor(x, y, width, height) {
        this.x = x; // center x
        this.y = y; // center y
        this.width = width;
        this.height = height;
    }

    contains(ball) {
        return (
            ball.x >= this.x - this.width &&
            ball.x < this.x + this.width &&
            ball.y >= this.y - this.height &&
            ball.y < this.y + this.height
        );
    }

    intersects(range) {
        return !(
            range.x - range.width > this.x + this.width ||
            range.x + range.width < this.x - this.width ||
            range.y - range.height > this.y + this.height ||
            range.y + range.height < this.y - this.height
        );
    }
}

class Quadtree {
    constructor(boundary, capacity) {
        this.boundary = boundary; // Rectangle
        this.capacity = capacity; // max objects per quadtree
        this.balls = [];
        this.divided = false;
    }

    subdivide() {
        const { x, y, width, height } = this.boundary;
        const nw = new Rectangle(x - width / 2, y - height / 2, width / 2, height / 2);
        this.northWest = new Quadtree(nw, this.capacity);
        const ne = new Rectangle(x + width / 2, y - height / 2, width / 2, height / 2);
        this.northEast = new Quadtree(ne, this.capacity);
        const sw = new Rectangle(x - width / 2, y + height / 2, width / 2, height / 2);
        this.southWest = new Quadtree(sw, this.capacity);
        const se = new Rectangle(x + width / 2, y + height / 2, width / 2, height / 2);
        this.southEast = new Quadtree(se, this.capacity);
        this.divided = true;
    }

    insert(ball) {
        if (!this.boundary.contains(ball)) {
            return false;
        }

        if (this.balls.length < this.capacity) {
            this.balls.push(ball);
            return true;
        } else {
            if (!this.divided) {
                this.subdivide();
            }

            if (this.northWest.insert(ball)) return true;
            if (this.northEast.insert(ball)) return true;
            if (this.southWest.insert(ball)) return true;
            if (this.southEast.insert(ball)) return true;
        }
    }

    query(range, found) {
        if (!found) {
            found = [];
        }

        if (!this.boundary.intersects(range)) {
            return found;
        } else {
            for (let b of this.balls) {
                if (range.contains(b)) {
                    found.push(b);
                }
            }
            if (this.divided) {
                this.northWest.query(range, found);
                this.northEast.query(range, found);
                this.southWest.query(range, found);
                this.southEast.query(range, found);
            }
            return found;
        }
    }

    clear() {
        this.balls = [];
        if (this.divided) {
            this.northWest.clear();
            this.northEast.clear();
            this.southWest.clear();
            this.southEast.clear();
            this.divided = false;
        }
    }
}





document.addEventListener('keydown', e => {
    if (!isGameStillPong || isInMenu || isInEndState) return;
    if (e.key == 'p') {
        isGamePaused = !isGamePaused;
        shouldUpdateNavigation = true;
    }
})



// Paddle object
class Paddle {
    constructor(x, y, width, height, image) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = new Image();
        this.image.src = image;
    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

// Ball object
let radius = 12 * Math.sqrt(speedMultiplier);
// console.log(radius);
const BALL_SPEED = 6 * 60 * speedMultiplier;
class Ball {
    constructor(x, y, radius, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.velocity = velocity;
        this.speed = BALL_SPEED;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.closePath();
    }

    update(deltaTime) {
        this.x += this.velocity.x * deltaTime;
        this.y += this.velocity.y * deltaTime;
    }

    setVelocity(angle, direction) {
        this.velocity.x = this.speed * Math.cos(angle) * direction;
        this.velocity.y = this.speed * Math.sin(angle);
    }
}

const ROCKET_SPEED = 6 * 60 * speedMultiplier;
const ROCKET_SIZE = {width: 61*2, height: 28*2, hitboxHeight: 40, hitboxWidth: 61*2};
ROCKET_SIZE.yGap = (ROCKET_SIZE.height - ROCKET_SIZE.hitboxHeight) / 2;
class Rocket {
    constructor(x, y, direction) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.sprite = new Spritesheet('./assets/rocket-size2.png', ROCKET_SIZE.width, ROCKET_SIZE.height, 4);
        this.sprite.direction = this.direction;
    }

    draw() {
        this.sprite.draw(this.x, this.y);
    }

    update(deltaTime) {
        this.x += ROCKET_SPEED * this.direction * deltaTime;
    }
    updateAnimation() {
        this.sprite.currentFrame = (this.sprite.currentFrame + 1) % this.sprite.frameCount;
    }
}
let rockets = [];

const EXPLOSION_SIZE = 200;
class Explosion {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.radiusSquared = radius*radius;
        this.sprite = new Spritesheet('./assets/explosion-small.png', 160, 160, 6);
        this.active = true;
        this.speedBoost = 1.25;
    }

    explode(quadtree) {
        // Define the range for querying nearby balls
        const range = new Rectangle(this.x, this.y, this.radius, this.radius);
        const nearbyBalls = quadtree.query(range);

        nearbyBalls.forEach(ball => {
            const dx = ball.x - this.x;
            const dy = ball.y - this.y;
            const distanceSquared = dx * dx + dy * dy;

            if (distanceSquared < this.radiusSquared) {
                // Calculate angle from explosion to ball
                const angle = Math.atan2(dy, dx);
                
                // Apply new direction with slight speed boost
                ball.speed *= this.speedBoost;
                ball.setVelocity(angle, 1);
            }
        });
    }

    draw() {
        this.sprite.draw(this.x, this.y);
    }

    updateAnimation() {
        this.sprite.currentFrame += 1;
        if (this.sprite.currentFrame >= this.sprite.frameCount)
            this.active = false;
    }
}
let explosions = [];

// An animated spritesheet
class Spritesheet {
    constructor(image, width, height, frameCount) {
        this.image = new Image();
        this.image.src = image;
        this.width = width;
        this.height = height;
        this.frameCount = frameCount;

        this.currentFrame = 0;
        this.direction = 1;
    }

    draw(x,y) {
        ctx.save();

        ctx.translate(x, y);

        // flip if needed
        ctx.scale(this.direction, 1);

        ctx.drawImage(
            this.image,

            this.currentFrame * this.width, // which frame x
            0, //* this.height, // which frame y
            this.width, // how big chunk is being taken out (width)
            this.height, // ^ (height)

            -this.width/2, 
            -this.height/2,
            
            this.width * 1,  // desired scale width
            this.height * 1   // desired scale height
        );

        ctx.restore();
    }
}

// Initialize paddles and ball
// const paddleImage = new Image();
// paddleImage.src = './assets/paddle.png';

let aiType = 0;

const MAX_REFLECTION_ANGLE = 75 * Math.PI / 180; // 75 degrees in radians
let AI_SPEED = 8 * 60 * speedMultiplier;
const sizePaddle = {width: 50, height: 160};

const leftPaddle = new Paddle(10, height/2, sizePaddle.width, sizePaddle.height, './assets/paddle.png');
const rightPaddle = new Paddle(width - 60, height/2, sizePaddle.width, sizePaddle.height, './assets/paddle2.png');


let shouldResize = false;
function resizeCanvas() {
    if (!isGameStillPong) {
        shouldResize = true;
        return;
    }

    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    width = canvas.width;
    height = canvas.height;

    leftPaddle.x = 10;
    rightPaddle.x = width - 60;
}
window.addEventListener('resize', resizeCanvas);


let balls = []
function addBall() {
    // console.log(pongScores);
    updateScores();
    // Random angle between -MAX_REFLECTION_ANGLE and MAX_REFLECTION_ANGLE
    const angle = (Math.random() * 2 - 1) * MAX_REFLECTION_ANGLE;
    
    const direction = Math.random() > 0.5 ? 1 : -1;
    
    // Calculate velocity components
    const velocity = {
        x: BALL_SPEED * Math.cos(angle) * direction,
        y: BALL_SPEED * Math.sin(angle)
    };
    
    // Create and add the new ball
    let ball = new Ball(width / 2, height / 2, radius, velocity);
    balls.push(ball);
}

let BALL_INTERVAL = 12; // seconds
let BALL_TIMER = 0;
const ANIMATION_INTERVAL = 0.06;
let ANIMATION_TIMER = 0; // shared animation between every sprite

const ROCKET_INTERVAL = 6;
let ROCKET_TIMER = {left: ROCKET_INTERVAL, right: ROCKET_INTERVAL-5};

// let mouseX = 10;
let mouseY = height/2;
document.addEventListener('mousemove', e => {
    if (isGamePaused || !isGameStillPong || isInMenu || isInEndState) return;
    const rect = canvas.getBoundingClientRect();
    mouseY = e.clientY - rect.top;
    // mouseX = e.clientX - rect.left;
});
document.addEventListener('click', e => {
    if (isGamePaused || !isGameStillPong || isInMenu || isInEndState) return;
    setTimeout(() => {
        createRocket(1);
    }, 10)

});

let touchY = null;
canvas.addEventListener('touchstart', e => {
    touchY = e.touches[0].clientY;
})
canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    const touch = e.touches[0];
    const deltaY = touch.clientY - touchY;
    touchY = touch.clientY;
    mouseY = touchY;
})

function movePaddles(deltaTime) {
    leftPaddle.y = Math.max(0, Math.min(height - leftPaddle.height, 
        mouseY - leftPaddle.height/2 // this is the position of the paddle, its just being clamped
    ));

    // right paddle AI
    createRocket(-1); // enemy sends out rocket

    // stationary
    if (aiType == 2) {
        rightPaddle.y = height/2 - rightPaddle.height/2;
        return;
    };

    // normal & advanced
    let targetBall;
    if (aiType == 0) {
        // Calculate nearestBall
        let nearestBall = null;
        let minX = -Infinity;
        balls.forEach(ball => {
            if (ball.velocity.x <= 0) return;

            if (ball.x > minX) {
                minX = ball.x;
                nearestBall = ball;
            }
        });
        targetBall = nearestBall;
    }
    
    if (aiType == 1) {
        // Calculate nearestPredictedBall
        let nearestPredictedBall = null;
        let minTime = Infinity;
        balls.forEach(ball => {
            if (ball.velocity.x <= 0) return; // only predict balls moving towards the paddle
            const timeToPaddle = (rightPaddle.x - ball.x) / ball.velocity.x;
            if (timeToPaddle < minTime) {
                minTime = timeToPaddle;
                nearestPredictedBall = ball;
            }
            
        });
        targetBall = nearestPredictedBall;
    }

    // move paddle towards the target ball
    if (targetBall !== null && targetBall.x > width/4) {
        // Radius is being substracted to make the ai have a "deadzone" within the middle, to track it better and not spaz out
        if (targetBall.y - radius > rightPaddle.y + rightPaddle.height/2) {
            rightPaddle.y += AI_SPEED * deltaTime;
        } else if (targetBall.y < rightPaddle.y + rightPaddle.height/2 - radius) {
            rightPaddle.y -= AI_SPEED * deltaTime;
        } else {
            const direction = Math.sign(targetBall.y - (rightPaddle.y + rightPaddle.height/2));
            let speed = Math.floor(Math.abs(targetBall.velocity.y));
            if (speed > AI_SPEED) speed = AI_SPEED;
            // if (speed < AI_SPEED/2) speed = AI_SPEED/2; // removed for better tracking
            rightPaddle.y += speed * direction * deltaTime;
        }          
    } else {
        // console.log('4');
        const difference = rightPaddle.y + rightPaddle.height/2 - height/2;
        if (Math.abs(difference) < AI_SPEED * deltaTime) return;

        if (difference < 0)
            rightPaddle.y += AI_SPEED * deltaTime;
        else
            rightPaddle.y -= AI_SPEED * deltaTime;
    }

    // clamp to the canvas boundaries
    rightPaddle.y = Math.max(0, Math.min(height - rightPaddle.height, rightPaddle.y));
 


}

// Collision detection
function paddleCollision(paddle, quadtree) {
    // Define the range around the paddle for collision detection
    const range = new Rectangle(
        paddle.x + paddle.width / 2,
        paddle.y + paddle.height / 2,
        paddle.width,
        paddle.height
    );

    //console.log(quadtree);

    const possibleCollisions = quadtree.query(range);

    possibleCollisions.forEach(ball => {
        if (ball.velocity.x > 1 && paddle == leftPaddle) return;
        if (ball.velocity.x < 1 && paddle == rightPaddle) return;

        // Bounding box collision
        if (
            ball.x - ball.radius < paddle.x + paddle.width &&
            ball.x + ball.radius > paddle.x &&
            ball.y - ball.radius < paddle.y + paddle.height &&
            ball.y + ball.radius > paddle.y 
        ) {
            // Pixel-perfect collision
            const paddleImageData = ctx.getImageData(paddle.x, paddle.y, paddle.width, paddle.height);
            const ballX = Math.floor(ball.x - paddle.x);
            const ballY = Math.floor(ball.y - paddle.y);
            
            if (paddleImageData.data[(ballY * paddle.width + ballX) * 4 + 3] > 128) {
                // Calculate relative collision position (from -1 to 1)
                const paddleCenterY = paddle.y + paddle.height / 2;
                const relativeIntersectY = (ball.y - paddleCenterY) / (paddle.height / 2);
                const clampedRelativeY = Math.max(-1, Math.min(1, relativeIntersectY));

                // Calculate reflection angle
                const reflectionAngle = clampedRelativeY * MAX_REFLECTION_ANGLE;

                // Determine the direction based on paddle side
                const direction = (paddle === leftPaddle) ? 1 : -1;

                // Update ball velocity based on reflection angle
                ball.setVelocity(reflectionAngle, direction);
            }
        }
    });
}


// Detect collision between two rectangles
function isRocketColliding(rocket, ball) {
    /*
    return rocket.x < ball.x &&
            rocket.x + ROCKET_SIZE.width > ball.x &&
            rocket.y + ROCKET_SIZE.yGap < ball.y &&
            rocket.y + ROCKET_SIZE.height - ROCKET_SIZE.yGap > ball.y;*/
    return rocket.x - ROCKET_SIZE.width/2 < ball.x && 
            rocket.x + ROCKET_SIZE.width/2 > ball.x && 
            rocket.y - ROCKET_SIZE.hitboxHeight/2 < ball.y && 
            rocket.y + ROCKET_SIZE.hitboxHeight/2 > ball.y;
}
function isColliding(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

function createRocket(direction) {
    let side = direction == 1 ? 'left' : 'right';
    if (ROCKET_TIMER[side] < ROCKET_INTERVAL) return;
    ROCKET_TIMER[side] = 0;

    let x, y;
    if (direction == 1) {
        // left side shoots: move right
        x = leftPaddle.width + 10 + ROCKET_SIZE.width/2;
        y = leftPaddle.y + leftPaddle.height/2;
    } else {
        // right side shoots: move left
        x = width - ROCKET_SIZE.width/2 - rightPaddle.width - 10;
        y = rightPaddle.y + rightPaddle.height/2;
    }
    
    const rocket = new Rocket(x, y, direction);
    rockets.push(rocket);
}

function updateRocketTimes() {
    let time1 = ROCKET_INTERVAL - ROCKET_TIMER.left;
    let time2 = ROCKET_INTERVAL - ROCKET_TIMER.right;
    rocketTimes.left.textContent = `${time1.toFixed(1)}s`;
    rocketTimes.right.textContent = `${time2.toFixed(1)}s`;

    if (time1 <= 0) {
        rocketTimes.left.style.color = 'lightgreen';
        rocketTimes.left.textContent = `GOTOWE`;
    } else rocketTimes.left.style = '';
    if (time2 <= 0) {
        rocketTimes.right.style.color = 'lightgreen';
        rocketTimes.right.textContent = `GOTOWE`;
    } else rocketTimes.right.style = '';
}

// Selecting buttons (gamemodes & leaderboards)
const _pongSideButtons = document.querySelector('.pong-side-buttons');
const _sideButtons = _pongSideButtons.querySelectorAll('.button');
let latestAction = 'pong-modes'; // 'pong-modes' or 'pong-leaderboards'

function showActionObjects(action) {
    if (action == latestAction) return;

    const actionObjects = gameOverlay.querySelectorAll(`.${action}`);
    const lastActionObjects = gameOverlay.querySelectorAll(`.${latestAction}`);

    // hide the old action objects
    lastActionObjects.forEach(obj => {
        obj.classList.add('hidden')
    })

    // add the new action objects
    actionObjects.forEach(obj => {
        obj.classList.remove('hidden')
    })
    latestAction = action;
}
showActionObjects(latestAction);

let currentButton = _pongSideButtons.querySelector('.button.selected');
const actions = [];
_sideButtons.forEach(button => {
    const action = button.dataset.action;
    actions.push(action);

    button.addEventListener('click', e => {
        showActionObjects(action);
        currentButton.classList.remove('selected');
        button.classList.add('selected');
        currentButton = button;
    })
})

// on start: hide all action objects except the latest action
actions.forEach(action => {
    if (action == latestAction) return;
    const actionObjects = gameOverlay.querySelectorAll(`.${action}`);
    actionObjects.forEach(obj => {
        obj.classList.add('hidden')
    })
})


// Selecting gamemodes
const _modes = document.querySelectorAll('.pong-modes > .button');
_modes.forEach(mode => {
    mode.addEventListener('click', e => {
        const modeName = mode.dataset.gamemode;
        selectGamemode(modeName);
    })
})



// Gamemodes
function selectGamemode(mode = 'normal') {
    BALL_INTERVAL = 12;
    if (mode == 'normal') {
        aiType = 0;
        rightPaddle.image.src = './assets/paddle2.png';
        rightPaddle.height = sizePaddle.height;
        AI_SPEED = 8 * 60 * speedMultiplier;
    } else if (mode == 'advanced') {
        aiType = 1;
        rightPaddle.image.src = './assets/paddle3.png';
        rightPaddle.height = sizePaddle.height * 1.25;
        AI_SPEED = 12 * 60 * speedMultiplier;
    } else if (mode == 'wall') {
        // Gain points every time a ball is spawned. Don't let Maniek beat you in score (OR, optional leaderboard, )
        aiType = 2;
        rightPaddle.image.src = './assets/paddle4.png';
        rightPaddle.height = sizePaddle.height * 6;

        BALL_INTERVAL = 2;
        
        addScore('left',1); // 1 ball to start with, your points are determined by the amount of balls on screen
    }
    rightPaddle.y = height/2 - rightPaddle.height/2;

    isInMenu = false;
    shouldUpdateNavigation = true;

    addBall();
}
function restartGame() {
    if (shouldUpdateScoreboardOnRestart) {
        saveHighscores();
        shouldUpdateScoreboardOnRestart = false;
    }

    _FREEPLAY.style.display = '';

    // Reset scores
    pongScores.left = 0;
    pongScores.right = 0;
    SCORE_FOR_LB.normal = 0;
    SCORE_FOR_LB.onelife = 0;
    updateScores();

    ROCKET_TIMER.left = ROCKET_INTERVAL;
    ROCKET_TIMER.right = ROCKET_INTERVAL-5;
    ANIMATION_TIMER = 0;
    BALL_TIMER = 0;
    
    balls = [];
    rockets = [];
    explosions = [];

    leftPaddle.y = height/2 - leftPaddle.height/2;
    rightPaddle.y = height/2 - rightPaddle.height/2;

    IN_FREEPLAY = false;
    isInEndState = false;
    isGamePaused = false;
    isInMenu = true;
    shouldUpdateNavigation = true;
}

// Animation loop
let previousTime = performance.now();

//const TARGET_FPS = 60;
//const interval = 1 / TARGET_FPS;

const _paused = document.querySelector('.paused');
const _resume = _paused.querySelector('.resume');
const _reset = gameOverlay.querySelectorAll('.resetGame');
_resume.addEventListener('click', e => {
    isGamePaused = false;
    shouldUpdateNavigation = true;
})

_reset.forEach(reset => {
    reset.addEventListener('click', e => {
        restartGame();
    })
})


const _modeHolder = document.querySelector('.pong-modes');

function drawOnce() {
    ctx.clearRect(0, 0, width, height);
    leftPaddle.draw();
    rightPaddle.draw();
    balls.forEach(ball => ball.draw());
    rockets.forEach(rocket => rocket.draw());
    explosions.forEach(explosion => explosion.draw());
}

function animate(timestamp) {
    const deltaTime = IGNORE_NEXT_DT && 1/60 
                    || (timestamp - previousTime)/1000 
                    || 1/60;
    previousTime = timestamp;

    requestAnimationFrame(animate);

    /*if (deltaTime < interval) {
        requestAnimationFrame(animate);
        return;
    }*/

    // UPDATES FOR GAME CHANGES
    {
        if (shouldUpdateNavigation) {
            if ((isGamePaused || isInMenu || isInEndState) && isGameStillPong && !isDocumentHidden) {
                shouldUpdateNavigation = false;
                gameOverlay.classList.remove('hidden');
            } else {
                gameOverlay.classList.add('hidden');
            }

            if (isGamePaused && isGameStillPong) {
                drawOnce();
                _paused.classList.remove('hidden');
            } else {
                _paused.classList.add('hidden');
            }

            if (isInMenu) {
                _modeHolder.classList.remove('superhidden');
            } else {
                _modeHolder.classList.add('superhidden');
            }
            if (isInEndState) {
                _ENDGAME.classList.remove('hidden');
            } else {
                _ENDGAME.classList.add('hidden');
            }
        }
        
        

        if (CURRENT_GAME != 'pong') {
            if (isGameStillPong) {
                ctx.clearRect(0, 0, width, height);
                if (!isInMenu && !isInEndState)
                    isGamePaused = true;
                shouldUpdateNavigation = true;
            }
            isGameStillPong = false;
            // requestAnimationFrame(animate);
            return;
        }
        isGameStillPong = true;
    
        

        if (isGamePaused || isInMenu || isInEndState || isDocumentHidden) {
            // requestAnimationFrame(animate);
            return;
        }
    
        if (shouldResize)
            resizeCanvas();
    }
    
    
    // GAME

    // Animations/timers
    {
        ROCKET_TIMER.left += deltaTime;
        ROCKET_TIMER.right += deltaTime;
        BALL_TIMER += deltaTime;
        if (BALL_TIMER > BALL_INTERVAL) {
            addBall();
            if (aiType == 2)
                addScore('left', 1);
            BALL_TIMER = 0;
        }

        ANIMATION_TIMER += deltaTime;
        if (ANIMATION_TIMER > ANIMATION_INTERVAL) {
            ANIMATION_TIMER = 0;
            for (let rocket of rockets) {
                rocket.updateAnimation();
            }
            for (let explosion of explosions) {
                explosion.updateAnimation();
                if (!explosion.active) {
                    explosions.splice(explosions.indexOf(explosion), 1);
                }
            }
        }
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Initialize Quadtree
    let boundary = new Rectangle(width / 2, height / 2, width / 2, height / 2);
    let quadtree = new Quadtree(boundary, 4); // capacity of 4
    balls.forEach(ball => quadtree.insert(ball));

    // Rockets & rocket explosions
    for (let rocket of rockets) {
        if (rocket.x < 0 || rocket.x > width) {
            rocket.sprite = null;
            rockets.splice(rockets.indexOf(rocket), 1);
            rocket = null;
            continue;
        }

        let range = new Rectangle(
            rocket.x,
            rocket.y,
            ROCKET_SIZE.width * 2,
            ROCKET_SIZE.height * 2
        );
        let possibleCollisions = quadtree.query(range);

        let collided = false;
        for (let ball of possibleCollisions) {
            //console.log(possibleCollisions);
            collided = isRocketColliding(rocket,ball);
            if (collided)
                break;
        }

        if (collided) {
            rockets.splice(rockets.indexOf(rocket), 1);
            let explosion = new Explosion(rocket.x, rocket.y, EXPLOSION_SIZE);
            explosions.push(explosion);
            explosion.explode(quadtree);
            continue;
        };

        rocket.update(deltaTime);
        rocket.draw();
    }

    explosions.forEach((explosion, index) => {
        explosion.draw();
    });

    // Paddles
    leftPaddle.draw();
    rightPaddle.draw();
    movePaddles(deltaTime);

    paddleCollision(leftPaddle, quadtree);
    paddleCollision(rightPaddle, quadtree);

    // Balls, score & ball paddle collisions
    for (let ball of balls) {
        if (ball.x < 0 || ball.x > width) {
            balls.splice(balls.indexOf(ball), 1);
            // delete collisionDebounce[leftPaddle][ball];
            // delete collisionDebounce[rightPaddle][ball];

            if (ball.x < 0) {
                addScore('right', 1);
            } else {
                addScore('left', 1);
            }
            addBall();

            continue;
        }
    
        ball.update(deltaTime);

        // Bounce off top and bottom edges
        if (ball.y - ball.radius < 0) {
            ball.velocity.y = Math.abs(ball.velocity.y);
        } else if (ball.y + ball.radius > height) {
            ball.velocity.y = -Math.abs(ball.velocity.y);
        }

        ball.draw();
    }

    updateRocketTimes();

    // requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
restartGame();