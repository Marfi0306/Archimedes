# The Caravaggio — independent static export

Samodzielna statyczna wersja strony. Układ responsywny, obrazy, menu, kotwice, galeria, marquee i animacje działają bez środowiska Wix.

## Lokalnie

```bash
python3 -m http.server 8000
```

Otwórz `http://localhost:8000`.

## Vercel

Zaimportuj repozytorium jako **Other**, bez Build Command. Output Directory pozostaw puste (`.`). Projekt nie wymaga zmiennych środowiskowych ani instalacji zależności.