# Multi-stage build
FROM node:24-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json .
COPY package-lock.json .

# Install dependencies
RUN npm install

# Copy source code
COPY /src ./src
COPY /public ./public
COPY .env .

# Build the production app
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built React app from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Copy custom nginx configuration
COPY docker/config/nginx/nginx.conf /etc/nginx/nginx.conf

# Install curl for health check
RUN apk add --no-cache curl

# Expose port 4000
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:4000/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
