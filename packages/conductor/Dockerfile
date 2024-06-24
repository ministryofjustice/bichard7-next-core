ARG BUILD_IMAGE="nodejs-20-2023"
FROM ${BUILD_IMAGE} AS builder

LABEL maintainer="CJSE"

WORKDIR /core

COPY scripts ./scripts

COPY package.json .
COPY package-lock.json .
COPY packages ./packages
COPY tsconfig*.json ./
RUN npm ci
RUN npm run build --workspaces
RUN npm run esbuild -w packages/conductor

FROM ${BUILD_IMAGE}

WORKDIR /core
COPY --from=builder /core/packages/conductor/build/worker.js ./worker.js

CMD [ "node", "worker.js" ]
