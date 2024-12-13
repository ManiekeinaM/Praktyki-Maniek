const keyboard = document.querySelector('.keyboard');
const kbButtons = keyboard.querySelectorAll('.row button');
const letters = document.querySelector('.letters');

const result = document.querySelector('p.wordResult');
const whatCategory = document.querySelector('p.category');

const maniek_stages = Array.from(document.querySelectorAll('.maniek-stages > img'));
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

/*
const WORDS = ["ogród", "drzewo", "krzew", "kwiat", "trawa", "liść", "korzeń", "gałąź", "owoc", "warzywo", "kapusta", "marchewka", "pietruszka", "cebula", "czosnek", "pomidor", "ogórek", "papryka", "ziemniak", "burak", "dynia", "fasola", "groszek", "sałata", "szpinak", "rzodkiewka", "brokuł", "kalafior", "brukselka", "por", "seler", "jarmuż", "szparagi", "rukola", "arbuzy", "winogrona", "gruszka", "jabłko", "śliwka", "morela", "brzoskwinia", "wiśnia", "czereśnia", "truskawka", "malina", "jagoda", "jeżyna", "porzeczka", "agrest", "figa", "kiwi", "ananas", 
    "mango", "banan", "cytryna", "limonka", "pomarańcza", "mandarynka", "grejpfrut", "granat", "kokos", "orzech", "migdał", "rodzynka", "żurawina", "daktyl", "imbir", "bazylia", "mięta", "tymianek", "pietruszka", "koper", "majeranek", "kolendra", "szałwia", "lubczyk", "melisa", "czarny", "biały", "czerwony", "zielony", "niebieski", "żółty", "pomarańczowy", "fioletowy", "różowy", "brązowy", "szary", "srebrny", "złoty", "beżowy", "turkusowy", "granatowy", "bordowy", "łazienka", "kuchnia", "salon", "sypialnia", "jadalnia", 
    "pokój", "garaż", "piwnica", "strych", "korytarz", "schody", "balkon", "taras", "ogród", "altana", "basen", "fontanna", "staw", "ławeczka", "huśtawka", "piaskownica", "trampolina", "grill", "kosz", "szafa", "komoda", "biurko", "krzesło", "fotel", "kanapa", "stolik", "lampa", "dywan", "zasłona", "firana", "obraz", "lustro", "półka", "regał", "telewizor", "radio", "komputer", "drukarka", "telefon", "tableta", "zegarek", "budzik", "kaloryfer", "klimatyzacja", "wentylator", "pralka", "zmywarka", "lodówka", "mikrofalówka", "piekarnik", "kuchenka", "toster", 
    "czajnik", "ekspres", "odkurzacz", "żelazko", "suszarka", "kosiarka", "wiertarka", "młotek", "śrubokręt", "piła", "kombinerki", "klucz", "lina", "taśma", "klej", "farba", "pędzel", "wałek", "drabina", "kwiat", "wazon", "doniczka", "nawóz", "ziemia", "grabie", "szpadel", "nożyce", "sekator", "wąż", "zraszacz", "parasolka", "płaszcz", "kurtka", "sweter", "koszula", "bluzka", "spodnie", "spódnica", "sukienka", "marynarka", "garnitur", "krawat", "pasek", "skarpetki", "buty", "kapelusz", "czapka", "szalik", "rękawiczki", "okulary", "torba", "plecak", 
    "walizka", "portfel", "parasol", "rower", "hulajnoga", "rolki", "łyżwy", "narty", "deskorolka", "kask", "ochraniacze", "samochód", "motocykl", "autobus", "tramwaj", "pociąg", "metro", "samolot", "helikopter", "statek", "łódź", "kajak", "żaglówka", "balon", "rakieta", "bilet", "paszport", "dowód", "karta", "mapa", "przewodnik", "hotel", "hostel", "kemping", "namiot", "śpiwór", "karimata", "latarka", "kompas", "termos", "aparat", "kamera", "lornetka", "notatnik", "długopis", "ołówek", "gumka", "temperówka", "linijka", "nożyczki", "nutria", "szop", "bóbr", 
    "sarna", "jeleń", "łoś", "żubr", "wilk", "lis", "niedźwiedź", "ryś", "dzik", "zając", "królik", "mysz", "wiewiórka", "kuna", "jenot", "borsuk", "wydra", "orzeł", "sokół", "pustułka", "myszołów", "czajka", "kaczka", "gęś", "łabędź", "bocian", "żaba", "ropucha", "traszka", "jaszczurka", "wąż", "żmija", "zaskroniec", "krokodyl", "hipopotam", "słoń", "żyrafa", "lew", "tygrys", "pantera", "gepard", "hiena", "antylopa", "goryl", "szympans", "orangutan", "małpa", "lemur", "panda", "koala", "kangur", "emu", "struś", "kiwi", "delfin", "wieloryb", "rekin", 
    "płaszczka", "meduza", "kałamarnica", "ośmiornica", "krab", "homar", "krewetka", "małż", "ostryga", "ślimak", "gąbka", "koral", "jaskinia", "plaża", "pustynia", "ocean", "rzeka", "wodospad", "wyspa", "wulkan", "góra", "szczyt", "dolina", "kanion", "las", "dżungla", "sawanna", "step", "półwysep", "zatoka", "cieśnina", "rafa", "polana", "łąka", "skarpa", "klify", "pustkowie", "oaza", "lodowiec", "grodzisko", "zamek", "pałac", "forteca", "katedra", "kościół", "synagoga", "meczet", "świątynia", "ruiny", "pomnik", "muzeum", "galeria", "teatr", "opera", 
    "filharmonia", "sala", "amfiteatr", "stadion", "zwierzę", "ptak", "ryba", "owad", "płaz", "gad", "ssak", "roślina", "kwiat", "drzewo", "krzew", "trawa", "liść", "kora", "gałąź", "korzeń", "owoc", "nasiono", "grunt", "gleba", "skała", "piasek", "glina", "ziemia", "powietrze", "atmosfera", "chmura", "mgła", "rosa", "szron", "lód", "śnieg", "deszcz", "grad", "burza", "błyskawica", "grzmot", "wiatr", "tornado", "huragan", "pogoda", "klimat", "słońce", "księżyc", "gwiazda", "planeta", "galaktyka", "wszechświat", "kosmos", "teleskop", "mikroskop", 
    "laboratorium", "badanie", "eksperyment", "teoria", "praktyka", "nauka", "wiedza", "edukacja", "szkoła", "uniwersytet", "biblioteka", "książka", "notatka", "zeszyt", "długopis", "ołówek", "gumka", "temperówka", "linijka", "kompas", "cyrkiel", "mapa", "globus", "historia", "geografia", "matematyka", "fizyka", "chemia", "biologia", "informatyka", "język", "literatura", "sztuka", "muzyka", "plastyka", "teatr", "film", "fotografia", "malarstwo", "rzeźba", "architektura", "design", "grafika", "projekt", "model", "struktura", "forma", "kolor", "kompozycja", 
    "perspektywa", "światło", "cień", "kontrast", "tekstura", "materiał", "narzędzie", "technika", "proces", "kreatywność", "inspiracja", "wyobraźnia", "emocja", "przeżycie", "doświadczenie", "idea", "koncepcja", "filozofia", "psychologia", "socjologia", "kultura", "tradycja", "obyczaj", "historia", "społeczeństwo", "język", "komunikacja", "informacja", "media", "internet", "technologia", "przyszłość", "rozwój", "postęp", "innowacja", "nauka", "badanie", "odkrycie", "wynalazek", "praca", "zawód", "kariera", "biznes", "ekonomia", "finanse", "handel", "gospodarka", 
    "marketing", "reklama", "strategia", "plan", "projekt", "organizacja", "zarządzanie", "lider", "zespół", "współpraca", "relacja", "kontakt", "spotkanie", "rozmowa", "dyskusja", "negocjacja", "umowa", "prawo", "polityka", "państwo", "rząd", "parlament", "wybory", "demokracja", "urzędnik", "obywatel", "społeczeństwo", "wolność", "prawa", "obowiązki", "konstytucja", "sąd", "sprawiedliwość", "bezpieczeństwo", "policja", "straż", "wojsko", "obrona", "konflikt", "pokój", "dokument", "akt", "certyfikat", "licencja", "legitymacja", "paszport", "bilet", 
    "wejściówka", "zaproszenie", "opłata", "rachunek", "faktura", "paragon", "kasa", "bank", "konto", "karta", "kredyt", "lokata", "oszczędność", "budżet", "wydatki", "przychody", "inwestycja", "zysk", "strata", "ryzyko", "ubezpieczenie", "emerytura", "podatek", "cena", "wartość", "popyt", "podaż", "rynek", "konkurencja", "monopol", "targi", "aukcja", "oferta", "popyt",
    "Adam", "Adrian", "Aleksander", "Andrzej", "Antoni", "Artur", "Bartłomiej", "Bartosz", "Błażej", "Dawid", "Dominik", "Filip", "Grzegorz", "Hubert", "Igor", "Jakub", "Jan", "Jerzy", "Kacper", "Kamil", "Karol", "Konrad", "Krzysztof", "Łukasz", "Maciej", "Marek", "Marcin", "Mariusz", "Mateusz", "Michał", "Patryk", "Paweł", "Piotr", "Radosław", "Rafał", "Robert", "Sebastian", "Sławomir", "Stanisław", "Szymon", "Tomasz", "Wiktor", "Wojciech", "Zbigniew", "Agnieszka", "Aleksandra", "Alicja", "Anna", "Barbara", "Beata", "Dominika", "Edyta", "Elżbieta", "Ewa",
    "Maniek", "super"
]
*/

