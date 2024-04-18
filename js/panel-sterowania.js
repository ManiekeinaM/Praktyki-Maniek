const settings = document.querySelectorAll('main .entry');

settings.forEach(setting => {
    let settingName = setting.dataset.setting;

    let checkbox = setting.querySelector(`.switch input[type='checkbox']`);

    // when page loads, set checkbox
    let cookieValue = getCookie(settingName);
    checkbox.checked = (cookieValue == 'true');

    checkbox.addEventListener('change', e => {
        console.log(`Setting ${settingName} changed to ${checkbox.checked}`);

        // when it changes, set that cookie to its value
        setCookie(settingName, checkbox.checked, 9999);
    })
});