//Canvas setup
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
//Visible window
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
//Entire game window
const GAME_WINDOW_HEIGHT = canvas.height + 200;
const GAME_WINDOW_WIDTH = canvas.width * 2;

//Configure mouse lock
canvas.addEventListener("click", async () => {
    await canvas.requestPointerLock();
    if (game.is_gameover) {
        game.reset();
    }
});

//Gameover properties
const gameover = {
    width: 400,
    height: 250,
}

//Game state controller
const score_top_margin = 25;
const game = {
    player_score: 0, 
    enemy_planes_amount: 1,
    is_gameover: false,
    stop: function() {
        this.is_gameover = true;
    },
    reset: function() {
        player_turret.reset();
        this.is_gameover = false;
        this.player_score = 0;
    },
    draw_score: function() {
        ctx.font = "64px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(this.player_score, canvasWidth/2, score_top_margin + 64);
    },
    update_score: function(amount) {
        this.player_score += amount;
    },
    draw_gameover: function() {
        ctx.fillStyle = 'rgba(24, 71, 19, 1)';
        ctx.fillRect(canvasWidth / 2 - (gameover.width + 20) / 2, canvasHeight / 3 - (gameover.height + 20) / 2, gameover.width + 20, gameover.height + 20);
        ctx.fillStyle = 'rgba(33, 112, 26, 1)';
        ctx.fillRect(canvasWidth / 2 - gameover.width / 2, canvasHeight / 3 - gameover.height / 2, gameover.width, gameover.height);

        ctx.font = "64px sans-serif";
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.fillText(this.player_score, canvasWidth/2, canvasHeight / 3 - 30);
        ctx.font = "32px sans-serif";
        ctx.fillText("Press anything to continue", canvasWidth/2, canvasHeight / 3 + 30);
    }
}

