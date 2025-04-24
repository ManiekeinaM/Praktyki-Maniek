//Canvas setup
const canvas = document.querySelector('canvas.antiair.plane-canvas');
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

//Configure mouse lock
canvas.addEventListener("click", async () => {
    if (!DISABLE_MOUSE_GAMES) {
        await canvas.requestPointerLock();
    }
    if (game.is_gameover || game.has_not_started) {
        game.reset();
    }
});

//Gameover properties
const gameover = {
    width: 600 * width_upscale,
    height: 250 * height_upscale,
}

//Single Live sprite
const life_icon = new Image();
life_icon.src = "./assets/antiair/turret-alive.png";

//Explosion animation
const explosion_img = new Image();
explosion_img.src = "./assets/antiair/explosion-sheet.png";

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

const plane_variants = {
    "none" : "./assets/antiair/planes/plane_normal.png",
    "ShootingSpeed" : "./assets/antiair/planes/plane_shoot_speed.png",
    "ScoreMultiplier" : "./assets/antiair/planes/plane_multiplier.png",
    "RandomBuffs"  : "./assets/antiair/planes/plane_random.png",
    "HealthUp"  : "./assets/antiair/planes/plane_heal.png",
    "Reverse" : "./assets/antiair/planes/plane_reverse.png",
    "ExplosiveBullets" : "./assets/antiair/planes/plane_explosive.png",
    "ScreenAOE" : "./assets/antiair/planes/plane_aoe.png", 
    "Aimbot" : "./assets/antiair/planes/plane_aimbot.png",
    "Immortality" : "./assets/antiair/planes/plane_immortal.png",
    "Slow" : "./assets/antiair/planes/plane_slow.png", 
}




// Plane obj array
const Planes = [];

//Update score every sec
let score_updater_id = null;
const score_per_plane = 10;

function update_score_gradually() {
    game.update_score(score_per_plane * game.enemy_planes_amount);  
}

//Highscore table
const scores_table = document.querySelector(".highscoresList[data-highscorecookie='airturret-bestscores']");

import { HighScores } from '../highscores.js';

const highscoreManager = new HighScores(scores_table);
highscoreManager.updateHighscores();

let random_explosions_id = 0;

function drawRoundedRect(x, y, width, height, radius, fillColor) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.arcTo(x + width, y, x + width, y + radius, radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    ctx.lineTo(x + radius, y + height);
    ctx.arcTo(x, y + height, x, y + height - radius, radius);
    ctx.lineTo(x, y + radius);
    ctx.arcTo(x, y, x + radius, y, radius);
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();
    ctx.lineWidth = 10;
    ctx.strokeStyle = 'rgb(24,71,19)';
    ctx.stroke();
}

//Game state controller
const score_top_margin = 25;

const game = {
    player_score: 0, 
    enemy_planes_amount: 1,
    kill_count: 0,
    is_gameover: false,
    play_explosion_sequence: false,
    has_not_started: true,
    stop: function() {
        // Unlock mouse pointer
        document.exitPointerLock();
        // create explosions on player death
        this.play_explosion_sequence = true;
        random_explosions_id = setInterval(create_explosion, 1000);

        // Refresh highscore table
        highscoreManager.addScore(this.player_score);
        highscoreManager.updateHighscores();
    },
    reset: function() {
        Planes.length = 0;
        SponsorPlanes.length = 0;
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
            plane.explosion = {...explosion_animation};
            plane.sprite = {...plane_animation};
            plane.item = {...special_item};
            plane.item.type = "none";

            //Roll for chance of getting plane containing random buff
            plane.item.type = roll_for_plane();

            let sprite = new Image();
            sprite.src = plane_variants[plane.item.type];
            plane.plane_img = sprite;
              
            plane.x = Math.floor(Math.random() * TOTAL_GAME_WIDTH + MIN_CAMERA_OFFSET_X);
            Planes.push(plane);
            this.enemy_planes_amount++;
        }
    },
    update_killcount: function() {
        this.kill_count += 1;

        // Spawn new planes, after killing required amount of enemies
        if (this.kill_count > this.enemy_planes_amount * this.enemy_planes_amount) {
            this.spawn_plane(1);
            this.kill_count = 0;
        }
    },
    // Top game score
    draw_score: function() {
        ctx.font = `64px Determination Mono`;
        ctx.textAlign = "center";
        ctx.fillText(this.player_score, canvasWidth/2, score_top_margin + 64);
    },
    update_score: function(amount) {
        this.player_score += amount;
    },
    draw_start_screen: function() {
        ctx.fillStyle = 'white';
        ctx.font = "32px Determination Mono";
        ctx.textAlign = "center";
        ctx.fillText("Kliknij by zagrać", canvasWidth/2, canvasHeight/2);
    },
    draw_gameover: function() {
        // Outline box
        drawRoundedRect(canvasWidth / 2 - (gameover.width + 20) / 2, canvasHeight / 3 - (gameover.height + 20) / 2, gameover.width + 20, gameover.height + 20, 64, "rgba(33, 112, 26, 1)");
        // ctx.fillStyle = 'rgba(24, 71, 19, 1)';
        // ctx.fillRect(canvasWidth / 2 - (gameover.width + 20) / 2, canvasHeight / 3 - (gameover.height + 20) / 2, (gameover.width + 20), gameover.height + 20);
        // Inside box
        // ctx.fillStyle = 'rgba(33, 112, 26, 1)';
        // ctx.fillRect(canvasWidth / 2 - gameover.width / 2, canvasHeight / 3 - gameover.height / 2, gameover.width, gameover.height);

        // Score
        ctx.font = "64px Determination Mono";
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.fillText(this.player_score, canvasWidth/2, canvasHeight / 3 - 30);

        // Press again text
        ctx.font = "32px Determination Mono";
        ctx.fillText("Kliknij by zagrać ponownie", canvasWidth/2, canvasHeight / 3 + 30);
    },
    // Draw lives in rows, above maniek window
    draw_livesbar: function() {
        let max_amount_per_row = 6;
        for (let i=1; i<player_turret.lives + 1; i++) {
            if (i % 6 == 0) i++;
            ctx.drawImage(
                life_icon,
                -sponsor_window.padding * 2 + life_icon.width*width_upscale*0.25/2 * (i % max_amount_per_row),
                canvasHeight - sponsor_window.height + sponsor_window.padding - life_icon.height * 0.25 * height_upscale - Math.floor(15 * height_upscale * parseInt(i / max_amount_per_row)),
                life_icon.width * 0.25 * width_upscale,
                life_icon.height * 0.25 * height_upscale
            ); 
        }
    }
}

