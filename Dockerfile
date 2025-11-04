# Use the official Node.js 20 image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files from frontend directory
COPY frontend/package*.json ./

# Install all dependencies
RUN npm ci

# Copy frontend source code
COPY frontend/ ./

# Build the application
RUN npm run build

# Remove dev dependencies to optimize image size
RUN npm prune --production

# Set environment variables
ENV NODE_ENV=production

# Expose the port (Railway will set PORT dynamically)
EXPOSE $PORT

# Start the application using sh to expand $PORT variable
CMD ["sh", "-c", "PORT=${PORT:-3000} npm run start"]