@echo off
echo Copying CEO image...
copy "C:\Users\Asus\.gemini\antigravity\brain\4f636acf-41f8-48e2-b9e5-7747436d2f56\media__1776352888397.jpg" "c:\Users\Asus\OneDrive\Documents\Desktop\GS powertech\assets\ceo.jpg"
if %errorlevel% equ 0 (
    echo Image copied successfully!
) else (
    echo Failed to copy image.
)
pause
