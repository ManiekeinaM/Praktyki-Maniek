const gamenavigation = document.querySelector('.game-navigation');
let gamesSide = document.querySelector('.games-side');

let games = gamenavigation.querySelectorAll('.button');
let lastGame = "logoitarcza";

let CURRENT_GAME = "logoitarcza";

games.forEach(button => {
    let game = button.dataset.game;

    button.addEventListener('click', e => {
        CURRENT_GAME = game;

        // Change the style of the gameboard
        gamesSide.classList.remove(lastGame);
        gamesSide.classList.add(game);


        // Hide all last game objects, show the new game objects
        let lastGameObjects = document.querySelectorAll(`.${lastGame}:not(.button)`);
        lastGameObjects.forEach(object => {
            object.style.display = '';
            object.classList.add('hidden');
        })

        let newGameObjects = document.querySelectorAll(`.${game}:not(.button)`);
        newGameObjects.forEach(object => {
            object.style.display = '';
            object.classList.remove('hidden');
        })


        // Select this game
        let lastButton = gamenavigation.querySelector('.selected');
        if (lastButton)
            lastButton.classList.remove('selected');
        button.classList.add('selected');

        lastGame = game;

        console.log(game);
    })

    // Correct the display on transition end
    let allGameObjects = document.querySelectorAll(`.${game}:not(.button)`);

    let fixDisplay = object => {
        let isHidden = object.classList.contains('hidden');
        let isRelative = window.getComputedStyle(object).position == 'static';

        if (isHidden && isRelative) {
            object.style.display = 'none';
        }
    }
    allGameObjects.forEach(object => {
        object.addEventListener('transitionend', e => {
            fixDisplay(object);
        })
        fixDisplay(object);
    });
})

