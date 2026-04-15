@echo off
echo =========================================
echo GS Powertech - GitHub Auto Uploader
echo =========================================

echo Checking and initializing Git...
git init
git add .
git commit -m "Initial commit for GS Powertech Platform"

echo Linking to GitHub repository...
git branch -M main
git remote add origin https://github.com/nalkar4280-sudo/GS-POWERTECH.git

echo Uploading files to GitHub...
git push -u origin main

echo =========================================
echo Upload Complete! You can close this window.
echo =========================================
pause
