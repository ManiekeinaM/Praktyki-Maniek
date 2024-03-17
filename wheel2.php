<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wheel</title>
    <link rel="stylesheet" href="./css/all.css">
    <link rel="stylesheet" href="./css/wheel.css">
</head>
<body>

    <div class="wheel-legend">
        <p><span class="legend-text">Legenda</span></p>
        <p>🗝️🎖️ - Brelok/przypinka</p>
        <p>📅🤐 - Voucher na dzień bez pytania</p>
        <p>🎫🏖️- Voucher na wycieczkę za free</p>
        <p>🎫💻- Voucher na sprzęt elektroniczny</p>
        <p>🎫🛒- Voucher do sklepiku za 10zł</p>
        <p>🎟️🛒- Voucher do sklepiku za 5zł</p>
    </div>

    <div class="wheels">
        <!-- <svg class="arrow" xmlns="http://www.w3.org/2000/svg" width="160px" height="160px" style="transform: translateY(30px)" viewBox="0 0 24 24" fill="none">
            <path d="M7 10L12 15L17 10 L7 10" stroke="#0e247c" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" fill="#1434B4"/>
        </svg> -->

        <div class="wheel-container">
            <img src="./assets/arrowDown.png" alt="v" class="arrow">
            <img src="./assets/locked3.png" alt="" class="locked hidden">
        </div>
    </div>

    <div class="spin-holder">
    <button class="spin1" data-wheelid="1" id="spin_button">SPIN ZA 15</button>
    <button class="spin2" data-wheelid="2" id="spin_button">SPIN ZA WSZYSTKO</button>
    </div>
    
    <p class="result"></p>

    <!-- PHP -->
    <p id="php-container" style="display:none;">
    <?php
        $db = new mysqli("localhost", "root", "", "baza_pula");

        if($db -> connect_error) {
            die();
        }

        $prizeAmount_array = [];

        $result = $db -> query("SELECT iloscNagrody FROM nagrody_pula");

        while($row = $result -> fetch_assoc()) {
            array_push($prizeAmount_array, $row['iloscNagrody']);
        }
        foreach($prizeAmount_array as $prizeAmount) {
            echo $prizeAmount.'_';
        }
    ?>
    </p>

    <!-- Navigation button container / zakładki -->
    <div class="navigation-container">
        <div class="button" data-tab="index.html">
            <!-- Mapa -->
            <img src="./assets/locationPin.png" alt="mapa">
        </div> 

        <div class="button" data-tab="info.html">
            <!-- Info i historia szkoły -->
            <img src="./assets/info.png" alt="mapa">
        </div>

        <div class="button selected" data-tab="wheel2.php">
            <!-- Koło fortuny -->
            <img src="./assets/wheel.png" alt="">
            <img src="./assets/sparkle.png" alt="" class="decoration">
        </div>
    </div>

    <script src="./js/wheel.js"></script>
    <script src="./js/navigation.js"></script>
</body>
</html>
