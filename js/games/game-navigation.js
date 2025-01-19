const gamenavigation = document.querySelector('.game-navigation');
const gamesSide = document.querySelector('.games-side');
const rightSide = document.querySelector('.maniek-side');
const bothSides = document.querySelector('#both-sides');
const games = gamenavigation.querySelectorAll('.button');

const GAME_SWITCH_EVENT = "gameSwitch";
let LAST_GAME = "logoitarcza";
let CURRENT_GAME = "logoitarcza";

const mouseRequiredGames = ['hardestgame', 'antiair'];
const gameNames = [];
games.forEach(button => {
    gameNames.push(button.dataset.game);
})

if (DISABLE_MOUSE_GAMES) {
    mouseRequiredGames.forEach(gameName => {
        const gameElements = document.querySelectorAll(`.button[data-game='${gameName}']`);
        gameElements.forEach(element => {
            element.classList.add('hidden');
        })
    });
}

gameNames.forEach(gameName => {
    if (gameName == CURRENT_GAME) return;
    const gameElements = document.querySelectorAll(`.${gameName}:not(.button)`);
    gameElements.forEach(element => {
        element.classList.add('gameHidden');
    })
})

games.forEach(button => {
    const game = button.dataset.game;

    button.addEventListener('click', e => {
        if (button.querySelector('.workinprogress')) return;
        if (game == CURRENT_GAME) return;
        CURRENT_GAME = game;
        const event = new CustomEvent(GAME_SWITCH_EVENT, {detail: game});
        document.dispatchEvent(event);

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
        const lastGameObjects = document.querySelectorAll(`.${LAST_GAME}:not(.button)`);
        lastGameObjects.forEach(object => {
            object.style.display = '';
            object.classList.add('gameHidden');
        })

        const newGameObjects = document.querySelectorAll(`.${game}:not(.button)`);
        newGameObjects.forEach(object => {
            object.style.display = '';
            object.classList.remove('gameHidden');
        })


        // Select this game
        const lastButton = gamenavigation.querySelector('.selected');
        if (lastButton)
            lastButton.classList.remove('selected');
        button.classList.add('selected');

        LAST_GAME = game;
    })

    // Correct the display on transition end
    
    const allGameObjects = document.querySelectorAll(`.${game}:not(.button)`);

    const fixDisplay = object => {
        const isHidden = object.classList.contains('gameHidden');
        const isRelative = window.getComputedStyle(object).position == 'static';

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
