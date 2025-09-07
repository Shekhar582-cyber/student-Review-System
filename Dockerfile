# Use Node.js 18 Alpine image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY server/package*.json ./server/

# Install dependencies with specific npm version
RUN npm install -g npm@9.8.1
RUN npm install --legacy-peer-deps
RUN cd server && npm install

# Copy source code
COPY . .

# Build frontend
RUN npm run build

# Make start script executable
RUN chmod +x start.sh

# Expose port
EXPOSE 3001

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3001

# Start the application
CMD ["./start.sh"]
