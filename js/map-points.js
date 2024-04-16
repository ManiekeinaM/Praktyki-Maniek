// List of img names that have corresponding points.
const imgPaths = {
    "Floor0": {
        // List of all dot coordinates placed around the map. Scaled to the image, then converted back into pixels.
        // Each dot needs a unique name
        dots: {
            "dot2": { x: 0.18500, y: 0.38048, desc: "Sala 2 (j. polski)", label: "2", dni_otwarte: "j. polski" }, // sala 2
            "dot3": { x: 0.25200, y: 0.46108, desc: "Sala 3 (historia, wos)", label: "3" }, // sala 3
            "dot4": { x: 0.25100, y: 0.74882, desc: "Dyrektor", label: "Dyrektor" }, // dyrektor
            "dot5": { x: 0.24900, y: 0.87972, desc: "Sala 10 (j. polski)", label: "10" }, // sala 10
            "dot6": { x: 0.10200, y: 0.87972, desc: "Sala 13 (matematyka)", label: "13", dni_otwarte: "girl team" }, // sala 13
            "dot7": { x: 0.10300, y: 0.65912, desc: "Sekretariat uczniowski", label: "Sekretariat" }, // sekretariat uczniowski
            "dot8": { x: 0.39300, y: 0.49505, desc: "Sala 22 (technik automatyk)", label: "22", dni_otwarte: "technik automatyk" }, // sala 22
            "dot9": { x: 0.53700, y: 0.49505, desc: "Sala 24 (lekcyjno-konferencyjna)", label: "24", dni_otwarte: "roboty" }, // sala 24
            "dot10": { x: 0.76000, y: 0.56011, desc: "Sala 46 (filozofia, religia)", label: "46", dni_otwarte: "filozofia, religia" }, // sala 46
            "dot11": { x: 0.83700, y: 0.63366, desc: "Sala 45 (j. angielski)", label: "45", dni_otwarte: "j. angielski" }, // sala 45
            "dot12": { x: 0.89100, y: 0.54173, desc: "Toaleta B", icon: 'toilet' }, // kibel meski
            // "dot12.5": {x: 0.88833, y: 0.37697, desc: "Toaleta nauczycielska (B)", icon: 'toilet'}, // Toaleta dla nauczycieli (parter B)
            "dot13": { x: 0.75900, y: 0.36775, desc: "Psycholog, pedagog", label: "Psycholog" }, // psycholog
            "dot14": { x: 0.76100, y: 0.21075, desc: "Sala 32 (chemia, biologia, fizyka)", label: "32", dni_otwarte: "chemia, biologia, fizyka" }, // sala 32
            "dot15": { x: 0.76100, y: 0.10750, desc: "Sala 39 (technik energetyk)", label: "39", dni_otwarte: "technik energetyk" }, // sala bez numerku raz byla na niemieckim i historii
            "dot16": { x: 0.91300, y: 0.16124, desc: "Sala 40 (technik mechatronik)", label: "40", dni_otwarte: "technik mechatronik" }, // sala 40 znak zapytania
            "dot17": { x: 0.91100, y: 0.29562, desc: "Sala 41 (technik mechatronik)", label: "41", dni_otwarte: "technik mechatronik" }, // sala 41
            "dot21": { x: 0.62083, y: 0.55896, desc: "Praktyka zawodowa (Ryszard Mirys)", label: "Praktyka" }, // mirys SALA
            "dot22": { x: 0.10667, y: 0.46226, desc: "Toaleta A", icon: 'toilet' }, // wc A
            "dot23": { x: 0.10250, y: 0.75236, icon: "musicNote", desc: "Muzyka!", dni_otwarte: "Muzyka" }, // nuty
            "dot18": { x: 0.91000, y: 0.47524, desc: "SCHODY B - GÓRA", icon: "stairsUp" }, // schody b gora
            "dot19": { x: 0.91000, y: 0.43706, desc: "SCHODY B - DÓL", icon: "stairsDown" }, // schody b dol
            "dot20": { x: 0.09200, y: 0.52900, desc: "SCHODY A - GÓRA", icon: "stairsUp" }, // schody a gora

            // W dots: walk dots
            // You can not go back in this pathfinding system, so the connections are only one way
            "Wdot0": { x: 0.23700, y: 0.49882, connections: ['Wdot1'], icon: 'machine', desc: "" }, // maniek
            "Wdot1": { x: 0.23667, y: 0.54481, connections: ['Wdot2', 'Wdot7'] }, // maniek up
            "Wdot2": { x: 0.18500, y: 0.54481, connections: ['Wdot3', 'Wdot4', 'dot20'] }, // leftA
            "Wdot3": { x: 0.18500, y: 0.46108, connections: ['dot2', 'dot3', 'dot22'] }, // up doors A
            "Wdot4": { x: 0.18500, y: 0.65920, connections: ['dot7', 'Wdot5'] }, // sekretariatSTAND
            "Wdot5": { x: 0.18500, y: 0.74882, connections: ['dot4', 'Wdot6', 'dot23'] }, // dyrektorSTAND
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

            // "stairdot1": {x: 0.87833, y: 0.44418}, // stairdot1 floor0
            // "stairdot2": {x: 0.87833, y: 0.47484}, // stairdot2 floor0

            "Xdot1": { x: 0.38000, y: 0.87500, icon: 'arrowDown', destination: mapThresholds[1].threshold }, // PIĘTRO 1 STRZAŁKA DO DOLU
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
            "dot1A": { x: 0.17978, y: 0.37726, desc: "Sala 102 (komputerowa)", label: "102" }, // sala 102
            "dot2A": { x: 0.25200, y: 0.44169, desc: "Sala 103 (komputerowa)", label: "103" }, // sala 103
            "dot3A": { x: 0.10422, y: 0.46370, desc: "Toaleta A (1)", icon: 'toilet' }, // Toaleta meska A
            "dot4A": { x: 0.10200, y: 0.63186, desc: "Toaleta A (2)", icon: 'toilet' }, // Toaleta pracownicza A
            "dot5A": { x: 0.10200, y: 0.68686, desc: "Sala 119 (geografia, przedsięb.)", label: "119", dni_otwarte: "doradca zawodowy" }, // sala 119
            "dot6A": { x: 0.45644, y: 0.49513, desc: "Sala gimnastyczna", label: "Sala gimnastyczna", dni_otwarte: "wf" }, // Sala gimnastyczna
            "dot7A": { x: 0.26750, y: 0.68868, desc: "Pielęgniarka", icon: "pielegniarka" }, // Pielegniarka A

            "dot7.1A": { x: 0.26750, y: 0.75590, desc: "Sala 108 (wolontariat)", label: "108", dni_otwarte: "wolontariat" }, // wolontariat, sala 108
            "dot8A": { x: 0.10250, y: 0.92807, icon: 'disco', desc: "Dyskoteka!", dni_otwarte: "Dyskoteka!" }, // dyskoteka
            "dot7.5A": { x: 0.25083, y: 0.84552, desc: "Sala 113 (TRN)", label: "113", dni_otwarte: "TRN" }, // Sala 113
            "dot7.6A": { x: 0.24833, y: 0.92748, desc: "Pokój nauczycielski", label: "Nauczycielski" }, // Pokój nauczycielski
            "dot7.7A": { x: 0.10667, y: 0.83608, desc: "Wicedyrektor", label: "Wicedyrektor" }, // Wicedyrektor


            "dot8B": { x: 0.76125, y: 0.55542, desc: "Sala 123 (technik mechatronik)", label: "123", dni_otwarte: "technik programista, roboty" }, // Sala 123
            "dot9B": { x: 0.83400, y: 0.61771, desc: "Sala 122 (technik programista, roboty)", label: "122", dni_otwarte: "technik programista, roboty" }, // Sala 122
            "dot10B": { x: 0.90756, y: 0.37097, desc: "Toaleta B", icon: 'toilet' }, // Toaleta pracownicza B
            "dot11B": { x: 0.90867, y: 0.25310, desc: "Sala 138 (technik elektronik)", label: "138" }, // Sala 138
            "dot12B": { x: 0.90867, y: 0.14152, desc: "Sala 134 (technik elektryk)", label: "134", dni_otwarte: "technik elektryk" }, // Sala 134
            "dot13B": { x: 0.76125, y: 0.14466, desc: "Sala 135 (technik elektronik)", label: "135", dni_otwarte: "technik elektronik" }, // Sala 135
            "dot13.5B": { x: 0.76125, y: 0.46108, desc: "Sala 131", label: "131" }, // Sala 131
            "dot14B": { x: 0.76125, y: 0.32311, desc: "Sala 132", label: "132" }, // Sala 132
            "dot15B": { x: 0.76125, y: 0.24175, desc: "Sala 133", label: "133" }, // Sala 133


            "Wdot1A": { x: 0.07500, y: 0.57426, connections: ['Wdot3A', 'stairdot1'], icon: 'stairsDown', desc: "SCHODY A - DÓŁ" }, // schody dol A
            "Wdot2A": { x: 0.07500, y: 0.53041, icon: 'stairsUp', desc: "SCHODY A - GÓRA" }, // schody gora A
            "Wdot3A": { x: 0.18000, y: 0.53890, connections: ['Wdot11A', 'Wdot4A', 'Wdot6A'] }, // mid A
            "Wdot4A": { x: 0.18000, y: 0.46393, connections: ['Wdot5A', 'dot3A'] }, // gora triple A
            "Wdot5A": { x: 0.18000, y: 0.44272, connections: ['dot1A', 'dot2A'] }, // gora A przed prawa sala
            "Wdot6A": { x: 0.18000, y: 0.63225, connections: ['dot4A', 'Wdot7A'] }, // przed WC pracownicze A
            "Wdot7A": { x: 0.18000, y: 0.68600, connections: ['dot5A', 'Wdot8A'] }, // przed 119
            "Wdot8A": { x: 0.18000, y: 0.73267, connections: ['Wdot9A', 'Wdot8.5A'] }, // przed pielegniarka
            "Wdot9A": { x: 0.22600, y: 0.73267, connections: ['Wdot10A', 'dot7.1A'] }, // pielegniarka drzwi down
            "Wdot10A": { x: 0.22700, y: 0.71711, connections: ['dot7A'] }, // pielegniarka drzwi
            "Wdot11A": { x: 0.33400, y: 0.54031, connections: ['Wdot12A'] }, // szatnia sala gimnastyczna
            "Wdot12A": { x: 0.33400, y: 0.49505, connections: ['dot6A'] }, // szatnia przed sala gimnastyczna

            "Wdot8.5A": { x: 0.18000, y: 0.84552, connections: ['dot7.5A', 'dot7.7A', 'Wdot8.9A'] }, // Sala 113 STAND
            "Wdot8.9A": { x: 0.18167, y: 0.92925, connections: ['dot8A', 'dot7.6A'] }, // przed disco 


            "Wdot13B": { x: 0.92100, y: 0.43706, connections: ['Wdot15B', 'stairdot3'], icon: 'stairsDown', desc: "SCHODY B - DÓŁ" }, // schody dol B
            "Wdot14B": { x: 0.92200, y: 0.47666, icon: 'stairsUp', desc: "SCHODY B - GÓRA" }, // schody gora B
            "Wdot15B": { x: 0.83400, y: 0.46344, connections: ['Wdot16B', 'Wdot17B', 'dot13.5B'] }, // mid B
            "Wdot16B": { x: 0.83400, y: 0.55778, connections: ['dot8B', 'dot9B'] }, // dol triple B
            "Wdot17B": { x: 0.83400, y: 0.37341, connections: ['dot10B', 'Wdot17.5B'] }, // przed WC pracownicze B
            "Wdot17.5B": { x: 0.83400, y: 0.32429, connections: ['dot14B', 'Wdot18B'] }, // Przed 132 (Wdot17.5B)
            "Wdot18B": { x: 0.83400, y: 0.26874, connections: ['Wdot19B'] }, // przed 131
            "Wdot19B": { x: 0.83400, y: 0.25300, connections: ['dot11B', 'Wdot20B', 'dot15B'] }, // przed 138
            "Wdot20B": { x: 0.83400, y: 0.14427, connections: ['dot12B', 'dot13B'] }, // przed 132 i 134

            "stairdot1": { x: 0.11694, y: 0.57426, connections: ['stairdot2'] }, // stairdot1 floor1A
            "stairdot2": { x: 0.11694, y: 0.53041, connections: ['Wdot2A'] }, // stairdot2 floor1A

            "stairdot3": { x: 0.88824, y: 0.43706, connections: ['stairdot4'] }, // stairdot3 floor1B
            "stairdot4": { x: 0.88824, y: 0.47666, connections: ['Wdot14B'] }, // stairdot4 floor1B

            "Xdot1": { x: 0.38000, y: 0.87500, icon: 'arrowDown', destination: mapThresholds[2].threshold }, // PIĘTRO 2 STRZAŁKA DO DOLU
        }

    },

    "Floor2A": {
        dots: {
            "dot1": { x: 0.53750, y: 0.21385, desc: "Sala 202 (j. angielski)", label: "202" }, // Sala 202
            "dot2": { x: 0.31250, y: 0.30308, icon: 'toilet', desc: "Toaleta 1 (męska)" }, // WC meskie
            "dot3": { x: 0.31250, y: 0.51692, icon: 'toilet', desc: "Toaleta 2 (żeńska)" }, // WC zenskie
            "dot4": { x: 0.74500, y: 0.28308, desc: "Sala 203 (j. angielski)", label: "203", dni_otwarte: "j. angielski" }, // Sala 203
            "dot5": { x: 0.74500, y: 0.48923, desc: "Sala 204 (j. polski)", label: "204", dni_otwarte: "j. polski" }, // Sala 204
            "dot6": { x: 0.74500, y: 0.69077, desc: "Sala 205 (matematyka)", label: "205", dni_otwarte: "matematyka" }, // Sala 205
            "dot7": { x: 0.74500, y: 0.79846, desc: "Sala 207 (fizyka)", label: "207" }, // Sala 207
            "dot8": { x: 0.41500, y: 0.88308, desc: "Sala 210 (matematyka)", label: "210", dni_otwarte: "matematyka" }, // Sala 210
            "dot9": { x: 0.31250, y: 0.68923, desc: "Biblioteka", label: "Biblioteka" }, // Biblioteka

            "Wdot1": { x: 0.31000, y: 0.44000, connections: ['Wdot2'], icon: 'stairsDown', desc: "SCHODY - DÓŁ" }, // Schody w dol
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
            "dot2": { x: 0.27500, y: 0.78769, desc: "Sala 216", label: "216" }, // Sala 216
            "dot3": { x: 0.27500, y: 0.62462, desc: "Sala 219", label: "219" }, // Sala 219
            "dot4": { x: 0.27500, y: 0.46154, desc: "Sala 221 (technik informatyk)", label: "221", dni_otwarte: "technik informatyk" }, // Sala 221
            "dot5": { x: 0.27500, y: 0.30615, desc: "Sala 222 (technik informatyk, programista)", label: "222", dni_otwarte: "technik informatyk" }, // Sala 222
            "dot6": { x: 0.27500, y: 0.23385, desc: "Sala 224 (technik informatyk)", label: "224" }, // Sala 224
            "dot7": { x: 0.70500, y: 0.23538, desc: "Sala 226 (technik informatyk)", label: "226", dni_otwarte: "technik informatyk" }, // Sala 226
            "dot8": { x: 0.69750, y: 0.37385, desc: "Sala 227 (j. niemiecki)", label: "227", dni_otwarte: "j. niemiecki" }, // Sala 227
            "dot9": { x: 0.70500, y: 0.56154, icon: 'toilet', desc: "Toaleta 1 (żeńska)" }, // WC zenskie
            "dot10": { x: 0.70500, y: 0.78769, icon: 'toilet', desc: "Toaleta 2 (męska)" }, // WC meskie

            "Wdot1": { x: 0.71750, y: 0.65385, connections: ['Wdot2'], icon: 'stairsDown', desc: "SCHODY - DÓŁ" }, // Schody w dol
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
    'pielegniarka': 'assets/map/icons/pielegniarka.png',
    'stairsUp': 'assets/map/icons/stairs-up.png',
    'stairsDown': 'assets/map/icons/stairs-down.png',
    'machine': 'assets/map/icons/Maniek.png',
    'disco': 'assets/map/icons/disco.png',
    'musicNote': 'assets/map/icons/musicNote.png',
    'toilet': 'assets/map/icons/toilet.png',
    'arrowDown': 'assets/map/icons/arrowDown.png',
    'arrowUp': 'assets/map/icons/arrowUp.png'
}

function percentToPx(percentages, relativeElement) {
    const bounds = relativeElement.getBoundingClientRect();
    return {
        x: percentages.x * bounds.width / scale,
        y: percentages.y * bounds.height / scale
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
        let floorContainer = map.querySelector(`div.${floorName}`);
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


function clearAllCanvas() {
    const allCanvas = document.querySelectorAll("canvas");
    allCanvas.forEach(canvas => {
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
}



// Draw a line from one point to the other

function drawLine(floorName, from, path) {
    // path: ['dot1', 'dot2', 'dot3', 'dot4', 'targetdot']
    // from: 'Wdot0' (the starting dot Maniek)

    let floorContainer = map.querySelector(`div.${floorName}`);
    if (!floorContainer) return;

    let img = floorContainer.querySelector("img");
    let canvas = floorContainer.querySelector("canvas");

    let ctx = canvas.getContext("2d");

    // Line things
    ctx.strokeStyle = "red";
    ctx.lineWidth = 4;

    let floor = imgPaths[floorName];
    let lastDot = floor.dots[from];
    // console.log(path);
    path.forEach(dot => {
        let connectionDot = floor.dots[dot];
        // console.log(floor.dots, from);
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
        if (dot === path[path.length - 1] || dot === path[0]) {
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

const floorNames = {
    Floor0: "Parter",
    Floor1: { A: "Piętro 1 (A)", B: "Piętro 1 (B)" },
    Floor2A: "Piętro 2 (A)",
    Floor2B: "Piętro 2 (B)",
}

// PATHFIND ALL OF THE POSSIBLE DESTINATIONS - then you can draw to whichever one you like!
for (const [floorName, floorItems] of Object.entries(imgPaths)) {
    let floorContainer = map.querySelector(`div.${floorName}`);
    if (!floorContainer) continue;

    let img = floorContainer.querySelector("img");

    let start = function () {
        console.log("starting map ");

        let pathfind = function (startDot) {
            // console.log(startDot);

            console.log("pathfinding something");

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

    // Musiałem to zrobic, bo inaczej 50% czasu na telefonie/slabszym internecie sie psulo
    if (img.complete) {
        start();
        console.log("already completed loading");
    } else {
        img.onload = start;
        console.log("onload");
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

const currentPath = document.querySelector(".currentPath");

const roomSelection = document.querySelector('.room-selection');
const navigationButton = document.querySelector(".room-selection-button");
navigationButton.addEventListener('click', e => {

    roomSelection.classList.toggle("hidden");
})

function drawPath(floorName, startDot = 'Wdot0', destinationDot, shouldntClear = false) {
    // Start dot of Floor0 is always 'Wdot0' 
    let floor = floorNames[floorName];
    if (typeof floor === "object") {
        // Wybierz A lub B nie wiem jak tbh
        if (destinationDot.includes("A")) {
            floor = floor.A;
        } else {
            floor = floor.B;
        }
    }

    // update currentPath path
    currentPath.innerHTML = `> ${floor} <
    <br>${imgPaths[floorName].dots[destinationDot].desc}`;

    // update currentPath color as a cool lil transition
    currentPath.style.color = 'purple';
    currentPath.style.transform = 'translate(-50%, 0%) scale(1.1)';
    setTimeout(() => {
        currentPath.style.color = '';
        currentPath.style.transform = '';
    }, 250);


    if (!shouldntClear) {
        clearAllCanvas();
        // ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    if (floorName != "Floor0") {
        let stairDot = "dot18";
        if (destinationDot.includes("A") || floorName.includes("A")) {
            stairDot = "dot20";
        }

        let stairPath = allPaths.Floor0[stairDot];
        drawLine("Floor0", 'Wdot0', stairPath);

        if (floorName != "Floor1") {
            let stairDot = "Wdot1A";
            let stairDestination = "Wdot2A";
            if (floorName.includes("B")) {
                stairDot = "Wdot13B";
                stairDestination = "Wdot14B";
            }
            drawLine("Floor1", stairDot, allPaths["Floor1"][stairDestination]);
        }
    }


    let path = allPaths[floorName][destinationDot];
    drawLine(floorName, startDot, path);
}

// drawPath("Floor2B", floorStartPoints.Floor2B, "dot5");


function createAllButtons() {
    for (const [floorName, floorItems] of Object.entries(imgPaths)) {
        let floorContainer = map.querySelector(`div.${floorName}`);
        if (!floorContainer) continue;

        let roomSelectionP = roomSelection.querySelector(`div.${floorName}`);
        // console.log(roomSelectionP)

        // console.log(floorContainer.children);
        let img = floorContainer.querySelector("img");
        let canvas = floorContainer.querySelector("canvas");
        let ctx = canvas.getContext("2d");

        const buttonLayer = floorContainer.querySelector(".button-layer");

        const setButtons = () => {
            for (const [dot, values] of Object.entries(floorItems.dots)) {
                let element = document.createElement("button");
                if (!values.icon && !values.label) continue;

                let desc = values.desc;

                // Set the icon of the button
                if (values.icon) {
                    if (values.dni_otwarte && !IS_DNI_OTWARTE) continue;

                    element = document.createElement("img");
                    element.src = mapIcons[values.icon];

                    if (values.icon.includes('arrow')) {
                        element.style = `width: 10em; height: 10em;`
                    }
                } else if (values.label) {
                    element = document.createElement("button");
                    element.innerHTML = values.label;
                }

                element.addEventListener("click", e => {
                    // Xdot - does something cool
                    if (dot.includes('Xdot')) {
                        if (values.destination) {
                            // Get the real destination, it is a bit lower than the threshold
                            let realDestination = values.destination - 450;
                            updateMap(false, realDestination);
                        }
                        return;
                    }

                    // Draw the path for this destination

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

                // Add a p button element to the roomSelection container of that floor
                if (desc && !desc.includes('DÓ')) {
                    let newP = document.createElement('p');
                    newP.innerHTML = values.desc;
                    roomSelectionP.appendChild(newP);

                    newP.addEventListener("click", e => {
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
                }




                let coordsPx = percentToPx(values, img);
                element.style.left = `${coordsPx.x}px`;
                element.style.top = `${coordsPx.y}px`;

                // Add a description/name/dni_otwarte description to the button
                let percentage = 0; // percent to add to the offset, so it shows one box under the other properly
                let incrementPercentage = () => {
                    percentage += 110;
                }

                if (values.dni_otwarte && IS_DNI_OTWARTE) {
                    if (percentage == 0) percentage = 60;

                    let sparkle = document.createElement("img");
                    sparkle.classList.add("dni-otwarte");
                    sparkle.src = 'assets/dni-otwarte.png';
                    element.appendChild(sparkle);


                    let popup = document.createElement("p");
                    popup.classList.add("popup");
                    popup.classList.add("dni-otwarte");
                    popup.innerText = values.dni_otwarte;
                    element.dataset.desc = values.dni_otwarte;

                    element.appendChild(popup);
                    popup.style = `transform: translate(-50%, ${percentage}%)`;

                    incrementPercentage();
                }

                if (values.desc) {
                    let popup = document.createElement("p");
                    popup.classList.add("popup");
                    popup.innerText = values.desc;
                    element.dataset.desc = values.desc;

                    element.appendChild(popup);
                    popup.style = `transform: translate(-50%, ${percentage}%)`;

                    incrementPercentage();
                }


                buttonLayer.appendChild(element);
            }
        }

        if (img.complete) {
            setButtons();
        } else {
            img.onload = setButtons;
        }


    }
}

setTimeout(createAllButtons, 50);




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
        if (!devMode) devCoords.innerHTML = ``;
    }
    if (!devMode) return;

    if (e.key == "F3") {
        e.preventDefault();
        drawDotsEverywhere();
        return;
    }

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
    // console.log(e.target);
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