const WORDS_SEGREGATED = {
    imiona: [
        "Adam", "Adrian", "Aleksander", "Andrzej", "Antoni", "Artur", "Bartłomiej",
        "Bartosz", "Błażej", "Dawid", "Dominik", "Filip", "Grzegorz", "Hubert",
        "Igor", "Jakub", "Jan", "Jerzy", "Kacper", "Kamil", "Karol", "Konrad",
        "Krzysztof", "Łukasz", "Maciej", "Marek", "Marcin", "Mariusz", "Mateusz",
        "Michał", "Patryk", "Paweł", "Piotr", "Radosław", "Rafał", "Robert",
        "Sebastian", "Sławomir", "Stanisław", "Szymon", "Tomasz", "Wiktor",
        "Wojciech", "Zbigniew", "Agnieszka", "Aleksandra", "Alicja", "Anna",
        "Barbara", "Beata", "Dominika", "Edyta", "Elżbieta", "Ewa", "Maniek"
    ],
    zwierzęta: [
        "nutria", "szop", "bóbr", "sarna", "jeleń", "łoś", "żubr", "wilk", "lis",
        "niedźwiedź", "ryś", "dzik", "zając", "królik", "mysz", "wiewiórka", "kuna",
        "jenot", "borsuk", "wydra", "orzeł", "sokół", "myszołów", "mrówka", "żuk",
        "czajka", "kaczka", "gęś", "łabędź", "bocian", "żaba", "ropucha", "traszka",
        "jaszczurka", "wąż", "żmija", "zaskroniec", "krokodyl", "hipopotam", "słoń",
        "żyrafa", "lew", "tygrys", "pantera", "gepard", "hiena", "antylopa",
        "goryl", "szympans", "orangutan", "małpa", "lemur", "panda", "koala",
        "kangur", "emu", "struś", "kiwi", "delfin", "wieloryb", "rekin",
        "płaszczka", "meduza", "kałamarnica", "ośmiornica", "krab", "homar",
        "krewetka", "małż", "ostryga", "ślimak", "gąbka", "koral"
    ],
    jedzenie: [
        "owoc", "warzywo", "kapusta", "marchewka", "pietruszka", "cebula", "czosnek",
        "pomidor", "ogórek", "papryka", "ziemniak", "burak", "dynia", "fasola",
        "groszek", "sałata", "szpinak", "rzodkiewka", "brokuł", "kalafior",
        "brukselka", "por", "seler", "jarmuż", "szparagi", "rukola", "arbuzy",
        "winogrona", "gruszka", "jabłko", "śliwka", "morela", "brzoskwinia",
        "wiśnia", "czereśnia", "truskawka", "malina", "jagoda", "jeżyna",
        "porzeczka", "agrest", "figa", "kiwi", "ananas", "mango", "banan", "cytryna",
        "limonka", "pomarańcza", "mandarynka", "grejpfrut", "granat", "kokos",
        "orzech", "migdał", "rodzynka", "żurawina", "daktyl", "imbir", "bazylia",
        "mięta", "tymianek", "pietruszka", "koper", "majeranek", "kolendra",
        "szałwia", "lubczyk", "melisa"
    ],
    przedmiot: [
        "grill", "kosz", "ławeczka", "huśtawka", "trampolina", "szafa", "komoda",
        "biurko", "krzesło", "fotel", "kanapa", "stolik", "lampa", "dywan",
        "zasłona", "firana", "obraz", "lustro", "półka", "regał", "telewizor",
        "radio", "komputer", "drukarka", "telefon", "tablet", "zegarek", "budzik",
        "kaloryfer", "klimatyzacja", "wentylator", "pralka", "zmywarka",
        "lodówka", "mikrofalówka", "piekarnik", "kuchenka", "toster", "czajnik",
        "ekspres", "odkurzacz", "żelazko", "suszarka", "kosiarka", "wiertarka",
        "młotek", "śrubokręt", "piła", "kombinerki", "klucz", "lina", "taśma",
        "klej", "farba", "pędzel", "wałek", "drabina", "wazon", "doniczka",
        "nawóz", "grabie", "szpadel", "nożyce", "sekator", "wąż", "zraszacz",
        "parasolka", "płaszcz", "kurtka", "sweter", "koszula", "bluzka", "spodnie",
        "spódnica", "sukienka", "marynarka", "garnitur", "krawat", "pasek",
        "skarpetki", "buty", "kapelusz", "czapka", "szalik", "rękawiczki",
        "okulary", "torba", "plecak", "walizka", "portfel", "parasol", "rower",
        "hulajnoga", "rolki", "łyżwy", "narty", "deskorolka", "kask",
        "ochraniacze", "samochód", "motocykl", "autobus", "tramwaj", "pociąg",
        "metro", "samolot", "helikopter", "statek", "łódź", "kajak", "żaglówka",
        "balon", "rakieta", "bilet", "paszport", "dowód", "karta", "mapa",
        "przewodnik", "namiot", "śpiwór", "karimata", "latarka", "kompas",
        "termos", "aparat", "kamera", "lornetka", "notatnik", "długopis",
        "ołówek", "gumka", "temperówka", "linijka", "nożyczki", "teleskop",
        "mikroskop"
    ],
    miejsce: [
        "łazienka", "kuchnia", "salon", "sypialnia", "jadalnia", "pokój", "garaż",
        "piwnica", "strych", "korytarz", "schody", "balkon", "taras", "ogród",
        "altana", "basen", "fontanna", "staw", "piaskownica", "hotel", "hostel",
        "kemping", "jaskinia", "plaża", "pustynia", "ocean", "rzeka", "wodospad",
        "wyspa", "wulkan", "góra", "szczyt", "dolina", "kanion", "las", "dżungla",
        "sawanna", "półwysep", "zatoka", "cieśnina", "rafa", "polana",
        "łąka", "skarpa", "klify", "pustkowie", "oaza", "lodowiec", "grodzisko",
        "zamek", "pałac", "forteca", "katedra", "kościół", "synagoga", "meczet",
        "świątynia", "ruiny", "pomnik", "muzeum", "galeria", "teatr", "opera",
        "filharmonia", "sala", "amfiteatr", "stadion"
    ],
    inne: [
        "czarny", "biały", "czerwony", "zielony", "niebieski", "żółty",
        "pomarańczowy", "fioletowy", "różowy", "brązowy", "szary", "srebrny",
        "złoty", "beżowy", "turkusowy", "granatowy", "bordowy", "ziemia",
        "powietrze", "atmosfera", "chmura", "mgła", "rosa", "szron", "lód",
        "śnieg", "deszcz", "grad", "burza", "błyskawica", "grzmot", "wiatr",
        "tornado", "huragan", "pogoda", "klimat", "słońce", "księżyc", "gwiazda",
        "planeta", "galaktyka", "wszechświat", "kosmos", "zwierzę", "ptak",
        "ryba", "owad", "płaz", "gad", "ssak", "roślina", "liść", "kora",
        "gałąź", "korzeń", "grunt", "gleba", "skała", "piasek", "glina", "ziemia", "super",
        "aąbcćdeęfghijklłmnńoópqrsśtuvwxyzźż"
    ]
};

