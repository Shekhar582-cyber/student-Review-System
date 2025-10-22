# 🚀 Render + Netlify Deployment Guide

## 📋 **Prerequisites**
- GitHub account
- Render account (free tier available)
- Netlify account (free tier available)
- MongoDB Atlas account (free tier available)

## 🗄️ **Step 1: Setup MongoDB Atlas**

1. **Create MongoDB Atlas Account**: https://www.mongodb.com/atlas
2. **Create a New Cluster** (Free M0 tier)
3. **Create Database User**:
   - Username: `admin`
   - Password: Generate a secure password
4. **Whitelist IP Addresses**: Add `0.0.0.0/0` (allow from anywhere)
5. **Get Connection String**: 
   ```
   mongodb+srv://admin:PASSWORD@cluster0.xxxxx.mongodb.net/teacher-reviews?retryWrites=true&w=majority
   ```

## 🖥️ **Step 2: Deploy Backend to Render**

### **Option A: Using GitHub Integration (Recommended)**

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

2. **Connect to Render**:
   - Go to https://render.com
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your repository

3. **Configure Service**:
   - **Name**: `teacher-review-api`
   - **Region**: Oregon (US West)
   - **Branch**: `main`
   - **Root Directory**: Leave empty
   - **Runtime**: Node
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`

4. **Set Environment Variables**:
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=mongodb+srv://admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/teacher-reviews?retryWrites=true&w=majority
   JWT_SECRET=your-super-secure-jwt-secret-minimum-32-characters
   ```

5. **Deploy**: Click "Create Web Service"

### **Option B: Using render.yaml (Alternative)**

1. **Update render.yaml** with your specific configuration
2. **Push to GitHub** and Render will auto-deploy

## 🌐 **Step 3: Deploy Frontend to Netlify**

### **Option A: Drag & Drop (Quick)**

1. **Build the Frontend**:
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**:
   - Go to https://netlify.com
   - Drag the `dist` folder to Netlify deploy area
   - Your site will be deployed instantly

### **Option B: GitHub Integration (Recommended)**

1. **Connect to Netlify**:
   - Go to https://netlify.com
   - Click "New site from Git"
   - Connect your GitHub repository
   - Select your repository

2. **Configure Build Settings**:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: `18`

3. **Deploy**: Click "Deploy site"

## 🔗 **Step 4: Connect Frontend to Backend**

1. **Get your Render Backend URL**:
   - Example: `https://teacher-review-api-xxxx.onrender.com`

2. **Update API Configuration**:
   ```javascript
   // src/config/api.js
   const API_BASE_URL = import.meta.env.PROD 
     ? 'https://your-render-app-name.onrender.com/api'
     : 'http://localhost:3001/api';
   ```

3. **Update CORS in Backend**:
   - Add your Netlify URL to Render environment variables:
   ```
   CORS_ORIGIN=https://your-netlify-app.netlify.app
   ```

4. **Redeploy Both Services**

## ✅ **Step 5: Verify Deployment**

### **Test Backend**:
```bash
curl https://your-render-app.onrender.com/api/health
```

### **Test Frontend**:
- Visit your Netlify URL
- Try registering a new user
- Try logging in
- Test adding teachers (as admin)
- Test submitting reviews (as student)

## 🔧 **Step 6: Custom Domain (Optional)**

### **For Netlify (Frontend)**:
1. Go to Site Settings → Domain Management
2. Add custom domain
3. Configure DNS records

### **For Render (Backend)**:
1. Go to Settings → Custom Domains
2. Add your API subdomain (e.g., `api.yourdomain.com`)
3. Configure DNS records

## 📊 **Monitoring & Maintenance**

### **Render Monitoring**:
- Check logs in Render dashboard
- Monitor response times
- Set up health checks

### **Netlify Monitoring**:
- Check build logs
- Monitor site performance
- Set up form handling if needed

### **MongoDB Atlas Monitoring**:
- Monitor database performance
- Check connection limits
- Review query performance

## 🚨 **Troubleshooting**

### **Common Issues**:

1. **CORS Errors**:
   - Ensure CORS_ORIGIN is set correctly in Render
   - Check that frontend URL matches exactly

2. **Database Connection Issues**:
   - Verify MongoDB URI is correct
   - Check IP whitelist in MongoDB Atlas
   - Ensure database user has proper permissions

3. **Build Failures**:
   - Check Node.js version compatibility
   - Verify all dependencies are in package.json
   - Check build logs for specific errors

4. **API Not Responding**:
   - Check Render service status
   - Verify environment variables
   - Check server logs in Render dashboard

### **Performance Optimization**:

1. **Enable Render Auto-Deploy**: Automatic deployments on git push
2. **Use Render Health Checks**: Automatic service monitoring
3. **Enable Netlify Branch Deploys**: Preview deployments for testing
4. **Set up MongoDB Indexes**: Run the setup-indexes script

## 💰 **Cost Estimation**

### **Free Tier Limits**:
- **Render**: 750 hours/month (enough for 1 service)
- **Netlify**: 100GB bandwidth, 300 build minutes
- **MongoDB Atlas**: 512MB storage, shared cluster

### **Paid Tier (if needed)**:
- **Render Starter**: $7/month per service
- **Netlify Pro**: $19/month
- **MongoDB Atlas M10**: $57/month

## 🎯 **Production Checklist**

- [ ] MongoDB Atlas cluster created and configured
- [ ] Backend deployed to Render with correct environment variables
- [ ] Frontend deployed to Netlify with correct API URL
- [ ] CORS configured properly
- [ ] Admin user seeded in database
- [ ] Health checks working
- [ ] Custom domains configured (if applicable)
- [ ] SSL certificates active
- [ ] Monitoring set up

## 🔐 **Security Best Practices**

1. **Use Strong JWT Secrets**: Minimum 32 characters
2. **Enable HTTPS**: Both services should use SSL
3. **Restrict CORS Origins**: Don't use wildcards in production
4. **Monitor Access Logs**: Check for suspicious activity
5. **Regular Updates**: Keep dependencies updated
6. **Database Security**: Use strong passwords and IP restrictions

---

## 🎉 **You're Live!**

Your Teacher Review System is now deployed and ready for production use!

- **Frontend**: https://your-app.netlify.app
- **Backend**: https://your-api.onrender.com
- **Database**: MongoDB Atlas

The application can now handle multiple users, is scalable, and includes all the security and performance optimizations needed for production use.