@echo off
echo 🚀 VCODE Typing Challenge - GitHub Setup
echo.

REM Replace YOUR_USERNAME with your actual GitHub username
set REPO_URL=https://github.com/YOUR_USERNAME/vcodetyping1.git

echo Adding remote repository...
git remote add origin %REPO_URL%

echo.
echo Pushing to GitHub...
git push -u origin main

echo.
echo ✅ If successful, your code is now on GitHub!
echo 📝 Next steps:
echo    1. Go to Netlify and connect this repository
echo    2. Deploy settings should auto-detect correctly
echo    3. Your site will be live at https://vcodetyping1.netlify.app
echo.

pause