//Camera
const camera = {
    offset_x: 0,
    offset_y: 0,
    acceleration_x: 50,
    acceleration_y: 25,
    y_offset_scale: 1,
    angle: 0,
    is_shaking: false,
    shake_timeout: null,
    auto_aim: false,
    desired_offset: 0,
    update_offset: function(mouse_x, mouse_y, delta) {
        if (this.auto_aim == true) {
            this.move_toward_plane(delta);
            this.adjust_camera();
            return;
        }
        // Current angle camera is facing
        this.angle = ((this.offset_x+ABS_MIN_CAMERA_OFFSET_X)*360)/ TOTAL_GAME_WIDTH;

        let fake_acceleration = 1.5;
        // Move with mouse
        this.offset_x += mouse_x * this.acceleration_x * delta * fake_acceleration;
        this.offset_y += mouse_y * this.acceleration_y * delta * fake_acceleration;

        // Limit camera Y-Axis movement
        if (this.offset_y < -(GAME_WINDOW_HEIGHT - canvasHeight)) {
            this.offset_y = -(GAME_WINDOW_HEIGHT - canvasHeight);
        };
        if (this.offset_y > 0) {
            this.offset_y = 0;
        } 

        // Used to scale sprites for depth imitation
        this.y_offset_scale = 1 - this.offset_y / 1000;

        // Wrap camera on X-Axis
        this.adjust_camera();
    },
    move_toward_plane(delta) {
        // Aimbot camera speed
        let x_aim_acceleration = 2000;
        let y_aim_acceleration = 500;

        // Get the offset to center camera on closest plane
        let desired_offset = get_closest_plane();
        if (desired_offset == null) return;
        // Calc distance to the desired offset
        let distance_x = desired_offset.x - this.offset_x;
        let distance_y = desired_offset.y - this.offset_y;

        // Gradually move offset to the desired point
        let x_offset_calc = Math.sign(distance_x) * x_aim_acceleration * delta;
        let y_offset_calc = Math.sign(distance_y) * y_aim_acceleration * delta 
        this.offset_x += x_offset_calc;
        this.offset_y += y_offset_calc;

        //Check if next calc won't overshoot
        if (
            Math.sign(distance_x) == 1 && desired_offset.x - (this.offset_x + x_offset_calc) < 0 ||
            Math.sign(distance_x) == -1 && desired_offset.x - (this.offset_x + x_offset_calc) > 0) {
            this.offset_x = desired_offset.x;
        } 
        if (Math.sign(distance_y) == 1 && desired_offset.y - (this.offset_y + y_offset_calc) < 0 ||
            Math.sign(distance_y) == -1 && desired_offset.y - (this.offset_y + y_offset_calc) > 0) {
            this.offset_y = desired_offset.y;
        }

        //Shoot if on target
        if (distance_x <= 50 && distance_x >= -50 && distance_y <= 80 && distance_y >= -80) {
            turret_is_shooting = true;
            player_turret.shoot(scope_anchor.x + scope_width / 2, scope_anchor.y + scope_height / 2);
        }
    },
    // Wrap camera if needed
    adjust_camera: function() {
        if (this.offset_x > MAX_CAMERA_OFFSET_X) {
            this.offset_x = (this.offset_x * -1) + canvasWidth - (MAX_CAMERA_OFFSET_X - this.offset_x);
        }
        if (this.offset_x < MIN_CAMERA_OFFSET_X) {
            this.offset_x = MAX_CAMERA_OFFSET_X - (MIN_CAMERA_OFFSET_X - this.offset_x);
        }
    },
    // Shake camera
    shake: function(i) {
        if (this.shake_timeout) {
            clearTimeout(this.shake_timeout);
        }

        this.is_shaking = true;

        this.shake_timeout = setTimeout(() => {
            this.is_shaking = false;
            this.shake_timeout = null;
        }, 400);
    }
}

//Buff list 
const buff_list = ["ShootingSpeed", "ScoreMultiplier", "RandomBuffs", "HealthUp", "ExplosiveBullets", "Aimbot", "Immortality", "Slow", "ScreenAOE", "Reverse"];
//Roll for plane type
function roll_for_plane() {
    //let roll = 4;
    let roll = Math.floor(Math.random() * 5 + 1);
    if (roll == 4) {
        let rolled_buff = roll_for_buff();
        return rolled_buff;
    } else {
        return "none"
    }
}

//Roll for buff type
function roll_for_buff() {
    let roll = Math.floor(Math.random() * buff_list.length);
    return buff_list[roll];
}

//----- LIST OF BUFFS ------
//1. Shooting Speed (Cooldown)
//2. Score multiplier (Cooldown)
//3. Get 2 random buffs (One-shot)
//4. Health up (One-shot)
//5. Reverse (Cooldown)
//6. Explosive bullets (Cooldown)
//7. Screen AOE (One-shot)
//8. Aimbot (Cooldown)
//9. Temporary Immortality (Cooldown)
//10. Slow down partner (Cooldown)

// Get closeset plane to player on y-axis
function get_closest_plane() {
    let closest_plane = null;
    let closest_to_y;
    let new_offset = {x: 0, y: 0};

    Planes.forEach(plane => {
        // If plane is exploding skip it
        if (plane.play_explosion) {
            return;
        }

        // Initialize first plane
        if (closest_plane == null) {
            closest_plane = plane;
            closest_to_y = plane.y;
        }

        // Check if plane is closer than previous one
        if (plane.y > closest_to_y && plane.play_explosion == false) {
            closest_plane = plane;
            closest_to_y = plane.y;
        }
    });

    // Return null if no planes were found
    if (closest_plane == null) return null;

    // Calc offset to have the plane centred on screen
    new_offset.x = (closest_plane.x - canvasWidth / 2) * -1;
    new_offset.y = closest_plane.y - 350;

    return new_offset;
}

// Time for each buff
const cooldown_times = {
    "ShootingSpeed" : 8 * 1000,
    "ScoreMultiplier" : 6 * 1000,
    "Reverse" : 2 * 1000,
    "ExplosiveBullets" : 8 * 1000,
    "Aimbot" : 6 * 1000,
    "Immortality" : 7 * 1000,
    "Slow" : 6 * 1000,
}

