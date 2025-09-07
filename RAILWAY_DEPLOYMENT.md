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
- Uses Node.js 18 Alpine
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
3. **MongoDB connection**: Verify `MONGODB_URI` is correct
4. **Build errors**: Check Railway build logs for specific errors

### Debug Commands:
```bash
# Check if server is running
curl https://your-app.railway.app/api/health

# Check Railway logs
railway logs
```

## Performance Notes
- Railway provides automatic scaling
- Health checks ensure service availability
- Restart policy handles failures gracefully
- Optimized for production with proper error handling

