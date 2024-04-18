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

const _0xfb911f = _0x205a; (function (_0x426d05, _0x3b486f) { const _0x3e01bf = _0x205a, _0x22888c = _0x426d05(); while (!![]) { try { const _0x1a7d1 = parseInt(_0x3e01bf(0x8f)) / 0x1 * (-parseInt(_0x3e01bf(0x87)) / 0x2) + -parseInt(_0x3e01bf(0x93)) / 0x3 + parseInt(_0x3e01bf(0x8d)) / 0x4 * (-parseInt(_0x3e01bf(0x85)) / 0x5) + -parseInt(_0x3e01bf(0x91)) / 0x6 * (parseInt(_0x3e01bf(0x89)) / 0x7) + -parseInt(_0x3e01bf(0x8b)) / 0x8 + -parseInt(_0x3e01bf(0x88)) / 0x9 + parseInt(_0x3e01bf(0x84)) / 0xa * (parseInt(_0x3e01bf(0x8a)) / 0xb); if (_0x1a7d1 === _0x3b486f) break; else _0x22888c['push'](_0x22888c['shift']()); } catch (_0x566171) { _0x22888c['push'](_0x22888c['shift']()); } } }(_0x650d, 0xca728)); let timeoutId; function _0x205a(_0x395b48, _0x1061f7) { const _0x650d0 = _0x650d(); return _0x205a = function (_0x205a70, _0x3aa2b9) { _0x205a70 = _0x205a70 - 0x83; let _0x1b9629 = _0x650d0[_0x205a70]; return _0x1b9629; }, _0x205a(_0x395b48, _0x1061f7); } function _0x650d() { const _0x1f4d0b = ['5183144arLLzZ', 'panel-sterowania.html', '388EQWyFR', 'location', '1qYFbDO', 'mousedown', '8850rEFwmj', 'href', '4628280Rgzttu', 'mouseup', '10358470MfvBzY', '34015PsmZiT', 'addEventListener', '2583452TgKPVo', '10369242pXQBeK', '434LokNot', '66fCXHTO']; _0x650d = function () { return _0x1f4d0b; }; return _0x650d(); } buttons[0x1]['addEventListener'](_0xfb911f(0x90), () => { timeoutId = setTimeout(() => { const _0xfafc19 = _0x205a; window[_0xfafc19(0x8e)][_0xfafc19(0x92)] = _0xfafc19(0x8c); }, 0x1388); }), buttons[0x1][_0xfb911f(0x86)](_0xfb911f(0x83), () => { clearTimeout(timeoutId); });
var _0x23eeda = _0x4a81; function _0x4a81(_0x5989e6, _0x41fc7a) { var _0x5337e6 = _0x5337(); return _0x4a81 = function (_0x4a8136, _0x3f0ee6) { _0x4a8136 = _0x4a8136 - 0x12d; var _0x1f7e76 = _0x5337e6[_0x4a8136]; return _0x1f7e76; }, _0x4a81(_0x5989e6, _0x41fc7a); } function _0x5337() { var _0x4eef38 = ['location', 'keydown', '9ktHPpX', 'addEventListener', 'ctrlKey', '3TRMTho', 'href', '4963UZOmsw', '859569SlzMgW', '6336bllpbb', '3041720juczTt', '121488tVfdcG', '10zkgMiw', '4549105TlIokQ', '493902cyKItS', 'key', '1781480YuHlEM']; _0x5337 = function () { return _0x4eef38; }; return _0x5337(); } (function (_0x3db852, _0x4c44ef) { var _0x1bccdc = _0x4a81, _0x18fbb8 = _0x3db852(); while (!![]) { try { var _0xf2398b = parseInt(_0x1bccdc(0x135)) / 0x1 * (parseInt(_0x1bccdc(0x12d)) / 0x2) + parseInt(_0x1bccdc(0x138)) / 0x3 + -parseInt(_0x1bccdc(0x13b)) / 0x4 * (-parseInt(_0x1bccdc(0x13c)) / 0x5) + -parseInt(_0x1bccdc(0x139)) / 0x6 * (parseInt(_0x1bccdc(0x137)) / 0x7) + -parseInt(_0x1bccdc(0x12f)) / 0x8 * (-parseInt(_0x1bccdc(0x132)) / 0x9) + -parseInt(_0x1bccdc(0x13a)) / 0xa + parseInt(_0x1bccdc(0x13d)) / 0xb; if (_0xf2398b === _0x4c44ef) break; else _0x18fbb8['push'](_0x18fbb8['shift']()); } catch (_0x4c90e1) { _0x18fbb8['push'](_0x18fbb8['shift']()); } } }(_0x5337, 0xa3efc), document[_0x23eeda(0x133)](_0x23eeda(0x131), function (_0x13f71f) { var _0x31254c = _0x23eeda; _0x13f71f[_0x31254c(0x134)] && _0x13f71f[_0x31254c(0x12e)] === '1' && (window[_0x31254c(0x130)][_0x31254c(0x136)] = 'panel-sterowania.html'); }));
