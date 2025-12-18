@echo off
echo ==========================================
echo      PropText.ai - GitHub Sync Script
echo ==========================================
echo.

echo [1/4] Renaming branch to 'main'...
git branch -M main

echo.
echo [2/4] Configuring remote repository...
git remote remove origin
git remote add origin https://github.com/Br1zz1713/PropText-ai.git

echo.
echo [3/4] Adding and Committing any pending changes...
git add .
git commit -m "Deployment Sync: Production Ready"

echo.
echo [4/4] Pushing to GitHub (Force Update)...
git push -u origin main --force

echo.
echo ==========================================
echo      DONE! Project is now on GitHub.
echo ==========================================
pause