//Buff cooldowns
let current_cooldowns = {
    "ShootingSpeed" : 0,
    "ScoreMultiplier" : 0,
    "Reverse" : 0,
    "ExplosiveBullets" : 0,
    "Aimbot" : 0,
    "Immortality" : 0,
    "Slow" : 0,
};

// Actions to perform on each buff
const buff_action = {
    "none" : function() { },
    "ShootingSpeed" : function() { buff_handler.activate_faster_shooting() },
    "ScoreMultiplier" : function() { buff_handler.activate_score_multiplier() },
    "RandomBuffs" : function() { buff_handler.use_roll_buffs() },
    "HealthUp" : function() { buff_handler.use_heal() },
    "Reverse" : function() { buff_handler.activate_reverse() },
    "ExplosiveBullets" : function() { buff_handler.activate_explosive_bullets() },
    "ScreenAOE" : function() { buff_handler.use_kill_all() },
    "Aimbot" : function() { buff_handler.activate_aimbot() },
    "Immortality" : function() { buff_handler.activate_immortality() },
    "Slow" : function() { buff_handler.activate_slow() },
}

const buff_handler = {
    shooting_speed_timeout : 0,
    score_multiplier_timeout : 0,
    reverse_timeout: 0,
    explosive_bullets_timeout : 0,
    aimbot_timeout : 0,
    immortality_timeout : 0,
    slow_timeout : 0,   
    // Rolls two random buffs
    use_roll_buffs: function() {
        buff_action[roll_for_buff()]();
        buff_action[roll_for_buff()](); 
    },
    // Heals
    use_heal: function() {
        player_turret.lives += 1;
    },
    // Kills all planes in middle range
    use_kill_all: function() {
        Planes.forEach(plane => {
            if (plane.y > canvasHeight / 4) plane.play_explosion = true;
        })
    },
    // Increases shooting speed
    activate_faster_shooting: function() {
            if (this.shooting_speed_timeout) {
                clearTimeout(this.shooting_speed_timeout);
            }
    
            turret_animation.frame_rate = 15;
    
            this.shooting_speed_timeout = setTimeout(() => {
                turret_animation.frame_rate = 50;
                this.shooting_speed_timeout = null;
            }, cooldown_times["ShootingSpeed"]);
            current_cooldowns["ShootingSpeed"] = cooldown_times["ShootingSpeed"];
    },
    // Multiplies incoming score by 2
    activate_score_multiplier: function() {
            if (this.score_multiplier_timeout) {
                clearTimeout(this.score_multiplier_timeout);
            }
            
            player_turret.score_multiplier = 2;
    
            this.score_multiplier_timeout = setTimeout(() => {
                player_turret.score_multiplier = 1;
                this.score_multiplier_timeout = null;
            }, cooldown_times["ScoreMultiplier"])
            current_cooldowns["ScoreMultiplier"] = cooldown_times["ScoreMultiplier"];
    },
    activate_reverse: function() {
        if (this.reverse_timeout) {
            clearTimeout(this.reverse_timeout);
        }
        
        Planes.forEach(plane => {
            // Reverses acceleration_y and scaling_factor
            plane.is_reversed = true;
        })

        this.reverse_timeout = setTimeout(() => {
            Planes.forEach(plane => {
                plane.is_reversed = false;
            })
            this.reverse_timeout = null;
        }, cooldown_times["Reverse"])
        current_cooldowns["Reverse"] = cooldown_times["Reverse"];
    },

    // Makes bullets explosive and kills planes in the explosion radius
    activate_explosive_bullets: function() {
        if (this.explosive_bullets_timeout) {
            clearTimeout(this.explosive_bullets_timeout);
        }
        
        player_turret.bullets_type = "explosive";

        this.explosive_bullets_timeout = setTimeout(() => {
            player_turret.is_immortal = false;
            player_turret.bullets_type = "regular";
            this.explosive_bullets_timeout = null;
        }, cooldown_times["ExplosiveBullets"])
        current_cooldowns["ExplosiveBullets"] = cooldown_times["ExplosiveBullets"];
    },

    // Aims towards closest plane and kills it
    activate_aimbot: function() {
        if (this.aimbot_timeout) {
            clearTimeout(this.aimbot_timeout);
        }

        camera.auto_aim = true;

        this.aimbot_timeout = setTimeout(() => {
            camera.auto_aim = false;
            this.aimbot_timeout = null;
        }, cooldown_times["Aimbot"])
        current_cooldowns["Aimbot"] = cooldown_times["Aimbot"];
    },

    // Disables taking damage
    activate_immortality: function() {
        if (this.immortality_timeout) {
            clearTimeout(this.immortality_timeout);
        }
        
        player_turret.is_immortal = true;

        this.immortality_timeout = setTimeout(() => {
            player_turret.is_immortal = false;
            this.immortality_timeout = null;
        }, cooldown_times["Immortality"])
        current_cooldowns["Immortality"] = cooldown_times["Immortality"];
    },

    // Slows down all planes
    activate_slow: function() {
        if (this.slow_timeout) {
            clearTimeout(this.slow_timeout);
        }
        
        Planes.forEach(plane => {
            // Decreases acceleration_y
            // Decreases scaling_factor
            plane.is_slow = true;
        })

        this.slow_timeout = setTimeout(() => {
            Planes.forEach(plane => {
                plane.is_slow = false;
            })
            this.slow_timeout = null;
        }, cooldown_times["Slow"])
        current_cooldowns["Slow"] = cooldown_times["Slow"];
    }

}

// Used by planes
const special_item = {
    type: 0,
    use: function() {buff_action[this.type]()},
}

// Maniek sprite
const current_maniek_sprite = new Image();

const maniek_sprite = {
    "idle": "./assets/antiair/maniek_faces/Maniek-blink.png",
    "blink": "./assets/antiair/maniek_faces/Maniek-blink.png",
    "shocked": "./assets/antiair/maniek_faces/Maniek-wow.png",
    "sad": "./assets/antiair/maniek_faces/Maniek-sad.png",
}

