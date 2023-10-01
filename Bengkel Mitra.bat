@echo off

start /min server.bat

timeout /t 5
start client.bat
