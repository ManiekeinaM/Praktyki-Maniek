//Canvas setup
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
//Visible window
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
//Entire game window
const GAME_WINDOW_HEIGHT = canvas.height + 200;
const GAME_WINDOW_WIDTH = canvas.width * 2;

//Game state controller
const game = {
    player_score: 0, 
    reset: function() {
        player_turret.lives = 3;
    },
}

//Controls
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


//Enemies obj
const enemy_plane = {
    x: canvasWidth / 2,
    y: 0,
    camera_offset_x: 0,
    camera_offset_y: 0,
    camera_acceleration_x: 200,
    camera_acceleration_y: 100,
    acceleration_y: 20,
    scaling_factor: 0.1,
    y_offset_scale: 1,  
    scale: 0.1,
    color: 'green',
    sprite: plane_animation,
    draw: function() {
        ctx.drawImage(
            spritesheet,
            plane_animation.source_x, plane_animation.source_y,
            plane_animation.frame_width, plane_animation.frame_height,
            this.x + this.camera_offset_x - (plane_animation.frame_width * 0.25 * this.scale * this.y_offset_scale) / 2,
            this.y - this.camera_offset_y - (plane_animation.frame_height * 0.25 * this.scale) / 2,
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
        };
        if (controls.down_pressed) { 
            if (this.camera_offset_y > 0) {
                this.camera_offset_y = 0;
            } else {
                this.camera_offset_y += this.camera_acceleration_y * delta; 
            }
            this.y_offset_scale = 1 - this.camera_offset_y / 1000;
        };
        if (controls.left_pressed) { 
            this.camera_offset_x -= this.camera_acceleration_x * delta;
        };
        if (controls.right_pressed) { 
            this.camera_offset_x += this.camera_acceleration_x * delta; 
        };

        this.adjust_camera();
    },
    adjust_camera: function() {
        if (this.camera_offset_x + this.x > 1600) {
            this.camera_offset_x = this.camera_offset_x * -1 + 800;
        }
        if (this.camera_offset_x + this.x < -800) {
            this.camera_offset_x = this.camera_offset_x * -1 - 800;
        }
    },
    move: function(delta) {
        this.y += this.acceleration_y * delta;
        this.scale_up(delta);
        this.attack_player();
    },
    scale_up: function(delta) {
        this.scale += this.scaling_factor * delta;
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

// Planes
const Planes = [];
Planes.push(Object.create(enemy_plane));

//Player obj
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

//Camera / Scope obj
const MAX_CAMERA_OFFSET_Y = -200
const MIN_CAMERA_OFFSET_Y = GAME_WINDOW_HEIGHT 
//console.log("max offset y: ",MAX_CAMERA_OFFSET_Y);
//console.log("min offset y: ",MIN_CAMERA_OFFSET_Y);

const scope_anchor = {
    height: 5,
    width: 5,
    x: canvasWidth / 2,
    y: canvasHeight / 2,
    acceleration_x: 200,
    acceleration_y: 100,
    draw: function() {
        let x = this.x - this.width / 2;
        let y = this.y - this.height / 2;
        ctx.fillStyle = 'green';
        ctx.fillRect(x, y, this.width, this.height);
    },
}


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

let lastFrameResponse = 0;
let lastAnimationTime = 0;

//Radar
const planeIcon = new Image();
const IconHeigth = 144;
const IconWidth = 144;
planeIcon.src = 'Assets/PlaneIcon.png';

function drawRadar(player, enemies, cameraAngle) {
    const radarRadius = 100; // Radar size
    const radarX = canvasWidth - radarRadius;
    const radarY = canvasHeight - radarRadius;

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

    const scale = radarRadius / 800; // Scale game world to radar size

    // Draw enemy blips
    enemies.forEach(enemy => {
        // Get the center of the enemy's sprite (based on position, not scale)
        let relativeX = (enemy.x + (enemy.width / 2) - player.x);
        let relativeY = (enemy.y + (enemy.height / 2) - player.y);

        // Calculate the actual distance from the enemy center to the player
        const distance = Math.sqrt(relativeX ** 2 + relativeY ** 2) * 0.8;

        // We don't want to clamp the distance for radar blips anymore to prevent them from disappearing prematurely.
        const maxDistance = 800; 

        // Scale the distance on the radar
        const scaledX = (relativeX / distance) * distance * scale;
        const scaledY = (relativeY / distance) * distance * scale;

        // Rotate to match the radar's orientation (rotate the relative position)
        const rotated = rotatePoint(scaledX, scaledY, -cameraAngle);

        // Calculate the final position of the blip on the radar
        const radarBlipX = radarX + rotated.x;
        const radarBlipY = radarY + rotated.y;

        // Draw the blip if it is within the radar's radius
        if (distance < maxDistance) { 
            const iconWidth = planeIcon.width * 0.2; 
                const iconHeight = planeIcon.height * 0.2; 

                // Calculate the angle toward the radar center
                const angleToCenter = Math.atan2(radarY - radarBlipY, radarX - radarBlipX) - Math.PI / 2;

                // Rotate and draw the image
                ctx.save();
                ctx.translate(radarBlipX, radarBlipY);
                ctx.rotate(angleToCenter); 
                ctx.drawImage(
                    planeIcon,
                    -iconWidth / 2,
                    -iconHeight / 2, 
                    iconWidth, 
                    iconHeight 
                );
                ctx.restore();
        }
    });
}

function rotatePoint(x, y, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
        x: -(x * cos - y * sin),
        y: x * sin + y * cos,
    };
}


let cameraAngle = 0;
const rotationSpeed = Math.PI / 4;

// Main game loop
function game_loop(timestamp) {
    let delta = (timestamp - lastFrameResponse) / 1000;
    lastFrameResponse = timestamp;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);


    Planes.forEach(plane => {
        plane.move_offset(delta);
        plane.move(delta);
    })
    console.log(Planes[0].y_offset_scale);
    //Handle animation
    if (timestamp - lastAnimationTime > plane_animation.frame_rate) {
        plane_animation.current_frame = (plane_animation.current_frame + 1) % plane_animation.total_frames;
        plane_animation.calc_source_position(); // Update source_x
        lastAnimationTime = timestamp;
    }

    //Draw new sprites
    player_turret.draw();
    Planes.forEach(plane => {
        plane.draw();
    })
    scope_anchor.draw();

    // Update camera angle based on player input
    if (controls.left_pressed) cameraAngle -= rotationSpeed * delta;
    if (controls.right_pressed) cameraAngle += rotationSpeed * delta;
    cameraAngle %= Math.PI * 2; // Keep angle between 0 and 2π

    // Draw the radar with updated positions
    drawRadar(player_turret, Planes, cameraAngle);

    requestAnimationFrame(game_loop);
}

spritesheet.onload = () => {
    requestAnimationFrame(game_loop);
}


