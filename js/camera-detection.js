let screensaver = document.querySelector('.screensaver');
let dialogScreen, maniekFace, dialog;

if (!screensaver) {
    screensaver = document.createElement('div');
    screensaver.classList.add('screensaver')

    dialogScreen = document.createElement('div');
    dialogScreen.classList.add('dialog');
    screensaver.appendChild(dialogScreen);

    maniekFace = document.createElement('img');
    maniekFace.src = 'assets/maniek-faces/big eyes.gif';
    dialogScreen.appendChild(maniekFace);

    dialog = document.createElement('p');
    dialog.innerHTML = `* skibidi bop bop bop yes yes💩🚽`;
    dialogScreen.appendChild(dialog);

    document.body.appendChild(screensaver);
} else {
    dialogScreen = screensaver.querySelector('.dialog');
    maniekFace = dialogScreen.querySelector('img');
    dialog = dialogScreen.querySelector('p');
}

// screensaver.style.display = 'none';
function updateScreensaverVisibility() {
    if (INACTIVITY_TIMER <= 0) {
        screensaver.style.display = 'none';
    } else {
        screensaver.style.display = 'block'
    }
}

// Inactivity timer

let INACTIVITY_TIMER = 90;
function decrementTimer() {
    INACTIVITY_TIMER -= 1;
    console.log(INACTIVITY_TIMER);
    updateScreensaverVisibility();

    setTimeout(decrementTimer, 1000);
}
setTimeout(decrementTimer, 1000);


let delay = 90 // between characters, milliseconds


let dialogQueue = []; // Queue of dialog strings
let isDialogRunning = false; // Flag to check if dialog is currently running

function setDialog(dialogStrings) {
    dialogQueue = dialogQueue.concat(dialogStrings); // Add new strings to the end of the queue
    if (!isDialogRunning) {
        processDialogQueue(); // Start processing the queue if not already doing so
    }
}

function processDialogQueue(characterPos = 0) {
    if (dialogQueue.length === 0) {
        isDialogRunning = false; // No more dialog strings in the queue
        return;
    }

    isDialogRunning = true;
    let goalString = dialogQueue[0]; // Get the first string in the queue
    let endCharacter = goalString.length;

    let newText = `* ${goalString.substring(0, characterPos)}`;
    dialog.innerHTML = newText;

    let sansVoice = new Audio('./sounds/voice_sans.mp3');
    sansVoice.volume = 0.1;
    sansVoice.play();

    if (characterPos == endCharacter) {
        dialogQueue.shift(); // Remove the first string from the queue
        processDialogQueue(); // Start processing the next string
    } else {
        setTimeout(() => {
            processDialogQueue(characterPos + 1);
        }, delay);
    }
}

function recursetext() {
    setDialog("skibidi bop bop bop yes yes");
    setDialog("skibidi bii bii");
    setTimeout(recursetext, 1000);
}
recursetext();


// ================== //
// CAMERA DETECTION V //

let canvas, ctx, video;

let previous_frame = [];

// brightness threshold to detect movement
let threshold = 80;

// sample color every 50 pixels
let sample_size = 2;

// This function gets called whenever X or more pixels change at once. Change this until it's good at detecting humans
let changeThreshold = 400;
function detectHumanMovement() {
    INACTIVITY_TIMER = 90;
}


function initializeCamera() {
    canvas = document.getElementById("canvas")
    ctx = canvas.getContext("2d", {willReadFrequently: true});
    video = document.createElement("video")

    var videoObj = { video: true },
        errBack = function(error) {
            console.log("Video capture error: ", error.code); 
        };

    // Check if getUserMedia support is available
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia(videoObj)
        .then(function(stream) {
            // Connect the media stream to the video element
            try {
                video.srcObject = stream;
            } catch (error) {
                video.src = window.URL.createObjectURL(stream);
            }
            // Play the video
            video.play();
        })
        .catch(errBack);
    } else if(navigator.getUserMedia) { // Standard
        navigator.getUserMedia(videoObj, function(stream) {
            video.src = stream;
            video.play();
        }, errBack);
    } else if(navigator.webkitGetUserMedia) { // WebKit
        navigator.webkitGetUserMedia(videoObj, function(stream){
            video.src = window.webkitURL.createObjectURL(stream);
            video.play();
        }, errBack);
    } else if(navigator.mozGetUserMedia) { // Firefox
        navigator.mozGetUserMedia(videoObj, function(stream){
            video.src = window.URL.createObjectURL(stream);
            video.play();
        }, errBack);
    }

    // Draw the video frame to the canvas
    video.addEventListener("play", function() {
        var draw = function() {
            if(video.paused || video.ended) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
            let motion = motionDetection();

            for (i = 0; i < motion.length; i++) {
                var m = motion[i];
                ctx.fillStyle = `rgb(${m.r}, ${m.g}, ${m.b})`;
                ctx.fillRect(m.x, m.y, sample_size, sample_size);
            }

            requestAnimationFrame(draw);
        };
        draw();
    });
}

function motionDetection() {
    // Motion detection
    let motion = [];

    let w = canvas.width, h = canvas.height;

    ctx.drawImage(video, 0, 0, w, h);
    var data = ctx.getImageData(0, 0, w, h).data;
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    for (var y = 0; y < h; y+= sample_size) {

        for (var x = 0; x < w; x+= sample_size) {

            var pos = (x + y * w) * 4;
            var r = data[pos];
            var g = data[pos+1];
            var b = data[pos+2];
            // first check if it's not the first frame, but 
            // seeing of when the previous_frame array 
            // is not we empty, and then only draw something if there's 
            // a significant colour difference 
            ctx.drawImage(video, 0, 0, w, h);
            var data = ctx.getImageData(0, 0, w, h).data;
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
        
            for (var y = 0; y < h; y+= sample_size) {
            
                for (var x = 0; x < w; x+= sample_size) {
                    var pos = (x + y * w) * 4;
                    var r = data[pos];
                    var g = data[pos+1];
                    var b = data[pos+2];
                    // first check if it's not the first frame, but 
                    // seeing of when the previous_frame array 
                    // is not we empty, and then only draw something if 
                    // a significant colour difference there's
                    if (previous_frame[pos] && Math.abs(previous_frame[pos] - r) > threshold) {
                
                        // push the x, y and rgb values into the motion array
                        motion.push({x: x, y: y, r: r, g: g, b: b});
                    }
                    // store these colour values to compare to the next frame
                    previous_frame[pos] = r;
                }
        
            }
        }
    }

    if (motion.length > changeThreshold) {
        // console.log(motion.length);
        detectHumanMovement();
    }

    return motion;
}

window.addEventListener("DOMContentLoaded", initializeCamera);