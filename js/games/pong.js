// Set up canvas
const canvas = document.querySelector('#game-canvas');
const ctx = canvas.getContext('2d', {willReadFrequently: true});
ctx.imageSmoothingEnabled = false;
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
let width = canvas.width;
let height = canvas.height;

let pongScores = {left: 0, right: 0};
function addScore(side, amount) {
    pongScores[side] += amount;
    document.querySelector(`.${side}-score`).textContent = pongScores[side];
}

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
let radius = 10;
const BALL_SPEED = 8;
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

const ROCKET_SPEED = 6;
const ROCKET_SIZE = {width: 61*2, height: 28*2, hitboxHeight: 28, hitboxWidth: 61*2};
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

    update() {
        this.x += ROCKET_SPEED * this.direction;
    }
    updateAnimation() {
        this.sprite.currentFrame = (this.sprite.currentFrame + 1) % this.sprite.frameCount;
    }
}
let rockets = [];

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

        ctx.translate(x+this.width/2, y+this.height/2);

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

const MAX_REFLECTION_ANGLE = 75 * Math.PI / 180; // 75 degrees in radians

const AI_SPEED = 6;

const sizePaddle = {width: 50, height: 160};


const leftPaddle = new Paddle(10, height/2 - sizePaddle.height/2, sizePaddle.width, sizePaddle.height, './assets/paddle.png');
const rightPaddle = new Paddle(width - 60, height/2 - sizePaddle.height/2, sizePaddle.width, sizePaddle.height, './assets/paddle2.png');

// Define safe zone (middle 4/5 of screen, for collision detecting paddles)
let widthZone = {
    min: 20+radius+sizePaddle.width, 
    max: width-20-radius-sizePaddle.width
};


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
const ANIMATION_INTERVAL = 0.25;
let ANIMATION_TIMER = 0; // shared animation between every sprite

const ROCKET_INTERVAL = 10;
let ROCKET_TIMER = {left: ROCKET_INTERVAL, right: ROCKET_INTERVAL-5};

// let mouseX = 10;
let mouseY = height/2;
canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouseY = e.clientY - rect.top;
    // mouseX = e.clientX - rect.left;
});
canvas.addEventListener('click', e => {
    createRocket(1);
});


function movePaddles() {
    // leftPaddle.x = mouseX - sizePaddle.width/2;
    leftPaddle.y = mouseY - sizePaddle.height/2;

    //createRocket(-1);
    createRocket(-1);

    // right paddle AI
    if (nearestBall.x > width/4 && nearestBall.velocity.x > 0) {
        if (nearestBall.y > rightPaddle.y && nearestBall.y < rightPaddle.y + sizePaddle.height) {
            let direction = Math.sign(nearestBall.velocity.y);
            rightPaddle.y += Math.min(AI_SPEED, Math.abs(nearestBall.velocity.y))*direction;
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
function paddleCollision(paddle, ball) {
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
// Detect collision between two rectangles
function isRocketColliding(rocket, ball) {
    return rocket.x < ball.x &&
            rocket.x + ROCKET_SIZE.width > ball.x &&
            rocket.y + ROCKET_SIZE.yGap < ball.y &&
            rocket.y + ROCKET_SIZE.height - ROCKET_SIZE.yGap > ball.y;
    //return (rocket.x - ROCKET_SIZE.width/2 < ball.x && rocket.x + ROCKET_SIZE.width/2 > ball.x)
    //    && (rocket.y - ROCKET_SIZE.hitboxHeight/2 < ball.y && rocket.y + ROCKET_SIZE.hitboxHeight/2 > ball.y);
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
        x = sizePaddle.width + 10;
        y = leftPaddle.y + sizePaddle.height/2 - ROCKET_SIZE.height/2;
    } else {
        // right side shoots: move left
        x = width - ROCKET_SIZE.width - sizePaddle.width - 10;
        y = rightPaddle.y + sizePaddle.height/2 - ROCKET_SIZE.height/2;
    }
    
    const rocket = new Rocket(x, y, direction);
    rockets.push(rocket);
}

//const rocket = new Spritesheet('./assets/rocket-size2.png', 61*2, 28*2, 4);

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

    // Animations/timers
    ROCKET_TIMER.left += deltaTime;
    ROCKET_TIMER.right += deltaTime;
    BALL_TIMER += deltaTime;
    if (BALL_TIMER > BALL_INTERVAL) {
        addBall();
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
        }
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //rocket.draw(500,500);
    //rocket.direction *= -1;

    // Initialize Quadtree
    let boundary = new Rectangle(width / 2, height / 2, width / 2, height / 2);
    let qtree = new Quadtree(boundary, 4); // capacity of 4
    balls.forEach(ball => qtree.insert(ball));


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
        let possibleCollisions = qtree.query(range);


        let collided = false;
        for (let ball of possibleCollisions) {
            //console.log(possibleCollisions);
            collided = isRocketColliding(rocket,ball);
            if (collided)
                break;
        }

        if (collided) {
            rockets.splice(rockets.indexOf(rocket), 1);

            let explosion = new Explosion(rocket.x, rocket.y, 200);
            explosions.push(explosion);
            explosion.explode(qtree);

            continue;
        };

        rocket.update();
        rocket.draw();
    }

    explosions.forEach((explosion, index) => {
        explosion.draw();
        explosion.updateAnimation();

        if (!explosion.active) {
            explosions.splice(index, 1);
        }
    });

    // Paddles
    leftPaddle.draw();
    rightPaddle.draw();
    movePaddles(deltaTime);

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

            if (ball == nearestBall) nearestBall = balls[0];
            continue;
        }
        if (ball != nearestBall) {
            if (ball.x > nearestBall.x || nearestBall.velocity.x < 0) {
                nearestBall = ball;
            }
        }
        
        paddleCollision(leftPaddle, ball);
        paddleCollision(rightPaddle, ball);
        ball.update();

        // Bounce off top and bottom edges
        if (ball.y - ball.radius < 0 || ball.y + ball.radius > height) {
            ball.velocity.y = -ball.velocity.y;
        }

        ball.draw();
    }

    requestAnimationFrame(animate);
}

animate();