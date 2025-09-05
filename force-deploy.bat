@echo off
chcp 65001 >nul
echo ===========================================
echo        强制更新GitHub Pages部署
echo ===========================================
echo.

echo 1. 清理Git缓存...
git rm -r --cached .
git add .

echo.
echo 2. 创建新的提交...
git commit -m "🚀 强制更新GitHub Pages部署 - %date% %time%"

echo.
echo 3. 推送到GitHub...
git push origin main --force

echo.
echo 4. 等待GitHub Pages更新...
echo   ⏳ GitHub Pages通常需要1-5分钟来构建和部署
echo   🌐 您的网站地址: https://worker100.github.io

echo.
echo 5. 清除浏览器缓存...
echo   请按Ctrl+F5刷新浏览器页面，或清除浏览器缓存

echo.
echo 6. 在浏览器中打开网站...
start https://worker100.github.io

echo.
echo ===========================================
echo 部署完成！请等待几分钟后刷新网站页面
echo ===========================================
pause
