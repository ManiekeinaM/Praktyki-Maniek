//Confetti

let confettiCanvas = document.createElement('canvas');
confettiCanvas.classList.add('confetti');

document.body.appendChild(confettiCanvas);

confettiCtx = confettiCanvas.getContext("2d");
confettiCanvas.width = window.innerWidth;
confettiCanvas.height = window.innerHeight;
cx = confettiCtx.canvas.width / 2;
cy = confettiCtx.canvas.height /2;

let confetti = [];
const confettiCount = 300;
const gravity = 0.8;
const terminalVelocity = 7.5;
const drag = 1;
const colors = [
    { front: 'red', back: 'darkred' },
    { front: 'green', back: 'darkgreen' },
    { front: 'blue', back: 'darkblue' },
    { front: 'yellow', back: 'darkyellow' },
    { front: 'orange', back: 'darkorange' },
    { front: 'pink', back: 'darkpink' },
    { front: 'purple', back: 'darkpurple' },
    { front: 'turquoise', back: 'darkturquoise' }];
        
        //-----------Functions--------------
resizeCanvas = () => {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
  cx = confettiCtx.canvas.width / 2;
  cy = confettiCtx.canvas.height / 2;
};

randomRange = (min, max) => Math.random() * (max - min) + min;

initConfetti = () => {
  for (let i = 0; i < confettiCount; i++) {
    confetti.push({
      color: colors[Math.floor(randomRange(0, colors.length))],
      dimensions: {
        x: randomRange(10, 20),
        y: randomRange(10, 30) },

      position: {
        x: randomRange(0, confettiCanvas.width),
        y: confettiCanvas.height - 1 },

      rotation: randomRange(0, 2 * Math.PI),
      scale: {
        x: 1,
        y: 1},

      velocity: {
        x: randomRange(-25, 25),
        y: randomRange(0, -50) } });


  }
};

//---------Render-----------
render = () => {
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

  confetti.forEach((confetto, index) => {
    let width = confetto.dimensions.x * confetto.scale.x/2;
    let height = confetto.dimensions.y * confetto.scale.y/2;

    // Move canvas to position and rotate
    confettiCtx.translate(confetto.position.x, confetto.position.y);
    confettiCtx.rotate(confetto.rotation);

    // Apply forces to velocity
    confetto.velocity.x -= confetto.velocity.x * drag;
    confetto.velocity.y = Math.min(confetto.velocity.y + gravity, terminalVelocity);
    confetto.velocity.x += Math.random() > 0.5 ? Math.random() : -Math.random();

    // Set position
    confetto.position.x += confetto.velocity.x;
    confetto.position.y += confetto.velocity.y;

    // Delete confetti when out of frame
    if (confetto.position.y >= confettiCanvas.height) confetti.splice(index, 1);

    // Loop confetto x position
    if (confetto.position.x > confettiCanvas.width) confetto.position.x = 0;
    if (confetto.position.x < 0) confetto.position.x = confettiCanvas.width;

    // Spin confetto by scaling y
    confetto.scale.y = Math.cos(confetto.position.y * 0.1);
    confettiCtx.fillStyle = confetto.scale.y > 0 ? confetto.color.front : confetto.color.back;

    // Draw confetti
    confettiCtx.fillRect(-width / 2, -height / 2, width, height);

    // Reset transform matrix
    confettiCtx.setTransform(1, 0, 0, 1, 0, 0);
  });

  window.requestAnimationFrame(render);
};

//---------Execution--------
//initConfetti();
render();

//----------Resize----------
window.addEventListener('resize', function () {
  resizeCanvas();
});

//------------Click------------
window.addEventListener('click', function () {
  //initConfetti();
});