const maniek_sprites_properties = {
    state : "idle",
    upcoming_state: "idle",
    "idle": {
        frame_width: 3822 / 7,
        frame_height: 426,
        total_frames: 1,
    },
    "blink": {
        frame_width: 3822 / 7,
        frame_height: 426,
        total_frames: 7,
    },
    "shocked": {
        frame_width: 3420 / 6,
        frame_height: 600,
        total_frames: 6,
    },
    "sad": {
        frame_width: 1092 / 2,
        frame_height: 420,
        total_frames: 2,
    },
    "display_item": {
        frame_width: 640,
        frame_height: 640,
        total_frames: 12,
        item: "none",
    },
    current_frame: 0,
    frame_rate: 100, 
    source_x: 0,
    source_y: 0,
    last_animation_time: 0,
    calc_source_position: function () {
        if (this.state == "display_item") {
            this.source_x = 0;
        } else {      
            this.source_x = this.current_frame * this[this.state].frame_width;  
        }
    },
    update_state: function() {
        maniek_sprites_properties.state = maniek_sprites_properties.upcoming_state;
        maniek_sprites_properties.update_sprite();

        if (maniek_sprites_properties.upcoming_state == maniek_sprites_properties.state) maniek_sprites_properties.upcoming_state = "idle";
    },
    change_state: function(state) {
        maniek_sprites_properties.upcoming_state = state;

        if (maniek_sprites_properties.upcoming_state == "blink" && maniek_sprites_properties.state == "idle") {
            maniek_sprites_properties.update_state();
        }

        if (this.state == "idle") {
            maniek_sprites_properties.update_state();
        }
    },
    update_sprite: function() {
        if (this.state == "display_item") {
            current_maniek_sprite.src = buff_icons[this.display_item.item].src;
        } else {
            current_maniek_sprite.src = maniek_sprite[this.state];
        }
    }
}

// Blink every 7s (only if current state == "idle")
let maniek_blink_id = setInterval(maniek_sprites_properties.change_state.bind(maniek_sprites_properties.change_state,"blink"), 7000);


current_maniek_sprite.src = maniek_sprite["idle"];


const sponsor_plane_properties = {
    frame_width: 3912 / 4,
    frame_height: 348,
    total_frames: 4,
    current_frame: 0,
    frame_rate: 100,
    source_x: 0,
    source_y: 0,
    last_animation_time: 0,
    calc_source_position: function() {
       this.source_x = this.current_frame * this.frame_width;
    },  
}

const sponsor_logos = {
    "Immortality": "./assets/antiair/sponsors/tomtom-logo.png", //"TomTom"
    "ScoreMultiplier": "./assets/antiair/sponsors/bsh-logo.png", // "B/S/H"
    "RandomBuffs": "./assets/antiair/sponsors/veolia-logo.png", // "Veolia"
    "HealthUp": "./assets/antiair/sponsors/better-logo.png", // "BetterCollective"
    "ExplosiveBullets": "./assets/antiair/sponsors/hydro-logo.png", // "Hydro"
    "Aimbot": "./assets/antiair/sponsors/pg-logo.png", // "PG"
    "Slow": "./assets/antiair/sponsors/radio-logo.png", // "RadioLodz"
    "ShootingSpeed": "./assets/antiair/sponsors/fujitsu-logo.png", // "Fujistu"
    "Reverse": "./assets/antiair/sponsors/toya-logo.png", // "Toya"
    "ScreenAOE": "./assets/antiair/sponsors/hitachi-logo.png", // "Hitachi"
}

const SponsorPlanes = [];

const wanted_height = 150 * height_upscale;

const sponsor_plane = {
    x: -200,
    speed_x: 200,
    y: 20,
    sponsor_logo: 0,
    animation: 0,
    sprite: 0,
    move(delta) {
        this.x += 200 * delta; 
        if (this.x > canvasWidth + this.sponsor_logo.width / this.get_aspect_ratio() * this.get_even_scaling_factor());
    },
    get_aspect_ratio: function() {
        return this.sponsor_logo.width / this.sponsor_logo.height;
    },
    get_even_scaling_factor: function() {
        return wanted_height / this.sponsor_logo.height;
    },
    draw: function() {
        ctx.drawImage(
            this.sponsor_logo,
            this.x + 5 * width_upscale,
            this.y + (this.animation.frame_height * 0.325 * height_upscale) / 2 - (this.sponsor_logo.height / this.get_aspect_ratio() * this.get_even_scaling_factor()) / 2,
            Math.round(this.sponsor_logo.width / this.get_aspect_ratio() * this.get_even_scaling_factor() * width_upscale),
            this.sponsor_logo.height / this.get_aspect_ratio() * this.get_even_scaling_factor() * width_upscale,
        )
    },
    draw_plane: function() {
        ctx.drawImage(
            this.sprite,
            this.animation.source_x,
            this.animation.source_y,
            this.animation.frame_width,
            this.animation.frame_height,
            Math.round(this.x),
            this.y,
            this.animation.frame_width * 0.325 * width_upscale, this.animation.frame_height * 0.325 * height_upscale,
        );
    },
}

