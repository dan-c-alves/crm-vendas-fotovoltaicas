# Use Node.js 20
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE $PORT

# Start with PORT variable
CMD ["sh", "-c", "PORT=${PORT:-3000} npm run start -- -p ${PORT:-3000}"]
