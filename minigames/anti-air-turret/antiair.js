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
    acceleration_y: 40,
    scaling_factor: 0.18,
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
    move_offset: function(mouse_x, mouse_y, delta) {
        this.camera_offset_x += mouse_x * this.camera_acceleration_x * delta;
        this.camera_offset_y += mouse_y * this.camera_acceleration_y * delta;
        if (this.camera_offset_y < -200) {
            this.camera_offset_y = -200;
        };
        if (this.camera_offset_y > 0) {
            this.camera_offset_y = 0;
        } 
        this.y_offset_scale = 1 - this.camera_offset_y / 1000;
        
        this.adjust_camera();
        /*if (controls.up_pressed) { 
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
            this.camera_offset_x += this.camera_acceleration_x * delta;
        };
        if (controls.right_pressed) { 
            this.camera_offset_x -= this.camera_acceleration_x * delta; 
        };*/
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
        if (this.y > 0) {
            this.scale_up(delta);
        }
        this.attack_player();
    },
    scale_up: function(delta) {
        this.scale += this.scaling_factor * delta;
        this.width = 40 * this.scale;
        this.height = 20 * this.scale;
    },
    attack_player: function() {
        if (this.scale > 2.3) {
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
const scope_icon = new Image();
scope_icon.src = "Assets/celownik.png";
const scope_icon_height = 180;
const scope_icon_width = 300; 
const scope_width = scope_icon_width * 0.25;
const scope_height = scope_icon_height * 0.25;

const scope_anchor = {
    height: 5,
    width: 5,
    x: canvasWidth / 2 - scope_width/2,
    y: canvasHeight / 1.7 - scope_height/2,
    acceleration_x: 200,
    acceleration_y: 100,
    draw: function() {
        let x = this.x - this.width / 2;
        let y = this.y - this.height / 2;
        //ctx.fillStyle = 'green';
        //ctx.fillRect(x, y, this.width, this.height);
        ctx.drawImage(scope_icon, x, y, scope_width, scope_height);
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
    const radarX = canvasWidth - radarRadius - 20;
    const radarY = canvasHeight - radarRadius - 20;

    // Draw radar background
    ctx.beginPath();
    ctx.arc(radarX, radarY, radarRadius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(130, 215, 110, 0.2)";
    ctx.fill();
    ctx.strokeStyle = "white";
    ctx.stroke();

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

function drawRadarSight(camera_offset_y) {
    camera_vision_percent = Math.abs(camera_offset_y) / 200;
    console.log(camera_vision_percent);
    const radarRadius = 100 * camera_vision_percent * 0.5 + 40; 
    const radarX = canvasWidth - 20;
    const radarY = canvasHeight - 20;

    ctx.beginPath();
    ctx.arc(radarX - 100, radarY - 100, radarRadius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(130, 215, 110, 0.1)";
    ctx.fill();
    ctx.strokeStyle = "white";
    ctx.stroke();

    const line1_angle = 315 * (Math.PI / 180);
    const line2_angle = 225 * (Math.PI / 180);

    const x1 = (radarX-100) + radarRadius * Math.cos(line1_angle);
    const y1 = (radarY-100) + radarRadius * Math.sin(line1_angle);
    ctx.beginPath();
    ctx.moveTo(radarX - 100, radarY - 100);
    ctx.lineTo(x1, y1);   
    ctx.strokeStyle = "rgba(130, 215, 110, 0.5)";
    ctx.stroke();

    const x2 = (radarX-100) + radarRadius * Math.cos(line2_angle);
    const y2 = (radarY-100) + radarRadius * Math.sin(line2_angle);
    ctx.beginPath();
    ctx.moveTo(radarX - 100, radarY - 100);
    ctx.lineTo(x2, y2);   
    ctx.strokeStyle = "rgba(130, 215, 110, 0.5)";
    ctx.stroke();

    //Draw turret on radar
    ctx.beginPath();
    ctx.arc(radarX-100, radarY-100, 5, 0, Math.PI * 2);
    ctx.fillStyle = "green";
    ctx.fill();
}

function rotatePoint(x, y, angle) {
    const cos = Math.cos(-angle);
    const sin = Math.sin(-angle);
    return {
        x: -(x * cos - y * sin),
        y: x * sin + y * cos,
    };
}


let cameraAngle = 0;
const rotationSpeed = Math.PI / 4;


//Background
const background = new Image();
background.src = "Assets/shooter-background.png";
const background_width = 5120
const background_height = 1024
const background_x = 0;
const background_y = 0;


//Screen cover
const screen_cover = new Image();
screen_cover.src = "Assets/ScreenCover3.png";

let mouse_movement_x = 0;
let mouse_movement_y = 0;

function logMovement(event) {
    mouse_movement_x += event.movementX;
    mouse_movement_y += event.movementY;
}

  document.addEventListener("mousemove", logMovement);

// Main game loop
function game_loop(timestamp) {
    let delta = (timestamp - lastFrameResponse) / 1000;
    lastFrameResponse = timestamp;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    //Draw background
    ctx.drawImage(background, Planes[0].camera_offset_x - background_width + canvasWidth/2, -Planes[0].camera_offset_y, background_width, canvasHeight);    
    ctx.drawImage(background, Planes[0].camera_offset_x + canvasWidth/2, -Planes[0].camera_offset_y, background_width, canvasHeight);  

    // Update camera angle based on player input
    if (mouse_movement_x < 0) cameraAngle -= rotationSpeed * delta;
    if (mouse_movement_x > 0) cameraAngle += rotationSpeed * delta;
    cameraAngle %= Math.PI * 2; // Keep angle between 0 and 2πY

    Planes.forEach(plane => {
        plane.move_offset(-mouse_movement_x, mouse_movement_y, delta);
        plane.move(delta);
        mouse_movement_x = 0;
        mouse_movement_y = 0;
    })

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

    //Draw screen_cover
    ctx.drawImage(
        screen_cover,
        0,
        0, 
        canvasWidth, 
        canvasHeight 
    );

    // Draw the radar with updated positions
    drawRadar(player_turret, Planes, cameraAngle);
    drawRadarSight(Planes[0].camera_offset_y);

    requestAnimationFrame(game_loop);
}

spritesheet.onload = () => {
    requestAnimationFrame(game_loop);
}


