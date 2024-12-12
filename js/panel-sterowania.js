const settings = document.querySelectorAll('main .entry');

settings.forEach(setting => {
    const settingName = setting.dataset.setting;
    const type = setting.dataset.type;

    let cookieValue = getCookie(settingName);

    if (type === 'switch') {
        const checkbox = setting.querySelector(`.switch input[type='checkbox']`);

        // when page loads, set checkbox
        checkbox.checked = (cookieValue == 'true');
    
        checkbox.addEventListener('change', e => {
            console.log(`Setting ${settingName} changed to ${checkbox.checked}`);
    
            // when it changes, set that cookie to its value
            setCookie(settingName, checkbox.checked, 9999);
        })
    } else if (type === 'button') {
        const buttons = setting.querySelectorAll('button');

        buttons.forEach(button => {
            if (button.dataset.value == WHICH_MACHINE) {
                button.classList.add('active');
            }

            button.addEventListener('click', e => {
                const activeButton = setting.querySelector('button.active');
                activeButton.classList.remove('active');
                button.classList.add('active');
                console.log(`Setting ${settingName} changed to ${button.dataset.value}`);
    
                // when it changes, set that cookie to its value
                setCookie(settingName, button.dataset.value, 9999);
            })
        })
    }

    
});