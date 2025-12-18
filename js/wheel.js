const result = document.querySelector(".result");
const wheelsDiv = document.querySelector(".wheels");
const winSound = document.getElementById("win_sound");
// const wheelContainers = document.querySelectorAll(".wheel-container");

let php_data_text = document.getElementById("php-container").innerHTML;
let php_amounts = php_data_text.split("_");
php_amounts.pop();

var wheels = {
    1: {
        prizes: [
            { name: "🗝️🎖️", id: 1, desc: "Gadżet", weight: 100, visualWeight: 1, amount: parseInt(php_amounts[0]), color: '#CAB282', darkcolor: '#b99a5a' },
            { name: "📅🤐", id: 2, desc: "Voucher: Dzień bez pytania", weight: 60, visualWeight: 1, amount: parseInt(php_amounts[1]), color: '#1434B4', darkcolor: '#112b95' },
            { name: "🎟️🛒", id: 5, desc: "Voucher: Sklepik 10zł", weight: 2.5, visualWeight: 1, amount: parseInt(php_amounts[4]), color: '#CAB282', darkcolor: '#b99a5a' },
            { name: "🎫🛒", id: 6, desc: "Voucher: Sklepik 5zł", weight: 5, visualWeight: 1, amount: parseInt(php_amounts[5]), color: '#1434B4', darkcolor: '#112b95' },
            // { name: "🎫🏖️", id: 3, desc: "Voucher: Wycieczka integracyjna gratis", weight: 0, visualWeight: 1, amount: php_amounts[2], color: '#CAB282', darkcolor: '#b99a5a' },
            // { name: "🎫💻", id: 4, desc: "Voucher: Sprzęt elektroniczny 50zł", weight: 0, visualWeight: 1, amount: php_amounts[3], color: '#1434B4', darkcolor: '#112b95' },
            { name: "🗝️🎖️", id: 1, desc: "Gadżet", weight: 100, visualWeight: 1, amount: parseInt(php_amounts[0]), color: '#CAB282', darkcolor: '#b99a5a' },
            { name: "📅🤐", id: 2, desc: "Voucher: Dzień bez pytania", weight: 60, visualWeight: 1, amount: parseInt(php_amounts[1]), color: '#1434B4', darkcolor: '#112b95' },
            { name: "🎟️🛒", id: 5, desc: "Voucher: Sklepik 10zł", weight: 2.5, visualWeight: 1, amount: parseInt(php_amounts[4]), color: '#CAB282', darkcolor: '#b99a5a' },
            { name: "🎫🛒", id: 6, desc: "Voucher: Sklepik 5zł", weight: 5, visualWeight: 1, amount: parseInt(php_amounts[5]), color: '#1434B4', darkcolor: '#112b95' },

        ],

        totalWeights: 0, totalVisualWeights: 0,
        // totalPrizes: 0,
        actualWheels: [],
    },
    2: {
        prizes: [
            { name: "🗝️🎖️", id: 1, desc: "Gadżet", weight: 100, visualWeight: 2, amount: parseInt(php_amounts[0]), color: '#CAB282', darkcolor: '#b99a5a' },
            { name: "📅🤐", id: 2, desc: "Voucher: Dzień bez pytania", weight: 100, visualWeight: 2, amount: parseInt(php_amounts[1]), color: '#1434B4', darkcolor: '#112b95' },
            { name: "🎫🏖️", id: 3, desc: "Voucher: Wycieczka integracyjna gratis", weight: 10, visualWeight: 1, amount: parseInt(php_amounts[2]), color: '#CAB282', darkcolor: '#b99a5a' },
            { name: "🎫💻", id: 4, desc: "Voucher: Sprzęt elektroniczny 50zł", weight: 10, visualWeight: 1, amount: parseInt(php_amounts[3]), color: '#1434B4', darkcolor: '#112b95' },
            { name: "🎟️🛒", id: 5, desc: "Voucher: Sklepik 10zł", weight: 40, visualWeight: 2, amount: parseInt(php_amounts[4]), color: '#CAB282', darkcolor: '#b99a5a' },
            { name: "🎫🛒", id: 6, desc: "Voucher: Sklepik 5zł", weight: 40, visualWeight: 2, amount: parseInt(php_amounts[5]), color: '#1434B4', darkcolor: '#112b95' },
            { name: "🎒😎", id: 7, desc: "Plecak Tomtom", weight: 150, visualWeight: 2, amount: parseInt(php_amounts[6]), color: '#CAB282', darkcolor: '#b99a5a' },
	    { name: "🤳📷", id: 8, desc: "Selfie Stick", weight: 150, visualWeight: 2, amount: parseInt(php_amounts[7]), color: '#1434B4', darkcolor: '#112b95' }
	],
        totalWeights: 0, totalVisualWeights: 0,
        // totalPrizes: 0,
        actualWheels: [],
    }
}

