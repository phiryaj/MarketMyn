@echo off
echo Starting MarketMyn Server...
echo Please leave this window open while using the website.
cd /d "%~dp0"
if not exist node_modules (
    echo Node modules not found. Installing...
    call npm install
)
npm start
pause
