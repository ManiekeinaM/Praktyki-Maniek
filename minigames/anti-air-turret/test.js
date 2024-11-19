// Canvas setup
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
// Visible window
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
// Entire game window dimensions
const GAME_WINDOW_HEIGHT = canvasHeight;
const GAME_WINDOW_WIDTH = canvasWidth;

// Game state controller
const game = {
    player_score: 0, 
    reset: function() {
        player_turret.lives = 3;
    },
}

// Controls
const controls = {
    up_pressed: false,
    down_pressed: false,
    right_pressed: false,
    left_pressed: false,
}

const spritesheet = new Image();
spritesheet.src = 'Assets/enemy.png';

const plane_animation = {
    frame_width: 640,
    frame_height: 640,
    total_frames: 3,
    current_frame: 0,
    frame_rate: 100,
    source_x: 0,
    source_y: 0,
    calc_source_position: function() {
        this.source_x = this.current_frame * this.frame_width;
    },
}

// Enemies object
const enemy_plane = {
    x: canvasWidth / 2,
    y: -200,
    camera_offset_x: 0,
    camera_offset_y: 0,
    camera_acceleration_x: 100, // Slower horizontal movement
    camera_acceleration_y: 50,  // Slower vertical panning
    acceleration_y: 10,         // Slower vertical movement
    scaling_factor: 0.05,       // Slower scaling factor
    y_offset_scale: 1,  
    scale: 0.1,
    color: 'green',
    sprite: plane_animation,
    draw: function() {
        ctx.drawImage(
            spritesheet,
            plane_animation.source_x, plane_animation.source_y,
            plane_animation.frame_width, plane_animation.frame_height,
            this.x + this.camera_offset_x, this.y - this.camera_offset_y,
            plane_animation.frame_width * 0.25 * this.scale * this.y_offset_scale, plane_animation.frame_height * 0.25 * this.scale,
        );
    },
    move_offset: function(delta) {
        if (controls.up_pressed) { 
            if (this.camera_offset_y < -200) {
                this.camera_offset_y = -200;
            } else {
                this.camera_offset_y -= this.camera_acceleration_y * delta;
            }
            this.y_offset_scale = 1 - this.camera_offset_y / 1000;
        }
        if (controls.down_pressed) { 
            if (this.camera_offset_y > 0) {
                this.camera_offset_y = 0;
            } else {
                this.camera_offset_y += this.camera_acceleration_y * delta; 
            }
            this.y_offset_scale = 1 - this.camera_offset_y / 1000;
        }
        if (controls.left_pressed) { 
            this.camera_offset_x -= this.camera_acceleration_x * delta;
        }
        if (controls.right_pressed) { 
            this.camera_offset_x += this.camera_acceleration_x * delta; 
        }

        // Constrain the camera's X offset to within the game window bounds.
        if (this.camera_offset_x + this.x > GAME_WINDOW_WIDTH) {
            this.camera_offset_x = GAME_WINDOW_WIDTH - this.x;
        }
        if (this.camera_offset_x + this.x < 0) {
            this.camera_offset_x = -this.x;
        }
    },
    move: function(delta) {
        this.y += this.acceleration_y * delta;
        this.scale_up(delta);
        this.attack_player();
    },
    scale_up: function(delta) {
        this.scale += this.scaling_factor * delta; // Slower scaling over time
        this.width = 40 * this.scale;
        this.height = 20 * this.scale;
    },
    attack_player: function() {
        if (this.scale > 2.2) {
            this.reset();
        }
    },
    reset: function() {
        this.y = -200;
        this.scale = 0.1;
        this.width = 40;
        this.height = 20;
        player_turret.deal_damage();
    }
}

// Planes array with initial planes
const Planes = [];
Planes.push(Object.create(enemy_plane));
Planes.push(Object.create(enemy_plane));
Planes[0].camera_offset_x -= 200;
Planes[0].y += 50;
Planes[0].color = 'red';

// Player object (turret)
const player_turret = {
    x: canvasWidth / 2,
    y: canvasHeight,
    width: 50,
    height: 20,
    lives: 3,
    draw: function() {
        let x = this.x - this.width / 2;
        let y = this.y - this.height;
        ctx.fillStyle = 'black';
        ctx.fillRect(x, y, this.width, this.height);
    }, 
    deal_damage: function() {
        this.lives -= 1;
        if (this.lives == 0) {
            game.reset();
        }
    }
}

