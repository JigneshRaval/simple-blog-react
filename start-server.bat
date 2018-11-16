:: The below script will simply exit after running the first command.
:: This is because npm itself runs as a batch file in Windows.
:: To correct this, we need to call npm with the use of call command
:: http://www.madhur.co.in/blog/2011/12/29/cmdshellfirst.html

@echo off
echo.
echo =================================================
echo 	Starting simple React Blog
echo =================================================
@echo on

call nodemon server-express.js

pause
