@echo off
echo =========================================
echo GS Powertech - Auto Pushing Updates...
echo =========================================

git add .
git commit -m "Fix Vercel routing and express static conflicts"
git push origin main

echo =========================================
echo Update Pushed! Check Vercel Dashboard for deployment progress.
echo =========================================
pause