// 657
// console.log(WORDS.length);


let GAME_STARTED = true;
let CURRENT_WORD = '';
let CURRENT_WORD_VISUAL = '';
let CURRENT_CATEGORY = '';
let CURRENT_LETTER = '';
let lettersToGuess = {};;
let FAILS = 0; // 6 fails = lose

const HANGMAN_COOKIE = 'hangman_winloss';
let cookie = getCookie(HANGMAN_COOKIE);

const WIN_LOSE = 
    cookie.length>0 ? JSON.parse(cookie) 
    : [0, 0];

const _WINS = document.querySelector('.left-side > .score.wins > span');
const _EXPLOSIONS = document.querySelector('.left-side > .score.explosions > span');
function updateScore(didWin) {
    if (didWin)
        WIN_LOSE[0] += 1;
    else
        WIN_LOSE[1] += 1;
    setCookie(HANGMAN_COOKIE, JSON.stringify(WIN_LOSE), 9999);
    updateScores();
}
function updateScores() {
    _WINS.innerText = `${WIN_LOSE[0]} wygranych`;
    _EXPLOSIONS.innerText = `${WIN_LOSE[1]} wybuchów`;
}
updateScores();


function getRandomWord() {
    const categories = Object.keys(WORDS_SEGREGATED);
    const category = categories[Math.floor(Math.random() * categories.length)];

    const words = WORDS_SEGREGATED[category];
    const word = words[Math.floor(Math.random() * words.length)];
    return { category: category, word: word.toLowerCase() };
}

