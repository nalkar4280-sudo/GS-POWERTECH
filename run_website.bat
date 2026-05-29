@echo off
echo ==========================================
echo GS Powertech - Launching Website
echo ==========================================
echo.
echo 1. Starting Backend Server...
start "" http://localhost:5005
node server.js
pause
