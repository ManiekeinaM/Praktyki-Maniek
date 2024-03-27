const containers = document.querySelectorAll('.scrollable');

containers.forEach(container => {



    let isMouseDown = false;
    let startY = 0;
    let scrollY = 0;

    function mousedown(event) {
        isMouseDown = true;
        startY = event.clientY;
        scrollY = container.scrollTop;
    }

    function mousemove(event) {
        if (!isMouseDown) return;
        const deltaY = event.clientY - startY;
        container.scrollTop = scrollY - deltaY*2;
    }

    function mouseup() {
        isMouseDown = false;
    }

    container.addEventListener('mousedown', mousedown);
    document.addEventListener('mousemove', mousemove);
    document.addEventListener('mouseup', mouseup);

})