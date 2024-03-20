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
            { name: "🗝️🎖️", desc: "Brelok/Przypinka", weight: 250, visualWeight: 3, amount: php_amounts[0], color: '#CAB282', darkcolor: '#b99a5a' },
            { name: "📅🤐", desc: "Voucher: Dzień bez pytania", weight: 60, visualWeight: 1, amount: php_amounts[1], color: '#1434B4', darkcolor: '#112b95' },
            // { name: "🎫🏖️", desc: "Voucher: Wycieczka integracyjna gratis", weight: 0, visualWeight: 1, amount: php_amounts[2], color: '#CAB282', darkcolor: '#b99a5a' },
            // { name: "🎫💻", desc: "Voucher: Sprzęt elektroniczny 50zł", weight: 0, visualWeight: 1, amount: php_amounts[3], color: '#1434B4', darkcolor: '#112b95' },
            { name: "🎫🛒", desc: "Voucher: Sklepik 5zł", weight: 10, visualWeight: 1, amount: php_amounts[4], color: '#CAB282', darkcolor: '#b99a5a' },
            { name: "🎟️🛒", desc: "Voucher: Sklepik 10zł", weight: 5, visualWeight: 1, amount: php_amounts[5], color: '#1434B4', darkcolor: '#112b95' },
        ],

        totalWeights: 0, totalVisualWeights: 0,
        // totalPrizes: 0,
        actualWheels: [],
    },
    2: {
        prizes: [
            { name: "🗝️🎖️", desc: "Brelok/Przypinka", weight: 100, visualWeight: 2, amount: php_amounts[0], color: '#CAB282', darkcolor: '#b99a5a' },
            { name: "📅🤐", desc: "Voucher: Dzień bez pytania", weight: 100, visualWeight: 2, amount: php_amounts[1], color: '#1434B4', darkcolor: '#112b95' },
            { name: "🎫🏖️", desc: "Voucher: Wycieczka integracyjna gratis", weight: 10, visualWeight: 1, amount: php_amounts[2], color: '#CAB282', darkcolor: '#b99a5a' },
            { name: "🎫💻", desc: "Voucher: Sprzęt elektroniczny 50zł", weight: 20, visualWeight: 1, amount: php_amounts[3], color: '#1434B4', darkcolor: '#112b95' },
            { name: "🎫🛒", desc: "Voucher: Sklepik 5zł", weight: 40, visualWeight: 2, amount: php_amounts[4], color: '#CAB282', darkcolor: '#b99a5a' },
            { name: "🎟️🛒", desc: "Voucher: Sklepik 10zł", weight: 40, visualWeight: 2, amount: php_amounts[5], color: '#1434B4', darkcolor: '#112b95' },
        ],
        totalWeights: 0, totalVisualWeights: 0,
        // totalPrizes: 0,
        actualWheels: [],
    }
}

// console.log("Koło1", JSON.parse(JSON.stringify(wheels[1])));
// console.log("Koło2", JSON.parse(JSON.stringify(wheels[2])));

wheels[1].prizes = wheels[1].prizes.filter(prize => prize.amount != 0);
wheels[2].prizes = wheels[2].prizes.filter(prize => prize.amount != 0);
console.log(wheels);

let currentWheel = 1;

