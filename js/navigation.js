const navigation = document.querySelector(".navigation-container");
const buttons = navigation.querySelectorAll(".button");

console.log(buttons);

buttons.forEach(button => {
    const target = button.dataset.tab;

    button.addEventListener("click", e => {
        window.location.href = target;
    })
})