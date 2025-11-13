# Stage 1: build frontend (Debian for easier native builds)
FROM node:20-bullseye-slim AS frontend-build
ARG HTTP_PROXY
ARG HTTPS_PROXY
ARG NO_PROXY
ENV http_proxy=${HTTP_PROXY} \
    https_proxy=${HTTPS_PROXY} \
    no_proxy=${NO_PROXY} \
    npm_config_proxy=${HTTP_PROXY} \
    npm_config_https_proxy=${HTTPS_PROXY} \
    npm_config_noproxy=${NO_PROXY} \
    npm_config_strict_ssl=true
WORKDIR /app/frontend
COPY frontend/.npmrc frontend/package.json frontend/package-lock.json* ./
RUN npm config set registry "${npm_config_registry:-https://registry.npmjs.org/}" \
    && npm config set @prisma:registry "${npm_config_registry:-https://registry.npmjs.org/}" \
    && npm install --legacy-peer-deps
COPY frontend/ .
RUN npm run build

# Stage 2: build backend (Debian for Prisma and build tools)
FROM node:20-bullseye-slim AS backend-build
ARG HTTP_PROXY
ARG HTTPS_PROXY
ARG NO_PROXY
ENV http_proxy=${HTTP_PROXY} \
    https_proxy=${HTTPS_PROXY} \
    no_proxy=${NO_PROXY} \
    npm_config_proxy=${HTTP_PROXY} \
    npm_config_https_proxy=${HTTPS_PROXY} \
    npm_config_noproxy=${NO_PROXY} \
    npm_config_strict_ssl=true
WORKDIR /app/backend
RUN set -eux; \
    apt-get update; \
    for attempt in 1 2 3; do \
        if apt-get -o Acquire::Retries=5 install -y --no-install-recommends \
            openssl ca-certificates python3 python-is-python3 make g++ git bash; then \
            break; \
        elif [ "${attempt}" -lt 3 ]; then \
            echo "apt-get install failed, retrying (${attempt}/3)..." >&2; \
            sleep 5; \
            apt-get update; \
        else \
            exit 1; \
        fi; \
    done; \
    rm -rf /var/lib/apt/lists/*
COPY backend/.npmrc backend/package.json backend/package-lock.json* ./
RUN npm config set registry "${npm_config_registry:-https://registry.npmjs.org/}" \
    && npm config set @prisma:registry "${npm_config_registry:-https://registry.npmjs.org/}" \
    && npm install --legacy-peer-deps
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
