@echo off
setlocal

:: Ustawienie URL i nazwy pliku
set "URL=https://github.com/M1chal3k28/DetectPeople/archive/refs/tags/v1.0.0.tar.gz"
set "FILE=v1.0.0.tar.gz"
set "DIR=DetectPeople-1.0.0"

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
