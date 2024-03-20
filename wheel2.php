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
    <audio id="win_sound">
        <source src="prizeWon.mp3" type="audio/mpeg">
    </audio>

    <div class="categories">
        <button data-wheelid="1">Koło Standardowe (15+ Bingo)</button>
        <button data-wheelid="2" class="premium">Koło Premium (2x) (25 Bingo)</button>
    </div>

    <div class="wheel-legend">
        <p><span class="legend-text">Legenda</span></p>
    </div>

    <div class="wheel-history">
        <p><span class="history-text">Historia losów</span></p>
        <p class="result"></p>
    </div>

    <div class="wheels">

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
