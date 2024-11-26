//Canvas setup
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
//Visible window
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
//Entire game window
const GAME_WINDOW_HEIGHT = canvas.height + canvas.height / 2;
const GAME_WINDOW_WIDTH = canvasWidth * 7;

const MAX_CAMERA_OFFSET_X = canvasWidth * 4;
const MIN_CAMERA_OFFSET_X = -canvasWidth * 3;
const ABS_MIN_CAMERA_OFFSET_X = canvasWidth * 3;
const TOTAL_GAME_WIDTH = Math.abs(MAX_CAMERA_OFFSET_X) + Math.abs(MIN_CAMERA_OFFSET_X);

let width_upscale = (800 / canvasWidth);
let height_upscale = (600 / canvasHeight);
if (width_upscale < 1) width_upscale += 1;
if (height_upscale < 1) height_upscale += 1;

console.log(width_upscale);
console.log(height_upscale);

//Configure mouse lock
canvas.addEventListener("click", async () => {
    await canvas.requestPointerLock();
    if (game.is_gameover || game.has_not_started) {
        game.reset();
    }
});

//Gameover properties
const gameover = {
    width: 400 * width_upscale,
    height: 250 * height_upscale,
}
//Lifebar properties
const lives_bar = {
    width: 100 * width_upscale,
    height: 100 * height_upscale,
}

//Buffs icons
const buff_icon = {
    width: 640 * 0.1 * width_upscale,
    height: 640 * 0.1 * height_upscale,
}

const speed_buff_icon = new Image();
const score_buff_icon = new Image();

speed_buff_icon.src = "Assets/buff_icons/shooter-speed.png";
score_buff_icon.src = "Assets/buff_icons/shooter-2x.png";

//Buff cooldown properties
let current_cooldowns = {"score": 0, "speed": 0};

const buff_cooldown = {
    x: 0,
    y: canvasHeight / 2,
    width: 100 * width_upscale,
    height: 60 * height_upscale,
    draw_cooldowns: function() {
        this.x = 0 + this.width / 2;

        for (const [key, value] of Object.entries(current_cooldowns)) {
            let icon = null;
            if (value > 0) { 
                if (key == "speed") { icon = speed_buff_icon; }
                if (key == "score") { icon = score_buff_icon; }
                console.log(icon);
                ctx.drawImage(icon, this.x, this.y, buff_icon.width, buff_icon.height);
                
                ctx.font = "2rem sans-serif";
                ctx.fillStyle = "white";
                ctx.textAlign = "center";
                ctx.fillText(Math.round(current_cooldowns[key] / 1000, 2), this.x + 20 + buff_icon.width / 2, this.y + buff_icon.height / 2);
                this.y -= 80 * height_upscale;
            }
        }
        this.y = canvasHeight / 2;
    }
}

//Single Live sprite
const life_icon = new Image();
life_icon.src = "Assets/turret-alive.png";

//Explosion animation
const explosion_img = new Image();
explosion_img.src = "Assets/explosion-sheet.png";

const spritesheet = new Image();
const heal_plane = new Image();
const speed_plane = new Image();
const score_plane = new Image();
spritesheet.src = 'Assets/enemy.png';
heal_plane.src = 'Assets/enemy-red.png';
speed_plane.src = 'Assets/enemy-orange.png';
score_plane.src = 'Assets/enemy-yellow.png';



const plane_animation = {
    frame_width: 640,
    frame_height: 640,
    total_frames: 3,
    current_frame: 0,
    frame_rate: 100,
    source_x: 0,
    source_y: 0,
    last_animation_time: 0,
    calc_source_position: function() {
        this.source_x = this.current_frame * this.frame_width;
    },  
}

const explosion_animation = {
    frame_width: 320,
    frame_height: 320,
    total_frames: 6,
    current_frame: 0,
    frame_rate: 100, 
    source_x: 0,
    source_y: 0,
    last_animation_time: 0,
    calc_source_position: function () {
        this.source_x = this.current_frame * this.frame_width;  
    },
}

// Waves
const Planes = [];

//Update score every sec
let score_updater_id = null;
const score_per_plane = 10;

function update_score_gradually() {
    game.update_score(score_per_plane * game.enemy_planes_amount);  
}