let currentSpinningWheels = 0;

wheels[1].prizes = wheels[1].prizes.filter(prize => prize.amount > 0);
wheels[2].prizes = wheels[2].prizes.filter(prize => prize.amount > 0);
// console.log(wheels);

let currentWheel = 1;

const categories = document.querySelector(".categories");
const categoryButtons = categories.querySelectorAll("button");
categoryButtons.forEach(button => {
    let id = button.dataset.wheelid;
    button.addEventListener("click", e => {
        e.preventDefault();

        if (currentSpinningWheels > 0) return;

        currentWheel = parseInt(id);
        updateWheels();
        // console.log("yo");
    })
})

const wheelLegend = document.querySelector('.wheel-legend');

function updateWheels() {
    // Update legend
    let legendPrizes = wheelLegend.querySelectorAll(".legend-container");

    legendPrizes.forEach(div => {
        let wheelid = div.dataset.wheelid;
        // console.log(wheelid);
        if (wheelid == currentWheel) {
            div.classList.remove("hidden");
        } else {
            div.classList.add("hidden");
        }
    })

    // Update scale
    if (currentWheel == 2) {
        wheelsDiv.style.transform = `scale(0.75)`;
    } else {
        wheelsDiv.style.transform = ``;
    }

    // Update wheels
    let wheelcontainers = wheelsDiv.querySelectorAll('.wheel-container');
    wheelcontainers.forEach(container => {
        let wheelid = container.dataset.wheelid;

        if (wheelid == currentWheel) {
            container.classList.remove("hidden");
            // console.log("removing hidden");
        } else {
            container.classList.add("hidden");
            // console.log("adding hidden");
        }
    });
}

updateWheels();

// Set the necessary properties for each wheel
for (const [wheelId, wheelProperties] of Object.entries(wheels)) {
    // To ensure only one legened entry for one id
    let exists = {}

    // Create an element for the wheel legend
    let legendContainer = document.createElement("div")
    legendContainer.classList.add("legend-container");
    legendContainer.dataset.wheelid = wheelId;

    let totalWeight = 0, totalVisualWeight = 0;
    for (const [i, prizeValues] of wheelProperties.prizes.entries()) {
        if (prizeValues.amount <= 0) continue;

        totalWeight += prizeValues.weight;
        totalVisualWeight += prizeValues.visualWeight;

        // Fill up the legend
        if (prizeValues.amount <= 0) continue;
        // Ensure only one entry for one id
        if ( exists[prizeValues.id] == true ) continue;
        exists[prizeValues.id] = true;
        
        let p = document.createElement("p");
        p.textContent = `${prizeValues.name} - ${prizeValues.desc}`;

        legendContainer.appendChild(p);
    }

    wheelLegend.appendChild(legendContainer);

    // Set the total weights and prizes
    wheels[wheelId].totalWeights = totalWeight;
    wheels[wheelId].totalVisualWeights = totalVisualWeight;
    // wheels[wheelId].totalPrizes = totalPrizes;

    // Calculate the starting current degree of the wheel, to be in the middle of the first segment
    // wheels[wheelId].currentDegree = 270//startDegree + segmentDegree / 2; // Start in the edge of the first segment

    if (wheelId != currentWheel) {
        legendContainer.classList.add("hidden");
    }
}

