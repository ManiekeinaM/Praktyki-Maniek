const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const strengthDisplay = document.getElementById('strengthDisplay');
let isDragging = false;
let mousePath = [];
let centroid = { x: 0, y: 0 };
let lastAngle = null;
let rotation = 0;
let strength = 0;

canvas.addEventListener('mousedown', () => {
  isDragging = true;
  mousePath = [];
  rotation = 0;
  strength = 0;
  lastAngle = null;
  strengthDisplay.textContent = 'Strength: 0';
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

canvas.addEventListener('mouseup', () => {
  isDragging = false;
  if (rotation !== 0) {
    const direction = rotation > 0 ? 'Clockwise' : 'Counterclockwise';
    console.log(`Direction: ${direction}, Strength: ${Math.abs(rotation).toFixed(2)}`);
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  mousePath.push({ x, y });
  drawPoint(x, y);
  updateCentroid();
  calculateRotation();
  updateStrengthDisplay();
});

function drawPoint(x, y) {
  ctx.fillStyle = 'blue';
  ctx.beginPath();
  ctx.arc(x, y, 2, 0, Math.PI * 2);
  ctx.fill();
}

function updateCentroid() {
  const sum = mousePath.reduce((acc, point) => {
    acc.x += point.x;
    acc.y += point.y;
    return acc;
  }, { x: 0, y: 0 });
  centroid.x = sum.x / mousePath.length;
  centroid.y = sum.y / mousePath.length;

  // Draw centroid
  ctx.fillStyle = 'red';
  ctx.beginPath();
  ctx.arc(centroid.x, centroid.y, 5, 0, Math.PI * 2);
  ctx.fill();
}

function calculateRotation() {
  const currentPoint = mousePath[mousePath.length - 1];
  const angle = Math.atan2(currentPoint.y - centroid.y, currentPoint.x - centroid.x) * (180 / Math.PI);

  if (lastAngle !== null) {
    let delta = angle - lastAngle;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    rotation += delta;
    strength = Math.abs(delta);
  }
  lastAngle = angle;
}

function updateStrengthDisplay() {
  strengthDisplay.textContent = `Strength: ${strength.toFixed(2)}`;
}