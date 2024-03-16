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
    <p id="php-container" style="display:none;">
    <?php
        $db = new mysqli("localhost", "root", "", "baza_pula");

        if($db -> connect_error) {
            die();
        }

        $prizeName_array = array();
        $prizeNumber_array = array();

        $result = $db -> query("SELECT nazwaNagrody, iloscNagrody FROM nagrody_pula");

        while($row = $result -> fetch_assoc()) {
            array_push($prizeName_array, $row['nazwaNagrody']);
            array_push($prizeNumber_array, $row['iloscNagrody']);
        }
        echo $prizeName_array;
        echo $prizeNumber_array;
        ?>
    </p>

    <script src="./js/wheel.js">
        
    </script>
</body>
</html>