const sponsor_window = {
    width: 250 * width_upscale,
    height: 175 * height_upscale,
    padding: 15,
    buff_width: 20 * width_upscale,
    buff_height: 20 * height_upscale,
    
    inside_box_width: 0,
    inside_box_height: 0,
    inside_box_x: 0,
    inside_box_y: 0,

    maniek_screen_width: 0,
    maniek_screen_height: 0,
    maniek_screen_x: 0,
    maniek_screen_y: 0,

    maniek_face_width: 0,
    maniek_face_height: 0,
    maniek_face_x: 0,
    maniek_face_y: 0,

    init: function() {
        let x = 0 - this.padding / 2;
        let y = canvasHeight - this.height + this.padding / 2;
        
        this.inside_box_width = this.width - this.padding;
        this.inside_box_height = this.height - this.padding;
        this.inside_box_x = x + this.padding / 2;
        this.inside_box_y = y + this.padding / 2;

        this.maniek_screen_width = this.width - this.padding * 2;
        this.maniek_screen_height = this.height - this.padding * 2;
        this.maniek_screen_x = x + this.padding;
        this.maniek_screen_y = y + this.padding;

        this.maniek_face_width = this.maniek_screen_width - this.padding * 2;
        this.maniek_face_height = this.maniek_screen_height - this.padding * 2;
        this.maniek_face_x = Math.round(this.maniek_screen_x + this.padding);
        this.maniek_face_y = this.maniek_screen_y + this.padding;
    },

    draw: function() {
        let x = 0 - this.padding / 2;
        let y = canvasHeight - this.height + this.padding / 2;

        // Outline box
        ctx.fillStyle = "rgba(24, 71, 19, 1)";
        ctx.fillRect(x, y, this.width, this.height);
        
        // Inside box
        ctx.fillStyle = 'rgba(33, 112, 26, 1)';
        ctx.fillRect(this.inside_box_x, this.inside_box_y, this.inside_box_width, this.inside_box_height);

        // Maniek screen
        ctx.fillStyle = 'rgba(5, 0, 0, 1)';
        ctx.fillRect(this.maniek_screen_x, this.maniek_screen_y, this.maniek_screen_width, this.maniek_screen_height);

        ctx.beginPath();
        ctx.arc(x + 50, y + this.height - 50, 40, Math.PI /2, Math.PI);
        ctx.strokeStyle = "rgba(33, 112, 26, 1)";
        ctx.lineWidth = 10;
        ctx.stroke();
    },
    draw_maniek: function() {
        ctx.drawImage(
            current_maniek_sprite,
            maniek_sprites_properties.source_x, maniek_sprites_properties.source_y,
            maniek_sprites_properties[maniek_sprites_properties.state].frame_width, 
            maniek_sprites_properties[maniek_sprites_properties.state].frame_height,
            this.maniek_face_x,
            this.maniek_face_y,
            this.maniek_face_width , this.maniek_face_height,
        );
    },
}

//Buffs icons
const buff_icon = {
    width: 640 * 0.1 * width_upscale,
    height: 640 * 0.1 * height_upscale,
}

// Cooldown icons
const shoot_speed_icon = new Image();
const score_multiplier_icon = new Image();
const reverse_icon = new Image(); 
const explosive_bullets_icon = new Image();
const aimbot_icon = new Image();
const immortality_icon = new Image();
const slow_icon = new Image();

shoot_speed_icon.src = "./assets/antiair/buff_icons/shooter-speed.png";
score_multiplier_icon.src = "./assets/antiair/buff_icons/shooter-2x.png";
reverse_icon.src = "./assets/antiair/buff_icons/shooter-reverse.png";
explosive_bullets_icon.src = "./assets/antiair/buff_icons/shooter-boomboom.png";
aimbot_icon.src = "./assets/antiair/buff_icons/shooter-aimbot.png" ;
immortality_icon.src = "./assets/antiair/buff_icons/shooter-immortal.png" ;
slow_icon.src = "./assets/antiair/buff_icons/shooter-slow.png"; 

//One shot icons (Popup)
const health_up_icon = new Image();
const screen_aoe_icon = new Image();
const random_buffs_icon = new Image();

health_up_icon.src = "./assets/antiair/buff_icons/shooter-heal.png";
screen_aoe_icon.src = "./assets/antiair/buff_icons/shooter-nuke.png";
random_buffs_icon.src = "./assets/antiair/buff_icons/shooter-random.png";

//Buff cooldowns
const buff_icons = {
    //Cooldowns
    "ShootingSpeed" : shoot_speed_icon,
    "ScoreMultiplier" : score_multiplier_icon,
    "Reverse" : reverse_icon,
    "ExplosiveBullets" : explosive_bullets_icon,
    "Aimbot" : aimbot_icon,
    "Immortality" : immortality_icon,
    "Slow" : slow_icon,

    //One-shot
    "RandomBuffs" : random_buffs_icon,
    "HealthUp" : health_up_icon,
    "ScreenAOE" : screen_aoe_icon,
};

const buff_cooldown = {
    x: 0,
    y: canvasHeight / 2,
    width: 100 * width_upscale,
    height: 60 * height_upscale,
    draw_cooldowns: function() {
        this.x = 0 + 20 * width_upscale;

        // Draw enabled cooldowns
        let displayed_buffs_amount = 0;
        for (const [key, value] of Object.entries(current_cooldowns)) {
            let icon = null;
            if (value > 0) { 
                icon = buff_icons[key];

                // Stack buffs next to each other, to prevent Y-axis overflow
                if (displayed_buffs_amount == 4) {
                    this.x = 30;
                    this.y = canvasHeight / 2;
                }

                ctx.drawImage(icon, this.x, this.y - 20 * height_upscale, buff_icon.width, buff_icon.height);
                
                ctx.font = "2rem Determination Mono";
                ctx.fillStyle = "white";
                ctx.textAlign = "center";
                ctx.fillText(Math.round(current_cooldowns[key] / 1000, 2), this.x + 20 + buff_icon.width / 2, this.y + buff_icon.height / 2 - 20 * height_upscale);
                this.y -= 80 * height_upscale;
                

                displayed_buffs_amount++;
            }
        }
        displayed_buffs_amount = 0;
        this.y = canvasHeight / 2;
    }
}