let currentDegree = 0;

let wheelAmount = 0;
let usedPrice = [{}, {}, {}];

function generateWheel(wheelId) {
    // console.log(wheelId);
    let pickedWheel = wheels[wheelId];

    let totalWeight = pickedWheel.totalVisualWeights;

    let container = document.createElement("div");
    container.classList.add(`wheel-container`);
    container.dataset.wheelid = wheelId;
    container.dataset.otherwheelid = wheelAmount;

    let arrow = document.createElement('img');
    arrow.classList.add("arrow");
    arrow.src = './assets/arrowDown.png';
    arrow.alt = 'v';
    container.appendChild(arrow);

    let locked = document.createElement('img');
    locked.src = './assets/locked3.png';
    locked.classList.add("locked");
    // locked.classList.add("hidden");
    container.appendChild(locked);


    let wheelSvg = `<svg class="wheel" data-currentdegree="270" data-debounce="false" data-locked="true" xmlns="http://www.w3.org/2000/svg" width="600" height="600" style="transform: rotate(${pickedWheel.currentDegree}deg)">
            <g transform="translate(300,300)">`;

    let weightsUsed = 0;
    for (const [i, values] of pickedWheel.prizes.entries()) {
        // If there is less amount than wheels then don't draw it
        if (usedPrice[wheelId][values.id] <= values.amount) continue;
        usedPrice[wheelId][values.id]++;

        // SEGMENT
        let prizeName = values.name;

        let weight = values.visualWeight;
        let segPortion = weight / totalWeight;
        let segAngle = segPortion * 360;

        let startAngle = weightsUsed * 360;
        let endAngle = startAngle + segAngle;

        weightsUsed += segPortion;

        // Calculate the start and end coordinates of the segment
        const startOuterX = Math.cos(startAngle * Math.PI / 180) * 250;
        const startOuterY = Math.sin(startAngle * Math.PI / 180) * 250;
        const endOuterX = Math.cos(endAngle * Math.PI / 180) * 250;
        const endOuterY = Math.sin(endAngle * Math.PI / 180) * 250;

        let largeArcFlag = (segAngle > 180) ? 1 : 0;

        // Create the segment path
        wheelSvg += `<path d="M0,0 L ${startOuterX},${startOuterY} A 250,250 0 ${largeArcFlag},1 ${endOuterX},${endOuterY} Z"
                        fill="${values.color}" stroke-width="8"/>`;


        // INNER STROKE
        const innerArcRadius = 240; // Slightly less than the segment radius to simulate the stroke being on the inside
        const startInnerX = Math.cos(startAngle * Math.PI / 180) * innerArcRadius;
        const startInnerY = Math.sin(startAngle * Math.PI / 180) * innerArcRadius;
        const endInnerX = Math.cos(endAngle * Math.PI / 180) * innerArcRadius;
        const endInnerY = Math.sin(endAngle * Math.PI / 180) * innerArcRadius;

        // Add an arc for the inner stroke
        wheelSvg += `<path d="M${startInnerX},${startInnerY} A ${innerArcRadius},${innerArcRadius} 0 ${largeArcFlag},1 ${endInnerX},${endInnerY}"
                    stroke="${values.darkcolor}" fill="none" stroke-width="16"/>`;

        // Place text
        const textAngle = startAngle + segAngle / 2;
        const textX = Math.cos(textAngle * Math.PI / 180) * 200;
        const textY = Math.sin(textAngle * Math.PI / 180) * 200;

        wheelSvg += `<text class="prizeText" x="${textX}" y="${textY + 8}" font-family="Arial" font-weight="bold" font-size="25" fill="lightgray" stroke-width="8" paint-order="stroke" stroke="${values.darkcolor}" text-anchor="middle" transform="rotate(${textAngle + 90}, ${textX}, ${textY})">${prizeName}</text>`;
    }

    wheelSvg += `<circle cx="0" cy="0" r="250" fill="none" stroke="#817453" stroke-width="10"/>`;
    wheelSvg += `<circle cx="0" cy="0" r="255" fill="none" stroke="#63593F" stroke-width="5"/>`;
    wheelSvg += `<circle cx="0" cy="0" r="20" fill="#9B8C64" stroke="#9B8C64" stroke-width="6"/>`;

    wheelSvg += `</g></svg>`;

    wheelsDiv.appendChild(container);
    // console.log(container.innerHTML);

    container.innerHTML += wheelSvg;

    let svg = container.querySelector('svg');
    wheels[wheelId].actualWheel = svg;

    let winScreen = document.createElement('p');
    winScreen.classList.add('winResult');
    winScreen.classList.add('hidden');
    container.appendChild(winScreen);

    svg.addEventListener("click", () => {
        // console.log(svg.dataset.debounce);
        if (svg.dataset.debounce == "true") return;
        if (svg.dataset.locked == "true") return;

        svg.dataset.debounce = "true";
        // wheels[wheelId].debounce = true;
        randomByWeight(wheelId, svg);
    })

    wheels[wheelId].actualWheels[wheelAmount] = svg;

    wheelAmount++;

    return container;
}

