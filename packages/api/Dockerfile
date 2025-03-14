ARG BUILD_IMAGE="nodejs-20-2023"
FROM ${BUILD_IMAGE} AS builder

RUN echo $NOTIIFCATION
LABEL maintainer="CJSE"

RUN dnf update -y \
  && dnf install -y findutils \
  && rm -rf /var/log/* \
  && dnf clean all \
  && rm -rf /var/cache/dnf

WORKDIR /core

COPY package*.json ./
COPY tsconfig*.json ./
COPY packages/api ./packages/api
COPY packages/common ./packages/common
COPY packages/core ./packages/core

RUN npm ci --ignore-scripts && npm run build:api

WORKDIR /core/packages/common

RUN ls | grep -v package.json | grep -v dist | xargs rm -rf

WORKDIR /core/packages/core

RUN ls | grep -v package.json | grep -v dist | xargs rm -rf

WORKDIR /core/packages/api

RUN ls | grep -v package.json | grep -v dist | grep -v node_modules | xargs rm -rf

WORKDIR /core

RUN npm prune --omit=dev --workspaces --include-root

FROM ${BUILD_IMAGE}

WORKDIR /

COPY --from=builder /core /core
COPY --from=builder /certs /certs

WORKDIR /core/packages/api

COPY --from=builder /core/node_modules/@fastify/swagger-ui/static ./static

USER node
CMD [ "node", "dist/src/index.js" ]
