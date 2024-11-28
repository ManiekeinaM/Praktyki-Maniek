function initScreensaver() {
    console.log("Screensaver wlaczony.");

    let screensaverRequirement = 75; // How many seconds until it appears?
    let screensaverEnabled = false;

    let CORNERBOUNCE_COOKIE_NAME = "cornerbounces";
    let cornerBounces = getCookie(CORNERBOUNCE_COOKIE_NAME) || 0;
    cornerBounces = parseInt(cornerBounces);
    let sessionCornerBounces = sessionStorage.getItem(CORNERBOUNCE_COOKIE_NAME) || 0;
    sessionCornerBounces = parseInt(sessionCornerBounces);

    console.log(cornerBounces, sessionCornerBounces);

    function incrementCornerBounces() {
        cornerBounces += 1;
        sessionCornerBounces += 1;
        updateCornerBounces();
    }

    // console.log(cornerBounces);

    // Creating / finding the screensaver

    let screensaver = document.querySelector('.screensaver');
    let dialogScreen, maniekFace, dialog, score;

    let defaultDialogText = `* Jestem wygaszaczem ekranu. Kliknij mnie, by mnie wyłączyć.`;

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
        dialog.innerHTML = defaultDialogText;
        dialogScreen.appendChild(dialog);

        score = document.createElement('p');
        score.innerHTML = `Odbicia od rogu: <span>0</span>`;
        score.classList.add("cornerscore");
        screensaver.appendChild(score);

        document.body.appendChild(screensaver);
    } else {
        dialogScreen = screensaver.querySelector('.dialog');
        maniekFace = dialogScreen.querySelector('img');
        dialog = dialogScreen.querySelector('p');
    }

    screensaver.style.transform = `scale(0)`; // Hide the screensaver by default

    // Creating the bouncing screensaver face
    let screensaverFace = document.createElement('img');
    screensaverFace.src = `assets/maniek-faces/screensaver-face.png`;
    screensaverFace.classList.add('screensaver-face');
    screensaver.appendChild(screensaverFace);



    const faceColors = [ // Filter to change a black pixel into the desired color
        'filter: invert(17%) sepia(99%) saturate(6710%) hue-rotate(359deg) brightness(95%) contrast(114%);', // red
        'filter: invert(66%) sepia(54%) saturate(5118%) hue-rotate(358deg) brightness(99%) contrast(108%);', // orange
        'filter: invert(89%) sepia(53%) saturate(4147%) hue-rotate(359deg) brightness(102%) contrast(101%);', // yellow
        'filter: invert(63%) sepia(49%) saturate(4868%) hue-rotate(83deg) brightness(115%) contrast(128%);', // lime
        'filter: invert(88%) sepia(93%) saturate(5057%) hue-rotate(100deg) brightness(105%) contrast(106%);', // teal
        'filter: invert(31%) sepia(51%) saturate(3798%) hue-rotate(198deg) brightness(104%) contrast(104%);', // lightblue
        'filter: invert(9%) sepia(91%) saturate(7488%) hue-rotate(246deg) brightness(93%) contrast(145%);', // blue
        'filter: invert(8%) sepia(100%) saturate(7444%) hue-rotate(271deg) brightness(113%) contrast(125%);', // purple
        'filter: invert(21%) sepia(63%) saturate(4305%) hue-rotate(292deg) brightness(110%) contrast(135%);', // magenta
        'filter: invert(20%) sepia(99%) saturate(7498%) hue-rotate(325deg) brightness(104%) contrast(103%);', // pink
    ]

    function getRandomFaceColor() {
        return faceColors[Math.floor(Math.random() * faceColors.length)];
    }



    // Bouncing Screensaver Face
    let xIncrement = 3, yIncrement = 3;

    let currentFilter = '';

    function init_bounce() {
        update_color();

        let randomTop = Math.floor(Math.random() * 200);
        let randomLeft = Math.floor(Math.random() * 200);
        screensaverFace.style = `top: ${randomTop}px; left: ${randomLeft}px; ${currentFilter}`;

        frame();
        // setInterval(frame, 5);
    }

    function update_color() {
        currentFilter = getRandomFaceColor();
    }

    function handle_collision() {
        let height = screensaverFace.offsetHeight;
        let width = screensaverFace.offsetWidth;
        let top = screensaverFace.offsetTop;
        let left = screensaverFace.offsetLeft;

        let window_height = window.innerHeight;
        let window_width = window.innerWidth;

        let flipsDone = 0;
        if (left < 0 || left + width > window_width) {
            // flip x incrementation
            xIncrement *= -1;
            flipsDone += 1;
            // initConfetti();
        }

        if (top < 0 || top + height > window_height) {
            // flip y incrementation
            yIncrement *= -1;
            flipsDone += 1;
        }

        if (flipsDone > 0) update_color();

        if (flipsDone == 2) {
            // It hit a corner!

            console.log("HIT CORNER");
            initConfetti();
            incrementCornerBounces();
        }
    }

    function frame() {
        if (!screensaverEnabled) {
            requestAnimationFrame(frame);
            return
        };

        handle_collision();
        let newTop = screensaverFace.offsetTop + yIncrement;
        let newLeft = screensaverFace.offsetLeft + xIncrement;

        // console.log(newTop, newLeft);
        screensaverFace.style = `top: ${newTop}px; left: ${newLeft}px; ${currentFilter}`;

        requestAnimationFrame(frame);
    }

    init_bounce();




    // Screensaver visibility

    function updateScreensaverVisibility() {
        if (INACTIVITY_TIMER >= screensaverRequirement) {
            if (!screensaverEnabled) {
                // The moment this change was made!
                dialog.innerHTML = defaultDialogText;
            }

            screensaverEnabled = true;
            screensaver.style.transform = 'scale(1)';

        } else {
            screensaverEnabled = false;
            screensaver.style.transform = 'scale(0)'
        }
    }

    // Inactivity timer [starts at 0, appears after it reaches screensaverRequirement]

    let INACTIVITY_TIMER = 0;
    function incrementTimer() {
        INACTIVITY_TIMER += 1;
        console.log(INACTIVITY_TIMER);
        updateScreensaverVisibility();

        setTimeout(incrementTimer, 1000);
    }
    setTimeout(incrementTimer, 1000);

    // Reset inactivity timer
    document.addEventListener('click', e => {
        INACTIVITY_TIMER = 0;
    })


    // Dialog
    let delay = 90 // between characters, milliseconds

    let dialogQueue = []; // Queue of dialog strings
    let isDialogRunning = false; // Flag to check if dialog is currently running

    function setDialog(dialogStrings) {
        dialogQueue = dialogQueue.concat(dialogStrings); // Add new strings to the end of the queue
        if (!isDialogRunning) {
            processDialogQueue(); // Start processing the queue if not already doing so
        }
    }

    function processDialogQueue(characterPos = 0, nextDelay = delay) {
        if (!screensaverEnabled || dialogQueue.length === 0) {
            isDialogRunning = false; // No more dialog strings in the queue
            dialogQueue = []; // Clear the queue (in case dialog is halted)
            return;
        }

        isDialogRunning = true;
        let goalString = dialogQueue[0]; // Get the first string in the queue
        let endCharacter = goalString.length;


        let newText = `* ${goalString.substring(0, characterPos)}`;
        dialog.innerHTML = newText;

        if (navigator.userActivation.hasBeenActive) {
            // new scope to garbage collect it faster
            let sansVoice = new Audio('./sounds/voice_sans.mp3');
            sansVoice.volume = 0.06;
            sansVoice.play();
        }

        // Capital letters, punctuation and spaces
        let currentChar = goalString.charAt(characterPos);
        let currentDelay = nextDelay || delay;

        // Calculate the next letter's delay
        nextDelay = delay;
        // console.log(currentChar);
        if (currentChar === ' ') {
            nextDelay = 10;
        } else if (currentChar === ',') {
            nextDelay *= 3;
        } else if (currentChar === '.') {
            nextDelay *= 5;
        } else if (currentChar === '?' || currentChar === '!') {
            nextDelay *= 2;
        } else if (currentChar === currentChar.toUpperCase()) {
            nextDelay /= 2;
        }
        // console.log(currentChar, currentDelay);

        if (characterPos == endCharacter) {
            dialogQueue.shift(); // Remove the first string from the queue

            setTimeout(processDialogQueue, 1000); // Start processing the next string
        } else {
            setTimeout(() => {
                processDialogQueue(characterPos + 1, nextDelay);
            }, currentDelay);
        }
    }

    function updateCornerBounces() {
        score.innerHTML = `Odbicia od rogu: <span>${cornerBounces}</span> <br>
                        Dzisiejsze: <span>${sessionCornerBounces}</span>`;

        setCookie(CORNERBOUNCE_COOKIE_NAME, cornerBounces, 9999); // All-time
        sessionStorage.setItem(CORNERBOUNCE_COOKIE_NAME, sessionCornerBounces); // Daily
    }
    updateCornerBounces();

    screensaver.addEventListener('click', () => {
        INACTIVITY_TIMER = 0;
        updateScreensaverVisibility();
    });

    // function recursetext() {
    //     setDialog("skibidi bop bop bop yes yes");
    //     setDialog("skibidi bii bii");
    //     setTimeout(recursetext, 1000);
    // }
    // recursetext();






    // ================== //
    // CAMERA DETECTION V //

    let canvas, ctx, video;

    let previous_frame = [];

    // brightness threshold to detect movement
    let threshold = 80;

    // sample color every X pixels [resolution]
    let sample_size = 2;

    // This function gets called whenever X or more pixels change at once. Change this until it's good at detecting humans
    let changeThreshold = 400;

    let randomNames = ['Bartek', 'Mateusz', 'Zosia', 'Hania', 'Antoni', 'Franek', 'Janek', 'Krzysztof', 'Marysia', 'Ania', 'Andrzej', 'Wojciech', 'Michał', 'Marcin', 'Kuba', 'Patryk', 'Kamil', 'Dawid', 'Julia', 'Kacper', 'Filip', 'Mikołaj', 'Laura', 'Wiktor', 'Adam', 'Igor', 'Maciek', 'Dominik', 'Tomek'];
    function getRandomName() {
        return randomNames[Math.floor(Math.random() * randomNames.length)];
    }
    let maniekChats = [
        "Widzę Ciebie! {name}!!",
        "Fajna fryzura! {name}, to ty?",
        "Przyjdź tu, NIE UCIEKAJ ODE MNIE!!!",
        "Ładnie wyglądasz, teraz tu przyjdź!",
        "KAŻDEGO WIDZĘ. Nawet CIEBIE.",
        "Zagraj ze mną w Ponga :D",
        "Ja, wszechmocny Maniek, proszę Ciebie do ekranu.",
        "Mój highscore w Flappy Mańku wynosi 634 :)",
        "Legenda mówi, że coś się stanie, jak Maniek odbije się od rogu...",
        "Guten Tag!",
    ];

    let maniekNoCamChats = [
        "Nie widzę nikogo..",
        "Gdzie jesteście?",
        "Czy ktoś tam jest?",
        "Czy ktoś mnie słyszy?",
        "Czy ktoś mnie widzi?",
    ];

    let forceDisable = false;
    setInterval(() => {
        if (forceDisable) return;
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;

        let randomChat = maniekNoCamChats[Math.floor(Math.random() * maniekNoCamChats.length)];
        setDialog(randomChat);
    }, 16000)


    let chattingDebounce = false;
    function detectHumanMovement() {
        forceDisable = true;
        if (chattingDebounce) return;
        chattingDebounce = true;

        console.log("HEY YOU! I see you moving!");


        let randomChat = maniekChats[Math.floor(Math.random() * maniekChats.length)];
        randomChat = randomChat.replace('{name}', getRandomName());
        setDialog(randomChat);

        setTimeout(() => {
            chattingDebounce = false;
        }, 10000);
    }


    function initializeCamera() {
        canvas = document.querySelector('.camera-canvas') || document.querySelector('#camera-canvas')
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.classList.add('camera-canvas');
            document.body.appendChild(canvas);
        }

        ctx = canvas.getContext("2d", { willReadFrequently: true });
        video = document.createElement("video");

        var videoObj = { video: true },
            errBack = function (error) {
                console.log("Video capture error: ", error.code);
            };

        // Check if getUserMedia support is available
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia(videoObj)
                .then(function (stream) {
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
        } else if (navigator.getUserMedia) { // Standard
            navigator.getUserMedia(videoObj, function (stream) {
                video.src = stream;
                video.play();
            }, errBack);
        } else if (navigator.webkitGetUserMedia) { // WebKit
            navigator.webkitGetUserMedia(videoObj, function (stream) {
                video.src = window.webkitURL.createObjectURL(stream);
                video.play();
            }, errBack);
        } else if (navigator.mozGetUserMedia) { // Firefox
            navigator.mozGetUserMedia(videoObj, function (stream) {
                video.src = window.URL.createObjectURL(stream);
                video.play();
            }, errBack);
        }

        // Draw the video frame to the canvas
        video.addEventListener("play", function () {
            var draw = function () {
                if (video.paused || video.ended) return;
                // console.log('draw');

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

        for (var y = 0; y < h; y += sample_size) {

            for (var x = 0; x < w; x += sample_size) {

                var pos = (x + y * w) * 4;
                var r = data[pos];
                var g = data[pos + 1];
                var b = data[pos + 2];
                // first check if it's not the first frame, but 
                // seeing of when the previous_frame array 
                // is not we empty, and then only draw something if there's 
                // a significant colour difference 
                ctx.drawImage(video, 0, 0, w, h);
                var data = ctx.getImageData(0, 0, w, h).data;
                ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

                for (var y = 0; y < h; y += sample_size) {

                    for (var x = 0; x < w; x += sample_size) {
                        var pos = (x + y * w) * 4;
                        var r = data[pos];
                        var g = data[pos + 1];
                        var b = data[pos + 2];
                        // first check if it's not the first frame, but 
                        // seeing of when the previous_frame array 
                        // is not we empty, and then only draw something if 
                        // a significant colour difference there's
                        if (previous_frame[pos] && Math.abs(previous_frame[pos] - r) > threshold) {

                            // push the x, y and rgb values into the motion array
                            motion.push({ x: x, y: y, r: r, g: g, b: b });
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

}

if (IS_MANIEK)
    initScreensaver();
else
    console.log("Screensaver wylaczony.");