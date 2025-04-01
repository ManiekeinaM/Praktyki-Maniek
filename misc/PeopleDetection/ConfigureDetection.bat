@echo off
setlocal

:: Sprawdzenie czy istnieje folder zrodlowy
set "TARGET_DIR=DetectPeople-1.0.0"
if not exist %TARGET_DIR% (
    echo Folder %TARGET_DIR% nie istnieje.
    echo Pobieranie i wypakowanie...
    call download.bat
    
    :: Sprawdzenie jeszcze raz po pobraniu
    if not exist %TARGET_DIR% (
        echo Pobieranie nie powiodlo sie.
        exit /b 1
    )
)

cd %TARGET_DIR%

:: Sprawdzenie czy istnieje folder Scripts (czyli czy venv istnieje)
if not exist Scripts (
    echo Tworzenie srodowiska wirtualnego Python...
    call py -m venv .
    cd Scripts
    activate 
    cd ..
    :: Pierwsza konfiguracja wymaga zainstalowania bibliotek
    call python -m pip install -r requirements.txt
)

:: Start serwera z flaga deploy
Scripts\\python main.py --deploy 1

endlocal