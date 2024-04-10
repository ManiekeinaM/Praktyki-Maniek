let gamenavigation = document.querySelector('.game-navigation');

let games = gamenavigation.querySelectorAll('.button');
games.forEach(button => {
    let game = button.dataset.game;

    button.addEventListener('click', e => {
        console.log(game);
    })
})
