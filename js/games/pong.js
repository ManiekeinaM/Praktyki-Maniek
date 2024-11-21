/*

// Set up canvas
const pongCanvas = document.getElementById('gameCanvas');
const ctx = pongCanvas.getContext('2d');
pongCanvas.width = 800;
pongCanvas.height = 600;
let width = pongCanvas.width;
let height = pongCanvas.height;

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
}

// Initialize paddles and ball
const leftPaddle = new Paddle(50, height / 2 - 50, 20, 100, './assets/paddle.png');
const rightPaddle = new Paddle(width - 70, height / 2 - 50, 20, 100, './assets/paddle.png');
const ball = new Ball(width / 2, height / 2, 10, {x: 4, y: 4});


pongCanvas.addEventListener('mousemove', e => {
    console.log(e.clientY, e.clientY);
});
function movePaddles() {
    
}

// Collision detection
function detectCollision(paddle, ball) {
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
            // Calculate normal
            let normal = {x: 0, y: 0};
            if (ball.y < paddle.y || ball.y > paddle.y + paddle.height) {
                normal.y = ball.y < paddle.y ? -1 : 1;
            } else {
                normal.x = ball.x < paddle.x ? -1 : 1;
            }
            // Reflect velocity
            const dot = ball.velocity.x * normal.x + ball.velocity.y * normal.y;
            ball.velocity.x -= 2 * dot * normal.x;
            ball.velocity.y -= 2 * dot * normal.y;
        }
    }
}

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    leftPaddle.draw();
    rightPaddle.draw();
    ball.draw();
    movePaddles();
    ball.update();
    detectCollision(leftPaddle, ball);
    detectCollision(rightPaddle, ball);
    requestAnimationFrame(animate);
}

animate();

*/