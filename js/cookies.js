function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }

  return "";
}

// Figure out whether the machine is Maniek
function isMachineManiek() {
  if (/Mobi|Android/i.test(navigator.userAgent)) {
    console.log("Mobilne!");
    return false;
  }

  let cookie = getCookie('isManiek');

  // TEMPORARY DEFAULT STATE
  if (cookie == '') {
    console.log("Temporary default - isManiek is false");
    return false;
  }

  if (cookie == '' || cookie == 'false') {
    console.log('Maszyna nie jest mańkiem');
    return false;
  }

  if (cookie == 'true') {
    console.log("Maszyna jest mańkiem!");
    return true;
  }

  console.log('Maniek error - false');
  return false;
}

const IS_MANIEK = isMachineManiek();

// Figure out whether today are the open days

function isDniOtwarte() {
  let cookie = getCookie('isDniOtwarte');

  // TEMPORARY DEFAULT STATE
  if (cookie == '') {
    console.log("Temporary default - isDniOtwarte is true");
    
    return true;
  }

  if (cookie == '' || cookie == 'false') {
    console.log('Nie są dni otwarte');
    return false;
  }

  if (cookie == 'true') {
    console.log("Są dni otwarte!");
    return true;
  }

  console.log("Dni otwarte error - false");
  return false;
}

const IS_DNI_OTWARTE = isDniOtwarte();
console.log(IS_DNI_OTWARTE);