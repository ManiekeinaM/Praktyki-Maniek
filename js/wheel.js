const result = document.querySelector(".result");
const wheelContainer = document.querySelector(".wheel-container");

var wheels = {
    1: {
        prizes: [
            { name: "Prize1", weight: 3, color: '#CAB282', darkcolor: '#b99a5a' },
            { name: "Prize2", weight: 1, color: '#1434B4', darkcolor: '#112b95' },
            { name: "Prize3", weight: 1, color: '#CAB282', darkcolor: '#b99a5a' },
            { name: "Prize4", weight: 1, color: '#1434B4', darkcolor: '#112b95' },
            { name: "Prize5", weight: 1, color: '#CAB282', darkcolor: '#b99a5a' },
            { name: "Prize6", weight: 1, color: '#1434B4', darkcolor: '#112b95' },
        ],
        totalWeights: 0, // filled via code later
        totalPrizes: 0,
        defaultDegree: 0,
        currentDegree: 0,
        actualWheel: null,
        debounce: false,
    },
    2: {
        prizes: [
            { name: "Prize1", weight: 10, color: 'blue' },
            { name: "Prize2", weight: 1, color: 'red' },
            { name: "Prize3", weight: 1, color: 'lightgreen' },
            { name: "Prize4", weight: 1, color: 'pink' },
        ],
        totalWeights: 0, // filled via code later
        totalPrizes: 0,
        defaultDegree: 0,
        currentDegree: 0,
        actualWheel: null,
        debounce: false,
    }

}


// Set the necessary properties for each wheel
for (const [wheelId, wheelProperties] of Object.entries(wheels)) {

    let totalWeight = 0, totalPrizes = 0;
    for (const [i, prizeValues] of wheelProperties.prizes.entries()) {
        totalPrizes += 1;
        totalWeight += prizeValues.weight;
    }

    // Set the total weights and prizes
    wheels[wheelId].totalWeights = totalWeight;
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

    let totalWeight = pickedWheel.totalWeights;
    let totalPrizes = pickedWheel.totalPrizes;


    let wheelSvg = `<svg id="wheel" xmlns="http://www.w3.org/2000/svg" width="800" height="600" style="transform: rotate(${pickedWheel.currentDegree}deg)">
            <g transform="translate(400,300)">`;

    let weightsUsed = 0;
    for (const [i, values] of pickedWheel.prizes.entries()) {
        // SEGMENT
        let prizeName = values.name;

        let weight = values.weight;
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
}

function randomByWeight(wheelId) {

    let pickedWheel = wheels[wheelId];
    let totalWeights = pickedWheel.totalWeights;

    // Random a number between [1, total]
    const random = Math.ceil(Math.random() * totalWeights); // [1,total]

    //C ursor random thing idk
    let cursor = 0;
    for (const [i, values] of pickedWheel.prizes.entries()) {
        let prizeName = values.name;

        cursor += values.weight;
        if (cursor >= random) {

            let startDegree = (random / totalWeights) * 360 - 90;
            let endDegree = startDegree + (values.weight / totalWeights) * 360;
            console.log(random, startDegree, endDegree);

            spin(wheelId, prizeName, startDegree, endDegree);

            result.innerHTML = prizeName;
            return { prizeName, startDegree, endDegree };
        }
    }

    return "never go here";
}

const spinButton = document.querySelector(".spin");
spinButton.addEventListener("click", e => {
    let wheelId = spinButton.dataset.wheelid;
    // console.log(wheelId);
    if (wheels[wheelId].debounce) return;

    wheels[wheelId].debounce = true;
    randomByWeight(wheelId);
});

function spin(wheelId, prizeName, startDegree, endDegree) {
    const totalSpins = 9; // Determines how many times the wheel will spin

    let pickedWheel = wheels[wheelId];

    let currentDegree = pickedWheel.currentDegree;
    let defaultDegree = pickedWheel.defaultDegree;

    // Calculate the degree to stop on the winning segment
    let realDegree = (currentDegree) % 360 // get the real degree without the 360s
    let inbetween = (startDegree + endDegree) / 2; // get the middle of the target segment

    let generalTarget = defaultDegree - inbetween;
    let change = generalTarget - realDegree;

    console.log(`Real: ${realDegree} General: ${generalTarget} Change: ${change} Inbetween: ${inbetween}`);

    // Ensure smooth transition by adjusting for the current rotation
    const finalDegree = realDegree + change + (360 * totalSpins);


    // Update currentDegree to keep track of the wheel's state
    pickedWheel.currentDegree += finalDegree + (360 - realDegree);

    console.log(`What I have: ${pickedWheel.currentDegree % 360} What I want: ${finalDegree % 360}`);

    // Apply the spin animation
    const wheel = document.getElementById('wheel');

    let time = Math.max(4, totalSpins / 1.5);
    wheel.style.transition = `transform ${time}s cubic-bezier(0.33, 1, 0.68, 1)`; // Smooth deceleration
    wheel.style.transform = `rotate(${pickedWheel.currentDegree}deg)`;

    // Display the winner
    result.innerHTML = `Winner is: ${prizeName}`;

    // Reset the transition after the animation to allow for future spins
    setTimeout(() => {
        wheel.style.transition = '';
        pickedWheel.debounce = false;
    }, time * 1000); // Matches the duration of the animation
}

generateWheel(1); // Call to generate the wheel on page load