//Enemies obj
const enemy_plane = {
    x: canvasWidth / 2,
    y: 100,
    acceleration_y: 40,
    scaling_factor: 0.18,
    scale: 0.1,
    collision_box_width: 320,
    collision_box_height: 320,
    plane_img: 0,
    sprite: 0,
    explosion: 0,
    play_explosion: false,
    item: 0,
    // Plane debuffs
    is_slow: false,
    is_reversed: false,
    draw_plane: function() {
        ctx.drawImage(
            this.plane_img,
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
        if (this.is_reversed) {
            this.y -= this.acceleration_y * delta;
        }
        else if (this.is_slow) {
            this.y += this.acceleration_y * 0.5 * delta;
        }
        else {
            this.y += this.acceleration_y * delta;
        }
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
        if (this.is_reversed) {
            this.scale -= this.scaling_factor * delta;
        }
        else if (this.is_slow) {
            this.scale += this.scaling_factor * 0.5 * delta;
        }
        else {
            this.scale += this.scaling_factor * delta;
        }    
    },
    attack_player: function() {
        if (this.y > canvasHeight - turret_inactive_height + (0.5 * turret_inactive_height) && this.play_explosion == false) {
            this.kill_self();
        }
    },
    kill_self: function() {
        player_turret.deal_damage();
        this.play_explosion = true;
    },
    reset: function() {
        this.item.type = "none";
        //Roll for type
        this.item.type = roll_for_plane();
        this.plane_img.src = plane_variants[this.item.type];
        
        this.play_explosion = false;
        this.explosion.current_frame = 0;
        this.y = 0;
        this.acceleration_y = 40;
        this.scaling_factor = 0.18;
        this.x = Math.floor(Math.random() * TOTAL_GAME_WIDTH + MIN_CAMERA_OFFSET_X);
        this.scale = 0.1;
        this.width = 40;
        this.height = 20;
        game.update_score(50 * player_turret.score_multiplier);
        game.update_killcount();
    },
}


//Turret animation
const turret_active = new Image();
turret_active.src = "./assets/antiair/machinegun_spritesheet.png";

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

//Explosion effects for explosive bullets buff
const Explosions = [];
const explosion_effect = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    animation: 0,
    draw: function() {
        // Add camera wrapping for planes
        if (this.x + camera.offset_x > MAX_CAMERA_OFFSET_X) 
            this.x = this.x - TOTAL_GAME_WIDTH;
        
        if (this.x + camera.offset_x < MIN_CAMERA_OFFSET_X) 
            this.x = this.x + TOTAL_GAME_WIDTH;

        ctx.drawImage(
            explosion_img,
            this.animation.source_x, this.animation.source_y,
            this.animation.frame_width, this.animation.frame_height,
            this.x + camera.offset_x,
            this.y - camera.offset_y,
            this.width, this.height,
        ); 
    },
    draw_on_UI: function() {
        ctx.drawImage(
            explosion_img,
            this.animation.source_x, this.animation.source_y,
            this.animation.frame_width, this.animation.frame_height,
            this.x,
            this.y,
            this.width, this.height,
        ); 
    },
}

//Player obj
let turret_is_shooting = false;

const turret_inactive = new Image();
turret_inactive.src = "./assets/antiair/machinegun.png";
const turret_inactive_width = 205 * width_upscale;
const turret_inactive_height = 315 * height_upscale;

