# Archimedes — eksport publicznego frontendu

Źródło: https://www.thecaravaggio.com/
Data pobrania: 16 września 2026.

Zapisano oryginalny HTML, osadzone CSS i JavaScript, publiczną konfigurację Wix, pobrane skrypty, fonty, obrazy, SVG i dokument PDF. Część obrazów, CSS i SVG zapisano bezpośrednio przez funkcję eksportu zasobów przeglądarki; pozostałe zasoby pobrano z adresów używanych przez stronę.

## Pliki

- `original.html`: niezmieniona odpowiedź HTML serwera.
- `index.html`: HTML z lokalnymi odnośnikami do pobranych zasobów.
- `assets/`: pobrane zasoby.
- `manifest.json`: adresy źródłowe, ścieżki, rozmiary i błędy pobrania.
- `serve.py`: pomocniczy adapter lokalnego podglądu. Nie jest kodem serwera Wix.

## Uruchomienie

```sh
python3 serve.py
```

Otwórz http://127.0.0.1:8766. Adapter dopasowuje domenę konfiguracji i przekazuje żądania do publicznych usług oryginalnej strony. Potrzebuje internetu. Sam HTML można również przeglądać przez zwykły serwer statyczny.

## Ograniczenia

To eksport dostępnych plików, a nie projekt źródłowy z edytora Wix ani jego backend. Skrypty pobrano w wersji produkcyjnej, często zminifikowanej. Wix ładuje również kolejne zasoby dynamicznie. Zapisano dostępne skrypty animacji i interakcji, ale nie potwierdzono pełnej zgodności wszystkich interakcji poza domeną Wix.

Podgląd lokalny został otwarty w przeglądarce; potwierdzono widoczną strukturę strony i główny obraz. Zwykły serwer statyczny ujawnił ograniczenia Worker i routingu Wix związane ze zmianą domeny. Adapter łagodzi te ograniczenia, lecz pełne działanie galerii, responsywności i animacji wymaga dalszej weryfikacji.

Pobranie plików nie zmienia praw do oryginalnych treści, obrazów ani bibliotek.
