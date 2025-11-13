# Stage 1: build frontend (Debian for easier native builds)
FROM node:20-bullseye-slim AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install --legacy-peer-deps
COPY frontend/ .
RUN npm run build

# Stage 2: build backend (Debian for Prisma and build tools)
FROM node:20-bullseye-slim AS backend-build
WORKDIR /app/backend
RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl ca-certificates python3 make g++ git bash \
    && ln -sf /usr/bin/python3 /usr/bin/python \
    && rm -rf /var/lib/apt/lists/*
COPY backend/package.json backend/package-lock.json* ./
RUN npm install --legacy-peer-deps
COPY backend/ .
RUN npx prisma generate && npm run build
RUN npm prune --omit=dev

# Stage 3: final runtime (Debian for Prisma glibc engines)
FROM node:20-bullseye-slim
WORKDIR /app
ENV NODE_ENV=production
COPY --from=backend-build /app/backend/dist ./backend/dist
COPY --from=backend-build /app/backend/node_modules ./backend/node_modules
COPY --from=frontend-build /app/frontend/dist ./frontend/dist
COPY backend/package.json backend/package-lock.json* ./backend/
EXPOSE 4000
CMD ["node", "backend/dist/server.js"]