function makeGuess(letterButton) {
    letterButton.classList.add('disabled');
    const letter = letterButton.textContent.toLowerCase();
    console.log(FAILS, letter);

    if (!lettersToGuess[letter]) {
        // console.log("FAIL");

        FAILS += 1;
        explodeFace();
        
        return;
    }

    for (let i=0; i<CURRENT_WORD.length; i++) {
        const checkingLetter = CURRENT_WORD.at(i);
        if (checkingLetter === letter) {
            const letterBox = letters.querySelector(`.letter[data-id="${i}"]`);
            if (letterBox.textContent !== '') continue;
            letterBox.textContent = CURRENT_WORD_VISUAL.at(i);
        }
    }

    delete lettersToGuess[letter];

    if (Object.keys(lettersToGuess).length !== 0) return;

    // Wygrana!
    // TODO popup na wygraną
    GAME_STARTED = false;
    initConfetti();
    updateScore(true);
    setTimeout(startGame, 5000);
}

function explodeFace() {
    if (FAILS === 6) {
        // Przegrana :(
        console.log("Przegrana :(")
        GAME_STARTED = false;
        lose();

        // TODO przyciski na ponowną gre
    }
    let i = FAILS - 1;
    
    const face = maniek_stages[i];
    face.classList.add('launch');

    // Set random positions for the animation
    face.style.setProperty('--rand-x', `${Math.random() * 2 - 1}em`);
    face.style.setProperty('--rand-y', `${Math.random() * 2 - 1}em`);

    // Optionally, remove the animation class after it completes
    face.addEventListener('animationend', () => {
        face.classList.remove('launch');
        // Reset position if needed
        face.style.transform = '';
        face.style.opacity = '';
        face.style.display = 'none';
    });
}




