@echo off
echo ========================================
echo    AI探索者 - AI资讯系统启动脚本
echo ========================================
echo.

REM 检查Node.js是否安装
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js 未安装，请先安装 Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js 已安装
echo.

REM 切换到后端目录
cd backend

REM 检查是否已安装依赖
if not exist node_modules (
    echo 📦 正在安装后端依赖...
    npm install
    if errorlevel 1 (
        echo ❌ 依赖安装失败
        pause
        exit /b 1
    )
    echo ✅ 依赖安装完成
    echo.
)

REM 启动后端服务
echo 🚀 启动AI资讯后端服务...
echo.
echo 服务将运行在: http://localhost:3001
echo API健康检查: http://localhost:3001/api/health
echo.
echo 按 Ctrl+C 停止服务
echo.

npm start
