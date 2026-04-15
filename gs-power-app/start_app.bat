@echo off
echo ==========================================
echo GS Powertech - Mobile App Setup
echo ==========================================
echo.
echo 1. Installing dependencies...
call npm install
echo.
echo 2. Clearing old Metro cache to prevent Windows errors...
if exist ".expo" rmdir /s /q ".expo"
echo.
echo 3. Starting Expo...
echo (If you see a script error, I will try the backup method)
call npx expo start -c || call npx.cmd expo start -c
echo.
pause
