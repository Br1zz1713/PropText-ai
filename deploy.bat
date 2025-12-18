@echo off
echo ==========================================
echo      PropText.ai Deployment Script
echo ==========================================
echo.

:PROMPT
set /p commit_msg="Enter commit message: "
if "%commit_msg%"=="" goto PROMPT

echo.
echo [1/3] Adding files...
git add .

echo.
echo [2/3] Committing changes...
git commit -m "%commit_msg%"

echo.
echo [3/3] Pushing to repository...
git push

echo.
echo ==========================================
echo      Deployment Triggered Successfully
echo ==========================================
pause