function randomByWeight(wheelId, actualWheel) {
    // console.log("randomizin");
    let pickedWheel = wheels[wheelId];
    let totalWeights = pickedWheel.totalWeights;

    // Random a number between [1, total]
    const random = Math.ceil(Math.random() * totalWeights); // [1,total]
    // Prize selecting logic
    let cursor = 0;
    // console.log(pickedWheel.prizes);
    let found = false;
    do {
        let cantSpin = ( pickedWheel.prizes.length == 0 ) || ( pickedWheel.prizes.length == 1 && pickedWheel.prizes[0].amount <= 0);
  
        if (cantSpin) {
            alert("Nie ma juz nagrod do wygrania !");
            break;
        }
        for (const [i, values] of pickedWheel.prizes.entries()) {
            let prizeName = values.name;
    
            cursor += values.weight;
            // console.log(wheels);
            // console.log(cursor, random);
            if (cursor >= random) {
                if (values.amount <= 0) continue;
                found = true; 
                values.amount--;
                //php amount decreasing
                // console.log(i);
                let decreasedAmount = {id: values.id};
    
                fetch('misc/decreaseAmount.php', {
                    method: 'POST',
                    body: JSON.stringify(decreasedAmount),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(response => response.text())
                .then(data => {} /*console.log(data) */)
                .catch(error => {} /*console.log('Error:', error)*/);
                
                // console.log(`prize id to spin to: ${i}`);
                spin(wheelId, i, actualWheel);

                // result.innerHTML = prizeName;
                return { prizeName };
            }
        }
    } while(!found);

    return "never go here";
}


const winHistoryCookie = getCookie("winHistory");
// console.log(winHistoryCookie);
let winHistory = JSON.parse(winHistoryCookie == "" ? "[]" : winHistoryCookie);
// console.log(winHistory);

let newResult = `NOWE: `;

function updateHistory() {
    newResult = `NOWE: `;
    for (let i=winHistory.length-1; i>winHistory.length-6 && i>=0; i--) {
        newResult += `${winHistory[i]} <br>`;
    }

    result.innerHTML = newResult;
}

updateHistory();

let spinnedWheelId2 = 0;
function spin(wheelId, prizeId, actualWheel) {
    if (wheelId == 2)
        spinnedWheelId2 += 1;

    const totalSpins = 9; // Determines how many times the wheel will spin

    let pickedWheel = wheels[wheelId];
    // console.log(pickedWheel.prizes);
    let prizeName = pickedWheel.prizes[prizeId].name;

    let totalWeights = pickedWheel.totalVisualWeights;

    let currentDegree = parseFloat(actualWheel.dataset.currentdegree);
    // console.log(`Current degree: ${currentDegree}`);

    // Calculate the degree to stop on the winning segment
    let realDegree = (currentDegree) % 360 // get the real degree without the 360s

    let cumulativeWeight = 0;
    for (let i = 0; i < prizeId; i++) {
        let prize = pickedWheel.prizes[i];
        let weight = prize.visualWeight;

        cumulativeWeight += weight;
    }
    let leadingDegrees = (cumulativeWeight / totalWeights) * 360;
    let generalTarget = leadingDegrees + (pickedWheel.prizes[prizeId].visualWeight / totalWeights) * 360 / 2;

    const finalDegree = (270 - generalTarget) + (360 * totalSpins);

    currentDegree += finalDegree + (360 - realDegree);
    actualWheel.dataset.currentdegree = currentDegree;
    // actualWheel.dataset.currentdegree += finalDegree + (360 - realDegree);

    // Apply the spin animation
    const wheel = actualWheel;

    let time = Math.max(4, totalSpins / 1.5);
    wheel.style.transition = `transform ${time}s cubic-bezier(0.33, 1, 0.68, 1)`; // Smooth deceleration
    wheel.style.transform = `rotate(${currentDegree}deg)`;

    let prizeValues = pickedWheel.prizes[prizeId];
    let entry = ``;
    if (wheelId == 2) {
        entry += `<span class="premium">`
    }
    entry += `${prizeValues.name} - ${prizeValues.desc} </span>`;
    

    winHistory.push(entry);
    setCookie("winHistory", JSON.stringify(winHistory), 30);
    // result.innerHTML = `Winner is: ${prizeName}`;

    // console.log(wheels[wheelId].prizes);
    let winScreen = wheel.parentNode.querySelector('.winResult');
    
    currentSpinningWheels += 1;

    setTimeout(() => {
        wheel.style.transition = '';
        updateHistory();
    
        winScreen.classList.remove("hidden");
        winScreen.innerHTML = `${prizeValues.name} - ${prizeValues.desc}`;
        winSound.play();
        initConfetti();
        winScreen.style.animation = `showPrize 5.1s`;
        setTimeout(() => {
            winScreen.classList.add("hidden");
            wheel.dataset.debounce = "false";
            lockWheel(wheel);
            currentSpinningWheels -= 1;
        }, 5000);
    }, time * 1000); // Matches the duration of the animation

    // Check if can reload after animation
    const isWheel2SpinnedTwice = (wheelId == 2 && spinnedWheelId2 == 2);
    const isSinglePrizeWithZeroAmount = (wheelId == 2 && wheels[wheelId].prizes.length == 1 && prizeValues.amount <= 0);
    const isWheel1 = (wheelId == 1);

    if (isWheel2SpinnedTwice || isSinglePrizeWithZeroAmount || isWheel1){
        // Set timeout to reload to time it after animations !
        setTimeout(() => {
            document.location.reload();
        }, time * 1000 + 4500);
    }
}

generateWheel(1); // Call to generate the wheel on page load
generateWheel(2);
generateWheel(2);

updateWheels();

// Locking wheels (DEV TOOLS)
function lockWheel(wheelSvg) {
    let container = wheelSvg.parentNode;
    
    wheelSvg.dataset.locked = true;
    let lock = container.querySelector('.locked');
    lock.classList.remove('hidden');

}

function lockWheels() {
    let wheelContainers = wheelsDiv.querySelectorAll(`[data-wheelid="${currentWheel}"]`);

    for (let i=0; i<wheelContainers.length; i++) {
        let container = wheelContainers[i];

        let wheel = container.querySelector('.wheel');
        wheel.dataset.locked = true;

        let lock = container.querySelector('.locked');
        lock.classList.remove('hidden');
    }
}

function unlockWheels() {
    let wheelContainers = wheelsDiv.querySelectorAll(`[data-wheelid="${currentWheel}"]`);

    for (let i=0; i<wheelContainers.length; i++) {
        let container = wheelContainers[i];

        let wheel = container.querySelector('.wheel');
        wheel.dataset.locked = false;

        let lock = container.querySelector('.locked');
        lock.classList.add('hidden');
    }
}

document.addEventListener('keydown', e => {
    let key = e.key;
    if (key == "1") lockWheels();
    if (key == "2") unlockWheels();
})