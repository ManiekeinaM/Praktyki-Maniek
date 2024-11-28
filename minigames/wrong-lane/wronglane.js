//Canvas setup
const canvas = document.getElementById('steering-canvas');
const ctx = canvas.getContext('2d');
//Visible window
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

const MAX_CAMERA_OFFSET_X = 400;
const MIN_CAMERA_OFFSET_X = -400;

class camera {
    constructor() {
        this.offset_x = 0;
    }

    update_offset(delta) {
        this.offset_x += wheel_tilt * delta
        if (this.offset_x > MAX_CAMERA_OFFSET_X) this.offset_x = MAX_CAMERA_OFFSET_X;
        if (this.offset_x < MIN_CAMERA_OFFSET_X) this.offset_x = MIN_CAMERA_OFFSET_X;
    }
}

class traffic_handler {
    constructor(camera) {
        this.camera = camera
        this.car_stack = [];
    }
    spawn_car() {
        this.car_stack.push(new car(0, 40, 100, 50, this.camera));
    }
}

const MAX_DEPTH_SCALE = 4;
class car {
    constructor(x, speed, width, height, camera) {
        this.x = x;
        this.y = -100;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.depth_scale = 0.1;
        this.distance_percentage = 0;
        this.camera = camera;
    }

    move(delta) {
        this.y += this.speed * delta;
        this.distance_percentage = (this.y / canvasHeight);
        this.depth_scale = MAX_DEPTH_SCALE * this.distance_percentage;
    }

    switch_lanes() {

    }

    draw() {
        ctx.fillStyle = "green";
        ctx.fillRect(this.x - this.camera.offset_x, this.y, this.width * this.depth_scale, this.height * this.depth_scale);
    }
}

const main_camera = new camera();

const green_car = new car(canvasWidth/2 , 40, 100, 50, main_camera);

let steering;
let lastRotation = 0;
let wheel_tilt = 0;

const strengthDisplay = document.getElementById('strengthDisplay');
let isDragging = false;
let mousePath = [];
let centroid = { x: 0, y: 0 };
let lastAngle = null;
let rotation = 0;
let strength = 0;

canvas.addEventListener('mousedown', () => {
  isDragging = true;
  mousePath = [];
  rotation = 0;
  strength = 0;
  lastAngle = null;
  strengthDisplay.textContent = 'Strength: 0';
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

canvas.addEventListener('mouseup', () => {
  isDragging = false;
  if (rotation !== 0) {
    const direction = rotation > 0 ? 'Clockwise' : 'Counterclockwise';
    console.log(`Direction: ${direction}, Strength: ${Math.abs(rotation).toFixed(2)}`);
  }
  steering = "Nic";
});

canvas.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  mousePath.push({ x, y });
  drawPoint(x, y);
  updateCentroid();
  calculateRotation();
  updateStrengthDisplay();
});

function drawPoint(x, y) {
  ctx.fillStyle = 'blue';
  ctx.beginPath();
  ctx.arc(x, y, 2, 0, Math.PI * 2);
  ctx.fill();
}

function updateCentroid() {
  const sum = mousePath.reduce((acc, point) => {
    acc.x += point.x;
    acc.y += point.y;
    return acc;
  }, { x: 0, y: 0 });
  centroid.x = sum.x / mousePath.length;
  centroid.y = sum.y / mousePath.length;

  // Draw centroid
  ctx.fillStyle = 'red';
  ctx.beginPath();
  ctx.arc(centroid.x, centroid.y, 5, 0, Math.PI * 2);
  ctx.fill();
}

function calculateRotation() {
    const currentPoint = mousePath[mousePath.length - 1];
    const angle = Math.atan2(currentPoint.y - centroid.y, currentPoint.x - centroid.x) * (180 / Math.PI);

    if (lastAngle !== null) {
        let delta = angle - lastAngle;
        if (delta > 180) delta -= 360;
        if (delta < -180) delta += 360;
        rotation += delta;

        strength = Math.abs(delta);
    }

    lastAngle = angle;

    if (strength > 3) {
        if (lastRotation - rotation > 0) {
            steering = "Lewo";
        }else if (lastRotation - rotation < 0) {
            steering = "Prawo";
        }
    }

    lastRotation = rotation;
}

function tilt_the_wheel(delta) {
    if (steering == "Prawo") {
        wheel_tilt += 100 * delta;
        if (wheel_tilt > 60) {
            wheel_tilt = 60;
        }
    }else if (steering == "Lewo") {
        wheel_tilt -= 100 * delta;
        if (wheel_tilt < -60) {
            wheel_tilt = -60;
        }
    }
}

function move_block(delta) {
    block.x += wheel_tilt * delta
}

function updateStrengthDisplay() {
  strengthDisplay.textContent = `Strength: ${strength.toFixed(2)}`;
}




let lastFrameResponse = 0;

function game_loop(timestamp) {
    let delta = (timestamp - lastFrameResponse) / 1000;
    lastFrameResponse = timestamp;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    ctx.fillStyle = "yellow";
    tilt_the_wheel(delta);
    main_camera.update_offset(delta);
    green_car.move(delta);
    console.log(wheel_tilt);

    green_car.draw();

    requestAnimationFrame(game_loop);
}

requestAnimationFrame(game_loop);