//Game state controller
const score_top_margin = 25;
const game = {
    player_score: 0, 
    enemy_planes_amount: 1,
    kill_count: 0,
    is_gameover: false,
    has_not_started: true,
    stop: function() {
        this.is_gameover = true;
    },
    reset: function() {
        Planes.length = 0;
        this.enemy_planes_amount = 0;
        this.spawn_plane(1);
        player_turret.reset();
        this.has_not_started = false;
        this.is_gameover = false;
        this.player_score = 0;
        this.kill_count = 0;
        score_updater_id = setInterval(update_score_gradually, 1000);
    },
    spawn_plane: function(amount) {
        for (let i=0; i<amount; i++) {
            let plane = {...enemy_plane};
            plane.explosion = {...explosion_animation} ;
            plane.sprite = {...plane_animation};
            plane.item = {...special_item};
            plane.item.type = 0;

            let roll = Math.floor(Math.random() * 20 + 1); 
            if (roll == 4) { plane.item.type = "heal";}
            if (roll == 7) { plane.item.type = "speed";}
            if (roll == 13) { plane.item.type = "score";}   
            plane.x = Math.floor(Math.random() * TOTAL_GAME_WIDTH + MIN_CAMERA_OFFSET_X);
            Planes.push(plane);
            this.enemy_planes_amount++;
        }
    },
    update_killcount: function() {
        //console.log(this.kill_count);
        //console.log(this.enemy_planes_amount);
        this.kill_count += 1;
        if (this.kill_count > this.enemy_planes_amount * 4) {
            this.spawn_plane(1);
        }
    },
    draw_score: function() {
        ctx.font = "64px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(this.player_score, canvasWidth/2, score_top_margin + 64);
    },
    update_score: function(amount) {
        this.player_score += amount;
    },
    draw_start_screen: function() {
        ctx.fillStyle = 'rgba(24, 71, 19, 1)';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.fillStyle = 'rgba(33, 112, 26, 1)';
        ctx.fillRect(40, 40, canvasWidth - 80, canvasHeight - 80);
        ctx.fillStyle = 'white';
        ctx.font = "32px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Press anything to start", canvasWidth/2, canvasHeight/2);
    },
    draw_gameover: function() {
        ctx.fillStyle = 'rgba(24, 71, 19, 1)';
        ctx.fillRect(canvasWidth / 2 - (gameover.width + 20) / 2, canvasHeight / 3 - (gameover.height + 20) / 2, (gameover.width + 20), gameover.height + 20);
        ctx.fillStyle = 'rgba(33, 112, 26, 1)';
        ctx.fillRect(canvasWidth / 2 - gameover.width / 2, canvasHeight / 3 - gameover.height / 2, gameover.width, gameover.height);

        ctx.font = "64px sans-serif";
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.fillText(this.player_score, canvasWidth/2, canvasHeight / 3 - 30);
        ctx.font = "32px sans-serif";
        ctx.fillText("Press anything to continue", canvasWidth/2, canvasHeight / 3 + 30);
    },
    draw_livesbar: function() {
        for (let i=1; i<=player_turret.lives; i++) {
            ctx.drawImage(life_icon, 0 + life_icon.width*width_upscale*0.25/2 * i, canvasHeight - life_icon.height * 0.25 * height_upscale - 20, life_icon.width * 0.25 * width_upscale, life_icon.height * 0.25 * height_upscale); 
        }
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

//Camera
const camera = {
    offset_x: 0,
    offset_y: 0,
    acceleration_x: 50,
    acceleration_y: 25,
    y_offset_scale: 1,
    angle: 0,
    update_offset: function(mouse_x, mouse_y, delta) {
        this.angle = ((this.offset_x+ABS_MIN_CAMERA_OFFSET_X)*360)/ TOTAL_GAME_WIDTH;
        this.offset_x += mouse_x * this.acceleration_x * delta;
        this.offset_y += mouse_y * this.acceleration_y * delta;
        if (this.offset_y < -(GAME_WINDOW_HEIGHT - canvasHeight)) {
            this.offset_y = -(GAME_WINDOW_HEIGHT - canvasHeight);
        };
        if (this.offset_y > 0) {
            this.offset_y = 0;
        } 
        this.y_offset_scale = 1 - this.offset_y / 1000;
        
        //console.log("Camera: x: ", this.offset_x, " y: ", this.offset_y, " yscale: ", this.y_offset_scale);
        this.adjust_camera();
    },
    adjust_camera: function() {
        if (this.offset_x > MAX_CAMERA_OFFSET_X) {
            this.offset_x = (this.offset_x * -1) + canvasWidth - (MAX_CAMERA_OFFSET_X - this.offset_x);
        }
        if (this.offset_x < MIN_CAMERA_OFFSET_X) {
            this.offset_x = MAX_CAMERA_OFFSET_X + (MIN_CAMERA_OFFSET_X - this.offset_x);
        }
    },
}

const special_item = {
    type: 0,
    use: function() {
        if (this.type == 'heal') {
            player_turret.heal();
        }
        if (this.type == 'speed') {
            player_turret.boost_speed();
        }
        if (this.type == 'score') {
            player_turret.boost_score();
        }
    }
}

//Enemies obj
const enemy_plane = {
    x: canvasWidth / 2,
    y: 100,
    acceleration_y: 40,
    scaling_factor: 0.18,
    scale: 0.1,
    color: 'green',
    is_on_scope: false,
    collision_box_width: 320,
    collision_box_height: 320,
    sprite: 0,
    explosion: 0,
    death_x: 0,
    death_y: 0,
    play_explosion: false,
    is_special: false,
    item: 0,
    draw_plane: function() {
        let sprite = spritesheet;
        if (this.item.type == "heal") { sprite = heal_plane }
        if (this.item.type == "speed") { sprite = speed_plane }
        if (this.item.type == "score") { sprite = score_plane }
        //console.log(this.item.type);
        ctx.drawImage(
            sprite,
            this.sprite.source_x, this.sprite.source_y,
            this.sprite.frame_width, this.sprite.frame_height,
            this.x + camera.offset_x - (this.sprite.frame_width * 0.25 * this.scale * camera.y_offset_scale) / 2,
            this.y - camera.offset_y - (this.sprite.frame_height * 0.25 * this.scale) / 2,
            this.sprite.frame_width * 0.25 * this.scale * camera.y_offset_scale * width_upscale , this.sprite.frame_height * 0.25 * this.scale * camera.y_offset_scale * height_upscale,
        );
        //Draw Colision Box
        //let plane_col_x = this.get_col_xpos();
        //let plane_col_x2 = this.get_col_width();
        //let plane_col_y = this.get_col_ypos();
        //let plane_col_y2 = this.get_col_height();
        //ctx.fillStyle = "rgba(33, 112, 26, 0.5)"
        //ctx.fillRect(this.x + camera.offset_x - plane_col_x2/2, this.y - camera.offset_y - plane_col_y2 / 2, plane_col_x2, plane_col_y2);
    },
    draw_explosion: function() {
        ctx.drawImage(
            explosion_img,
            this.explosion.source_x, this.explosion.source_y,
            this.explosion.frame_width, this.explosion.frame_height,
            this.x + camera.offset_x - (this.explosion.frame_width * 0.5 * this.scale * camera.y_offset_scale) / 2,
            this.y - camera.offset_y - (this.explosion.frame_height * 0.5 * this.scale) / 2,
            this.explosion.frame_width * 0.5 * this.scale * camera.y_offset_scale * width_upscale, this.explosion.frame_height * 0.5 * this.scale * camera.y_offset_scale * height_upscale,
        ); 
    },
    get_col_width: function() {
        return this.collision_box_width * 0.25 * this.scale * camera.y_offset_scale * width_upscale;
    },
    get_col_height: function() {
        return this.collision_box_height * 0.25 * this.scale * camera.y_offset_scale * height_upscale;
    },
    get_col_xpos: function() {
        return this.x + camera.offset_x - this.get_col_width() / 2;
    },
    get_col_ypos: function() {
        return this.y - camera.offset_y - this.get_col_height() / 2;
    },
    move: function(delta) {
        this.y += this.acceleration_y * delta;
        if (this.y > 0) {
            this.scale_up(delta);
        }
        
        // Add camera wrapping for planes
        if (this.x + camera.offset_x > MAX_CAMERA_OFFSET_X) 
            this.x = this.x - TOTAL_GAME_WIDTH;
        
        if (this.x + camera.offset_x < MIN_CAMERA_OFFSET_X) 
            this.x = this.x + TOTAL_GAME_WIDTH;
        
        
        this.attack_player();
    },
    scale_up: function(delta) {
        this.scale += this.scaling_factor * delta;
        //this.width = 40 * this.scale;
        //this.height = 20 * this.scale;
    },
    attack_player: function() {
        //if (this.scale > 2.3 && this.play_explosion == false) {
        //    this.kill_self();
        //}
        if (this.y > canvasHeight - turret_inactive_height + (0.5 * turret_inactive_height) && this.play_explosion == false) {
            this.kill_self();
        }
    },
    kill_self: function() {
        player_turret.deal_damage();
        this.play_explosion = true;
        //this.reset();
    },
    reset: function() {
        this.item.type = 0;
        let roll = Math.floor(Math.random() * 20 + 1); 
        if (roll == 4) { this.item.type = "heal";}
        if (roll == 7) { this.item.type = "speed";}
        if (roll == 13) { this.item.type = "score";}   
        this.death_x = this.x + this.camera_offset_x - (plane_animation.frame_width * 0.25 * this.scale * this.y_offset_scale) / 2;
        this.death_y = this.y - this.camera_offset_y - (plane_animation.frame_height * 0.25 * this.scale) / 2;
        this.play_explosion = false;
        this.explosion.current_frame = 0;
        this.y = 0;
        this.acceleration_y = 40;
        this.x = Math.floor(Math.random() * TOTAL_GAME_WIDTH + MIN_CAMERA_OFFSET_X);
        this.scale = 0.1;
        this.width = 40;
        this.height = 20;
        this.scaling_factor = 0.18;
        game.update_killcount();
    },
}




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
const turret_inactive_width = 205 * width_upscale;
const turret_inactive_height = 315 * height_upscale;

const player_turret = {
    x: canvasWidth / 2,
    y: canvasHeight,
    lives: 3,
    score_multiplier: 1,
    speed_timeout: null,
    score_timeout: null,
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
                turret_animation.frame_width * width_upscale, turret_animation.frame_height * height_upscale,
            );
        } else {
            ctx.drawImage(turret_inactive, x, y, turret_inactive_width, turret_inactive_height); 
        }
    }, 
    draw_disabled: function(y_offset) {
        this.y += y_offset;
        ctx.drawImage(turret_inactive, this.x - turret_inactive_width / 2, this.y - turret_inactive_height, turret_inactive_width, turret_inactive_height);
    },
    shoot: function(last_scope_anchor_x, last_scope_anchor_y) {
        Planes.forEach(plane => {
            let plane_col_x = plane.get_col_xpos();
            let plane_col_x2 = plane_col_x + plane.get_col_width();
            let plane_col_y = plane.get_col_ypos();
            let plane_col_y2 = plane_col_y + plane.get_col_height();
            if (
                (last_scope_anchor_x > plane_col_x) && 
                (last_scope_anchor_x < plane_col_x2) &&
                (last_scope_anchor_y > plane_col_y) && 
                (last_scope_anchor_y < plane_col_y2)
            ) {
                game.update_score(50 * this.score_multiplier);
                if (plane.play_explosion == false) {
                plane.item.use();
                }
                plane.play_explosion = true;
            }
        })
    },
    deal_damage: function() {
        this.lives -= 1;
        if (this.lives == 0) {
            game.stop();
        }
    },
    heal: function() {
        this.lives += 1;
    },
    boost_speed: function() {
        if (this.speed_timeout) {
            clearTimeout(this.speed_timeout);
        }

        turret_animation.frame_rate = 15;

        this.speed_timeout = setTimeout(() => {
            turret_animation.frame_rate = 50;
            this.speed_timeout = null;
        }, 6000);
        current_cooldowns["speed"] = 6000;
    },
    boost_score: function() {
        if (this.score_timeout) {
            clearTimeout(this.score_timeout);
        }
        
        this.score_multiplier = 2;

        this.score_timeout = setTimeout(() => {
            this.score_multiplier = 1;
            this.score_timeout = null;
        }, 6000)
        current_cooldowns["score"] = 6000;
    },
    remove_buff: function() {
        this.score_multiplier = 1;
        turret_animation.frame_rate = 50;
        for (const [key, value] of Object.entries(current_cooldowns)) {
            current_cooldowns[key] = 0;
        }
    },
    reset: function() {
        //ensure buffs are dispelled
        this.speed_timeout = null;
        this.score_timeout = null;
        this.remove_buff();

        this.y = canvasHeight;
        this.lives = 3;
    }
}


