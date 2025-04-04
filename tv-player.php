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

    <script>
        // Maniek div where maniek text will appear 
        const maniekTextContainer = document.querySelector("#maniek-text-container");
        const maniekTextContainerTextContainer = maniekTextContainer.querySelector("#maniek-text-container-text-container");
        const maniekTextConatinerImg = maniekTextContainer.querySelector('.maniek-face');

        //Retrieving videos
        const dir = '/example-videos';
        const passed_data = document.getElementById("data-pass").innerHTML;
        let videosList = passed_data.split(' ');
        videosList.pop();

        //Videos changer
        const videoPlayer = document.getElementById("vidplayer");
        // videoPlayer.playbackRate = 16;
        const videoSource = document.getElementById("vidsource");

        videoPlayer.addEventListener("ended", (event) => {
            let previousSource = videoSource.src;
            let nextSource;
            do{
                nextSource = `${dir}/${videosList[Math.floor(Math.random() * videosList.length)]}`;
            } while(previousSource.includes(nextSource));
            videoSource.src = "."+nextSource;
            
            videoPlayer.load();
            videoPlayer.play();
        });

        const clock = document.getElementById("clock");
        const timer = document.getElementById("timer");
        let timeLeft;
        let whatHappening = {
            "lekcja": false,
            "przerwa": false,
            "matury": false,
            "pozno": false,
            "ludzie": 0
        }

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

                    // For maniek conditional messages
                    whatHappening["lekcja"] = true;
                    whatHappening["przerwa"] = false;

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
                        
                        // For maniek conditional messages
                        whatHappening["lekcja"] = true;
                        whatHappening["przerwa"] = false;   
                    }else{
                        // For maniek conditional messages
                        whatHappening["lekcja"] = false;
                        whatHappening["przerwa"] = true;

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
        });
        
        const minimumSecDelayBetweenMessages = 8;
        let currentDelay = 0;
        const url = "http://localhost:8080/detect";
        let readAmountOfPeopleTimeout = null;
        const getAmountOfPeopleInFrontOfTv = async () => {
            let detected = false;
            let peopleAmount = 0;
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Response status: ${response.status}`);
                }

                const json = await response.json();
                detected = json["Detected"];
                peopleAmount = json["Amount"];
            } catch (error) {
                console.error(error.message);
            }

            clearTimeout(readAmountOfPeopleTimeout);
            readAmountOfPeopleTimeout = setTimeout(getAmountOfPeopleInFrontOfTv, 1000);

            currentDelay += 1;
            if (currentDelay >= minimumSecDelayBetweenMessages) {
                if(detected) {
                    // For maniek conditional messages
                    whatHappening["ludzie"] = peopleAmount;
                    toggleManiekMessage();
                    currentDelay = 0;
                }
            }
        };
        readAmountOfPeopleTimeout = setTimeout(getAmountOfPeopleInFrontOfTv, 1000);
        
        let messages = [
            "ZWOLNIJ!!",
            "Uwaga! Nauczyciel na horyzoncie!",
            "Powodzenia na kartkówce!",
            "Powodzenia na sprawdzianie!",
            "Chcesz zagrać w grę??",
            "Dzwonek to tylko sugestia...",
            "Lekcja zaczęła się 5 minut temu...",
            "Uśmiechnij się! To tylko szkoła!",
            "Kawałek czekolady poprawia koncentrację!",
            "Pamiętaj o zadaniu domowym!",
            "Uwaga, dyrektor w pobliżu!",
            "Dzisiaj obiad w stołówce wygląda podejrzanie...",
            "Szukasz ściągi? Uśmiechnij się do kolegi!",
            "Chcesz mieć spokój? Udawaj, że się uczysz!",
            "Nie śpij na lekcji, bo przegapisz przerwę!",
            "Dzień bez spóźnienia to dzień stracony!",
            "Czy już dziś powiedziałeś 'Nie było mnie na tej lekcji'?",
            "Za pięć minut dzwonek... albo i nie!",
            "Skoro to czytasz, to znaczy, że nie uważasz na lekcji!",
            "Pamiętaj! Weekend jest coraz bliżej!",
            "Matematyka? Spokojnie, kalkulator też nie wie!",
            "Czy na pewno masz swoją legitymację?",
            "Nie wiesz, co się dzieje? Spokojnie, nikt nie wie!",
            "Za 20 lat będziesz to wspominać... może.",
            "Nie stój w przejściu! Ludzie próbują przejść!",
            "Uwaga! Nauczyciel patrzy!",
            "Nauczyciele też kiedyś byli uczniami... podobno!",
            "Zgadnij, kto dziś dostanie pytanie na ocenę?",
            "Klasówka? Chyba dzisiaj, ale nie jestem pewien...",
            "Dzisiaj dobry dzień na wagary? Nie, lepiej nie ryzykować!",
            "Przestań gapić się w ekran, idź na lekcję!",
            "Dzwonek nie oznacza końca lekcji... zapytaj nauczyciela!"
        ];

        let delay = 90;
        let removeDelay = 15;
        let isDisplaying = false;
        let isRemoving = false;
        let currentDialog = ""
        function processDialogQueue(characterPos = 0, nextDelay = delay) {
            if (!isDisplaying) {
                isDialogRunning = false; // No more dialog strings in the queue
                dialogQueue = []; // Clear the queue (in case dialog is halted)
                return;
            }

            let goalString = currentDialog; // Get the first string in the queue
            let endCharacter = goalString.length;

            let newText = `${goalString.substring(0, characterPos)}`;
            maniekTextContainerTextContainer.innerHTML = newText;

            if (navigator.userActivation.hasBeenActive) {
                // new scope to garbage collect it faster
                let sansVoice = new Audio('./sounds/voice_sans.mp3');
                sansVoice.volume = 0.03;
                sansVoice.play();
            }

            // Capital letters, punctuation and spaces
            let currentChar = goalString.charAt(characterPos);
            let currentDelay = nextDelay || delay;

            // Calculate the next letter's delay
            nextDelay = delay;
            // console.log(currentChar);
            if (currentChar === ' ') {
                nextDelay = 10;
            } else if (currentChar === ',') {
                nextDelay *= 3;
            } else if (currentChar === '.') {
                nextDelay *= 5;
            } else if (currentChar === '?' || currentChar === '!') {
                nextDelay *= 2;
            } else if (currentChar === currentChar.toUpperCase()) {
                nextDelay /= 2;
            }
            // console.log(currentChar, currentDelay);

            if (characterPos == endCharacter) {
                if (!isRemoving) {
                    setTimeout(() => {
                        isRemoving = true;
                        processDialogQueue(characterPos - 1, removeDelay);
                    }, 2000);
                    return;
                } 
            } else if (isRemoving && characterPos == 0) {
                isDisplaying = false;
                isRemoving = false;
                // Close dialog !
                toggleManiekMessage();
            } else {
                setTimeout(() => {
                    if (isRemoving)
                        processDialogQueue(Math.max(characterPos - 1, 0), removeDelay);
                    else 
                        processDialogQueue(characterPos + 1, nextDelay);
                }, currentDelay);
            }
        }

        // Maniek message 
        const positionsOfManiekTextContainer = {
            "start": { top: 0, left: 0},
            "end": { top: 0, left: 0}
        };
        const maniekFacesSrcs = {
            "normal": "./assets/maniek-faces/wink-centered.gif",
            "bigEye": "./assets/maniek-faces/big eyes.gif"
        };
        let startSet = false;
        let endSet = false;

        // Set width and height to px amount
        let rect = maniekTextContainer.getBoundingClientRect();

        const toggleManiekMessage = (peopleAmount = 0) => {
            let scrollY = window.scrollY;
            let scrollX = window.scrollX;

            
            if (!maniekTextContainer.classList.contains("active")) {
                if (!startSet) {
                    positionsOfManiekTextContainer["start"].top = rect.top;
                    positionsOfManiekTextContainer["start"].left = rect.left;
                    startSet = true;
                }
                
                maniekTextConatinerImg.src = maniekFacesSrcs["bigEye"];
                // Animacja wchodzaca
                maniekTextContainer.style.position = "fixed";
                maniekTextContainer.style.top = positionsOfManiekTextContainer["start"].top + "px";
                maniekTextContainer.style.left = positionsOfManiekTextContainer["start"].left + "px";

                setTimeout(() => {
                    maniekTextContainer.classList.toggle("active");

                    maniekTextContainer.style.removeProperty("top");
                    maniekTextContainer.style.removeProperty("left");
                    maniekTextContainer.style.removeProperty("position");

                    setTimeout(() => {
                        maniekTextContainer.classList.toggle("background");
                        setTimeout(() => {
                            maniekTextContainerTextContainer.style.display = "flex";

                            // TODO: get random text from somewhere
                            currentDialog = messages[Math.floor(Math.random() * messages.length)];
                            isDisplaying = true;
                            processDialogQueue();
                        }, 500);
                    }, 900);
                }, 20);
            } else {
                if (!endSet) {
                    positionsOfManiekTextContainer["end"].top = rect.top + scrollY;
                    positionsOfManiekTextContainer["end"].left = rect.left + scrollX;
                    endSet = true;
                }

                maniekTextConatinerImg.src = maniekFacesSrcs["normal"];

                // Animacja wychodzaca
                maniekTextContainerTextContainer.style.display = "none";
                maniekTextContainer.classList.toggle("background");
                setTimeout(() => {
                    maniekTextContainer.style.top = (positionsOfManiekTextContainer["end"].top) + "px";
                    maniekTextContainer.style.left = (positionsOfManiekTextContainer["end"].left) + "px";
                    maniekTextContainer.style.transform = "translate(0px, 0px)";

                    setTimeout(() => {
                        maniekTextContainer.classList.toggle("active");

                        maniekTextContainer.style.removeProperty("top");
                        maniekTextContainer.style.removeProperty("left");
                        maniekTextContainer.style.removeProperty("transform");
                    }, 900);
                }, 500);
            }
        };
        
        toggleManiekMessage();
        setInterval(toggleManiekMessage, 15000);
    </script>
</body>
</html>