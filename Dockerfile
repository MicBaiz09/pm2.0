# Stage 1: build frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Stage 2: build backend
FROM node:20-alpine AS backend-build
WORKDIR /app/backend
RUN apk add --no-cache openssl libc6-compat python3 make g++ git bash
COPY backend/package.json backend/package-lock.json* ./
RUN npm install --legacy-peer-deps
COPY backend/ .
RUN npx prisma generate && npm run build
RUN npm prune --omit=dev

# Stage 3: final runtime
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=backend-build /app/backend/dist ./backend/dist
COPY --from=backend-build /app/backend/node_modules ./backend/node_modules
COPY --from=frontend-build /app/frontend/dist ./frontend/dist
COPY backend/package.json backend/package-lock.json* ./backend/
EXPOSE 4000
CMD ["node", "backend/dist/server.js"]