const scope_icon = new Image();
scope_icon.src = "Assets/celownik.png";
const scope_icon_height = 180;
const scope_icon_width = 300; 
const scope_width = scope_icon_width * 0.25 * width_upscale;
const scope_height = scope_icon_height * 0.25 * height_upscale;

const scope_anchor = {
    height: 5,
    width: 5,
    x: canvasWidth / 2 - scope_width / 2,
    y: canvasHeight / 1.7 - scope_height / 2,
    acceleration_x: 200,
    acceleration_y: 100,
    draw: function() {
        ctx.drawImage(scope_icon, this.x, this.y, scope_width, scope_height);
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
const plane_icon_normal = new Image();
const plane_icon_heal = new Image();
const plane_icon_speed = new Image();
const plane_icon_score = new Image();

plane_icon_normal.src = "Assets/plane_icons/plane_icon_normal.png";
plane_icon_heal.src = "Assets/plane_icons/plane_icon_heal.png";
plane_icon_speed.src = "Assets/plane_icons/plane_icon_speed.png";
plane_icon_score.src = "Assets/plane_icons/plane_icon_score.png";

const IconHeight = 144 * 0.25;
const IconWidth = 144 * 0.25;

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
        let plane_angle = (((enemy.x + camera.offset_x + Math.abs(MIN_CAMERA_OFFSET_X)) * 360) / TOTAL_GAME_WIDTH) - 90;
    
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

        let icon_sprite = plane_icon_normal;
        if (enemy.item.type == "heal")  icon_sprite = plane_icon_heal;
        else if (enemy.item.type == "speed") icon_sprite = plane_icon_speed; 
        else if (enemy.item.type == "score") icon_sprite = plane_icon_score;

        ctx.drawImage(
            icon_sprite,
            -(IconWidth) / 2, 
            -(IconHeight) / 2,
            IconWidth,
            IconHeight
        );
        ctx.restore();
    });
}

