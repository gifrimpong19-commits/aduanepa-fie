@echo off
cd /d "%~dp0"
echo Pushing AduanePa Fie to GitHub repository: https://github.com/gifrimpong19-commits/aduanepa-fie.git ...
"%LOCALAPPDATA%\Programs\Git\cmd\git.exe" push -u origin main
echo.
echo ========================================================
echo If successful, your code is live on GitHub!
echo ========================================================
pause
