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
    <div class="upper-controls">
        <video id="vidplayer" autoplay muted>
            <source id="vidsource" src="./example-videos/LEGO1.mp4" type="video/mp4">
        </video>
        <div class="bell-schedule">
            <table>
                <tr><th>Lekcja godz</th></tr>
                <tr><td><span id="0">7:05 - 7:50</span></td></tr>
                <tr><td><span id="1">8:00 - 8:45</span></td></tr>
                <tr><td><span id="2">8:55 - 9:40</span></td></tr>
                <tr><td><span id="3">9:50 - 10:35</span></td></tr>
                <tr><td><span id="4">10:55 - 11:40</span></td></tr>
                <tr><td><span id="5">11:50 - 12:35</span></td></tr>
                <tr><td><span id="6">12:45 - 13:30</span></td></tr>
                <tr><td><span id="7">13:40 - 14:25</span></td></tr>
                <tr><td><span id="8">14:35 - 15:20</span></td></tr>
                <tr><td><span id="9">15:30 - 16:15</span></td></tr>
            </table>
        </div>
    </div>

    <div class="bottom-controls">
        <div class="break">
            <p id="timer">Koniec przerwy za: <span class="light-green">10MIN</span></p>
        </div>
        <div class="timer">
            <p id="clock">09:46</p>
        </div>  
    </div>

    <div id="data-pass"><?php
            $dir = './example-videos';
            $videos = scandir($dir,1);
            foreach ($videos as $video) {
                if($video == ".." || $video == ".") continue;
                echo "$video ";
            }
    ?></div>

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

        const clock = document.getElementById("clock");
        const timer = document.getElementById("timer");
        let timeLeft;

        startTime();

        function startTime() {
            const currentTime = new Date();
            let currentHour = currentTime.getHours();
            let currentMinute = currentTime.getMinutes();

            if(currentHour < 10) currentHour = `0${currentHour}`;
            if(currentMinute < 10) currentMinute = `0${currentMinute}`;
            clock.innerHTML = `${currentHour}:${currentMinute}`;

            //Podkreślenie obecnej lekcji
            
            document.getElementById(lessonCheck(currentHour, currentMinute)).classList.add("light-green");
            if(document.getElementById(lessonCheck(currentHour, currentMinute)-1).classList.contains("light-green"));
            document.getElementById(lessonCheck(currentHour, currentMinute)-1).classList.remove("light-green");
            
            timer.innerHTML = timeLeft;
            setTimeout(startTime, 1000);
        }

        function lessonCheck(currentHour, currentMinute) {
            let currentLesson = 0;
            let vHour = 7;
            let vMinute = 50;
            do{
                if(currentHour == vHour && currentMinute<vMinute){
                    timeLeft = vMinute-currentMinute;
                    if(timeLeft < 0) timeLeft+=60;
                    timeLeft = `Koniec lekcji za: <span class="light-green"><span class="big">${timeLeft}</span>min</span>`;
                    return currentLesson;
                }else if(currentHour == vHour) {
                    timeLeft = vMinute+10;
                    if(currentLesson == 3) timeleft+=10;
                    timeLeft = timeLeft-currentMinute;
                    if(timeLeft<=0) {
                        timeLeft = vMinute-5-currentMinute;
                        console.log(timeLeft);
                        if(timeLeft < 0) timeLeft+=60;
                        timeLeft = `Koniec lekcji za: <span class="light-green"><span class="big">${timeLeft}</span>min</span>`;
                    }else{
                        timeLeft = `Koniec przerwy za: <span class="light-green"><span class="big">${timeLeft}</span>min</span>`;
                    }
                    return ++currentLesson;
                }

                if(currentLesson!=3){
                    vMinute-=5;
                    vHour++;
                }else {
                    vMinute+=5;
                    vHour++;
                }
                breakFinished = false;
                currentLesson++;
            }while(true)
        }
        
    </script>
</body>
</html>