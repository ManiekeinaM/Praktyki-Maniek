@echo off
setlocal

:: Wczytanie konfiguracji z pliku
for /f "tokens=2 delims==" %%A in ('findstr /R "^VERSION=" config.txt') do set "VERSION=%%A"

:: Sprawdzenie czy zmienna VERSION została poprawnie wczytana
if not defined VERSION (
    echo Blad: Nie mozna wczytac wersji z config.txt!
    exit /b 1
)

:: Ustawienie URL i nazwy pliku
set "URL=https://github.com/M1chal3k28/DetectPeople/archive/refs/tags/v%VERSION%.tar.gz"
set "FILE=v%VERSION%.tar.gz"
set "DIR=DetectPeople-%VERSION%"

:: Pobranie pliku
curl -L -o %FILE% %URL%

:: Sprawdzenie czy plik został pobrany
if not exist %FILE% (
    echo Pobieranie nie powiodlo sie.
    exit /b 1
)

:: Wypakowanie archiwum
tar -xvf %FILE% -C .

:: Usunięcie pobranego archiwum
if exist %FILE% del %FILE%

:: Powiadomienie o zakończeniu
echo Pobieranie i wypakowanie zakonczone!
endlocal
