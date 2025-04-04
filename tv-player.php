<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Maniek - TV Player</title>
    <link rel="stylesheet" href="./css/tv.css">

    <script src="./js/cookies.js"></script>
</head>
<body>
    <div class="upper-controls">
        <!-- Video container -->
        <video id="vidplayer" autoplay muted>
            <source id="vidsource" src="./example-videos/LEGO1.mp4" type="video/mp4">
        </video>

        <!-- Bell schedule with highlight -->
        
        <div class="bell-schedule">
                <h4>lekcja / godz</h4>
                <span id="0">7:05 - 7:50</span>
                <span id="1">8:00 - 8:45</span>
                <span id="2">8:55 - 9:40</span>
                <span id="3">9:50 - 10:35</span>
                <span id="4">10:55 - 11:40</span>
                <span id="5">11:50 - 12:35</span>
                <span id="6">12:45 - 13:30</span>
                <span id="7">13:40 - 14:25</span>
                <span id="8">14:35 - 15:20</span>
                <span id="9">15:30 - 16:15</span>
            </table>
        </div>
 
    </div>

    <!-- Timer and clock -->
    <div class="bottom-controls">
        <?php if (!isset($_COOKIE["isDniOtwarte"]) || ( isset($_COOKIE["isDniOtwarte"]) && $_COOKIE["isDniOtwarte"] != true) ): ?>
        <div class="break">
            <p id="timer">Koniec przerwy za: <span class="light-green">10MIN</span></p>
        </div>
        <?php endif; ?>

        <div id="maniek-text-container">
            <div id="maniek-text-container-img-container">
                <img class="maniek-face" src="./assets/maniek-faces/wink-centered.gif">
            </div>
            <div id="maniek-text-container-text-container" class="big">
                *
            </div>
        </div>

        <div class="timer">
            <p id="clock">09:46</p>
        </div>
    </div>

    <!-- Videos from file transfer -->
    <div id="data-pass"><?php
            $dir = './example-videos';
            $videos = scandir($dir,1);
            foreach ($videos as $video) {
                if($video == ".." || $video == ".") continue;
                echo "$video ";
            }
    ?></div>

    <script src="js/tv.js">
    </script>
</body>
</html>