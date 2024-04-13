@echo off

timeout /t 10 /nobreak >nul
start "" "C:\xampp\xampp-control.exe"

timeout /t 2 /nobreak >nul
start "" "C:\xampp\apache_start.bat"

start "" "C:\xampp\mysql_start.bat"

timeout /t 10 /nobreak >nul

//start /B chrome --kiosk "C:\Program Files\Google\Chrome\Application\chrome.exe" --kiosk "http://localhost/Final/Praktyki-Maniek-main/index.html"

start /B chrome --app="http://localhost/maniek/Praktyki-Maniek/tv-player.php" --window-position=1680,0 --kiosk --user-data-dir=c:/monitor2
start /B chrome --app="http://localhost/maniek/Praktyki-Maniek/index.html" --window-postion=0,0 --kiosk --user-data-dir=c:/monitor1

cmd /k