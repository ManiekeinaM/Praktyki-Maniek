@echo off
setlocal

:: Wczytanie konfiguracji z pliku
for /f "tokens=2 delims==" %%A in ('findstr /R "^VERSION=" config.txt') do set "VERSION=%%A"

:: Sprawdzenie czy zmienna VERSION została poprawnie wczytana
if not defined VERSION (
    echo Blad: Nie mozna wczytac wersji z config.txt!
    exit /b 1
)

:: Sprawdzenie czy istnieje folder zrodlowy
set "TARGET_DIR=DetectPeople-%VERSION%"
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
    :: Pierwsza konfiguracja wymaga zainstalowania bibliotek
    call Scripts\\python -m pip install -r requirements.txt
)

:: Start serwera z flaga deploy
Scripts\\python main.py --deploy 1

endlocal