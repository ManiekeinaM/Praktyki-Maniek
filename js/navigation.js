const navigation = document.querySelector(".navigation-container");
const buttons = navigation.querySelectorAll(".button");

// console.log(buttons);

buttons.forEach(button => {
    const target = button.dataset.tab;
    let name = button.dataset.name;

    // Hide wheel of fortune if not dni otwarte
    if (!IS_DNI_OTWARTE && target == 'wheel.php') {
        button.style.display = 'none';
    }

    button.addEventListener("click", e => {
        window.location.href = target;
    })

    // Add a label above the button
    if (name) {
        let label = document.createElement('p');
        label.classList.add('label');
        label.innerText = name;

        button.appendChild(label);
    }

})