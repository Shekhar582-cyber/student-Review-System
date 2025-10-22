@echo off
echo 🚀 Teacher Review System - Deployment Script
echo =============================================

if not exist package.json (
    echo ❌ Error: package.json not found. Please run this script from the project root.
    pause
    exit /b 1
)

echo 📦 Installing dependencies...
call npm install

echo 🏗️ Building frontend for production...
call npm run build

echo.
echo 📋 Deployment Summary:
echo ======================
echo ✅ Frontend built successfully in 'dist' folder
echo ✅ Ready for Netlify deployment
echo.
echo 📝 Next Steps:
echo 1. Deploy backend to Render:
echo    - Push code to GitHub
echo    - Connect repository to Render
echo    - Set environment variables (see .env.example)
echo.
echo 2. Deploy frontend to Netlify:
echo    - Drag 'dist' folder to Netlify
echo    - Or connect GitHub repository
echo.
echo 3. Update API URL in src/config/api.js with your Render URL
echo.
echo 📖 Full instructions: See RENDER_NETLIFY_DEPLOYMENT.md
echo.
echo 🎉 Ready for deployment!
pause