# Use the official Node.js 20 image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files from frontend directory
COPY frontend/package*.json ./

# Install all dependencies (needed for build)
RUN npm ci

# Copy frontend source code
COPY frontend/ ./

# Build the application
RUN npm run build

# Remove dev dependencies after build to optimize image size
RUN npm prune --production

# Expose the port that Next.js runs on
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]