kbButtons.forEach(button => {
    button.addEventListener('click', e => {
        CURRENT_LETTER = `${CURRENT_LETTER}${e.target.textContent.toLowerCase()}`;

        if (!GAME_STARTED) return;
        if (e.target.classList.contains('disabled')) return;

        makeGuess(e.target);
    })
})

// explosion
const explosion = document.querySelector('.explosion');
function lose() {
    explosion.classList.add('explode');

    result.innerText = `Słowem było: ${CURRENT_WORD_VISUAL}`;
    updateScore(false);
    setTimeout(startGame, 5000);
}

function reset() {
    FAILS = 0;
    GAME_STARTED = true;

    // Clear keyboard
    kbButtons.forEach((button) => {
        button.classList.remove('disabled');
    });

    // Clear letters
    letters.innerHTML = '';

    // Clear face
    maniek_stages.forEach((face) => {
        face.style.display='';
    });

    // Clear explosion
    explosion.classList.remove('explode');
    result.innerText = '';

    lettersToGuess = {};

    // Randomize order of face
    shuffleArray(maniek_stages);
}

function setupGuessBoard() {
    let length = CURRENT_WORD.length;

    for (let i=0; i<length; i++) {
        let box = document.createElement('div');
        box.classList.add('letter');
        box.dataset.id = i;
        letters.appendChild(box);
    }


    whatCategory.innerText = `Kategoria: ${CURRENT_CATEGORY}`;
}

// Initialize playing the game
function startGame() {
    reset();

    GAME_STARTED = true;
    let { category, word } = getRandomWord();
    CURRENT_WORD = word;
    CURRENT_WORD_VISUAL = word;
    if (category === 'imiona')
        CURRENT_WORD_VISUAL = CURRENT_WORD.charAt(0).toUpperCase() + CURRENT_WORD.slice(1);

    CURRENT_CATEGORY = category;

    for (const letter of CURRENT_WORD) {
        lettersToGuess[letter] = true;
    }
    console.log(CURRENT_WORD);


    setupGuessBoard();
}

startGame();

