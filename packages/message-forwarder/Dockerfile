ARG BUILD_IMAGE="nodejs-20-2023"
FROM ${BUILD_IMAGE} AS base

LABEL maintainer="CJSE"

#########################################################
FROM base AS deps

USER root

WORKDIR /message-forwarder

COPY package*.json ./
COPY packages/common/package.json ./packages/common/package.json
COPY packages/core/package.json ./packages/core/package.json
COPY packages/conductor/package.json ./packages/conductor/package.json
COPY packages/message-forwarder/package.json ./packages/message-forwarder/package.json

RUN npm ci --ignore-scripts --no-audit

#########################################################
FROM base AS builder

USER root

WORKDIR /message-forwarder

COPY --from=deps ./message-forwarder ./

COPY tsconfig*.json ./
COPY packages/common ./packages/common
COPY packages/core ./packages/core
COPY packages/conductor ./packages/conductor
COPY packages/message-forwarder ./packages/message-forwarder

RUN npm run build:core && npm run esbuild -w packages/message-forwarder

FROM base AS runner

USER root

WORKDIR /message-forwarder

COPY --from=builder /message-forwarder/packages/message-forwarder/build/server.js ./server.js

USER node
CMD [ "node", "server.js" ]
