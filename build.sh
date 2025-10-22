#!/bin/bash
echo "Building server for Render deployment..."
cd server
npm install --production
echo "Server build complete!"