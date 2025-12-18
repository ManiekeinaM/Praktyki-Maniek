# 🖥️ Instrukcja konfiguracji i użytkowania projektu **Maniek**

## 🎬 Dodawanie filmików do TV
Filmy są domyślnie w formacie .mp4 oraz są podzielone na priorytetowe i regularne.
Na każde dwa regularne filmy przypada jeden priorytetowy:
**Priority1 -> Regular1 -> Regular2 -> Priority2 -> ...**

### Lokalnie
1. Przejdź do folderu:
  `C:/xampp/htdocs/Praktyki-Maniek/videos`
2. W folderze powinny się znajdywać podfoldery `priority` oraz `regular`
3. Wrzuć do podfolderu `priority` filmy priorytetowe, a filmy regularne do `regular`
4. Playlista odtwarzacza powinna odświeżyć się automatycznie po paru sekundach

### Za pomocą dysku USB
1. Upewnij się, że dysk USB zawiera foldery `priority` oraz `regular`, a w nich filmy
2. Podłącz dysk USB do komputera/laptopa w Mańku
3. Upewnij się, że Maniek (interfejs) jest włączony
4. Playlista odtwarzacza powinna odświeżyć się automatycznie po paru sekundach
   
---

## 🛠️ Ustawienie dowolnej maszyny jako **Maniek**

### ✅ Wymagane oprogramowanie:
- **XAMPP**
- **AutoHotkey V2**
- **Git** lub **GitHub Desktop** (do pobrania projektu)

### 🗓️ Harmonogram zadań (Windows):
- `misc/AbsoluteShutdown.bat`  
  > Umieść skrót na pulpicie i ustaw na godzinę **~17:00**  
  > ❌ Odznacz opcję: _"Uruchom szybko zadanie, jeśli pominięto zaplanowane uruchomienie"_
- `misc/LaunchSequence.bat`  
  > Umieść skrót na pulpicie i ustaw uruchamianie **przy logowaniu/z uruchomieniem systemu** z małym opóźnieniem

### ⚙️ BIOS:
- Włącz **autostart** systemu ok. **6:55**

### 🖥️ Konfiguracja ekranów:
- Użyj programu **Dual Monitor Tools** do zablokowania wyjeżdżania kursora na drugi ekran
- Użyj **tylko monitora kioskowego**, lub:
  - Podłącz TV jako drugi ekran – wtedy `LaunchSequence` automatycznie otworzy `tv-player.php` na ekranie TV

### 📂 Struktura projektu:
- Umieść projekt w folderze:  
  `C:/xampp/htdocs/Praktyki-Maniek` **lub** `C:/xampp/htdocs/maniek/Praktyki-Maniek`
- Aktualizacja projektu odbywa się **manualnie** przez **GitHub Desktop (fetch/pull)**
- Jeśli przeglądarka nie odświeża zmian, użyj **Shift + F5**

---

## 🗺️ Dodawanie punktu do mapy

### 🔧 Edycja pliku `map-points.js`:
- Na górze pliku znajduje się tablica z punktami (`dots`) dla każdego piętra:
  - `'dot'` – punkt docelowy (niewymagana nazwa)
  - `'Wdot'` – punkt nawigacyjny (niewymagana nazwa)
  - `'Xdot'` – punkt funkcyjny (np. strzałki). Musi zawierać pole `destination` z ilością pikseli przesunięcia.

### 🔗 Każdy punkt `'Wdot'` powinien mieć `connections` – połączenia z innymi punktami.

### 🖋️ Czcionka:
- **Siemens Sans SC Black** – używana do dużych opisów

### 👇 Dodawanie punktu na stronie mapy:
1. **F2** – włącza tryb DEV (narzędzie dodawania punktów w lewym dolnym rogu)
2. Kliknij na mapę → współrzędne się wypełnią
3. Dodaj opis (opcjonalnie) i naciśnij **Enter**, aby zatwierdzić
4. Kliknij w **pomarańczowy tekst punktu**, aby skopiować JSON do schowka
5. Wklej dane do tablicy z punktami w `map-points.js`:
   - `Floor0` – parter  
   - `Floor1` – piętro 1  
   - `Floor2A` – piętro 2A  
   - `Floor2B` – piętro 2B
6. Zmień nazwę punktu zgodnie z konwencją
7. Dodaj połączenia (`connections`)

### 🧪 Tryb developera:
- **F2** – włącza/wyłącza tryb DEV
- **F3** – pokazuje nazwy wszystkich punktów

---

## 🎡 Koło fortuny (dni otwarte)

- Po uruchomieniu koła są **zablokowane**
- Klawisze sterujące:
  - **1** – zablokuj widoczne koło
  - **2** – odblokuj widoczne koło
- Po każdym zakręceniu, koło automatycznie się **blokuje**
- Użytkownik może kręcić kołem tylko, jeśli prowadzący je **odblokuje**

---

📌 **Uwaga:** Jeśli masz pytania lub coś przestało działać — sprawdź harmonogramy zadań, strukturę folderów i odśwież przeglądarkę (Shift + F5).