const player_turret = {
    x: canvasWidth / 2,
    y: canvasHeight,
    lives: 3,
    score_multiplier: 1,
    speed_timeout: null,
    score_timeout: null,
    is_immortal: false,
    bullets_type: "regular",
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

            let plane_hit = false;

            //Explosive detection
            /*
                X Y - - - - X2
                 |          |
                 |          |
                 |          |
                 Y2 - - - - +

                S > X && S < X2
                S > Y && S < Y2
            */
            if (this.bullets_type == "explosive") {
                let explosion_width = 200 * width_upscale / (camera.y_offset_scale * 0.75);
                let explosion_height = 150 * height_upscale / (camera.y_offset_scale * 0.75);
                let explosion_xstart = last_scope_anchor_x - explosion_width / 2;
                let explosion_ystart = last_scope_anchor_y - explosion_height / 2;

                let explosion =  {...explosion_effect};
                explosion.animation = {...explosion_animation};
                explosion.x = explosion_xstart - camera.offset_x;
                explosion.y = explosion_ystart + camera.offset_y;
                explosion.width = explosion_width;
                explosion.height = explosion_height;

                Explosions.push(explosion);

                //ctx.fillStyle = "rgba('255','0','0','50')";
                //ctx.fillRect(explosion_xstart, explosion_ystart, explosion_width, explosion_height);
                if(
                   (
                    explosion_xstart < plane_col_x + plane.get_col_width() &&
                    explosion_xstart + explosion_width > plane_col_x &&
                    explosion_ystart < plane_col_y + plane.get_col_height() &&
                    explosion_ystart + explosion_height > plane.get_col_width()
                   )  
                ) {
                    plane_hit = true;
                }
            }

            // Regular detection
            if (
                /*
                X Y - - - - X2
                 | S        |
                 |          |
                 |          |
                 Y2 - - - - +

                S > X && S < X2
                S > Y && S < Y2
                */
                (plane.play_explosion == false) && 
                (last_scope_anchor_x > plane_col_x) && 
                (last_scope_anchor_x < plane_col_x2) &&
                (last_scope_anchor_y > plane_col_y) && 
                (last_scope_anchor_y < plane_col_y2)
            ) {
                plane_hit = true;
            }
            
            if (plane_hit) {
                if (plane.play_explosion == false) {
                plane.item.use();
                if (plane.item.type != "none") {
                    let new_plane = {...sponsor_plane};
                    let logo = new Image();
                    
                    logo.src = sponsor_logos[plane.item.type];
                    new_plane.sponsor_logo = logo;
                    
                    let sponsor_plane_sprite = new Image();
                    sponsor_plane_sprite.src = "./assets/antiair/plane-support.png";
                    new_plane.sprite = sponsor_plane_sprite;
                    new_plane.animation = {...sponsor_plane_properties};

                    if (SponsorPlanes.length != 0) {
                        if (SponsorPlanes[SponsorPlanes.length - 1].x < 0) {
                            new_plane.x = Math.round(SponsorPlanes[SponsorPlanes.length - 1].x - 600);
                        }
                    }
                
                    SponsorPlanes.push(new_plane);

                    maniek_sprites_properties.change_state("shocked");
                    maniek_sprites_properties.display_item.item = plane.item.type;
                    maniek_sprites_properties.change_state("display_item");
                }
                }
                plane.play_explosion = true;
                plane_hit = false;
            }
        })
    },
    deal_damage: function() {
        camera.shake();
        if (this.is_immortal) return 0;
        maniek_sprites_properties.change_state("sad");
        this.lives -= 1;
        if (this.lives == 0) {
            game.stop();
        }
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
scope_icon.src = "./assets/antiair/celownik.png";
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

document.addEventListener("mousedown", (event) => {
    if (event.button === 0) {
        turret_is_shooting = true;
        stop_animation = false;
    }
});

document.addEventListener("mouseup", (event) => {
    if (event.button === 0) { 
        stop_animation = true
    }
});

let lastFrameResponse = 0;
let lastTurretAnimationTime = 0;


// Radar
const icon_types_list = ["none", "ShootingSpeed", "ScoreMultiplier", "RandomBuffs", "HealthUp", "ExplosiveBullets", "Aimbot", "Immortality", "Slow", "ScreenAOE", "Reverse"];

const radar_icons = {
    "none" : "./assets/antiair/plane_icons/plane_icon_normal.png",
    "ShootingSpeed" : "./assets/antiair/plane_icons/plane_icon_shoot_speed.png",
    "ScoreMultiplier" : "./assets/antiair/plane_icons/plane_icon_multiplier.png",
    "RandomBuffs"  : "./assets/antiair/plane_icons/plane_icon_random.png",
    "HealthUp"  : "./assets/antiair/plane_icons/plane_icon_heal.png",
    "Reverse" : "./assets/antiair/plane_icons/plane_icon_reverse.png",
    "ExplosiveBullets" : "./assets/antiair/plane_icons/plane_icon_explosive.png",
    "ScreenAOE" : "./assets/antiair/plane_icons/plane_icon_aoe.png", 
    "Aimbot" : "./assets/antiair/plane_icons/plane_icon_aimbot.png",
    "Immortality" : "./assets/antiair/plane_icons/plane_icon_immortal.png",
    "Slow" : "./assets/antiair/plane_icons/plane_icon_slow.png", 
}

const preloaded_images = {};
icon_types_list.forEach(buffName => {
    let image = new Image();
    image.src = radar_icons[buffName];
    preloaded_images[buffName] = image;
})

const IconHeight = 144 * 0.25;
const IconWidth = 144 * 0.25;

/*
  // Outline box
        ctx.fillStyle = "rgba(24, 71, 19, 1)";
        ctx.fillRect(x, y, this.width, this.height);
        
        // Inside box
        ctx.fillStyle = 'rgba(33, 112, 26, 1)';
        ctx.fillRect(this.inside_box_x, this.inside_box_y, this.inside_box_width, this.inside_box_height);

        // Maniek screen
        ctx.fillStyle = 'rgba(5, 0, 0, 1)';
        ctx.fillRect(this.maniek_screen_x, this.maniek_screen_y, this.maniek_screen_width, this.maniek_screen_height);
*/

function drawRadar(player, enemies, cameraAngle) {
    const radarRadius = 100; // Radar size
    const radarX = canvasWidth - radarRadius - 20;
    const radarY = canvasHeight - radarRadius - 20;

    // Draw radar background

    ctx.beginPath();
    ctx.arc(radarX, radarY, radarRadius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(5, 30, 0, 1)";
    ctx.fill();
    ctx.stroke();
    
    // Draw "Sight lines" - not really accurate, but looks cool
    drawRadarSight();

    // Clip sprites around radar
    ctx.save();
    ctx.beginPath();
    ctx.arc(radarX, radarY, radarRadius + 7.5, 0, Math.PI * 2);
    ctx.clip()

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


        let icon_sprite = preloaded_images[enemy.item.type];

        ctx.drawImage(
            icon_sprite,
            -(IconWidth) / 2, 
            -(IconHeight) / 2,
            IconWidth,
            IconHeight
        );

        // Disable clipping
        ctx.restore();
    });
    
    // Draw outer outline
    ctx.beginPath();
    ctx.arc(radarX, radarY, radarRadius, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(24, 71, 19, 1)";
    ctx.lineWidth = 15; 
    ctx.stroke();

    // Draw inner outline
    ctx.beginPath();
    ctx.arc(radarX, radarY, radarRadius, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(33, 112, 26, 1)";
    ctx.lineWidth = 5; 
    ctx.stroke();

    ctx.restore();
}



function drawRadarSight() {
    const camera_vision_percent = Math.abs(camera.offset_y) / (canvasHeight / 2);
    const radarRadius = 100 * camera_vision_percent * 0.5 + 40; 
    const radarX = canvasWidth - 20;
    const radarY = canvasHeight - 20;

    ctx.lineWidth = 4; 

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


    ctx.beginPath();
    ctx.arc(radarX - 100, radarY - 100, radarRadius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(130, 215, 110, 0.1)";
    ctx.fill();
    ctx.strokeStyle = "rgba(24, 71, 19, 1)";
    ctx.stroke();
    //Draw turret on radar
    ctx.beginPath();
    ctx.arc(radarX-100, radarY-100, 5, 0, Math.PI * 2);
    ctx.fillStyle = "green";
    ctx.fill();
}

let cameraAngle = 0;
const rotationSpeed = Math.PI / 16;


//Background
const background = new Image();
//background.src = "./assets/antiair/shooter-background.png";
//background.src = "./assets/antiair/Testbg.png";
background.src = "./assets/antiair/Sky_bg.png";
//background.src = "./assets/antiair/Calibrationbg.png";
const background_width = GAME_WINDOW_WIDTH + canvasWidth * 2;
const background_height = GAME_WINDOW_HEIGHT + canvasHeight / 2;



let mouse_movement_x = 0;
let mouse_movement_y = 0;


function logMovement(event) {
    mouse_movement_x += event.movementX;
    mouse_movement_y += event.movementY;
}
document.addEventListener("mousemove", logMovement);

let lastTouchX = null;
let lastTouchY = null;
let touchSensMultiplier = 2;

function logTouchMovement(event) {
    if (lastTouchX !== null && lastTouchY !== null) {
        const deltaX = event.touches[0].clientX - lastTouchX;
        const deltaY = event.touches[0].clientY - lastTouchY;
        mouse_movement_x += deltaX * touchSensMultiplier;
        mouse_movement_y += deltaY * touchSensMultiplier;
    }
    lastTouchX = event.touches[0].clientX;
    lastTouchY = event.touches[0].clientY;
}

document.addEventListener("touchstart", (event) => {
    lastTouchX = event.touches[0].clientX;
    lastTouchY = event.touches[0].clientY;
});

document.addEventListener("touchmove", logTouchMovement);

// Main game loop
// ** Draw order **
// * Start Screen
// * - background
// * - player
// * - radar
// * - livebar
// * - maniek window
// * - start screen
// * Gameover
// * - background
// * - player
// * - explosions
// * - gameover screen, after explosion sequence
// * Ingame
// * - background
// * - Explosive bullets Explosions
// * - Planes and exploding planes
// * - Sponsor planes
// * - scope
// * - player
// * - radar
// * - score
// * - livebar
// * - maniek window
// * - maniek
// * - buff cooldowns

function create_explosion() {
    let explosion =  {...explosion_effect};
    explosion.animation = {...explosion_animation};
    explosion.width = 200 * width_upscale;
    explosion.height = 200 * height_upscale;
    explosion.x = canvasWidth / 2 - explosion.width / 2;
    explosion.y = canvasHeight - 200;

    Explosions.push(explosion);
}

let gameLoopId;
function game_loop(timestamp) {
    const delta = (timestamp - lastFrameResponse) / 1000;
    lastFrameResponse = timestamp;

    if (CURRENT_GAME != 'antiair') {
        return;
    }

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    if (game.has_not_started == true) {
        ctx.drawImage(background, camera.offset_x - background_width / 2, -camera.offset_y - background_height/4, background_width, background_height);

        player_turret.draw();

        drawRadar(player_turret, Planes, cameraAngle);

        game.draw_livesbar();
        sponsor_window.draw();
        

        game.draw_start_screen();
        gameLoopId = requestAnimationFrame(game_loop);
        return;
    }

    // Short sequence played after losing
    if (game.play_explosion_sequence == true) {
        // Stop score from updating
        clearInterval(score_updater_id);

        //Draw background
        ctx.drawImage(background, camera.offset_x - background_width / 2, -camera.offset_y - background_height/4, background_width, background_height);
        
        //Draw turret
        player_turret.draw_disabled(35 * delta);

        // Draw explosions
        Explosions.forEach(puff => {
            if (timestamp - puff.animation.last_animation_time > puff.animation.frame_rate) {
                puff.animation.current_frame = (puff.animation.current_frame + 1) % puff.animation.total_frames;
                puff.animation.calc_source_position();
                puff.animation.last_animation_time = timestamp;
            }
            puff.draw_on_UI();
    
            if (puff.animation.current_frame == 5) {
                Explosions.splice(Explosions.indexOf(puff), 1);
            }
        })

        // Check if turret is offscreen
        if (player_turret.y > canvasHeight + turret_inactive_height * 0.75) {
            clearInterval(random_explosions_id);
            game.is_gameover = true;
            game.play_explosion_sequence = false;
            Explosions.splice(0, Explosions.length);
        }

        gameLoopId = requestAnimationFrame(game_loop);
        return;
    }

    if (game.is_gameover == true) {
        clearInterval(score_updater_id);
        
        //Draw background
        ctx.drawImage(background, camera.offset_x - background_width / 2, -camera.offset_y - background_height/4, background_width, background_height);
        
        //Draw gameover
        game.draw_gameover();
        gameLoopId = requestAnimationFrame(game_loop);
        return;
    }

    // Adjust camera to mouse movement
    cameraAngle += mouse_movement_x * rotationSpeed * delta;
    cameraAngle %= Math.PI * 2; // Keep angle between 0 and 2πY
    camera.update_offset(-mouse_movement_x, mouse_movement_y, delta);

    mouse_movement_x = 0;
    mouse_movement_y = 0;

    // Update planes position
    Planes.forEach(plane => {
        plane.move(delta);
    })

    //Shake camera
    if (camera.is_shaking) {
        camera.offset_x += Math.random() * (20 + 20) - 20;
        camera.offset_y += Math.random() * (20 + 20) - 20;
    }

    //Draw background
    ctx.drawImage(background, camera.offset_x - background_width / 2, -camera.offset_y - background_height/4, background_width, background_height); 

    //Handle animations
    SponsorPlanes.forEach(plane => {
        if (timestamp - plane.animation.last_animation_time > plane.animation.frame_rate) {
            plane.animation.current_frame = (plane.animation.current_frame + 1) % plane.animation.total_frames;
            plane.animation.calc_source_position();
            plane.animation.last_animation_time = timestamp;
        }
    })

    Explosions.forEach(puff => {
        if (timestamp - puff.animation.last_animation_time > puff.animation.frame_rate) {
            puff.animation.current_frame = (puff.animation.current_frame + 1) % puff.animation.total_frames;
            puff.animation.calc_source_position();
            puff.animation.last_animation_time = timestamp;
        }
        puff.draw();

        if (puff.animation.current_frame == 5) {
            Explosions.splice(Explosions.indexOf(puff), 1);
        }
    })

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
            plane.reset();
        }
        } else {
            if (timestamp - plane.sprite.last_animation_time > plane_animation.frame_rate + plane_animation.frame_rate * plane.is_slow) {
                plane.sprite.current_frame = (plane.sprite.current_frame + 1) % plane.sprite.total_frames;
                plane.sprite.calc_source_position(); // Update source_x
                plane.sprite.last_animation_time = timestamp;
            }
            plane.draw_plane();
        }
    });

    SponsorPlanes.forEach(plane => {
        plane.draw_plane();
        plane.draw();
        plane.move(delta);
    });

    if (turret_is_shooting) {
        if (timestamp - lastTurretAnimationTime > turret_animation.frame_rate) {
            if (turret_animation.current_frame == 1) player_turret.shoot(scope_anchor.x + scope_width / 2, scope_anchor.y + scope_height / 2);
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
        }
        turret_animation.calc_source_position();
    }

    if (timestamp - maniek_sprites_properties.last_animation_time > maniek_sprites_properties.frame_rate) {
        if (maniek_sprites_properties.state != "idle" && maniek_sprites_properties.current_frame == maniek_sprites_properties[maniek_sprites_properties.state].total_frames - 1) {
            maniek_sprites_properties.update_state();
            maniek_sprites_properties.update_sprite();
        }

        maniek_sprites_properties.current_frame = (maniek_sprites_properties.current_frame + 1) % maniek_sprites_properties[maniek_sprites_properties.state].total_frames;
        maniek_sprites_properties.calc_source_position();
        maniek_sprites_properties.last_animation_time = timestamp;
    }
   
    scope_anchor.draw();

    //Draw turret
    player_turret.draw();

    // Draw the radar with updated positions
    drawRadar(player_turret, Planes, cameraAngle);

    for (const [key, value] of Object.entries(current_cooldowns)) {
        if (value > 0) {
            current_cooldowns[key] -= 1000 * delta;
        }
    }

    //Draw GUI
    game.draw_score();
    game.draw_livesbar();
    sponsor_window.draw();
    sponsor_window.draw_maniek();
    buff_cooldown.draw_cooldowns();

    
    gameLoopId = requestAnimationFrame(game_loop);
}

// Initialisation zone
sponsor_window.init();

gameLoopId = requestAnimationFrame(game_loop);

document.addEventListener('gameSwitch', e => {
    const gameName = e.detail;
    if (gameName == "antiair") {
        gameLoopId = requestAnimationFrame(game_loop);
    } else {
        cancelAnimationFrame(gameLoopId);
        gameLoopId = null;
    }
})