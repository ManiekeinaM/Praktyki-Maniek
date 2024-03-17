// List of img names that have corresponding points.
const imgPaths = {
    "Floor0": {
        // List of all dot coordinates placed around the map. Scaled to the image, then converted back into pixels.
        // Each dot needs a unique name
        dots: {
            "dot2": { x: 0.18500, y: 0.38048, desc: "Sala 2 (girl team)", label: "2" }, // sala 2
            "dot3": { x: 0.25200, y: 0.46108, desc: "Sala 3 (historia)", label: "3" }, // sala 3
            "dot4": { x: 0.25100, y: 0.74882, desc: "Dyrektor", label: "Dyrektor" }, // dyrektor
            "dot5": { x: 0.24900, y: 0.87972, desc: "Sala 10 (j. polski)", label: "10" }, // sala 10
            "dot6": { x: 0.10200, y: 0.87972, desc: "Sala 13 (matematyka)", label: "13" }, // sala 13
            "dot7": { x: 0.10300, y: 0.65912, desc: "Sekretariat uczniowski", label: "Sekretariat" }, // sekretariat uczniowski
            "dot8": { x: 0.39300, y: 0.49505, desc: "Sala 22 (technik automatyk)", label: "22" }, // sala 22
            "dot9": { x: 0.53700, y: 0.49505, desc: "Sala 24 (sumoboty)", label: "24" }, // sala 24
            "dot10": { x: 0.76000, y: 0.56011, desc: "Sala 46 (filozofia, religia)", label: "46" }, // sala 46
            "dot11": { x: 0.83700, y: 0.63366, desc: "Sala 45 (j. angielski)", label: "45" }, // sala 45
            "dot12": { x: 0.89100, y: 0.54173, desc: "Toaleta A (1)" }, // kibel meski
            "dot13": { x: 0.75900, y: 0.36775, desc: "Psycholog", label: "Psycholog" }, // psycholog
            "dot14": { x: 0.76100, y: 0.21075, desc: "Sala 32 (chemia, biologia)", label: "32" }, // sala 32
            "dot15": { x: 0.76100, y: 0.10750, desc: "Sala 39 (technik energetyk*)", label: "39" }, // sala bez numerku raz byla na niemieckim i historii
            "dot16": { x: 0.91300, y: 0.16124, desc: "Sala 40 (technik mechatronik)", label: "40" }, // sala 40 znak zapytania
            "dot17": { x: 0.91100, y: 0.29562, desc: "Sala 41 (technik mechatronik)", label: "41" }, // sala 41
            "dot18": { x: 0.91000, y: 0.47524, desc: "SCHODY B - GÓRA", icon: "stairsUp" }, // schody b gora
            "dot19": { x: 0.90900, y: 0.43706, desc: "SCHODY B - DÓL", icon: "stairsDown" }, // schody b dol
            "dot20": { x: 0.09200, y: 0.52900, desc: "SCHODY A - GÓRA", icon: "stairsUp" }, // schody a gora
            "dot21": { x: 0.62083, y: 0.55896, desc: "Praktyka zawodowa (Ryszard Mirys)" }, // mirys SALA
            "dot22": { x: 0.10667, y: 0.46226, desc: "Toaleta A (2)" }, // wc A

            // W dots: walk dots
            // You can not go back in this pathfinding system, so the connections are only one way
            "Wdot0": { x: 0.23700, y: 0.49882, connections: ['Wdot1'], icon: 'machine' }, // maniek
            "Wdot1": { x: 0.23667, y: 0.54481, connections: ['Wdot2', 'Wdot7'] }, // maniek up
            "Wdot2": { x: 0.18500, y: 0.54481, connections: ['Wdot3', 'Wdot4', 'dot20'] }, // leftA
            "Wdot3": { x: 0.18500, y: 0.46108, connections: ['dot2', 'dot3', 'dot22'] }, // up doors A
            "Wdot4": { x: 0.18500, y: 0.65920, connections: ['dot7', 'Wdot5'] }, // sekretariatSTAND
            "Wdot5": { x: 0.18500, y: 0.74882, connections: ['dot4', 'Wdot6'] }, // dyrektorSTAND
            "Wdot6": { x: 0.18500, y: 0.87972, connections: ['dot6', 'dot5'] }, // down doors A
            "Wdot7": { x: 0.32083, y: 0.54481, connections: ['Wdot8'] }, // maniek right turn
            "Wdot8": { x: 0.32083, y: 0.43868, connections: ['Wdot9'] }, // lacznik a up
            "Wdot9": { x: 0.45667, y: 0.43868, connections: ['Wdot10', 'Wdot11'] }, // lacznik middle
            "Wdot10": { x: 0.45667, y: 0.49505, connections: ['dot8', 'dot9'] }, // lacznik inbetween doors
            "Wdot11": { x: 0.62083, y: 0.43868, connections: ['Wdot12'] }, // lacznik b up
            "Wdot12": { x: 0.62083, y: 0.47524, connections: ['dot21', 'Wdot13'] }, // mirys STAND
            "Wdot13": { x: 0.83700, y: 0.47524, connections: ['Wdot14', 'dot18', 'dot19', 'Wdot15'] }, // middle B
            "Wdot14": { x: 0.83700, y: 0.54307, connections: ['dot10', 'dot11', 'dot12'] }, // down doors B
            "Wdot15": { x: 0.83700, y: 0.36792, connections: ['dot13', 'Wdot16'] }, // psychologkibel STAND CORRECT
            "Wdot16": { x: 0.83700, y: 0.29363, connections: ['dot17', 'Wdot17'] }, // sala 41 STAND
            "Wdot17": { x: 0.83700, y: 0.21226, connections: ['dot14', 'Wdot18'] }, // sala 32 STAND
            "Wdot18": { x: 0.83700, y: 0.16038, connections: ['dot16', 'Wdot19'] }, // sala 40 STAND
            "Wdot19": { x: 0.83700, y: 0.10750, connections: ['dot15'] }, // upmost B door STAND
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
            "dot1A": { x: 0.17978, y: 0.37726 }, // sala 102
            "dot2A": { x: 0.25200, y: 0.44169 }, // sala 103
            "dot3A": { x: 0.10422, y: 0.46370, desc: "Toaleta A (1)" }, // Toaleta meska A
            "dot4A": { x: 0.10200, y: 0.63186, desc: "Toaleta A (2)" }, // Toaleta pracownicza A
            "dot5A": { x: 0.10200, y: 0.68686, desc: "Sala 119 (wolontariat)", label: "119" }, // sala 119
            "dot6A": { x: 0.45644, y: 0.49513, desc: "Sala gimnastyczna", label: "Sala gimnastyczna" }, // Sala gimnastyczna
            "dot7A": { x: 0.26867, y: 0.71279, desc: "Pielęgniarka", icon: "pielegniarka" }, // Pielegniarka A

            "dot7.5A": { x: 0.25083, y: 0.84552, desc: "Sala 113 (TRN)", label: "113" }, // Sala 113

            "dot8B": { x: 0.75978, y: 0.53285, desc: "Sala 123 (technik programista)", label: "123" }, // Sala 123
            "dot9B": { x: 0.83400, y: 0.61771, desc: "Sala 122 (technik programista)", label: "122" }, // Sala 122
            "dot10B": { x: 0.90756, y: 0.37097, desc: "Toaleta B" }, // Toaleta pracownicza B
            "dot11B": { x: 0.90867, y: 0.25310, desc: "Sala 138 (technik elektronik)", label: "138" }, // Sala 138
            "dot12B": { x: 0.90867, y: 0.14152, desc: "Sala 134 (technik elektryk)", label: "134" }, // Sala 134
            "dot13B": { x: 0.76311, y: 0.14466, desc: "Sala 135 (technik elektronik)", label: "135" }, // Sala 135
            "dot13.5B": { x: 0.75917, y: 0.43868 }, // Sala 131
            "dot14B": { x: 0.76311, y: 0.26882 }, // Sala 132

            "Wdot1A": { x: 0.07700, y: 0.57426, connections: ['Wdot3A'], icon: 'stairsDown' }, // schody dol A
            "Wdot2A": { x: 0.07500, y: 0.53041, connections: ['Wdot3A'], icon: 'stairsUp' }, // schody gora A
            "Wdot3A": { x: 0.18000, y: 0.53890, connections: ['Wdot11A', 'Wdot4A', 'Wdot6A'] }, // mid A
            "Wdot4A": { x: 0.18000, y: 0.46393, connections: ['Wdot5A', 'dot3A'] }, // gora triple A
            "Wdot5A": { x: 0.18000, y: 0.44272, connections: ['dot1A', 'dot2A'] }, // gora A przed prawa sala
            "Wdot6A": { x: 0.18000, y: 0.63225, connections: ['dot4A', 'Wdot7A'] }, // przed WC pracownicze A
            "Wdot7A": { x: 0.18000, y: 0.68600, connections: ['dot5A', 'Wdot8A'] }, // przed 119
            "Wdot8A": { x: 0.18000, y: 0.73267, connections: ['Wdot9A', 'Wdot8.5A'] }, // przed pielegniarka
            "Wdot9A": { x: 0.22600, y: 0.73267, connections: ['Wdot10A'] }, // pielegniarka drzwi down
            "Wdot10A": { x: 0.22700, y: 0.71711, connections: ['dot7A'] }, // pielegniarka drzwi
            "Wdot11A": { x: 0.33400, y: 0.54031, connections: ['Wdot12A'] }, // szatnia sala gimnastyczna
            "Wdot12A": { x: 0.33400, y: 0.49505, connections: ['dot6A'] }, // szatnia przed sala gimnastyczna

            "Wdot8.5A": { x: 0.18000, y: 0.84552, connections: ['dot7.5A'] }, // Sala 113 STAND

            "Wdot13B": { x: 0.92100, y: 0.43706, connections: ['Wdot15B'], icon: 'stairsDown' }, // schody dol B
            "Wdot14B": { x: 0.92200, y: 0.47666, connections: ['Wdot15B'], icon: 'stairsUp' }, // schody gora B
            "Wdot15B": { x: 0.83400, y: 0.43706, connections: ['Wdot16B', 'Wdot17B', 'dot13.5B'] }, // mid B
            "Wdot16B": { x: 0.83400, y: 0.53285, connections: ['dot8B', 'dot9B'] }, // dol triple B
            "Wdot17B": { x: 0.83400, y: 0.37341, connections: ['dot10B', 'Wdot18B'] }, // przed WC pracownicze B
            "Wdot18B": { x: 0.83400, y: 0.26874, connections: ['dot14B', 'Wdot19B'] }, // przed 131
            "Wdot19B": { x: 0.83400, y: 0.25318, connections: ['dot11B', 'Wdot20B'] }, // przed 138
            "Wdot20B": { x: 0.83400, y: 0.14427, connections: ['dot12B', 'dot13B'] }, // przed 132 i 134



        }

    },

    "Floor2A": {
        dots: {
            "dot1": { x: 0.53750, y: 0.21385, desc: "Sala 202 (j. angielski)", label: "202" }, // Sala 202
            "dot2": { x: 0.31250, y: 0.30308 }, // WC meskie
            "dot3": { x: 0.31250, y: 0.51692 }, // WC zenskie
            "dot4": { x: 0.74500, y: 0.28308 }, // Sala 203
            "dot5": { x: 0.74500, y: 0.48923, desc: "Sala 204 (j. polski)", label: "204" }, // Sala 204
            "dot6": { x: 0.74500, y: 0.69077, desc: "Sala 205 (matematyka)", label: "205" }, // Sala 205
            "dot7": { x: 0.74500, y: 0.79846, desc: "Sala 207 (fizyka)", label: "207" }, // Sala 207
            "dot8": { x: 0.41500, y: 0.88308, desc: "Sala 210 (matematyka)", label: "210" }, // Sala 210
            "dot9": { x: 0.31250, y: 0.68923 }, // Biblioteka

            "Wdot1": { x: 0.31000, y: 0.44000, connections: ['Wdot2'], icon: 'stairsDown' }, // Schody w dol
            "Wdot2": { x: 0.53500, y: 0.44000, connections: ['Wdot3', 'Wdot5'] }, // mid A
            "Wdot3": { x: 0.53500, y: 0.30000, connections: ['Wdot4', 'dot2'] }, // przed WC up
            "Wdot4": { x: 0.53500, y: 0.28308, connections: ['dot1', 'dot4'] }, // przed sale up
            "Wdot5": { x: 0.53500, y: 0.49231, connections: ['dot5', 'Wdot6'] }, // przed 204
            "Wdot6": { x: 0.53500, y: 0.51538, connections: ['dot3', 'Wdot7'] }, // przed WC down
            "Wdot7": { x: 0.53500, y: 0.69231, connections: ['dot9', 'dot6', 'Wdot8'] }, // przed 205 i bibl
            "Wdot8": { x: 0.53500, y: 0.79846, connections: ['dot7', 'Wdot9'] }, // przed 207
            "Wdot9": { x: 0.41500, y: 0.79846, connections: ['dot8'] }, // przed 210
        }

    },
    "Floor2B": {
        dots: {
            "dot1": { x: 0.50000, y: 0.89231, desc: "Sala 215 (j. niemiecki)", label: "215" }, // Sala 215
            "dot2": { x: 0.28750, y: 0.78769 }, // Sala 216
            "dot3": { x: 0.28250, y: 0.62462 }, // Sala 219
            "dot4": { x: 0.28250, y: 0.46154, desc: "Sala 221 (technik informatyk)", label: "221" }, // Sala 221
            "dot5": { x: 0.27500, y: 0.30615, desc: "Sala 222 (t. informatyk, programista)", label: "222" }, // Sala 222
            "dot6": { x: 0.29750, y: 0.23385, desc: "Sala 224 (technik informatyk)", label: "224" }, // Sala 224
            "dot7": { x: 0.70500, y: 0.23538, desc: "Sala 226 (technik informatyk)", label: "226" }, // Sala 226
            "dot8": { x: 0.69750, y: 0.37385 }, // Sala 227
            "dot9": { x: 0.70500, y: 0.56154 }, // WC zenskie
            "dot10": { x: 0.70500, y: 0.78769 }, // WC meskie

            "Wdot1": { x: 0.71750, y: 0.65385, connections: ['Wdot2'], icon: 'stairsDown' }, // Schody w dol
            "Wdot2": { x: 0.50000, y: 0.65385, connections: ['Wdot4', 'Wdot3'] }, // mid B
            "Wdot3": { x: 0.50000, y: 0.78769, connections: ['dot1', 'dot2', 'dot10'] }, // down B
            "Wdot4": { x: 0.50000, y: 0.62308, connections: ['dot3', 'Wdot5'] }, // przed 219
            "Wdot5": { x: 0.50000, y: 0.56462, connections: ['dot9', 'Wdot6'] }, // przed WC zenskie
            "Wdot6": { x: 0.50000, y: 0.46308, connections: ['dot4', 'Wdot7'] }, // przed 221
            "Wdot7": { x: 0.50000, y: 0.37385, connections: ['dot8', 'Wdot8'] }, // przed 227
            "Wdot8": { x: 0.50000, y: 0.30923, connections: ['dot5', 'Wdot9'] }, // przed 222
            "Wdot9": { x: 0.50000, y: 0.23538, connections: ['dot6', 'dot7'] }, // up B
        }

    },
}

