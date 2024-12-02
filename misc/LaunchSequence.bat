@echo off

REM start xampp
timeout /t 10 /nobreak >nul
start "" "C:\xampp\xampp-control.exe"

REM start xampp services (apache & mysql)
timeout /t 2 /nobreak >nul
start "" "C:\xampp\apache_start.bat"

start "" "C:\xampp\mysql_start.bat"

timeout /t 10 /nobreak >nul

REM after 10sec, the windows were probably loaded, start the site on both monitors
REM TODO use AHK instead

start /B chrome --app="http://localhost/maniek/praktyki-maniek/tv-player.php" --window-position=1680,0 --kiosk --user-data-dir=c:/monitor2
start /B chrome --app="http://localhost/maniek/praktyki-maniek/index.html" --window-position=0,0 --kiosk --user-data-dir=c:/monitor1

start "" "%USERPROFILE%\Desktop\focusManiekWindow.ahk"

cmd /k