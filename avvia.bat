@echo off
REM Avvia Rugby Train Creator in locale e apre il browser.
REM Doppio clic su questo file.
cd /d "%~dp0"
echo.
echo  Rugby Train Creator - avvio server locale...
echo  Apri:  http://localhost:8000
echo  (Per chiudere: chiudi questa finestra)
echo.
start "" http://localhost:8000
python -m http.server 8000
