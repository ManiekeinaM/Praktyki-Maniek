const enterfullscreen = document.querySelector('.enter-fullscreen');
const enterfullscreen_button = enterfullscreen.querySelector('button');



enterfullscreen_button.addEventListener('click', () => {
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) { // Firefox
        document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari and Opera
        document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) { // IE/Edge
        document.documentElement.msRequestFullscreen();
    }

    enterfullscreen.style.display = 'none';
});


let isMobile = /Mobi|Android/i.test(navigator.userAgent);
if (isMobile) {
    enterfullscreen.style.display = 'block';
}
let isSmallMobile = isMobile && window.innerWidth <= 500;

document.addEventListener('fullscreenchange', () => {
    if (!isMobile) return;

    if (!document.fullscreenElement) {
        enterfullscreen.style.display = 'block';
    }
});