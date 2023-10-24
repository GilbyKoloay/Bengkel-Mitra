@echo off

if not exist "BackEnd\database\invoice.json" (
  copy "scripts\invoice.json" "BackEnd\database\invoice.json"
)

cd BackEnd
npm i

pause