//Controls
const controls = {
    up_pressed: false,
    down_pressed: false,
    right_pressed: false,
    left_pressed: false,
    mouse_pressed: false,
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

//Explosion animation
const explosion_img = new Image();
explosion_img.src = "Assets/explosion-sheet.png";

const explosion_animation = {
    frame_width: 320,
    frame_height: 320,
    total_frames: 6,
    current_frame: 0,
    frame_rate: 100, 
    source_x: 0,
    source_y: 0,
    calc_source_position: function () {
        this.source_x = this.current_frame * this.frame_width;  
    },
}

//Camera
const camera = {
    offset_x: 0,
    offset_y: 0,
    acceleration_x: 50,
    acceleration_y: 25,
    y_offset_scale: 1,
    angle: 0,
    update_offset: function(mouse_x, mouse_y, delta) {
        this.angle = ((this.offset_x+2400)*360)/5600;
        console.log("Offset: ", this.offset_x);
        this.offset_x += mouse_x * this.acceleration_x * delta;
        this.offset_y += mouse_y * this.acceleration_y * delta;
        if (this.offset_y < -200) {
            this.offset_y = -200;
        };
        if (this.offset_y > 0) {
            this.offset_y = 0;
        } 
        this.y_offset_scale = 1 - this.offset_y / 1000;
        
        //console.log("Camera: x: ", this.offset_x, " y: ", this.offset_y, " yscale: ", this.y_offset_scale);
        this.adjust_camera();
    },
    adjust_camera: function() {
        if (this.offset_x > 3200) {
            console.log(-2400 + (3200 - this.offset_x));
            this.offset_x = (this.offset_x * -1) + 800 - (3200 - this.offset_x);
        }
        if (this.offset_x < -2400) {
            this.offset_x = 3200 + (-2400 - this.offset_x);
        }
    },
}

//Enemies obj
const enemy_plane = {
    x: canvasWidth / 2,
    y: 100,
    //camera_offset_x: 0,
    //camera_offset_y: 0,
    //camera_acceleration_x: 50,
    //camera_acceleration_y: 25,
    acceleration_y: 40,
    scaling_factor: 0.18,
    //y_offset_scale: 1,  
    scale: 0.1,
    color: 'green',
    is_on_scope: false,
    collision_box_width: 320,
    collision_box_height: 320,
    sprite: plane_animation,
    explosion: 0,
    death_x: 0,
    death_y: 0,
    play_explosion: false,
    adjust_position: function() {
    },
    draw_plane: function() {
        ctx.drawImage(
            spritesheet,
            plane_animation.source_x, plane_animation.source_y,
            plane_animation.frame_width, plane_animation.frame_height,
            this.x + camera.offset_x - (plane_animation.frame_width * 0.25 * this.scale * camera.y_offset_scale) / 2,
            this.y - camera.offset_y - (plane_animation.frame_height * 0.25 * this.scale) / 2,
            plane_animation.frame_width * 0.25 * this.scale * camera.y_offset_scale, plane_animation.frame_height * 0.25 * this.scale,
        );
        //Draw Colision Box
        /*ctx.fillStyle = 'green';
        ctx.fillRect(
            this.x + camera.offset_x - (this.collision_box_width * 0.25 * this.scale * camera.y_offset_scale) / 2,
            this.y - camera.offset_y -  (this.collision_box_height * 0.25 * this.scale) / 2,
            this.collision_box_width * 0.25 * this.scale * camera.y_offset_scale, this.collision_box_height * 0.25 * this.scale
        );*/
    },
    draw_explosion: function() {
        ctx.drawImage(
            explosion_img,
            this.explosion.source_x, this.explosion.source_y,
            this.explosion.frame_width, this.explosion.frame_height,
            this.x + camera.offset_x - (this.explosion.frame_width * 0.5 * this.scale * camera.y_offset_scale) / 2,
            this.y - camera.offset_y - (this.explosion.frame_height * 0.5 * this.scale) / 2,
            this.explosion.frame_width * 0.5 * this.scale * camera.y_offset_scale, this.explosion.frame_height * 0.5 * this.scale,
        ); 
    },
    get_col_width: function() {
        return this.collision_box_width * 0.25 * this.scale * camera.y_offset_scale;
    },
    get_col_height: function() {
        return this.collision_box_height * 0.25 * this.scale;
    },
    get_col_xpos: function() {
        return this.x + camera.offset_x - (this.collision_box_width * 0.25 * this.scale * camera.y_offset_scale);
    },
    get_col_ypos: function() {
        return this.y - camera.offset_y -  (this.collision_box_height * 0.25 * this.scale);
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
            this.kill_self();
        }
    },
    kill_self: function() {
        player_turret.deal_damage();
        this.reset();
    },
    reset: function() {
        this.death_x = this.x + this.camera_offset_x - (plane_animation.frame_width * 0.25 * this.scale * this.y_offset_scale) / 2;
        this.death_y = this.y - this.camera_offset_y - (plane_animation.frame_height * 0.25 * this.scale) / 2;
        this.play_explosion = false;
        this.explosion.current_frame = 0;
        this.y = 0;
        this.acceleration_y = 40;
        this.x = Math.floor(Math.random() * (1600 - (-800) - 800));
        this.scale = 0.1;
        this.width = 40;
        this.height = 20;
    },
}

// Planes
const Planes = [];
spawn_plane(14);

function spawn_plane(amount) {
    for (let i=0; i<amount; i++) {
        Planes.push({...enemy_plane});
        Planes[i].explosion = {...explosion_animation};
        //Planes[i].x = Math.floor(Math.random() * (100 - 50) - 50);
        Planes[i].x = -2400 + i * 400;
        //Planes[i].x = Math.floor(Math.random() * (1600 - (-800) - 800));
        console.log(Planes[i].x);
    }
}

//console.log(Planes[0]);
//console.log(Planes[0].explosion);
//Turret animation
const turret_active = new Image();
turret_active.src = "Assets/machinegun_spritesheet.png";

const turret_animation = {
    frame_width: 205,
    frame_height: 315,
    total_frames: 7,
    current_frame: 0,
    frame_rate: 50, 
    source_x: 0,
    source_y: 0,
    calc_source_position: function () {
        this.source_x = this.current_frame * this.frame_width;
    },
}

//Player obj
let turret_is_shooting = false;

const turret_inactive = new Image();
turret_inactive.src = "Assets/machinegun.png";
const turret_inactive_width = 205;
const turret_inactive_height = 315;

