# Use Node.js 18 LTS as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy and install frontend dependencies first
COPY frontend/package*.json ./frontend/
WORKDIR /app/frontend
RUN npm install

# Copy frontend source and build
COPY frontend/ .
RUN npm run build

# Switch to backend directory and copy backend files
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install

# Copy backend source code
COPY backend/ .

# Copy built frontend dist to backend static directory
RUN cp -r /app/frontend/dist ./static

# Set environment variables
ENV MONGO_URI="mongodb://admin:password123@localhost:27017/myapp?authSource=admin"
ENV PORT=3000
ENV JWT_SECRET=mysecretkey
ENV ACCESS_TOKEN_SECRET=your_very_secret_access_key
ENV REFRESH_TOKEN_SECRET=your_very_secret_refresh_key
ENV NODE_ENV=development

# Expose port
EXPOSE 3000

# Start the backend server
CMD ["npm", "run", "dev"]