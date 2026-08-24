@echo off
echo ===================================================
echo   MEEM Game - Iniciando servidor (front-end + banco de dados)
echo ===================================================
echo.

cd /d "%~dp0"

if not exist node_modules (
  echo Instalando dependencias, aguarde...
  call npm install
)

echo Gerando build de producao...
call npm run build

echo.
echo Iniciando servidor...
echo O jogo ficara disponivel no ENDERECO mostrado abaixo.
echo Use o endereco "localhost" neste computador.
echo Use o endereco com o numero de IP para acessar do celular (mesma rede Wi-Fi).
echo Pressione Ctrl+C para parar o servidor.
echo.

call npm run server

pause