const categories = document.querySelector(".categories");
const categoryButtons = categories.querySelectorAll("button");
categoryButtons.forEach(button => {
    let id = button.dataset.wheelid;
    button.addEventListener("click", e => {
        e.preventDefault();

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
    locked.classList.add("hidden");
    container.appendChild(locked);


    let wheelSvg = `<svg class="wheel" data-currentdegree="270" data-debounce="false" xmlns="http://www.w3.org/2000/svg" width="600" height="600" style="transform: rotate(${pickedWheel.currentDegree}deg)">
            <g transform="translate(300,300)">`;

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
        console.log(svg.dataset.debounce);
        if (svg.dataset.debounce == "true") return;

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
    console.log(pickedWheel.prizes);
    for (const [i, values] of pickedWheel.prizes.entries()) {
        let prizeName = values.name;

        cursor += values.weight;
        // console.log(wheels);
        console.log(cursor, random);
        if (cursor >= random) {

            values.amount--;
            //php amount decreasing
            // console.log(i);
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

            spin(wheelId, i, actualWheel);

            wheels[1].prizes = wheels[1].prizes.filter(prize => prize.amount != 0);
            wheels[2].prizes = wheels[2].prizes.filter(prize => prize.amount != 0); 
            // result.innerHTML = prizeName;
            return { prizeName };
        }
    }


    return "never go here";
}

let winHistory = [];
function spin(wheelId, prizeId, actualWheel) {
    const totalSpins = 9; // Determines how many times the wheel will spin

    let pickedWheel = wheels[wheelId];
    // console.log(pickedWheel.prizes);
    let prizeName = pickedWheel.prizes[prizeId].name;

    let totalWeights = pickedWheel.totalVisualWeights;

    let currentDegree = parseFloat(actualWheel.dataset.currentdegree);
    // console.log(currentDegree);

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
    // result.innerHTML = `Winner is: ${prizeName}`;

    // Display the last 5 results
    
    let newResult = `NOWE: `;
    for (let i=winHistory.length-1; i>winHistory.length-6 && i>=0; i--) {

        newResult += `${winHistory[i]} <br>`;
        
        
    }
    

    // console.log(wheels[wheelId].prizes);
    let winScreen = wheel.parentNode.querySelector('.winResult');
    
    setTimeout(() => {
        wheel.style.transition = '';
        result.innerHTML = newResult;
    
        winScreen.classList.remove("hidden");
        winScreen.innerHTML = `${prizeValues.name} - ${prizeValues.desc}`;
        winSound.play();
        initConfetti();
        winScreen.style.animation = `showPrize 8s`;
        setTimeout(() => {
            winScreen.classList.add("hidden");
            wheel.dataset.debounce = "false";
        }, 8000)
    }, time * 1000); // Matches the duration of the animation
}

generateWheel(1); // Call to generate the wheel on page load
generateWheel(2);
generateWheel(2);

updateWheels();

//Confetti

canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
cx = ctx.canvas.width / 2;
cy = ctx.canvas.height /2;

let confetti = [];
const confettiCount = 300;
const gravity = 0.5;
const terminalVelocity = 7.5;
const drag = 1;
const colors = [
    { front: 'red', back: 'darkred' },
    { front: 'green', back: 'darkgreen' },
    { front: 'blue', back: 'darkblue' },
    { front: 'yellow', back: 'darkyellow' },
    { front: 'orange', back: 'darkorange' },
    { front: 'pink', back: 'darkpink' },
    { front: 'purple', back: 'darkpurple' },
    { front: 'turquoise', back: 'darkturquoise' }];
        
        //-----------Functions--------------
resizeCanvas = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  cx = ctx.canvas.width / 2;
  cy = ctx.canvas.height / 2;
};

randomRange = (min, max) => Math.random() * (max - min) + min;

initConfetti = () => {
  for (let i = 0; i < confettiCount; i++) {
    confetti.push({
      color: colors[Math.floor(randomRange(0, colors.length))],
      dimensions: {
        x: randomRange(10, 20),
        y: randomRange(10, 30) },

      position: {
        x: randomRange(0, canvas.width),
        y: canvas.height - 1 },

      rotation: randomRange(0, 2 * Math.PI),
      scale: {
        x: 1,
        y: 1},

      velocity: {
        x: randomRange(-25, 25),
        y: randomRange(0, -50) } });


  }
};

//---------Render-----------
render = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  confetti.forEach((confetto, index) => {
    let width = confetto.dimensions.x * confetto.scale.x/2;
    let height = confetto.dimensions.y * confetto.scale.y/2;

    // Move canvas to position and rotate
    ctx.translate(confetto.position.x, confetto.position.y);
    ctx.rotate(confetto.rotation);

    // Apply forces to velocity
    confetto.velocity.x -= confetto.velocity.x * drag;
    confetto.velocity.y = Math.min(confetto.velocity.y + gravity, terminalVelocity);
    confetto.velocity.x += Math.random() > 0.5 ? Math.random() : -Math.random();

    // Set position
    confetto.position.x += confetto.velocity.x;
    confetto.position.y += confetto.velocity.y;

    // Delete confetti when out of frame
    if (confetto.position.y >= canvas.height) confetti.splice(index, 1);

    // Loop confetto x position
    if (confetto.position.x > canvas.width) confetto.position.x = 0;
    if (confetto.position.x < 0) confetto.position.x = canvas.width;

    // Spin confetto by scaling y
    confetto.scale.y = Math.cos(confetto.position.y * 0.1);
    ctx.fillStyle = confetto.scale.y > 0 ? confetto.color.front : confetto.color.back;

    // Draw confetti
    ctx.fillRect(-width / 2, -height / 2, width, height);

    // Reset transform matrix
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  });

  window.requestAnimationFrame(render);
};

//---------Execution--------
//initConfetti();
render();

//----------Resize----------
window.addEventListener('resize', function () {
  resizeCanvas();
});

//------------Click------------
window.addEventListener('click', function () {
  //initConfetti();
});