const mapIcons = {
    'pielegniarka': './assets/map/icons/pielegniarka.png',
    'stairsUp': './assets/map/icons/stairs-up.png',
    'stairsDown': './assets/map/icons/stairs-down.png',
    'machine': './assets/map/icons/Maniek.png',
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
const imgContainers = document.querySelectorAll(".layers");
imgContainers.forEach(container => {
    let img = container.querySelector("img")
    let canvas = container.querySelector("canvas");
    let buttonLayer = container.querySelector(".button-layer");

    let setSize = function () {
        container.style.width = `${img.width}px`;
        container.style.height = `${img.height}px`;
        canvas.width = img.width;
        canvas.height = img.height;
        buttonLayer.style.width = `${img.width}px`;
        buttonLayer.style.height = `${img.height}px`;
    }

    if (img.complete) {
        setSize();
    } else {
        img.onload = setSize;
    }
})


// Draw dots on each thingy
function drawDotsEverywhere() {
    for (const [floorName, floorItems] of Object.entries(imgPaths)) {
        let floorContainer = document.querySelector(`div.${floorName}`);
        if (!floorContainer) continue;

        let img = floorContainer.querySelector("img");
        let canvas = floorContainer.querySelector("canvas");
        let ctx = canvas.getContext("2d");

        for (const [dot, values] of Object.entries(floorItems.dots)) {
            let coordsPx = percentToPx(values, img);

            // Draw the dot
            ctx.fillStyle = "red";
            ctx.beginPath();
            ctx.arc(coordsPx.x, coordsPx.y, 5, 0, 2 * Math.PI);
            ctx.fill();

            // Draw the name of the dot
            ctx.fillStyle = "black";
            ctx.font = "12px Arial";
            ctx.fillText(dot, coordsPx.x, coordsPx.y - 10);
        }
    }

}

// drawDotsEverywhere();


// Draw a line from one point to the other

function drawLine(floorName, from, path, shouldntClear = false) {
    // path: ['dot1', 'dot2', 'dot3', 'dot4', 'targetdot']
    // from: 'Wdot0' (the starting dot Maniek)

    let floorContainer = document.querySelector(`div.${floorName}`);
    if (!floorContainer) return;

    let img = floorContainer.querySelector("img");
    let canvas = floorContainer.querySelector("canvas");

    let ctx = canvas.getContext("2d");
    if (!shouldntClear) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Line things
    ctx.strokeStyle = "red";
    ctx.lineWidth = 4;

    let floor = imgPaths[floorName];
    let lastDot = floor.dots[from];
    path.forEach(dot => {
        let connectionDot = floor.dots[dot];
        console.log(floor.dots, from);
        let coordsPx = percentToPx(lastDot, img);
        let connectionCoordsPx = percentToPx(connectionDot, img);

        // Draw line
        ctx.beginPath();
        ctx.moveTo(coordsPx.x, coordsPx.y);
        ctx.lineTo(connectionCoordsPx.x, connectionCoordsPx.y);
        ctx.stroke();
        ctx.closePath();

        // Draw dot
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(connectionCoordsPx.x, connectionCoordsPx.y, 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        // Draw arrow
        if (dot === path[path.length - 1]) {
            // ctx.fillSt

            ctx.beginPath();
            ctx.arc(connectionCoordsPx.x, connectionCoordsPx.y, 6, 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath();

        }

        lastDot = connectionDot;
    });
}


// testing drawing a line
// drawLine("Floor0", "Wdot0", ['Wdot1', 'Wdot2', 'Wdot3', 'dot3']);

let allPaths = {
    Floor0: { "Wdot0": [] },
    Floor1: {},
    Floor2A: {},
    Floor2B: {},
};

const floorStartPoints = {
    Floor0: "Wdot0",
    Floor1: { A: "Wdot1A", B: "Wdot13B" },
    Floor2A: "Wdot1",
    Floor2B: "Wdot1",
}

// PATHFIND ALL OF THE POSSIBLE DESTINATIONS - then you can draw to whichever one you like!
for (const [floorName, floorItems] of Object.entries(imgPaths)) {
    let floorContainer = document.querySelector(`div.${floorName}`);
    if (!floorContainer) continue;


    let pathfind = function (startDot) {
        // console.log(startDot);

        let currentPath = [startDot];
        let lastBranchedPath;

        let checkNextConnection = function (currentPath) {
            // console.log(floorName);
            let latestDotName = currentPath[currentPath.length - 1];
            let latestDot = floorItems.dots[latestDotName];
            // console.log(latestDotName);
            // console.log(latestDot);

            if (!latestDot) return;

            if (!latestDot.connections || latestDot.connections && latestDot.connections.length == 0) {
                // No connections, end of this path
                allPaths[floorName][latestDotName] = currentPath;
                currentPath = lastBranchedPath;
                return;
            }

            let connections = latestDot.connections;

            if (connections.length > 1) {
                // Branching path
                lastBranchedPath = currentPath;
            }

            // Go through the connections, and look at THEIR connections
            connections.forEach(connection => {
                let newPath = [...currentPath, connection];
                checkNextConnection(newPath);
            })
        }

        checkNextConnection(currentPath);
    }

    let startDot = floorStartPoints[floorName];
    if (typeof startDot === "object") {
        // Przejdz przez obydwa wejscia
        pathfind(startDot.A);
        pathfind(startDot.B);
    } else {
        // Przejdz przez jedno wejscie
        pathfind(startDot);
    }
}

console.log(allPaths);
// drawLine("Floor0", "Wdot0", allPaths['dot7']);

function drawAllPaths() {
    for (const [floorName, paths] of Object.entries(allPaths)) {

        for (const [targetDot, path] of Object.entries(paths)) {
            let startDot = floorStartPoints[floorName];
            if (typeof startDot === "object") {
                // Wybierz A lub B nie wiem jak tbh
                if (targetDot.includes("A")) {
                    startDot = startDot.A;
                } else {
                    startDot = startDot.B;
                }
            }

            drawLine(floorName, startDot, path);
        }

    }
}

// drawAllPaths();


// Draw a path to a specific point
// provide: floor name, start dot, floor's destination dot

function drawPath(floorName, startDot = 'Wdot0', destinationDot) {
    // Start dot of Floor0 is always 'Wdot0' 

    if (floorName != "Floor0") {
        let stairDot = "dot18";
        if (destinationDot.includes("A") || floorName.includes("A")) {
            stairDot = "dot20";
        }

        let stairPath = allPaths.Floor0[stairDot];
        drawLine("Floor0", 'Wdot0', stairPath);
    }


    let path = allPaths[floorName][destinationDot];
    drawLine(floorName, startDot, path);
}

// drawPath("Floor2B", floorStartPoints.Floor2B, "dot5");

function createAllButtons() {
    for (const [floorName, floorItems] of Object.entries(imgPaths)) {
        let floorContainer = document.querySelector(`div.${floorName}`);
        if (!floorContainer) continue;

        let img = floorContainer.querySelector("img");
        let canvas = floorContainer.querySelector("canvas");
        let ctx = canvas.getContext("2d");

        const buttonLayer = floorContainer.querySelector(".button-layer");

        for (const [dot, values] of Object.entries(floorItems.dots)) {
            let element = document.createElement("button");
            if (!values.icon && !values.label) continue;

            // Set the icon of the button
            if (values.icon) {
                element = document.createElement("img");
                element.src = mapIcons[values.icon];
            } else if (values.label) {
                element = document.createElement("button");
                element.innerHTML = values.label;
            }

            // Add a description/name to the button
            if (values.desc) {
                element.dataset.desc = values.desc;
            }




            element.addEventListener("click", e => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                let startPoint = floorStartPoints[floorName];
                if (floorName == "Floor1") {
                    if (dot.includes("A")) {
                        startPoint = floorStartPoints.Floor1.A;
                    } else {
                        startPoint = floorStartPoints.Floor1.B;
                    }
                }
                drawPath(floorName, startPoint, dot);
            })

            let coordsPx = percentToPx(values, img);
            element.style.left = `${coordsPx.x}px`;
            element.style.top = `${coordsPx.y}px`;

            buttonLayer.appendChild(element);
        }
    }
}

createAllButtons();




function copy(e) {
    // console.log(e.innerText);
    navigator.clipboard.writeText(e.innerText);
}

// Enable dev mode
const devCoords = document.querySelector(".dev-coordinates");

let devMode = false;

let iterator = 1;
let fullString = `Enabled DEV MODE - Click on imgs for coordinates`
let commentString = "";

let textX = 0, textY = 0;

function updateCoordString() {
    let coordString = fullString + `<br><span class='copyable' onclick='copy(this)'>"dot${iterator}": {x: ${textX}, y: ${textY}}, // ${commentString}</span>`;
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

    if (x.length >= 2 && !(x == "Backspace" || x == "Enter")) return;

    e.preventDefault();

    if (e.key === "Enter") {
        fullString = updateCoordString();

        commentString = "";
        iterator++;
    } else if (e.key === "Backspace") {
        commentString = commentString.slice(0, -1);
    } else {
        commentString += e.key;
    }

    updateCoordString();
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

    let percentages = pxToPercent({ x: x, y: y }, img);

    textX = percentages.x.toFixed(5);
    textY = percentages.y.toFixed(5);

    updateCoordString();
});


/*

let coordsPx = percentToPx(values, img);

        let draw = function() {
            Draw the dot
            ctx.fillStyle = "red";
            ctx.beginPath();
            ctx.arc(coordsPx.x, coordsPx.y, 5, 0, 2 * Math.PI);
            ctx.fill();

            // Connect all connection dots
            if (values.connections && values.connections.length > 0) {
                ctx.strokeStyle = "red";
                ctx.lineWidth = 3;

                values.connections.forEach(connectionName => {
                    let connectionDot = floorItems.dots[connectionName];
                    let connectionCoordsPx = percentToPx(connectionDot, img);

                    ctx.beginPath();
                    ctx.moveTo(coordsPx.x, coordsPx.y);
                    ctx.lineTo(connectionCoordsPx.x, connectionCoordsPx.y);
                    ctx.stroke();
                });
            }

            // Name the dot
            ctx.fillStyle = "black";
            ctx.font = "12px Arial";
            ctx.fillText(dot, coordsPx.x, coordsPx.y - 10);
        };

        if (img.complete) {
            draw();
        } else {
            img.onload = draw;
        }

*/