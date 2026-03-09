# Dockerfile for Edu Tech MVP

# --- Stage 1: Build Frontend ---
FROM node:18-alpine AS build-frontend
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- Stage 2: Production Server ---
FROM node:18-alpine
WORKDIR /app

# Copy built frontend from Stage 1
COPY --from=build-frontend /app/dist ./dist

# Copy backend server code
COPY server/ ./server/
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Expose port (Backend port from server.js)
EXPOSE 5000

# Set Environment Variables (These should be overridden in docker-compose or .env)
ENV NODE_ENV=production
ENV PORT=5000

# Start the server
CMD ["node", "server/server.js"]
