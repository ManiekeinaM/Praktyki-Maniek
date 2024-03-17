const map_container = document.querySelector('.map-container');
const map = document.querySelector('.map');

const scaleUp = document.querySelector('.scale .plus');
const scaleDown = document.querySelector('.scale .minus');
const resetScale = document.querySelector('.scale .reset');
const scaleText = document.querySelector('.scale-num');

// Scaling of the items
let scale = 1;

function setScale(newScale) {
    if (newScale < 0.5) newScale = 0.5;
    if (newScale > 2) newScale = 2;

    scale = newScale;
}

scaleUp.addEventListener('click', e => {
    setScale(scale + 0.1);
    updateMap();
})
scaleDown.addEventListener("click", e => {
    setScale(scale - 0.1);
    updateMap();
})
resetScale.addEventListener("click", e => {
    setScale(1);
    updateMap();
})

// Disable image dragging
map.querySelectorAll("img").forEach(img => {
    img.addEventListener('dragstart', e => {
        e.preventDefault();
    })
})




// Listen to dragging
let isDragging = false;

let startX;
let startY;
let translateX = 0;
let translateY = 0;
let start_translateX = translateX;
let start_translateY = translateY;

// Function to update the map! Always called when the map is updated
function updateMap() {
    translateX = Math.min(3000, translateX);
    translateY = Math.min(3000, translateY);

    map.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
    scaleText.textContent = `${scale.toFixed(1)}x`;
}

function mouseDown(e, isMobile) {
    if (map_container.contains(e.target)) {
        isDragging = true;
        document.body.style.cursor = 'grabbing';
        map_container.style.cursor = 'grabbing';

        startX = e.clientX;
        startY = e.clientY;

        if (isMobile) {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }
    }
}
function mouseUp() {
    if (!isDragging) return;

    isDragging = false;
    document.body.style.cursor = '';
    map_container.style.cursor = 'grab';

    start_translateX = translateX;
    start_translateY = translateY;
}

function mouseMove(e, isMobile) {
    if (!isDragging) return;

    let deltaX = e.clientX - startX;
    let deltaY = e.clientY - startY;
    if (isMobile) {
        deltaX = e.touches[0].clientX - startX;
        deltaY = e.touches[0].clientY - startY;
    }


    translateX = start_translateX + deltaX * (1 / scale);
    translateY = start_translateY + deltaY * (1 / scale);

    updateMap();
}

// PC
document.addEventListener("mousedown", mouseDown);
document.addEventListener("mouseup", mouseUp);
document.addEventListener("mousemove", mouseMove);

// Mobile
document.addEventListener("touchstart", e => {
    mouseDown(e, true);
});
document.addEventListener("touchend", mouseUp);
document.addEventListener("touchmove", e => {
    mouseMove(e, true);
});


document.addEventListener("dragstart", e => e.preventDefault());