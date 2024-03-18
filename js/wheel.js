const result = document.querySelector(".result");
const wheelContainer = document.querySelector(".wheel-container");

let php_data_text = document.getElementById("php-container").innerHTML;
let php_amounts = php_data_text.split("_");
php_amounts.pop();

var wheels = {
    1: {
        prizes: [
            { name: "🗝️🎖️", desc: "Brelok/Przypinka", weight: 500, visualWeight: 2, amount: php_amounts[0], color: '#CAB282', darkcolor: '#b99a5a' },
            { name: "📅🤐", desc: "Voucher: Dzień bez pytania", weight: 200, visualWeight: 1, amount: php_amounts[1], color: '#1434B4', darkcolor: '#112b95' },
            { name: "🎫🏖️", desc: "Voucher: Wycieczka integracyjna gratis", weight: 0, visualWeight: 1, amount: php_amounts[2], color: '#CAB282', darkcolor: '#b99a5a' },
            { name: "🎫💻", desc: "Voucher: Sprzęt elektroniczny 50zł", weight: 0, visualWeight: 1, amount: php_amounts[3], color: '#1434B4', darkcolor: '#112b95' },
            { name: "🎫🛒", desc: "Voucher: Sklepik 5zł", weight: 25, visualWeight: 1, amount: php_amounts[4], color: '#CAB282', darkcolor: '#b99a5a' },
            { name: "🎟️🛒", desc: "Voucher: Sklepik 10zł", weight: 50, visualWeight: 1, amount: php_amounts[5], color: '#1434B4', darkcolor: '#112b95' },
        ],
        totalWeights: 0, totalVisualWeights: 0,
        totalPrizes: 0,
        defaultDegree: 0,
        currentDegree: 0,
        actualWheel: null,
        debounce: false,
    },
    2: {
        prizes: [
            { name: "🗝️🎖️", weight: 200, visualWeight: 1, amount: php_amounts[0], color: '#CAB282', darkcolor: '#b99a5a' },
            { name: "📅🤐", weight: 100, visualWeight: 1, amount: php_amounts[1], color: '#1434B4', darkcolor: '#112b95' },
            { name: "🎫🏖️", weight: 50, visualWeight: 1, amount: php_amounts[2], color: '#CAB282', darkcolor: '#b99a5a' },
            { name: "🎫💻", weight: 100, visualWeight: 1, amount: php_amounts[3], color: '#1434B4', darkcolor: '#112b95' },
            { name: "🎫🛒", weight: 350, visualWeight: 1, amount: php_amounts[4], color: '#CAB282', darkcolor: '#b99a5a' },
            { name: "🎟️🛒", weight: 250, visualWeight: 1, amount: php_amounts[5], color: '#1434B4', darkcolor: '#112b95' },
        ],
        totalWeights: 0, totalVisualWeights: 0,
        totalPrizes: 0,
        defaultDegree: 0,
        currentDegree: 0,
        actualWheel: null,
        debounce: false,
    }
}

console.log("Koło1", JSON.parse(JSON.stringify(wheels[1])));
console.log("Koło2", JSON.parse(JSON.stringify(wheels[2])));

wheels[1].prizes = wheels[1].prizes.filter(prize => prize.amount != 0);
wheels[2].prizes = wheels[1].prizes.filter(prize => prize.amount != 0);
console.log(wheels);


// Set the necessary properties for each wheel
for (const [wheelId, wheelProperties] of Object.entries(wheels)) {

    let totalWeight = 0, totalVisualWeight = 0, totalPrizes = 0;
    for (const [i, prizeValues] of wheelProperties.prizes.entries()) {
        totalPrizes += 1;
        totalWeight += prizeValues.weight;
        totalVisualWeight += prizeValues.visualWeight;
    }

    // Set the total weights and prizes
    wheels[wheelId].totalWeights = totalWeight;
    wheels[wheelId].totalVisualWeights = totalVisualWeight;
    wheels[wheelId].totalPrizes = totalPrizes;

    // Calculate the starting current degree of the wheel, to be in the middle of the first segment
    let segmentDegree = (360 / totalPrizes);
    let startDegree = segmentDegree * (totalPrizes - 2);

    wheels[wheelId].defaultDegree = startDegree;
    wheels[wheelId].currentDegree = 270//startDegree + segmentDegree / 2; // Start in the edge of the first segment
}

