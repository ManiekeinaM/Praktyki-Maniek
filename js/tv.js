// Maniek div where maniek text will appear 
const maniekTextContainer = document.querySelector("#maniek-text-container");
const maniekTextContainerTextContainer = maniekTextContainer.querySelector("#maniek-text-container-text-container");
const maniekTextConatinerImg = maniekTextContainer.querySelector('.maniek-face');

const videoPlayer = document.getElementById("vidplayer");
const videoSource = document.getElementById("vidsource");

let videosList = [];
let currentIndex = 0;

async function refreshPlaylist() {
    try {
        const response = await fetch("./misc/getPlaylist.php");
        const newList = await response.json();

        if (JSON.stringify(videosList) !== JSON.stringify(newList)) {
            console.log("Aktualizacja playlisty...");

            videosList = newList;

            if (currentIndex >= videosList.length) currentIndex = 0;
        }
    } catch (err) {
        console.error("Błąd przy odświeżeniu playlisty: ", err);
    }
}

videoPlayer.addEventListener("ended", (event) => {
    currentIndex++;
    if (currentIndex >= videosList.length) currentIndex = 0;

    videoSource.src = videosList[currentIndex];
    videoPlayer.load();
    videoPlayer.play();
});

(async() => {
    await refreshPlaylist();
    
    if (videosList.length > 0) {
        videoSource.src = videosList[currentIndex];
        videoPlayer.load();
        videoPlayer.play();
    }
})();

setInterval(refreshPlaylist, 15000);

const clock = document.getElementById("clock");
const timer = document.getElementById("timer");
let realTimeLeft;
let timeLeft;
let whatsHappening = {
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
            timeLeft = vMinute - currentMinute;
            if(timeLeft < 0) timeLeft+=60;
            realTimeLeft = timeLeft;
            timeLeft = `Koniec lekcji za: <span class="light-green"><span class="big">${timeLeft}</span>min</span>`;

            // For maniek conditional messages
            whatsHappening["lekcja"] = true;
            whatsHappening["przerwa"] = false;

            return currentLesson;
        }else if(currentHour == vHour) {
            timeLeft = vMinute+10;
            timeLeft = timeLeft-currentMinute;
            realTimeLeft = timeLeft;
            if(timeLeft<=0) {
                timeLeft = vMinute-5-currentMinute;
                // console.log(timeLeft);
                if(currentLesson == 3) timeLeft+=10;
                if(timeLeft < 0) timeLeft+=60;
                realTimeLeft = timeLeft;
                timeLeft = `Koniec lekcji za: <span class="light-green"><span class="big">${timeLeft}</span>min</span>`;
                
                // For maniek conditional messages
                whatsHappening["lekcja"] = true;
                whatsHappening["przerwa"] = false;   
            }else{
                // For maniek conditional messages
                whatsHappening["lekcja"] = false;
                whatsHappening["przerwa"] = true;

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

// Pobierz dane z API od kamery, który wykrywa obecność osób
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
            whatsHappening["ludzie"] = peopleAmount;
            toggleManiekMessage();
            currentDelay = 0;
        }
    }
};
// readAmountOfPeopleTimeout = setTimeout(getAmountOfPeopleInFrontOfTv, 1000);


let messagesContext = {
    duzoLudzi: [
        "Ooo ile was !!! Może w coś zagracie ?",
        "Nie stójcie w przejściu ludzie próbują przejść !!",
        "Czuje sie bardzo prytłoczony ilością osób :(",
        "Zatrzymajcie się chociaż na chwile, chodzą plotki, że maniek ma nowe funkcje :O",
        "Widze was !!"
    ],
    pozno: [
        "Przepraszam czy nie pomyliły Ci się godziny ?",
        "O tej porze w szkole ... Współczuje :<",
        "Zostajesz na noc ? Czyli nie bedę sam :)",
        "Dobranoc !!"
    ],
    lekcja: [
        "Przepraszam, można wiedzieć czemu nie jesteś na lekcji ?",
        "Rozumiem, że tylko do toalety ?",
        "Wiem, że jest lekcja i tak dalej ale dawno nikt w nic nie grał . . . Może szybka rundka ?",
        "Nie śpisz podczas lekcji ? Wydarzenie roku !",
        "Uciekasz ??",
        "Jak uciekasz to zabierz mnie ze sobą !"
    ],
    koniecLekcji: [
        "Nie wracaj, zaraz koniec lekcji"
    ],
    przerwa: [
        "Wyspany ? Zaraz kolejna lekcja x} !",
        "Nie uważasz, że przerwa jest za krótka ?",
        "Chodź pograć w jakąś grę !",
        "Zapraszam do grania w gry !",
    ],
    koniecPrzerwy: [
        "UWAGA ! Zaraz koniec przerwy !"
    ],
    weekend: [
        "Jakie plany na weekend ?",
        "Zaraz weekend !!",
        "Czujesz smak weekendu ?"
    ],
    poniedzialek: [
        "Początek tygodnia zawsze jest najgorszy !",
        "Kto lubi poniedziałki niech pierwszy rzuci kamieniem"
    ],
    ogolne: [
        "Szukasz sali ? Skorzystaj z mapy szkoły w zakładce mapa na kiosku !",
        "Mowią na mnie 'Maniek' a Ty jak masz na imię ?",
        "Pong, Air-turret, Wisielec, Kółko i Krzyżyk czekają na Ciebie ? A Ty na co czekasz ?",  
        "Nie biegamy po korytarzu !",
        "ZWOLNIJ !!!!! Może szybka partia w kółko i krzyżyk ?",
        "Widze Cię :))"      
    ]
};

