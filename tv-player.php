<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TV Player</title>
    <link rel="stylesheet" href="./css/tv.css">

    <script src="./js/cookies.js"></script>
</head>
<body>
    <video id="vidplayer" autoplay muted>
        <source id="vidsource" src="./example-videos/LEGO1.mp4" type="video/mp4">
    </video>

    <div id="data-pass"><?php
            $dir = './example-videos';
            $videos = scandir($dir,1);
            foreach ($videos as $video) {
                if($video == ".." || $video == ".") continue;
                echo "$video ";
            }
    ?></div>

    <div class="additional-events">
        <div class="tv-clock">
            <p id="ClockTime">11:57</p>
        </div>
        <div class="maniek-face">
            <img src="assets/maniek-faces/thinking.gif" alt="">
        </div>
        <div class="bell-schedule">
            <table>
                <tr><th>Lekcja</th><th>godz</th></tr>
             <!--   <tr><td>1</td><td>8:00 - 8:45</td></tr>
                <tr><td>2</td><td>8:55 - 9:40</td></tr>
                <tr><td>3</td><td>9:50 - 10:35</td></tr>
                <tr><td>4</td><td>10:55 - 11:40</td></tr>-->
                <tr><td>5</td><td>11:50 - 12:35</td></tr>
                <tr><td>6</td><td>12:45 - 13:30</td></tr>
                <tr><td>7</td><td>13:40 - 14:25</td></tr>
             <!--   <tr><td>8</td><td>14:35 - 15:20</td></tr>
                <tr><td>9</td><td>15:25 - 16:10</td></tr>-->
            </table>
        </div>
    </div>

    <script>
        let dir = '/example-videos';
        let passed_data = document.getElementById("data-pass").innerHTML;
        let VideosList = passed_data.split(' ');
        VideosList.pop();
        console.log(VideosList);

        let VideoPlayer = document.getElementById("vidplayer");
        let VideoSource = document.getElementById("vidsource");

        VideoPlayer.addEventListener("ended", (event) => {
            let previousSource = VideoSource.src;
            let nextSource;
            do{
                nextSource = `${dir}/${VideosList[Math.floor(Math.random()*(VideosList.length)+0)]}`;
                console.log(`P:${previousSource}`);
                console.log(`N:${nextSource}`); 
            }while(previousSource.includes(nextSource));
            VideoSource.src = "."+nextSource;
            
            VideoPlayer.load();
            VideoPlayer.play();
        });


    </script>
</body>
</html>