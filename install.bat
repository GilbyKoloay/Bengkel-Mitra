@echo off

if not exist "BackEnd\database\invoice.json" (
  copy "BackEnd\database\_.json" "BackEnd\database\invoice.json"
)

cd BackEnd
npm i

pause
