@echo off
echo ================================================
echo   Starting Cafe POS Desktop Application
echo ================================================
echo.
echo Launching desktop application...
echo.

cd /d "%~dp0"
node_modules\.bin\electron.cmd electron-simple.js

pause