// Camera / Scope object adjustments
const MAX_CAMERA_OFFSET_Y = -200;
const MIN_CAMERA_OFFSET_Y = GAME_WINDOW_HEIGHT;

const scope_anchor = {
    height: 5,
    width: 5,
    x: canvasWidth / 2,
    y: canvasHeight / 2,
    acceleration_x: 100, // Slower movement for smoother control
    acceleration_y: 50,  // Slower vertical acceleration
    draw: function() {
        let x = this.x - this.width / 2;
        let y = this.y - this.height / 2;
        ctx.fillStyle = 'green';
        ctx.fillRect(x, y, this.width, this.height);
    },
}

// Camera angle initialization
let cameraAngle = 0;
const rotationSpeed = Math.PI / 4; // Speed at which the camera rotates

// Controls handling
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') controls.up_pressed = true;
    if (event.key === 'ArrowDown') controls.down_pressed = true;
    if (event.key === 'ArrowLeft') controls.left_pressed = true;
    if (event.key === 'ArrowRight') controls.right_pressed = true;
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowUp') controls.up_pressed = false;
    if (event.key === 'ArrowDown') controls.down_pressed = false;
    if (event.key === 'ArrowLeft') controls.left_pressed = false;
    if (event.key === 'ArrowRight') controls.right_pressed = false;
});

// Main game loop with controlled movement
let lastFrameResponse = 0;
let lastAnimationTime = 0;

function gameLoop(timestamp) {
    const delta = (timestamp - lastFrameResponse) / 1000; // Time difference in seconds
    lastFrameResponse = timestamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Move and draw planes
    Planes.forEach(plane => {
        plane.move_offset(delta); // Apply offset movement
        plane.move(delta); // Apply vertical movement and scaling
        plane.draw(); // Draw the plane sprite
    });

    // Handle animation frame change
    if (timestamp - lastAnimationTime > plane_animation.frame_rate) {
        plane_animation.current_frame = (plane_animation.current_frame + 1) % plane_animation.total_frames;
        plane_animation.calc_source_position(); // Update source_x
        lastAnimationTime = timestamp;
    }

    // Draw player turret
    player_turret.draw();

    // Update camera angle based on player input
    if (controls.left_pressed) cameraAngle -= rotationSpeed * delta;
    if (controls.right_pressed) cameraAngle += rotationSpeed * delta;
    cameraAngle %= Math.PI * 2; // Keep angle between 0 and 2π

    // Radar draw (if needed)
    drawRadar(player_turret, Planes, cameraAngle);

    requestAnimationFrame(gameLoop);
}

spritesheet.onload = () => {
    requestAnimationFrame(gameLoop);
}

// Radar drawing function (example)
function drawRadar(player, enemies, cameraAngle) {
    const radarRadius = 100; // Radar size
    const radarX = canvasWidth - radarRadius - 20; // Radar position (bottom-right corner)
    const radarY = canvasHeight - radarRadius - 20;

    // Draw radar background
    ctx.beginPath();
    ctx.arc(radarX, radarY, radarRadius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fill();
    ctx.strokeStyle = "white";
    ctx.stroke();

    // Draw the anchor point (player's position) on radar
    ctx.beginPath();
    ctx.arc(radarX, radarY, 5, 0, Math.PI * 2);
    ctx.fillStyle = "green";
    ctx.fill();

    // Scale the radar according to the player's distance
    const scale = radarRadius / 800; // Max range scale factor

    // Draw enemy blips
    enemies.forEach(enemy => {
        // Calculate enemy position relative to the player
        let relativeX = enemy.x - player.x;
        let relativeY = enemy.y - player.y;

        // Apply rotation for radar rotation
        const rotated = rotatePoint(relativeX, relativeY, cameraAngle);

        // Scale and position the radar blip
        const radarBlipX = radarX + rotated.x * scale;
        const radarBlipY = radarY + rotated.y * scale;

        // Draw radar blip
        ctx.beginPath();
        ctx.arc(radarBlipX, radarBlipY, 3, 0, Math.PI * 2);
        ctx.fillStyle = "red";
        ctx.fill();
    });
}

// Rotate a point by an angle (for the radar rotation)
function rotatePoint(x, y, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
        x: x * cos - y * sin,
        y: x * sin + y * cos,
    };
}
