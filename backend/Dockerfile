# Use Node.js 18 LTS image
FROM node:18

# Set working directory
WORKDIR /app

# Copy only package.json and package-lock.json first
COPY package*.json ./

# Install dependencies (compiles native deps based on container's OS)
RUN npm install

# Copy the rest of the code
COPY . .

# Install compatible version of nanoid that supports CommonJS
RUN npm install nanoid@3.3.7

# Rebuild native modules like better-sqlite3 to avoid architecture mismatch
RUN npm rebuild better-sqlite3

# Install ts-node globally to run TypeScript directly
RUN npm install -g ts-node

# Expose port (optional: depends on your server)
EXPOSE 3001

# Run your backend (change `server.ts` to your actual entry point)
CMD ["ts-node", "server.ts"]
