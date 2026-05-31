# ==========================================
# Dockerfile — Multi-stage build
# Stage 1: Build Vite + React + TypeScript
# Stage 2: Serve Express.js + Static Files
# ==========================================

# Stage 1: Build Frontend
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Production Server
FROM node:20-alpine AS runner

WORKDIR /app

# Copy built frontend
COPY --from=builder /app/dist ./dist

# Install backend dependencies
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm install --production

# Copy backend code
COPY server/ ./

# Cloud Run requirement
ENV PORT=8080
EXPOSE 8080

CMD ["node", "index.js"]

