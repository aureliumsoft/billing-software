@echo off
title Building Cafe POS Installer - Aurelium Soft
cls

echo ================================================
echo   Cafe POS System - Installer Builder
echo   Aurelium Soft
echo ================================================
echo.
echo This will create a Windows installer (.exe)
echo.
echo Steps:
echo  1. Build React application (optimized)
echo  2. Package with Electron Builder
echo  3. Create installer in dist folder
echo.
echo This may take 2-5 minutes...
echo.
pause
echo.

echo ================================================
echo   Step 1: Building React Application...
echo ================================================
call npm run build
if %errorlevel% neq 0 (
    echo.
    echo ❌ React build failed!
    pause
    exit /b 1
)

echo.
echo ================================================
echo   Step 2: Creating Windows Installer...
echo ================================================
call electron-builder --win --x64
if %errorlevel% neq 0 (
    echo.
    echo ❌ Installer creation failed!
    pause
    exit /b 1
)

echo.
echo ================================================
echo   ✅ SUCCESS!
echo ================================================
echo.
echo Your installer is ready!
echo.
echo Location: dist\Cafe POS System-Setup-1.0.0.exe
echo.
echo You can now distribute this installer to users.
echo.
pause
