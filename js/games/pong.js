// Set up canvas
const canvas = document.querySelector('#game-canvas');
const ctx = canvas.getContext('2d', {willReadFrequently: true});
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
let width = canvas.width;
let height = canvas.height;

let pongScores = {left: 0, right: 0};
function addScore(side, amount) {
    pongScores[side] += amount;
    document.querySelector(`.${side}-score`).textContent = pongScores[side];
}

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

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }

    setVelocity(angle, direction) {
        this.velocity.x = this.speed * Math.cos(angle) * direction;
        this.velocity.y = this.speed * Math.sin(angle);
    }
}

// Initialize paddles and ball
// const paddleImage = new Image();
// paddleImage.src = './assets/paddle.png';

const MAX_REFLECTION_ANGLE = 75 * Math.PI / 180; // 75 degrees in radians
const BALL_SPEED = 8;
const AI_SPEED = 6;

const sizePaddle = {width: 50, height: 160};
let radius = 10;

const leftPaddle = new Paddle(10, height/2 - sizePaddle.height/2, sizePaddle.width, sizePaddle.height, './assets/paddle.png');
const rightPaddle = new Paddle(width - 60, height/2 - sizePaddle.height/2, sizePaddle.width, sizePaddle.height, './assets/paddle.png');
const ball = new Ball(157, height/2, radius, {x: 4, y: 4});

// Define safe zone (middle 4/5 of screen, for collision detecting paddles)
let widthZone = {min: 20+radius+sizePaddle.width, max: width-20-radius-sizePaddle.width};


function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    width = canvas.width;
    height = canvas.height;

    leftPaddle.x = 10;
    rightPaddle.x = width - 60;
    widthZone = {
        min: 20 + radius + sizePaddle.width, 
        max: width - 20 - radius - sizePaddle.width
    };
}
window.addEventListener('resize', resizeCanvas);


let balls = []
function addBall() {
    // Random angle between -MAX_REFLECTION_ANGLE and MAX_REFLECTION_ANGLE
    const angle = (Math.random() * 2 - 1) * MAX_REFLECTION_ANGLE;
    
    // Random direction: 1 for right, -1 for left
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
addBall();

const BALL_INTERVAL = 10; // seconds
let BALL_TIMER = 0;


// let mouseX = 10;
let mouseY = height/2;
canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouseY = e.clientY - rect.top;
    // mouseX = e.clientX - rect.left;
});
function movePaddles() {
    // leftPaddle.x = mouseX - sizePaddle.width/2;
    leftPaddle.y = mouseY - sizePaddle.height/2;

    // right paddle AI
    if (nearestBall.x > width/4 && nearestBall.velocity.x > 0) {
        if (nearestBall.y > rightPaddle.y && nearestBall.y < rightPaddle.y + sizePaddle.height) {
            rightPaddle.y += AI_SPEED * Math.sign(nearestBall.velocity.y);
            return;
        } else if (nearestBall.y > rightPaddle.y + sizePaddle.height/2) {
            rightPaddle.y += AI_SPEED;
        } else if (nearestBall.y < rightPaddle.y + sizePaddle.height/2) {
            rightPaddle.y -= AI_SPEED;
        } 
        
    } else {
        let difference = rightPaddle.y + sizePaddle.height/2 - height/2;
        if (Math.abs(difference) < AI_SPEED) return;

        if (difference < 0)
            rightPaddle.y += AI_SPEED;
        else
            rightPaddle.y -= AI_SPEED;
        
    }
}

let nearestBall = balls[0];

// Collision detection
function detectCollision(paddle, ball) {
    // Skip if ball is moving away from paddle
    if ((paddle === leftPaddle && ball.velocity.x > 0) || 
        (paddle === rightPaddle && ball.velocity.x < 0)) {
        return;
    }

    // Skip collision check if ball is in safe zone
    if (ball.x > widthZone.min && ball.x < widthZone.max) {
        return;
    }

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
            // collisionDebounce[paddle][ball] = true;

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
}

// Animation loop
let previousTime = performance.now();

let isGameStillPong = false;
function animate(timestamp) {
    if (CURRENT_GAME != 'pong') {
        if (isGameStillPong)
            ctx.clearRect(0, 0, width, height);
        
        isGameStillPong = false;
        requestAnimationFrame(animate);
        return;
    }
    isGameStillPong = true;

    const deltaTime = (timestamp - previousTime)/1000 || 1/60;
    previousTime = timestamp;

    BALL_TIMER += deltaTime;
    //console.log(BALL_TIMER);
    if (BALL_TIMER > BALL_INTERVAL) {
        addBall();
        BALL_TIMER = 0;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    leftPaddle.draw();
    rightPaddle.draw();
    movePaddles(deltaTime);

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

            if (ball == nearestBall) nearestBall = balls[0];
            continue;
        }
        if (ball != nearestBall) {
            if (ball.x > nearestBall.x) {
                nearestBall = ball;
            }
        }


        
        ball.update();
        detectCollision(leftPaddle, ball);
        detectCollision(rightPaddle, ball);

        // Bounce off top and bottom edges
        if (ball.y - ball.radius < 0 || ball.y + ball.radius > height) {
            ball.velocity.y = -ball.velocity.y;
        }

        ball.draw();
    }

    requestAnimationFrame(animate);
}

animate();