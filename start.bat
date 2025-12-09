@echo off
echo ===================================================
echo       AI Job Assistant - Startup Script
echo ===================================================

echo.
echo [1/4] Checking Backend Environment...
cd backend
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate

echo Installing/Updating dependencies...
pip install -r requirements.txt > nul 2>&1

echo Checking spaCy model...
python -c "import spacy; spacy.load('en_core_web_sm')" > nul 2>&1
if %errorlevel% neq 0 (
    echo Downloading spaCy model (en_core_web_sm)...
    python -m spacy download en_core_web_sm
)

echo.
echo [2/4] Starting Backend Server...
start "AI Job Assistant Backend" cmd /k "title AI Job Assistant Backend && python app.py"

echo.
echo [3/4] Checking Frontend Environment...
cd ..\frontend
if not exist node_modules (
    echo Installing frontend dependencies (this may take a while)...
    call npm install
)

echo.
echo [4/4] Starting Frontend Server...
start "AI Job Assistant Frontend" cmd /k "title AI Job Assistant Frontend && npm start"

echo.
echo ===================================================
echo       System Started Successfully!
echo ===================================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit this launcher (servers will keep running)...
pause > nul
