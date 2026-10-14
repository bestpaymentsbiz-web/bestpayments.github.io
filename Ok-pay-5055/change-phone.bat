@echo off
setlocal

set "NEWNUM=%~1"
if "%NEWNUM%"=="" (
    set /p NEWNUM=Enter new phone number (e.g. 010-1234-5678):
)

if "%NEWNUM%"=="" (
    echo No number entered. Exiting.
    pause
    exit /b 1
)

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0change-phone.ps1" -NewNumber "%NEWNUM%"

echo.
pause