const currentDate = new Date();
const dayOfTheWeek = currentDate.getDay();
const year = currentDate.getFullYear();
const day = currentDate.getDate();
const month = currentDate.getMonth();

let gotHolidays = false;
const getHolidays = async() => {
    if (gotHolidays) return;
    // Pobierz dane z bazy o swietach !
    try {
        // 
        let response = await fetch('./misc/getHoliday.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        // On fetch error
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        
        let json = await response.json();
        // On failure
        if (json["success"] == false)
            throw new Error(`Failed with message: ${json["message"]}`);

        let holidays = json["holidays"];
        holidays.forEach(holiday => {
            if (holiday["showWithDate"] === 1)
                messagesContext['ogolne'].push(`Czy wiesz, że ${holiday["startDay"]}.${holiday["startMonth"]} jest ${holiday["nazwa"]} ?`);
            else 
                messagesContext['ogolne'].push(`Za niedługo ${holiday["nazwa"]}, ach ten czas szybko leci ...`);
        });
        gotHolidays = true;
    } catch (error) {
        console.error(error.message);
    }
};
// Pobierz je raz
// getHolidays();

const getAvailableMessages = () => {
    // Funkcja na podstawie wielu czynnikow wybiera wiadomosci pasujące do aktualnego wydarzenia w ciagu dnia, lub roku !
    let messages = messagesContext["ogolne"];

    // Kiedy jest lekcja
    if (whatsHappening['lekcja']) {
        messages = messages.concat(messagesContext["lekcja"]);

        // Kiedy zaraz koniec lekcji
        if (realTimeLeft <= 10) {
            messages = messages.concat(messagesContext["koniecLekcji"]);
        }
    }

    // Kiedy jest przerwa
    if (whatsHappening['przerwa']) {
        messages = messages.concat(messagesContext["przerwa"]);

        // Kiedy zaraz koniec lekcji
        if (realTimeLeft <= 5) {
            messages = messages.concat(messagesContext["koniecPrzerwy"]);
        }
    }

    // Kiedy poniedzialek
    if (dayOfTheWeek == 1) {
        messages = messages.concat(messagesContext["poniedzialek"]);
    }

    // Kiedy piatek 
    if (dayOfTheWeek == 5) {
        messages = messages.concat(messagesContext["weekend"]);
    }

    // Kiedy duzo osob przed kamera
    if (whatsHappening["ludzie"] >= 10) {
        messages = messages.concat(messagesContext["duzoLudzi"]);
    }

    return messages;
};

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
            // This timeout determins when maniek's message will hide 
            setTimeout(() => {
                isRemoving = true;
                processDialogQueue(characterPos - 1, removeDelay);
            }, 3000);
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
const MainTransitionTimeMS = 700;
const OtherTransitionTimeMS = 500;
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
        maniekTextContainer.style.trans
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
                    let messages = getAvailableMessages();
                    currentDialog = messages[Math.floor(Math.random() * messages.length)];
                    isDisplaying = true;
                    processDialogQueue();
                }, OtherTransitionTimeMS);
            }, MainTransitionTimeMS);
        }, 10);
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
            }, MainTransitionTimeMS - 20);
        }, OtherTransitionTimeMS);
    }
};

// toggleManiekMessage();
// setInterval(toggleManiekMessage, 15000);