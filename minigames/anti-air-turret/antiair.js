//Canvas setup
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
//Visible window
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
//Entire game window
const GAME_WINDOW_HEIGHT = canvas.height + 200;
const GAME_WINDOW_WIDTH = canvas.width;

//console.log(canvasWidth);
//console.log(canvasHeight);
//Game state controller
const game = {
    player_score: 0, 
}

//Controls
const controls = {
    up_pressed: false,
    down_pressed: false,
    right_pressed: false,
    left_pressed: false,
}

// Diffrent ai plane behaviors
/*
const ai_plane_behaviors = {

}
*/

//Enemies obj
const enemy_plane = {
    height: 20,
    width: 40,
    x: canvasWidth / 2,
    y: -200,
    camera_offset_x: 0,
    camera_offset_y: 0,
    camera_acceleration_x: 200,
    camera_acceleration_y: 100,
    acceleration_y: 50,
    scaling_factor: 0.5,
    scale: 1.0,
    color: 'green',
    draw: function() {
        ctx.fillStyle = this.color;
        let x = this.x - this.width / 2;
        let y = this.y - this.height;
        // Add camera offset
        ctx.fillRect(this.x + this.camera_offset_x, this.y + this.camera_offset_y, this.width, this.height);
    },
    move_offset: function(delta) {
        if (controls.up_pressed) { this.camera_offset_y -= this.camera_acceleration_y * delta; };
        if (controls.down_pressed) { this.camera_offset_y += this.camera_acceleration_y * delta; };
        if (controls.left_pressed) { this.camera_offset_x -= this.camera_acceleration_x * delta; };
        if (controls.right_pressed) { this.camera_offset_x += this.camera_acceleration_x * delta; };

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
        console.log(this.scale);
        this.attack_player();
    },
    scale_up: function(delta) {
        this.scale += this.scaling_factor * delta;
        this.width = 40 * this.scale;
        this.height = 20 * this.scale;
    },
    attack_player: function() {
        if (this.y > canvasHeight / 2) {
            this.reset();
        }
    },
    reset: function() {
        this.y = -200;
        this.scale = 1.0;
        this.width = 40;
        this.height = 20;
    }
}

// Planes
const Planes = [];
Planes.push(Object.create(enemy_plane));
Planes.push(Object.create(enemy_plane));
Planes[0].camera_offset_x -= 200
Planes[0].y += 50
Planes[0].color = 'red';

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
}

//Camera / Scope obj
const MAX_CAMERA_OFFSET_Y = -200
const MIN_CAMERA_OFFSET_Y = GAME_WINDOW_HEIGHT 
console.log("max offset y: ",MAX_CAMERA_OFFSET_Y);
console.log("min offset y: ",MIN_CAMERA_OFFSET_Y);

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

function game_loop(timestamp) {
    let delta = (timestamp - lastFrameResponse) / 1000;
    lastFrameResponse = timestamp;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    Planes.forEach(plane => {
        plane.move_offset(delta);
        plane.move(delta);
    })

    player_turret.draw();
    //console.log("Plane1: "+(Planes[0].camera_offset_x+Planes[0].x)," Plane2: "+(Planes[1].camera_offset_x+Planes[1].x));
    Planes.forEach(plane => {
        plane.draw();
    })
    scope_anchor.draw();

    requestAnimationFrame(game_loop);
}

requestAnimationFrame(game_loop);


