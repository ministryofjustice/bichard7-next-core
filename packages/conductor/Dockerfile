#########################################################
ARG BUILD_IMAGE="nodejs-20-2023"
FROM ${BUILD_IMAGE} AS base

LABEL maintainer="CJSE"

#########################################################
FROM base AS deps

WORKDIR /core

COPY scripts ./scripts

COPY package*.json ./
COPY packages/core/package.json ./packages/core/package.json
COPY packages/common/package.json ./packages/common/package.json
COPY packages/conductor/package.json ./packages/conductor/package.json

RUN npm ci --ignore-scripts --no-audit

#########################################################
FROM base AS builder

WORKDIR /core

COPY --from=deps ./core ./

COPY tsconfig*.json ./
COPY packages/core ./packages/core
COPY packages/common ./packages/common
COPY packages/conductor ./packages/conductor

RUN npm run build -w packages/common
RUN npm run build -w packages/core
RUN npm run build -w packages/conductor

RUN npm run esbuild -w packages/conductor

#########################################################
FROM base AS runner

WORKDIR /core

COPY --from=builder /core/packages/conductor/build/worker.js ./worker.js

USER node
CMD [ "node", "worker.js" ]
