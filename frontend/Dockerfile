# Use Node.js 20
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including dev dependencies for build)
RUN npm ci

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Remove dev dependencies
RUN npm prune --production

# Expose port (Railway will set PORT automatically)
EXPOSE 3000

# Start with custom server that uses Railway PORT
CMD ["npm", "run", "start"]
