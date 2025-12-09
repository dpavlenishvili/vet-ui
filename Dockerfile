# =========================
# Build stage
# =========================
FROM node:20-alpine AS build

WORKDIR /app

# Install CA bundle in case your build needs it (optional but harmless)
RUN apk add --no-cache ca-certificates && update-ca-certificates

COPY package.json package-lock.json ./
COPY kendo-ui-license.txt ./
COPY nx.json tsconfig.base.json ./
COPY shared-styles/ shared-styles/
COPY shared/ shared/

RUN npm ci

COPY . .

ARG BUILD_CONFIGURATION
ARG APP_BASE_URL
ENV NODE_ENV=production
ENV BUILD_CONFIGURATION=$BUILD_CONFIGURATION
ENV APP_BASE_URL=$APP_BASE_URL

# Fixed: Use nx directly with proper configuration syntax
RUN npx nx build vet --configuration=${BUILD_CONFIGURATION}


# =========================
# Runtime stage
# =========================
FROM node:20-alpine AS runtime

# 1) System CA tools
RUN apk add --no-cache ca-certificates

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# 2) Copy your internal CA (PEM/.crt). Make sure it's in your repo at ./certs/internal-root-ca.crt
#    If you have a chain, concatenate full chain in this one file (root + intermediates).
COPY certs/internal-root-ca.crt /usr/local/share/ca-certificates/internal-root-ca.crt

# 3) Register it with the OS trust store
RUN update-ca-certificates

# 4) Tell Node to also trust this CA (Node uses its own bundle)
ENV NODE_EXTRA_CA_CERTS=/usr/local/share/ca-certificates/internal-root-ca.crt

# PM2
RUN npm i -g pm2

# App
COPY --from=build /app/dist ./dist

EXPOSE 3000
CMD ["pm2-runtime", "dist/apps/vet/server/server.mjs"]