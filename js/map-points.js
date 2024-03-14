// List of img names that have corresponding points.
const imgPaths = {
    "Floor0": {
        // List of all dot coordinates placed around the map. Scaled to the image, then converted back into pixels.
        // Each dot needs a unique name
        dots: {
            "dot1": {x: 0.17900, y: 0.38048}, // sala 2
            "dot2": {x: 0.25200, y: 0.44272}, // sala 3
            "dot3": {x: 0.25100, y: 0.74116}, // dyrektor
            "dot4": {x: 0.24900, y: 0.88826}, // sala 10
            "dot5": {x: 0.10200, y: 0.88119}, // sala 13
            "dot6": {x: 0.10300, y: 0.65912}, // sekretariat uczniowski
            "dot7": {x: 0.39300, y: 0.49646}, // sala 21
            "dot8": {x: 0.53700, y: 0.49505}, // sala 24
            "dot9": {x: 0.23700, y: 0.57709}, // maniek
            "dot10": {x: 0.76000, y: 0.56011}, // sala 46
            "dot11": {x: 0.83700, y: 0.63366}, // sala 45
            "dot12": {x: 0.89100, y: 0.54173}, // kibel meski
            "dot13": {x: 0.75900, y: 0.36775}, // psycholog
            "dot14": {x: 0.76100, y: 0.21075}, // sala 32
            "dot15": {x: 0.76100, y: 0.10750}, // sala bez numerku raz byla na niemieckim i historii
            "dot16": {x: 0.91300, y: 0.16124}, // sala 40 znak zapytania
            "dot17": {x: 0.91100, y: 0.29562}, // sala 41
            "dot18": {x: 0.91000, y: 0.48091}, // schody b gora
            "dot19": {x: 0.90900, y: 0.43706}, // schody b dol
            "dot20": {x: 0.09200, y: 0.52900}, // schody a gora
        }

    },

    /* Floor 1 is "connected", although you can't make your way through the gymnastics room
    "Floor1A": {
        dots: {

        }

    },
    "Floor1B": {
        dots: {

        }

    }, */

    "Floor1": {
        dots: {

        }
        
    },

    "Floor2A": {
        dots: {

        }

    },
    "Floor2B": {
        dots: {

        }

    },
}

// List of connections for each dot. There will be *many*.
const connections = {

}


function percentToPx(percentages, relativeElement) {
    const bounds = relativeElement.getBoundingClientRect();
    return {
        x: percentages.x * bounds.width,
        y: percentages.y * bounds.height
    };
}

function pxToPercent(pixels, relativeElement) {
    const bounds = relativeElement.getBoundingClientRect();
    return {
        x: pixels.x / bounds.width,
        y: pixels.y / bounds.height
    }
}

// for each img, resize the image-canvas-container to the img's dimensions
const imgContainers = document.querySelectorAll(".image-canvas-container");
imgContainers.forEach(container => {
    let img = container.querySelector("img")
    let canvas = container.querySelector("canvas");

    container.style.width = `${img.width}px`;
    container.style.height = `${img.height}px`;
})


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Usage:
async function myFunction() {
    console.log('Before sleep');
    await sleep(2000); // Sleep for 2 seconds
    console.log('After sleep');
}


// draw img paths

for (const [floorName, floorItems] of Object.entries(imgPaths)) {
    let floorContainer = document.querySelector(`div.${floorName}`);
    let img = floorContainer.querySelector("img");
    let canvas = floorContainer.querySelector("canvas");

    canvas.width = img.width;
    canvas.height = img.height;

    let ctx = canvas.getContext("2d");
    for (const [dot, coords] of Object.entries(floorItems.dots)) {
        let coordsPx = percentToPx(coords, img);

        let draw = function() {
            ctx.fillStyle = "red";
            ctx.beginPath();
            ctx.arc(coordsPx.x, coordsPx.y, 5, 0, 2 * Math.PI);
            ctx.fill();
        }

        if (img.complete) {
            draw();
        } else {
            img.onload = draw;
        }
        
        setTimeout(() => {
            draw();
        }, 1000);
    }

}

// for (const [dot, coords] of Object.entries(imgPaths.Floor0.dots)) {
//     let floorContainer = document.querySelector("div.Floor0");
//     let img = floorContainer.querySelector("img");
//     let canvas = floorContainer.querySelector("canvas");

//     let coordsPx = percentToPx(coords, img);
    
//     let ctx = canvas.getContext("2d");
//     ctx.fillStyle = "red";
//     ctx.beginPath();
//     ctx.arc(coordsPx.x, coordsPx.y, 5, 0, 2 * Math.PI);
//     ctx.fill();
    
// }


// const img = document.querySelector(".map img");
// console.log( percentToPx({x: 0.1, y: 0.1}, img) );



function copy(e) {
    // console.log(e.innerText);
    navigator.clipboard.writeText(e.innerText);
}

// Enable dev mode
const devCoords = document.querySelector(".dev-coordinates");

let devMode = false;

let iterator = 1;
let fullString = `Enabled DEV MODE - Click on imgs for coordinates`
let dotName = "";

let textX = 0, textY = 0;

function updateCoordString() {
    let coordString = fullString + `<br><span class='copyable' onclick='copy(this)'>"dot${iterator}": {x: ${textX}, y: ${textY}}, // ${dotName}</span>`;
    devCoords.innerHTML = coordString;


    return coordString;
}

document.addEventListener("keydown", e => {
    if (e.key == "F2") {
        devMode = !devMode;
        devCoords.innerHTML = fullString;
    }
    if (!devMode) return;

    let x = e.key;
    
    if (x.length == 2 || x.length == 3) return;
    if (
        (/[a-zA-Z0-9 ]/).test(x)
        || e.key === "Enter" 
        || e.key === "Backspace"
        ) {
        e.preventDefault();

        if (e.key === "Enter") {
            fullString = updateCoordString();
            
            dotName = "";
            iterator++;
        } else if (e.key === "Backspace") {
            dotName = dotName.slice(0, -1);
        } else {
            dotName += e.key;
        }

        updateCoordString();
    }
});



document.addEventListener("mousedown", e => {
    if (!devMode) return;
    if (e.target.tagName != "IMG") return;
    if (!map.contains(e.target)) return;

    let img = e.target;

    // Get the position the image was clicked in
    let relativePos = img.getBoundingClientRect();
    let x = (e.clientX - relativePos.x);
    let y = (e.clientY - relativePos.y);

    let percentages = pxToPercent({x: x, y: y}, img);

    textX = percentages.x.toFixed(5);
    textY = percentages.y.toFixed(5);
    
    updateCoordString();
});


