@echo off
cd /d "d:\GitHub Project\mengdingshan-tea"

echo ============================================
echo  蒙顶山茶文化数字博物馆 - 启动器
echo ============================================
echo.

echo [1/2] 启动本地服务器...
start "Museum Server" cmd /c "python -m http.server 3000"

timeout /t 3 /nobreak >nul

echo [2/2] 启动内网穿透...
echo.
start "Museum Tunnel" cmd /c "npx localtunnel --port 3000"

echo.
echo ============================================
echo  ✓ 服务器已启动
echo  ✓ 隧道启动中...
echo   等待几秒出现 "your url is:" 即可
echo.
echo  把上面的链接发给同事就能访问了！
echo ============================================
pause