const player_turret = {
    x: canvasWidth / 2,
    y: canvasHeight,
    lives: 3,
    draw: function() {
        let x = this.x - turret_inactive_width / 2;
        let y = this.y - turret_inactive_height;
        if (turret_is_shooting == true) {     
            ctx.drawImage(
                turret_active,
                turret_animation.source_x, turret_animation.source_y,
                turret_animation.frame_width, turret_animation.frame_height,
                x,
                y,
                turret_animation.frame_width, turret_animation.frame_height,
            );
        } else {
            ctx.drawImage(turret_inactive, x, y, turret_inactive_width, turret_inactive_height); 
            //ctx.fillStyle = 'black';
            //ctx.fillRect(x, y, this.width, this.height);
        }
    }, 
    draw_disabled: function(y_offset) {
        this.y += y_offset;
        ctx.drawImage(turret_inactive, this.x - turret_inactive_width / 2, this.y - turret_inactive_height, turret_inactive_width, turret_inactive_height);
    },
    shoot: function(last_scope_anchor_x, last_scope_anchor_y) {
        Planes.forEach(plane => {
            //console.log("Collision width: ", plane.get_col_width(), " , height: ", plane.get_col_height(), " , x: ", plane.get_col_xpos(), " , y: ", plane.get_col_ypox());
            let plane_col_x = plane.get_col_xpos();
            let plane_col_x2 = plane_col_x + plane.get_col_width();
            let plane_col_y = plane.get_col_ypos();
            let plane_col_y2 = plane_col_y + plane.get_col_height();
            if (
                (plane_col_x > last_scope_anchor_x && plane_col_x < (last_scope_anchor_x + scope_width * 4) ||
                plane_col_x2 > last_scope_anchor_x && plane_col_x2 < (last_scope_anchor_x + scope_width * 4)) &&
                (plane_col_y > last_scope_anchor_y && plane_col_y < (last_scope_anchor_y + scope_height * 4) ||
                plane_col_y2 > last_scope_anchor_y && plane_col_y2 < (last_scope_anchor_y + scope_height * 4))
            ) {
                game.update_score(50);
                
                plane.play_explosion = true;
                //plane.reset();
                //console.log("Ładuj armate!");
            }
        })
    },
    deal_damage: function() {
        this.lives -= 1;
        if (this.lives == 0) {
            game.stop();
        }
    },
    reset: function() {
        this.y = canvasHeight;
        this.lives = 3;
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

let stop_animation;

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

document.addEventListener("mousedown", (event) => {
    if (event.button === 0) { // Left mouse button
        turret_is_shooting = true;
        stop_animation = false;
    }
});

document.addEventListener("mouseup", (event) => {
    if (event.button === 0) { // Left mouse button
        stop_animation = true
        //turret_is_shooting = false;
    }
});

let lastFrameResponse = 0;
let lastAnimationTime = 0;
let lastTurretAnimationTime = 0;

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

    // Draw enemy blips
    enemies.forEach(enemy => {
        if (enemy.play_explosion == true) {
            return;
        }
        // World angle of plane
        let plane_angle = (((enemy.x + camera.offset_x + 2400) * 360) / 5600) - 90;
    
        // Adjust for player's camera angle
        let relative_angle = (plane_angle - cameraAngle) % 360;
        if (relative_angle < 0) relative_angle += 360;
    
        // Calculate radius based on enemy scale
        let radius_percentage = (enemy.scale - 0.1) / 2.2;
        let radius = (1 - radius_percentage) * radarRadius;
    
        // Convert relative angle to radians
        let angle_to_radians = -relative_angle * (Math.PI / 180);
    
        // Convert to radar coordinates
        let point_on_radar_x = -radius * Math.cos(angle_to_radians);
        let point_on_radar_y = radius * Math.sin(angle_to_radians); // Adjust if needed
    
        // Calculate the angle toward the radar center
        let dx = radarX - (point_on_radar_x + radarX); 
        let dy = radarY - (point_on_radar_y + radarY);
        let angle_to_center = Math.atan2(dy, dx); 

        // Rotate plane icon
        ctx.save();
        ctx.translate(point_on_radar_x + radarX, point_on_radar_y + radarY); // Move origin to plane icon
        ctx.rotate(angle_to_center);
        ctx.drawImage(
            planeIcon,
            -(planeIcon.width * 0.25) / 2, 
            -(planeIcon.height * 0.25) / 2,
            planeIcon.width * 0.25,
            planeIcon.height * 0.25
        );
        ctx.restore();
    });
}

function drawRadarSight(camera_offset_y) {
    camera_vision_percent = Math.abs(camera_offset_y) / 200;
    //console.log(camera_vision_percent);
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
const rotationSpeed = Math.PI / 16;


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

let did_shoot = false;

// Main game loop
// ** Draw order **
// 1. Background
// 2. Planes
// 3. Screen cover
// 4. Turret
// 5. Radar
// 6. Radar Sight
// 7. Game score

//Update score every sec
const score_per_plane = 10;
function update_score_gradually() {
    game.update_score(score_per_plane * game.enemy_planes_amount);  
}
let score_updater_id = setInterval(update_score_gradually, 1000);

function game_loop(timestamp) {
    let delta = (timestamp - lastFrameResponse) / 1000;
    lastFrameResponse = timestamp;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    // ctx.restore();
    // ctx.save();
    // ctx.translate(Math.random()*50 - 25, Math.random()*50 - 25);

    
    if (game.is_gameover == true) {
        clearInterval(score_updater_id);
        
        //Draw background
        ctx.drawImage(background, camera.offset_x - background_width + canvasWidth/2, -camera.offset_y, background_width, canvasHeight);    
        ctx.drawImage(background, camera.offset_x + canvasWidth/2, -camera.offset_y, background_width, canvasHeight);  

        //Draw screen_cover
        //ctx.drawImage(screen_cover, 0, 0, canvasWidth, canvasHeight);
        
        //Draw turret
        player_turret.draw_disabled(50 * delta);

        //Draw gameover
        game.draw_gameover();
        requestAnimationFrame(game_loop);
        return;
    }

    //Draw background
    ctx.drawImage(background, camera.offset_x - background_width + canvasWidth/2, -camera.offset_y, background_width, canvasHeight);    
    ctx.drawImage(background, camera.offset_x + canvasWidth/2, -camera.offset_y, background_width, canvasHeight);  

    // Update camera angle based on player input
    //if (controls.right_pressed) cameraAngle += rotationSpeed * delta;
    //if (controls.left_pressed) cameraAngle -= rotationSpeed * delta;
    cameraAngle += mouse_movement_x * rotationSpeed * delta;
    cameraAngle %= Math.PI * 2; // Keep angle between 0 and 2πY
    camera.update_offset(-mouse_movement_x, mouse_movement_y, delta);
    Planes.forEach(plane => {
        plane.move(delta);
        mouse_movement_x = 0;
        mouse_movement_y = 0;
    })

    //Handle animations
    Planes.forEach(plane => {
        if (plane.play_explosion == true) {
            if (timestamp - lastAnimationTime > explosion_animation.frame_rate) {
                plane.explosion.current_frame = (plane.explosion.current_frame + 1) % plane.explosion.total_frames;
                plane.explosion.calc_source_position(); // Update source_x
                lastAnimationTime = timestamp;
            }
        plane.acceleration_y = 0;
        plane.draw_explosion();
        
        if (plane.explosion.current_frame == 5) {
            console.log(plane.explosion.current_frame);
            plane.reset();
        }
        } else {
            plane.draw_plane();
        }
    });

    if (timestamp - lastAnimationTime > plane_animation.frame_rate) {
        plane_animation.current_frame = (plane_animation.current_frame + 1) % plane_animation.total_frames;
        plane_animation.calc_source_position(); // Update source_x
        lastAnimationTime = timestamp;
    }
    if (turret_is_shooting) {
        if (timestamp - lastTurretAnimationTime > turret_animation.frame_rate) {
            
            if (turret_animation.current_frame == 1) player_turret.shoot(scope_anchor.x, scope_anchor.y);
            turret_animation.current_frame = (turret_animation.current_frame + 1) % turret_animation.total_frames;
            turret_animation.calc_source_position();
            lastTurretAnimationTime = timestamp;
        }
        if (stop_animation == true && turret_animation.current_frame == 0) {
            turret_is_shooting = false;
        }
    } else {
        if (turret_animation.current_frame != 0) {
            turret_animation.current_frame = (turret_animation.current_frame + 1) % turret_animation.total_frames;
            turret_animation.current_frame = (turret_animation.current_frame + 1) % turret_animation.total_frames;
            turret_animation.calc_source_position();
            //lastTurretAnimationTime = timestamp;
        }
        turret_animation.calc_source_position();
    }
   
    scope_anchor.draw();

    //Draw screen_cover
    /*ctx.drawImage(
        screen_cover,
        0,
        0, 
        canvasWidth, 
        canvasHeight 
    );*/

    //Draw turret
    player_turret.draw();

    // Draw the radar with updated positions
    drawRadar(player_turret, Planes, cameraAngle);
    drawRadarSight(camera.offset_y);

    //Draw score
    game.draw_score();
    
    requestAnimationFrame(game_loop);
}

spritesheet.onload = () => {
    requestAnimationFrame(game_loop);
}