# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files from builder stage (preserve dist directory structure)
COPY --from=builder /app/dist /usr/share/nginx/html/dist

# Copy static assets
COPY --from=builder /app/index.html /usr/share/nginx/html/
COPY --from=builder /app/favicon_io /usr/share/nginx/html/favicon_io

# Create a simple nginx config for the frontend container
# The main nginx config will be handled by the separate nginx service
RUN echo 'server { listen 80; location / { root /usr/share/nginx/html; index index.html; try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
