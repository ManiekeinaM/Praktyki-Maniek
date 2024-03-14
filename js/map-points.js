// List of img names that have corresponding points.
const imgPaths = {
    "Floor0": {
        // List of all dot coordinates placed around the map. Scaled to the image, then converted back into pixels.
        // Each dot needs a unique name
        dots: {
            "dot1": {x: 0.48244, y: 0.07810},
            
        }

    },

    "Floor1A": {
        dots: {

        }

    },
    "Floor1B": {
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


