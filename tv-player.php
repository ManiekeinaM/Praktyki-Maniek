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
        <div class="break">
            <p id="timer">Koniec przerwy za: <span class="light-green">10MIN</span></p>
        </div>
        <img class="maniek-face" src="./assets/maniek-faces/wink-centered.gif">
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

    <script>
        //Retrieving videos
        let dir = '/example-videos';
        let passed_data = document.getElementById("data-pass").innerHTML;
        let VideosList = passed_data.split(' ');
        VideosList.pop();
        console.log(VideosList);

        //Videos changer
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

            //Clock handler
            const currentTime = new Date();
            let currentHour = currentTime.getHours();
            let currentMinute = currentTime.getMinutes();

            let displayHour = (currentHour < 10) ? `0${currentHour}` : currentHour;
            let displayMinute = (currentMinute < 10) ? `0${currentMinute}` : currentMinute;
            clock.innerHTML = `${displayHour}:${displayMinute}`;

            setTimeout(startTime, 1000);
            
            let totalMinutes = currentHour * 60 + currentMinute;
            let lessonStartTime = 7 * 60 + 5;
            let lessonEndTime = 16 * 60 + 15;

            if(totalMinutes < lessonStartTime || totalMinutes >= lessonEndTime){
                timer.innerHTML = "<span class='light-green'>BRAK LEKCJI</span>";
                return;
            }

            let currentLesson = lessonCheck(currentHour, currentMinute);
            //Bell schedule highlight
            document.getElementById(currentLesson).classList.add("light-green");
            if(currentLesson != 0){
            if(document.getElementById(currentLesson-1).classList.contains("light-green"));
            document.getElementById(currentLesson-1).classList.remove("light-green");
            } 
            //Remaining time counter, changes in lessonCheck
            timer.innerHTML = timeLeft;  
        }

        //Function to estimate current lesson and change time left on timer
        function lessonCheck(currentHour, currentMinute) {
            //What it does: 
            //- looks for current lesson based on current time
            //- it takes advantage of the fact that each lesson compared to previous ends 5 minutes sooner, only if we look at the minutes. 
            //- It's worth mentioning that longer break makes the lesson end 5 minutes later than other, which forces checking if lesson == 3 in some places
            //- vHour and vMinute store closest lesson ending compared to currrent time
            //- rest is just simple math

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
                    if(currentLesson == 3) timeLeft+=10;
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

                //Skiping to next lesson
                if(currentLesson!=3){
                    vMinute-=5;
                    vHour++;
                }else {
                    vMinute+=5;
                    vHour++;
                }
                currentLesson++;
            }while(true);
        }

        document.querySelectorAll('.bell-schedule > span').forEach(lesson => {
            lesson.innerText = `${lesson.id} / ${lesson.innerText}`;
        })
        
    </script>
</body>
</html>