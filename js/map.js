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



const mapThresholds = [
    {
        threshold: 1000,
        titleName: "PARTER",
        text: "Budynki A i B"
    },
    {
        threshold: -350,
        titleName: "PIĘTRO 1",
        text: "Budynki A i B"
    },
    {
        threshold: -1200,
        titleName: "PIĘTRO 2",
        text: "Budynki A i B"
    },
]


// Listen to dragging
let isDragging = false;

let startX;
let startY;
let translateX = 0;
let translateY = 0;
let start_translateX = translateX;
let start_translateY = translateY;

// Function to update the map! Always called when the map is updated

const floorTitle = document.querySelector(".floorTitle");
const floorText = document.querySelector(".floorText");
function updateMap(x, y) {
    if (x) { start_translateX = x; translateX = x };
    if (y) { start_translateY = y; translateY = y };
    // console.log(translateX, translateY);
    translateX = Math.min(800, translateX);
    translateX = Math.max(-800, translateX);

    translateY = Math.min(500, translateY);
    translateY = Math.max(-1750, translateY);

    for (let i = mapThresholds.length - 1; i >= 0; i--) {
        if (translateY < mapThresholds[i].threshold) {
            if (floorTitle.textContent == mapThresholds[i].titleName) break;

            floorTitle.textContent = mapThresholds[i].titleName;
            floorText.textContent = mapThresholds[i].text;

            floorTitle.style = "font-size: 1rem";
            setTimeout(() => {
                floorTitle.style = "";
            }, 100)
            break;
        }

    }



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

function wheel(e) {
    if (!map_container.contains(e.target)) return;

    e.preventDefault();
    const delta = Math.sign(e.deltaY);
    if (delta > 0) {
        setScale(scale - 0.1);
    } else {
        setScale(scale + 0.1);
    }
    updateMap();
}





// PC
document.addEventListener("mousedown", mouseDown);
document.addEventListener("mouseup", mouseUp);
document.addEventListener("mousemove", mouseMove);
document.addEventListener("wheel", wheel);



// Mobile

let initialDistance, initialScale;

document.addEventListener("touchstart", e => {
    if (!map_container.contains(e.target)) return;

    if (e.touches.length === 2) {
        e.preventDefault();
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
        initialDistance = distance;
        initialScale = scale;
    } else {
        mouseDown(e, true);
    }
});

document.addEventListener("touchend", e => {
    mouseUp();
});

document.addEventListener("touchmove", e => {
    if (e.touches.length === 2 && map_container.contains(e.target)) {
        e.preventDefault();
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
        const scaleChange = (distance - initialDistance) / 100;
        const newScale = initialScale + scaleChange;
        setScale(newScale);
        updateMap();
    } else {
        e.preventDefault();
        mouseMove(e, true);
    }
});


document.addEventListener("dragstart", e => e.preventDefault());


// Fullscreen on mobile


window.addEventListener("load", function () {
    setTimeout(function () {
        // This will scroll page slightly down
        window.scrollTo(0, 1);
        console.log("scrolled");
    }, 100);
});