function drawRadarSight(camera_offset_y) {
    camera_vision_percent = Math.abs(camera_offset_y) / (canvasHeight / 2);
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
//background.src = "Assets/shooter-background.png";
//background.src = "Assets/Testbg.png";
background.src = "Assets/Sky_bg.png";
const background_width = GAME_WINDOW_WIDTH + canvasWidth * 2;
const background_height = GAME_WINDOW_HEIGHT + canvasHeight / 2;
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

function game_loop(timestamp) {
    let delta = (timestamp - lastFrameResponse) / 1000;
    lastFrameResponse = timestamp;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    if (game.has_not_started == true) {
        game.draw_start_screen();
        requestAnimationFrame(game_loop);
        return;
    }

    if (game.is_gameover == true) {
        clearInterval(score_updater_id);
        
        //Draw background
        ctx.drawImage(background, camera.offset_x - background_width / 2, -camera.offset_y - background_height/4, background_width, background_height);
        
        //Draw turret
        player_turret.draw_disabled(50 * delta);

        //Draw gameover
        game.draw_gameover();
        requestAnimationFrame(game_loop);
        return;
    }

    cameraAngle += mouse_movement_x * rotationSpeed * delta;
    cameraAngle %= Math.PI * 2; // Keep angle between 0 and 2πY
    camera.update_offset(-mouse_movement_x, mouse_movement_y, delta);
    Planes.forEach(plane => {
        plane.move(delta);
        mouse_movement_x = 0;
        mouse_movement_y = 0;
    })

    //Draw background
    ctx.drawImage(background, camera.offset_x - background_width / 2, -camera.offset_y - background_height/4, background_width, background_height); 

    //Handle animations
    Planes.forEach(plane => {
        if (plane.play_explosion == true) {
            if (timestamp - plane.explosion.last_animation_time > explosion_animation.frame_rate) {
                plane.explosion.current_frame = (plane.explosion.current_frame + 1) % plane.explosion.total_frames;
                plane.explosion.calc_source_position(); // Update source_x
                plane.explosion.last_animation_time = timestamp;
            }
        plane.scaling_factor = 0.0;
        plane.acceleration_y = 0;
        plane.draw_explosion();
        
        if (plane.explosion.current_frame == 5) {
            //console.log(plane.explosion.current_frame);
            plane.reset();
        }
        } else {
            if (timestamp - plane.sprite.last_animation_time > plane_animation.frame_rate) {
                plane.sprite.current_frame = (plane.sprite.current_frame + 1) % plane.sprite.total_frames;
                plane.sprite.calc_source_position(); // Update source_x
                plane.sprite.last_animation_time = timestamp;
            }
            plane.draw_plane();
        }
    });
    if (turret_is_shooting) {
        if (timestamp - lastTurretAnimationTime > turret_animation.frame_rate) {
            if (turret_animation.current_frame == 1) player_turret.shoot(scope_anchor.x + scope_width / 2, scope_anchor.y + scope_height / 2);
            //ctx.beginPath();
            //ctx.strokeStyle = "black";
            //ctx.arc(scope_anchor.x + scope_width*width_upscale/2 - 5/2, scope_anchor.y + scope_height*height_upscale/2 - 5/2, 10, 0, 2 * Math.PI);
            //ctx.stroke();
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

    //Draw turret
    player_turret.draw();

    // Draw the radar with updated positions
    drawRadar(player_turret, Planes, cameraAngle);
    drawRadarSight(camera.offset_y);

    for (const [key, value] of Object.entries(current_cooldowns)) {
        console.log(key, " ", value);
        if (value > 0) {
            current_cooldowns[key] -= 1000 * delta;
        }
    }

    //Draw GUI
    game.draw_score();
    game.draw_livesbar();
    buff_cooldown.draw_cooldowns();
    
    requestAnimationFrame(game_loop);
}

spritesheet.onload = () => {
    requestAnimationFrame(game_loop);
}