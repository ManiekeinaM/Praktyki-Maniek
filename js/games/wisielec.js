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
let lettersToGuess = {};
let FAILS = 0; // 6 fails = lose

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