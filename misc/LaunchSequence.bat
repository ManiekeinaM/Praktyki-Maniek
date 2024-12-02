@echo off

REM Start XAMPP
timeout /t 10 /nobreak >nul
start "" "C:\xampp\xampp-control.exe"

REM Start XAMPP services (Apache & MySQL)
timeout /t 2 /nobreak >nul
start "" "C:\xampp\apache_start.bat"
start "" "C:\xampp\mysql_start.bat"

timeout /t 10 /nobreak >nul

REM Determine the correct base URL

IF EXIST "C:\xampp\htdocs\maniek\praktyki-maniek" (
    SET "BASE_URL=http://localhost/maniek/praktyki-maniek"
) ELSE IF EXIST "C:\xampp\htdocs\Praktyki-Maniek" (
    SET "BASE_URL=http://localhost/Praktyki-Maniek"
) ELSE (
    ECHO "Error: Neither 'maniek\praktyki-maniek' nor 'Praktyki-Maniek' directories found in htdocs."
    EXIT /B 1
)

REM Launch Chrome instances using the determined BASE_URL
start /B chrome --app="%BASE_URL%/tv-player.php" --window-position=1680,0 --kiosk --user-data-dir=c:/monitor2 --use-fake-ui-for-media-stream --autoplay-policy=no-user-gesture-required
start /B chrome --app="%BASE_URL%/index.html" --window-position=0,0 --kiosk --user-data-dir=c:/monitor1 --use-fake-ui-for-media-stream --autoplay-policy=no-user-gesture-required

REM Start the AutoHotkey script to focus the window
start "" "%USERPROFILE%\Desktop\focusManiekWindow.ahk"

EXIT