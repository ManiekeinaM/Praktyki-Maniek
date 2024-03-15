<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wheel</title>
    <link rel="stylesheet" href="wheel.css">
</head>
<body>
    <div>
    <svg class="arrow" xmlns="http://www.w3.org/2000/svg" width="160px" height="160px" style="transform: translateY(30px)" viewBox="0 0 24 24" fill="none">
        <path d="M7 10L12 15L17 10 L7 10" stroke="#000000" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" fill="#FFFFFF"/>
    </svg>
    <div id="wheel-container"></div>
    </div>
    <button class="spin" data-wheelid="1" id="spin_button">SPIN</button>
    <p id="result"></p>

    <?php
    $baza = new mysqli("localhost", "root", "", "baza_pula");

    if($baza -> connect_error) {
        die();
    }else { echo "ok"}
    
    ?>

    <script>
        const result = document.getElementById("result");
        const wheelContainer = document.getElementById("wheel-container");

        var wheels = {
            1: {
                prizes: {
                    "Prize1": {weight: 10, color: '#CAB282', darkcolor: '#b99a5a'},
                    "Prize2": {weight: 1, color: '#1434B4', darkcolor: '#112b95'},
                    "Prize3": {weight: 1, color: '#CAB282', darkcolor: '#b99a5a'},
                    "Prize4": {weight: 1, color: '#1434B4', darkcolor: '#112b95'},
                    "Prize5": {weight: 1, color: '#CAB282', darkcolor: '#b99a5a'},
                    "Prize6": {weight: 1, color: '#1434B4', darkcolor: '#112b95'}
                },
                totalWeights: 0, // filled via code later
                totalPrizes: 0,
                debounce: false,
            },
            2: {
                prizes: {
                    "Prize1": {weight: 10, color: 'blue'},
                    "Prize2": {weight: 1, color: 'red'},
                    "Prize3": {weight: 1, color: 'lightgreen'},
                    "Prize4": {weight: 1, color: 'pink'},
                },
                totalWeights: 0, // filled via code later
                totalPrizes: 0,
                debounce: false,
            }
            
        }
        
        // 
        for (const [wheelId, wheelProperties] of Object.entries(wheels)) {  
            
            let totalWeight = 0, totalPrizes = 0;
            for (const [prizeName, prizeValues] of Object.entries(wheelProperties.prizes)) {
                totalPrizes += 1;
                totalWeight += prizeValues.weight;
            }

            // Set the total weights and prizes
            wheels[wheelId].totalWeights = totalWeight;
            wheels[wheelId].totalPrizes = totalPrizes;
        }

        let currentDegree = 0;

        function generateWheel(wheelId) {
            let pickedWheel = wheels[wheelId];

            const numOfSegments = pickedWheel.totalPrizes;
            const segAngle = 360 / numOfSegments;
            let wheelSvg = `<svg id="wheel" xmlns="http://www.w3.org/2000/svg" width="800" height="600">
            <g transform="translate(400,300)">`;

            let i = 0;
            for (const [prizeName, values] of Object.entries(pickedWheel.prizes)) {
                const startAngle = segAngle * i - 90;
                const endAngle = startAngle + segAngle;

                wheelSvg += `<path d="M0,0 L ${Math.cos(startAngle * Math.PI / 180) * 250}, ${Math.sin(startAngle * Math.PI / 180) * 250}
                             A 250,250 0 0,1 ${Math.cos(endAngle * Math.PI / 180) * 250},${Math.sin(endAngle * Math.PI / 180) * 250} Z"
                             fill="${values.color}" stroke-width="8"/>`;

                const innerArcRadius = 240; // Slightly less than the segment radius to simulate the stroke being on the inside
                const startInnerX = Math.cos(startAngle * Math.PI / 180) * innerArcRadius;
                const startInnerY = Math.sin(startAngle * Math.PI / 180) * innerArcRadius;
                const endInnerX = Math.cos(endAngle * Math.PI / 180) * innerArcRadius;
                const endInnerY = Math.sin(endAngle * Math.PI / 180) * innerArcRadius;

                // Add an arc for the inner stroke
                wheelSvg += `<path d="M${startInnerX},${startInnerY} A ${innerArcRadius},${innerArcRadius} 0 0,1 ${endInnerX},${endInnerY}"
                             stroke="${values.darkcolor}" fill="none" stroke-width="16"/>`;   

                // Place text
                const textAngle = startAngle + segAngle / 2;
                const textX = Math.cos(textAngle * Math.PI / 180) * 200;
                const textY = Math.sin(textAngle * Math.PI / 180) * 200;

                wheelSvg += `<text x="${textX}" y="${textY + 8}" font-family="Arial" font-size="20" fill="black" text-anchor="middle" transform="rotate(${textAngle + 90}, ${textX}, ${textY})">${prizeName}</text>`;
                wheelSvg += `<circle cx="0" cy="0" r="250" fill="none" stroke="#9B8C64" stroke-width="8"/>`;
                wheelSvg += `<circle cx="0" cy="0" r="25" fill="#9B8C64" stroke="#9B8C64" stroke-width="6"/>`;
                i++;
            }

            wheelSvg += `</g></svg>`;
            wheelContainer.innerHTML = wheelSvg;
        }

        function randomByWeight(wheelId) {

            let pickedWheel = wheels[wheelId];
            let totalWeights = pickedWheel.totalWeights;
            let totalPrizes = pickedWheel.totalPrizes;

            // Random a number between [1, total]
            const random = Math.ceil(Math.random() * totalWeights); // [1,total]

            // Seek cursor to find which area the random is in
            // for (let i = 0; i < totalPrizes; i++) {
            //     cursor += weights[i];
            //     if (cursor >= random) {
            //         spin(i)
            //         console.log(i, values[i]);
            //         result.innerHTML = values[i];
            //         return values[i];
            //     }
            // }

            //
            let i = 0, cursor = 0;
            for (const [prizeName, values] of Object.entries(pickedWheel.prizes)) {
                cursor += values.weight;
                if (cursor >= random) {
                    spin(wheelId, i, prizeName);
                    
                    result.innerHTML = prizeName;
                    return prizeName;
                }

                i++;
            }

            return "never go here";
        }

        const spinButton = document.querySelector(".spin");
        spinButton.addEventListener("click", e => {
            let wheelId = spinButton.dataset.wheelid;
            console.log(wheelId);
            if (wheels[wheelId].debounce) return;

            wheels[wheelId].debounce = true;
            randomByWeight(wheelId);
        });

        function spin(wheelId, winnerIndex, prizeName) {
            const totalSpins = 3; // Determines how many times the wheel will spin

            let pickedWheel = wheels[wheelId];
            let totalWeights = pickedWheel.totalWeights;
            let totalPrizes = pickedWheel.totalPrizes;

            const segments = totalPrizes;
            const segmentDegrees = 360 / segments;

            // Calculate the degree to stop on the winning segment
            // Adjust by half segment to center and add total spins
            const stopDegree = (360 * totalSpins) + ((segments-winnerIndex-1) * segmentDegrees) + (segmentDegrees / 2);

            // Ensure smooth transition by adjusting for the current rotation
            const finalDegree = stopDegree + (360 - currentDegree % 360);

            // Update currentDegree to keep track of the wheel's state
            currentDegree += finalDegree;

            // Apply the spin animation
            const wheel = document.getElementById('wheel');
            wheel.style.transition = 'transform 4s cubic-bezier(0.33, 1, 0.68, 1)'; // Smooth deceleration
            wheel.style.transform = `rotate(${currentDegree}deg)`;

            // Display the winner
            result.innerHTML = `Winner is: ${prizeName}`;

            // Reset the transition after the animation to allow for future spins
            setTimeout(() => {
                wheel.style.transition = '';
                pickedWheel.debounce = false;
            }, 4000); // Matches the duration of the animation
        }

        generateWheel(1); // Call to generate the wheel on page load
    </script>
</body>
</html>