let currentDegree = 0;

function generateWheel(wheelId) {
    let pickedWheel = wheels[wheelId];

    let totalWeight = pickedWheel.totalVisualWeights;
    let totalPrizes = pickedWheel.totalPrizes;


    let wheelSvg = `<svg id="wheel" xmlns="http://www.w3.org/2000/svg" width="800" height="600" style="transform: rotate(${pickedWheel.currentDegree}deg)">
            <g transform="translate(400,300)">`;

    let weightsUsed = 0;
    for (const [i, values] of pickedWheel.prizes.entries()) {
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
    wheelContainer.innerHTML += wheelSvg;

    return wheelContainer;
}

function randomByWeight(wheelId) {

    console.log("Koło", wheels[wheelId]);
    let pickedWheel = wheels[wheelId];
    let totalWeights = pickedWheel.totalWeights;
    console.log("Wagi", totalWeights);
    // Random a number between [1, total]
    const random = Math.ceil(Math.random() * totalWeights); // [1,total]
    // Prize selecting logic
    let cursor = 0;
    for (const [i, values] of pickedWheel.prizes.entries()) {
        let prizeName = values.name;

        cursor += values.weight;
        console.log(wheels);
        if (cursor >= random) {

            values.amount--;
            //php amount decreasing
            console.log(i);
            let decreasedAmount = {id: i, amount:values.amount};

            fetch('decreaseAmount.php', {
                method: 'POST',
                body: JSON.stringify(decreasedAmount),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            .then(response => response.text())
            .then(data => console.log(data))
            .catch(error => console.log('Error:', error));

            let startDegree = (random / totalWeights) * 360 - 90;
            let endDegree = startDegree + (values.weight / totalWeights) * 360;
            // console.log(random, startDegree, endDegree);

            spin(wheelId, i, startDegree, endDegree);
            wheels[1].prizes = wheels[1].prizes.filter(prize => prize.amount != 0);
            wheels[2].prizes = wheels[1].prizes.filter(prize => prize.amount != 0); 
            result.innerHTML = prizeName;
            return { prizeName, startDegree, endDegree };
        }
    }

    return "never go here";
}

const spinButton1 = document.querySelector(".spin1");
console.log(spinButton1);
spinButton1.addEventListener("click", e => {
    let wheelId = spinButton1.dataset.wheelid;
    console.log(wheelId);
    if (wheels[wheelId].debounce) return;

    wheels[wheelId].debounce = true;
    randomByWeight(wheelId);
});

const spinButton2 = document.querySelector(".spin2");
console.log(spinButton2);
spinButton2.addEventListener("click", e => {
    let wheelId = spinButton2.dataset.wheelid;
    console.log(wheelId);
    if (wheels[wheelId].debounce) return;

    wheels[wheelId].debounce = true;
    randomByWeight(wheelId);
});

function spin(wheelId, prizeId) {
    const totalSpins = 9; // Determines how many times the wheel will spin

    let pickedWheel = wheels[wheelId];
    let prizeName = pickedWheel.prizes[prizeId].name;

    let totalWeights = pickedWheel.totalVisualWeights;

    let currentDegree = pickedWheel.currentDegree;

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

    pickedWheel.currentDegree += finalDegree + (360 - realDegree);

    // Apply the spin animation
    const wheel = document.getElementById('wheel');

    let time = Math.max(4, totalSpins / 1.5);
    wheel.style.transition = `transform ${time}s cubic-bezier(0.33, 1, 0.68, 1)`; // Smooth deceleration
    wheel.style.transform = `rotate(${pickedWheel.currentDegree}deg)`;

    result.innerHTML = `Winner is: ${prizeName}`;

    setTimeout(() => {
        wheel.style.transition = '';
        pickedWheel.debounce = false;
    }, time * 1000); // Matches the duration of the animation
}

generateWheel(1); // Call to generate the wheel on page load