const scrollers = document.querySelectorAll('.scrolling-images');
const scrollContainers = document.querySelectorAll('.scroll-container');
const IMAGE_WIDTH = 400;
const SPEED = 150;

function updateScroller(scroller) {
    const numberOfChildren = scroller.children.length;
    const scrollDistance = IMAGE_WIDTH * numberOfChildren;
    
    // Duration = distance / speed
    const scrollDuration = scrollDistance / SPEED;
    console.log(numberOfChildren);
  
    // Set CSS variables
    scroller.style.setProperty('--scroll-distance', `${scrollDistance}px`);
    scroller.style.setProperty('--scroll-duration', `${scrollDuration}s`);
}

function duplicateScrollingContent(scroller) {
    const numberOfChildren = scroller.children.length;

    if (!scroller.dataset.duplicated) {
        for (let i = 0; i < numberOfChildren; i++) {
            const childClone = scroller.children[i].cloneNode();
            scroller.appendChild(childClone);
        }
        for (let i = 0; i < numberOfChildren; i++) {
            const childClone = scroller.children[i].cloneNode();
            scroller.appendChild(childClone);
        }
        // Mark as duplicated to prevent future duplications
        scroller.dataset.duplicated = 'true';
    }
}

scrollers.forEach((scroller) => {
    updateScroller(scroller);
    duplicateScrollingContent(scroller);
});