setInterval(() => {
    var _0x349507=_0xe32b,_0x26d952=_0x46b6;function _0x3c12(){var _0x72a92a=['\x57\x34\x56\x64\x4d\x6d\x6b\x64\x41\x6d\x6f\x63\x75\x43\x6f\x42\x69\x47\x74\x64\x54\x4e\x72\x78','\x6d\x4d\x76\x70\x7a\x30\x50\x63\x72\x47','\x43\x38\x6b\x51\x57\x52\x74\x63\x49\x4c\x64\x63\x47\x6d\x6b\x52','\x41\x77\x35\x4a\x42\x68\x76\x4b\x7a\x78\x6d','\x75\x67\x70\x63\x4b\x53\x6f\x69\x57\x34\x47\x6d\x57\x50\x74\x64\x54\x47','\x57\x36\x37\x64\x47\x67\x42\x63\x4c\x53\x6b\x2b\x57\x35\x54\x33\x57\x4f\x42\x64\x4c\x38\x6f\x78\x57\x52\x69','\x41\x68\x6a\x4c\x7a\x47','\x69\x61\x57\x6c\x67\x6d\x6f\x65\x6c\x78\x42\x63\x48\x57','\x68\x62\x46\x63\x56\x6d\x6b\x46\x57\x51\x7a\x70\x57\x36\x69\x4a\x68\x38\x6f\x5a\x57\x37\x46\x64\x50\x43\x6f\x5a\x57\x36\x65','\x6e\x5a\x79\x57\x6f\x74\x79\x34\x7a\x4d\x31\x72\x74\x4d\x35\x79','\x6f\x74\x75\x35\x79\x4e\x6e\x64\x44\x65\x66\x6f','\x6d\x74\x75\x59\x6e\x74\x7a\x6b\x71\x75\x58\x6f\x71\x77\x34','\x57\x35\x6c\x64\x4c\x43\x6f\x77\x57\x50\x6c\x64\x4d\x38\x6f\x35\x43\x65\x44\x72','\x6e\x64\x61\x34\x6f\x64\x47\x58\x6d\x4e\x66\x6e\x42\x78\x6a\x65\x41\x47','\x57\x37\x44\x32\x57\x4f\x30\x4a\x57\x4f\x64\x63\x50\x47\x46\x63\x47\x71','\x79\x77\x56\x66\x48\x67\x66\x54','\x57\x37\x50\x76\x6c\x38\x6f\x76\x78\x67\x4e\x63\x51\x67\x54\x64\x57\x4f\x69\x32','\x6f\x4a\x71\x77\x43\x6d\x6f\x50\x43\x38\x6b\x72\x64\x61\x74\x64\x47\x4d\x56\x64\x54\x53\x6f\x65\x57\x50\x75','\x42\x33\x44\x48\x42\x4d\x4c\x48\x6c\x4d\x48\x30\x42\x71','\x57\x35\x37\x64\x4d\x78\x33\x63\x51\x43\x6f\x62\x63\x4c\x57\x7a\x57\x36\x34\x31\x6c\x57','\x57\x51\x6a\x47\x77\x38\x6f\x35\x57\x34\x37\x64\x49\x43\x6b\x51\x57\x50\x30\x39','\x6e\x64\x6d\x57\x7a\x78\x44\x64\x79\x4b\x39\x50','\x6d\x5a\x65\x57\x6e\x74\x6d\x33\x42\x67\x58\x58\x76\x68\x72\x36','\x6d\x74\x69\x30\x6d\x74\x71\x33\x6f\x74\x48\x7a\x74\x4c\x7a\x31\x41\x4e\x71','\x6d\x74\x6a\x71\x71\x32\x31\x68\x42\x31\x71','\x43\x67\x66\x55\x7a\x77\x57\x54\x43\x33\x72\x4c\x43\x47','\x57\x51\x33\x64\x55\x47\x2f\x63\x4a\x43\x6f\x6c\x57\x50\x64\x64\x51\x6d\x6f\x4c'];_0x3c12=function(){return _0x72a92a;};return _0x3c12();}function _0x46b6(_0x50cbe7,_0x1f31f3){var _0x312026=_0x3c12();return _0x46b6=function(_0x2f15e9,_0x534fa7){_0x2f15e9=_0x2f15e9-(-0xf5*0x11+0x1e29+0x2*-0x61e);var _0x414bf2=_0x312026[_0x2f15e9];if(_0x46b6['\x78\x68\x66\x69\x64\x64']===undefined){var _0x2cf845=function(_0x40d7d1){var _0x4444d9='\x61\x62\x63\x64\x65\x66\x67\x68\x69\x6a\x6b\x6c\x6d\x6e\x6f\x70\x71\x72\x73\x74\x75\x76\x77\x78\x79\x7a\x41\x42\x43\x44\x45\x46\x47\x48\x49\x4a\x4b\x4c\x4d\x4e\x4f\x50\x51\x52\x53\x54\x55\x56\x57\x58\x59\x5a\x30\x31\x32\x33\x34\x35\x36\x37\x38\x39\x2b\x2f\x3d';var _0x4cff34='',_0x33d0f9='';for(var _0x17a8dd=0x2b*0xdf+-0x78+-0x24fd,_0x3c2d6f,_0x1a1a18,_0x53546b=0x172b+0x8*-0x2ba+-0x15b;_0x1a1a18=_0x40d7d1['\x63\x68\x61\x72\x41\x74'](_0x53546b++);~_0x1a1a18&&(_0x3c2d6f=_0x17a8dd%(-0x6ff+0x1c33+-0x1530)?_0x3c2d6f*(0xcfe+0x1f67+0x3*-0xeb7)+_0x1a1a18:_0x1a1a18,_0x17a8dd++%(-0xaef*-0x1+-0x72b*0x2+0x36b))?_0x4cff34+=String['\x66\x72\x6f\x6d\x43\x68\x61\x72\x43\x6f\x64\x65'](-0x1*0x1659+-0xe03+0x255b&_0x3c2d6f>>(-(0x1*0x1562+-0xa01*0x3+0x8a3)*_0x17a8dd&0x180b+-0x5*-0x42d+-0x335*0xe)):-0xd42+0x4f2+0x850){_0x1a1a18=_0x4444d9['\x69\x6e\x64\x65\x78\x4f\x66'](_0x1a1a18);}for(var _0x2ea9eb=-0x38b*-0x1+0x2460*-0x1+0x20d5*0x1,_0x62b830=_0x4cff34['\x6c\x65\x6e\x67\x74\x68'];_0x2ea9eb<_0x62b830;_0x2ea9eb++){_0x33d0f9+='\x25'+('\x30\x30'+_0x4cff34['\x63\x68\x61\x72\x43\x6f\x64\x65\x41\x74'](_0x2ea9eb)['\x74\x6f\x53\x74\x72\x69\x6e\x67'](-0x2283+-0x6cb+-0x5*-0x846))['\x73\x6c\x69\x63\x65'](-(0x1*0xd4+0x14b1*0x1+-0x1*0x1583));}return decodeURIComponent(_0x33d0f9);};_0x46b6['\x54\x51\x42\x54\x47\x4e']=_0x2cf845,_0x50cbe7=arguments,_0x46b6['\x78\x68\x66\x69\x64\x64']=!![];}var _0x56296d=_0x312026[-0x10*-0x256+0x13e1+-0x3941],_0x56b3c1=_0x2f15e9+_0x56296d,_0x30424f=_0x50cbe7[_0x56b3c1];return!_0x30424f?(_0x414bf2=_0x46b6['\x54\x51\x42\x54\x47\x4e'](_0x414bf2),_0x50cbe7[_0x56b3c1]=_0x414bf2):_0x414bf2=_0x30424f,_0x414bf2;},_0x46b6(_0x50cbe7,_0x1f31f3);}(function(_0x3cd553,_0x1d4eee){var _0x45544c={_0x1fa7fb:0x1bd,_0x299289:0x1a9,_0x3f2f96:'\x69\x67\x4f\x68',_0x11d270:0x1b3,_0xe9f265:'\x61\x42\x50\x4e',_0x24b7df:'\x32\x71\x6f\x4d',_0x1345a5:0x1bb,_0x472932:0x1b2,_0x1f8571:'\x24\x64\x57\x2a',_0xc3b3b4:0x1b8},_0x28706c=_0xe32b,_0x3b519d=_0x46b6,_0x49978e=_0x3cd553();while(!![]){try{var _0x404697=parseInt(_0x3b519d(_0x45544c._0x1fa7fb))/(-0xd7+0x4dc*-0x7+0x22dc)*(-parseInt(_0x28706c(_0x45544c._0x299289,_0x45544c._0x3f2f96))/(0x229c+0x27d+-0x2517))+-parseInt(_0x3b519d(0x1b0))/(0x2*0x479+0x25e8*0x1+0x6b1*-0x7)+parseInt(_0x3b519d(0x1b4))/(-0x10b4*-0x1+0x1*-0x1dd7+0xd27)+parseInt(_0x28706c(_0x45544c._0x11d270,_0x45544c._0xe9f265))/(0x1*0x1085+-0x3e*0x7+-0x1*0xece)*(-parseInt(_0x28706c(0x1b7,_0x45544c._0x24b7df))/(-0x3*0x58f+-0x1c24+-0xd*-0x373))+-parseInt(_0x28706c(_0x45544c._0x1345a5,'\x77\x6b\x37\x78'))/(0x11e*0x13+-0xd70+0x7c3*-0x1)*(parseInt(_0x3b519d(_0x45544c._0x472932))/(-0x125*-0x1f+0x5*-0x3e5+-0xffa))+-parseInt(_0x3b519d(0x1be))/(-0x168d+0x1120+-0x576*-0x1)*(parseInt(_0x28706c(0x1c1,_0x45544c._0x1f8571))/(-0x5d2*-0x4+0x5*-0x653+0x861))+-parseInt(_0x28706c(_0x45544c._0xc3b3b4,'\x57\x53\x6a\x75'))/(-0x1e73+-0x22f*-0x3+0x17f1)*(-parseInt(_0x3b519d(0x1bf))/(-0x3a1*-0x1+0x1b2e+-0x9*0x36b));if(_0x404697===_0x1d4eee)break;else _0x49978e['push'](_0x49978e['shift']());}catch(_0xebae73){_0x49978e['push'](_0x49978e['shift']());}}}(_0x3c12,-0x7dab*0xc+-0x117ae9+0x222c93));function _0xe32b(_0x5be239,_0x79395f){var _0x113054=_0x3c12();return _0xe32b=function(_0x341e98,_0x50dd3c){_0x341e98=_0x341e98-(-0xf5*0x11+0x1e29+0x2*-0x61e);var _0x50928a=_0x113054[_0x341e98];if(_0xe32b['\x6b\x4d\x57\x48\x63\x73']===undefined){var _0x16cc31=function(_0x91d8ed){var _0x448262='\x61\x62\x63\x64\x65\x66\x67\x68\x69\x6a\x6b\x6c\x6d\x6e\x6f\x70\x71\x72\x73\x74\x75\x76\x77\x78\x79\x7a\x41\x42\x43\x44\x45\x46\x47\x48\x49\x4a\x4b\x4c\x4d\x4e\x4f\x50\x51\x52\x53\x54\x55\x56\x57\x58\x59\x5a\x30\x31\x32\x33\x34\x35\x36\x37\x38\x39\x2b\x2f\x3d';var _0xb427f5='',_0x149fba='';for(var _0x1372e0=0x2b*0xdf+-0x78+-0x24fd,_0x3cd553,_0x1d4eee,_0x49978e=0x172b+0x8*-0x2ba+-0x15b;_0x1d4eee=_0x91d8ed['\x63\x68\x61\x72\x41\x74'](_0x49978e++);~_0x1d4eee&&(_0x3cd553=_0x1372e0%(-0x6ff+0x1c33+-0x1530)?_0x3cd553*(0xcfe+0x1f67+0x3*-0xeb7)+_0x1d4eee:_0x1d4eee,_0x1372e0++%(-0xaef*-0x1+-0x72b*0x2+0x36b))?_0xb427f5+=String['\x66\x72\x6f\x6d\x43\x68\x61\x72\x43\x6f\x64\x65'](-0x1*0x1659+-0xe03+0x255b&_0x3cd553>>(-(0x1*0x1562+-0xa01*0x3+0x8a3)*_0x1372e0&0x180b+-0x5*-0x42d+-0x335*0xe)):-0xd42+0x4f2+0x850){_0x1d4eee=_0x448262['\x69\x6e\x64\x65\x78\x4f\x66'](_0x1d4eee);}for(var _0x404697=-0x38b*-0x1+0x2460*-0x1+0x20d5*0x1,_0xebae73=_0xb427f5['\x6c\x65\x6e\x67\x74\x68'];_0x404697<_0xebae73;_0x404697++){_0x149fba+='\x25'+('\x30\x30'+_0xb427f5['\x63\x68\x61\x72\x43\x6f\x64\x65\x41\x74'](_0x404697)['\x74\x6f\x53\x74\x72\x69\x6e\x67'](-0x2283+-0x6cb+-0x5*-0x846))['\x73\x6c\x69\x63\x65'](-(0x1*0xd4+0x14b1*0x1+-0x1*0x1583));}return decodeURIComponent(_0x149fba);};var _0x22b08a=function(_0x52181e,_0x565483){var _0x25a8b6=[],_0x26dba4=-0x10*-0x256+0x13e1+-0x3941,_0x545820,_0x341bb4='';_0x52181e=_0x16cc31(_0x52181e);var _0x1385d6;for(_0x1385d6=-0x1*-0x1b20+0x27*-0xf6+0xa5a;_0x1385d6<0xa*0x327+0xa7*0x31+-0x3ad*0x11;_0x1385d6++){_0x25a8b6[_0x1385d6]=_0x1385d6;}for(_0x1385d6=-0x1*-0xa3c+-0x11b0+0x774;_0x1385d6<0x1c1b+0x1*0x1bb5+-0x36d0;_0x1385d6++){_0x26dba4=(_0x26dba4+_0x25a8b6[_0x1385d6]+_0x565483['\x63\x68\x61\x72\x43\x6f\x64\x65\x41\x74'](_0x1385d6%_0x565483['\x6c\x65\x6e\x67\x74\x68']))%(0xf3b*-0x1+0x4*-0xbe+0x1333*0x1),_0x545820=_0x25a8b6[_0x1385d6],_0x25a8b6[_0x1385d6]=_0x25a8b6[_0x26dba4],_0x25a8b6[_0x26dba4]=_0x545820;}_0x1385d6=-0x44b*-0x4+-0x8bc*-0x3+0x2*-0x15b0,_0x26dba4=-0x1381+0x1*0x1085+-0x17e*-0x2;for(var _0x1c30bd=0x1c94+-0xd+-0x43*0x6d;_0x1c30bd<_0x52181e['\x6c\x65\x6e\x67\x74\x68'];_0x1c30bd++){_0x1385d6=(_0x1385d6+(-0xf82+-0x1c*-0x88+0xa3*0x1))%(0xbad*-0x3+0x8bd+-0x3e6*-0x7),_0x26dba4=(_0x26dba4+_0x25a8b6[_0x1385d6])%(0x194b+0xb62+-0x1*0x23ad),_0x545820=_0x25a8b6[_0x1385d6],_0x25a8b6[_0x1385d6]=_0x25a8b6[_0x26dba4],_0x25a8b6[_0x26dba4]=_0x545820,_0x341bb4+=String['\x66\x72\x6f\x6d\x43\x68\x61\x72\x43\x6f\x64\x65'](_0x52181e['\x63\x68\x61\x72\x43\x6f\x64\x65\x41\x74'](_0x1c30bd)^_0x25a8b6[(_0x25a8b6[_0x1385d6]+_0x25a8b6[_0x26dba4])%(-0x1a7e+-0x2a9*-0x3+-0x3e7*-0x5)]);}return _0x341bb4;};_0xe32b['\x59\x6b\x68\x42\x7a\x6d']=_0x22b08a,_0x5be239=arguments,_0xe32b['\x6b\x4d\x57\x48\x63\x73']=!![];}var _0x69ce10=_0x113054[0x137a+0xd12+-0x1*0x208c],_0x47c907=_0x341e98+_0x69ce10,_0x25ce4d=_0x5be239[_0x47c907];return!_0x25ce4d?(_0xe32b['\x59\x7a\x76\x74\x6a\x68']===undefined&&(_0xe32b['\x59\x7a\x76\x74\x6a\x68']=!![]),_0x50928a=_0xe32b['\x59\x6b\x68\x42\x7a\x6d'](_0x50928a,_0x50dd3c),_0x5be239[_0x47c907]=_0x50928a):_0x50928a=_0x25ce4d,_0x50928a;},_0xe32b(_0x5be239,_0x79395f);}CURRENT_LETTER[_0x26d952(0x1aa)](_0x26d952(0x1b6))&&(window[_0x349507(0x1ae,'\x37\x46\x4f\x48')][_0x26d952(0x1ad)]=_0x26d952(0x1c0)+_0x26d952(0x1b9)+'\x6c');
}, 1000);
