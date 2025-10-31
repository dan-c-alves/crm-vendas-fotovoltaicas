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
ENV PORT=3000

# Expose the port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]