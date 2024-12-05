const gamenavigation = document.querySelector('.game-navigation');
const gamesSide = document.querySelector('.games-side');
const rightSide = document.querySelector('.maniek-side');
const bothSides = document.querySelector('#both-sides');

const games = gamenavigation.querySelectorAll('.button');

let LAST_GAME = "logoitarcza";
let CURRENT_GAME = "logoitarcza";

games.forEach(button => {
    let game = button.dataset.game;

    button.addEventListener('click', e => {
        if (game == CURRENT_GAME) return;
        CURRENT_GAME = game;

        // Change the style of the gameboard
        gamesSide.classList.remove(LAST_GAME);
        gamesSide.classList.add(game);
        rightSide.classList.remove(LAST_GAME);
        rightSide.classList.add(game);
        bothSides.classList.remove(LAST_GAME);
        bothSides.classList.add(game);
        gamenavigation.classList.remove(LAST_GAME);
        gamenavigation.classList.add(game);


        // Hide all last game objects, show the new game objects
        let lastGameObjects = document.querySelectorAll(`.${LAST_GAME}:not(.button)`);
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

        LAST_GAME = game;
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

