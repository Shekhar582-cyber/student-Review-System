# 🚂 Railway Deployment Guide

## Issues Fixed

### 1. ✅ Server Binding Issue
- **Problem**: Server wasn't binding to `0.0.0.0` as required by Railway
- **Solution**: Updated `server.js` to listen on `0.0.0.0` and proper port

### 2. ✅ Missing Configuration Files
- **Added**: `Procfile` for process management
- **Added**: `Dockerfile` for containerized deployment  
- **Added**: `railway.json` for Railway-specific settings

### 3. ✅ Environment Variables
- **Required**: `MONGODB_URI`, `JWT_SECRET`, `NODE_ENV=production`

## Deployment Steps

### 1. **Prepare Environment Variables**
In Railway dashboard, add these environment variables:
```
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/teacher-reviews
JWT_SECRET=your-super-secure-jwt-secret-key-here
```

### 2. **Deploy to Railway**
1. Connect your GitHub repository to Railway
2. Select the root directory of your project
3. Railway will automatically detect the `Procfile` and `Dockerfile`
4. Set the environment variables in Railway dashboard
5. Deploy!

### 3. **Health Check**
Your app will be available at: `https://your-app-name.railway.app`
- Health check endpoint: `https://your-app-name.railway.app/api/health`

## Configuration Files Created

### `Procfile`
```
web: cd server && npm start
```

### `Dockerfile`
- Uses Node.js 20 Alpine
- Installs dependencies for both frontend and backend
- Builds the frontend
- Starts the server

### `railway.json`
- Configures Railway-specific settings
- Sets health check path to `/api/health`
- Configures restart policy

## Troubleshooting

### Common Issues:
1. **Port binding**: Ensure server listens on `0.0.0.0:PORT`
2. **Environment variables**: Check all required vars are set
3. **MongoDB connection**: Verify `MONGODB_URI` is correct and uses a compatible MongoDB version
4. **Build errors**: Check Railway build logs for specific errors
5. **Package version conflicts**: Ensure all package versions are compatible
6. **Node.js version**: Updated to use Node.js 20 for Vite compatibility (Vite 4+ requires Node.js 14.18+, Vite 7+ requires Node.js 20.15+ or 22.2+)
7. **Vite build issues**: Check for Vite configuration errors

### Debug Commands:
```bash
# Check if server is running
curl https://your-app.railway.app/api/health

# Check Railway logs
railway logs
```

### Version Compatibility Issues

If you encounter build failures, check these common version compatibility issues:

1. **React and React DOM**: Use version 18.x.x (not 19.x.x which may cause issues)
2. **Mongoose**: Use version 7.x.x (not 8.x.x which may require Node.js 20+)
3. **Express**: Use version 4.x.x (not 5.x.x which is still in beta)
4. **NPM Dependencies**: Use `--legacy-peer-deps` flag if needed

### Build Process Fixes

If the build process fails:

1. Check Vite configuration in `vite.config.js`
2. Ensure proper proxy settings for API calls
3. Configure proper build output directory
4. Use terser for minification to reduce bundle size

## Performance Notes
- Railway provides automatic scaling
- Health checks ensure service availability
- Restart policy handles failures gracefully
- Optimized for production with proper error handling

