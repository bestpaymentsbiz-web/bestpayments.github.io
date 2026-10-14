@echo off
setlocal

set "NEWLINK=%~1"
if "%NEWLINK%"=="" (
    set /p NEWLINK=Enter new consult link - Kakao openchat/channel, Instagram, Telegram etc. (e.g. https://pf.kakao.com/_xxxxx):
)

if "%NEWLINK%"=="" (
    echo No link entered. Exiting.
    pause
    exit /b 1
)

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0change-kakao.ps1" -NewLink "%NEWLINK%"

echo.
pause
