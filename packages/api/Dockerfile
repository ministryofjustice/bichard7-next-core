ARG BUILD_IMAGE="nodejs-20-2023"
FROM ${BUILD_IMAGE} AS builder

RUN echo $NOTIIFCATION
LABEL maintainer="CJSE"

WORKDIR /core

COPY package.json .
COPY package-lock.json .
COPY packages ./packages
COPY tsconfig*.json ./

RUN npm ci --ignore-scripts && npm run build -w packages/common

WORKDIR /core/packages/api

COPY packages/api/files/openssl.cnf /tmp/openssl.cnf

RUN npm run esbuild && \
  mkdir -p /certs && \
  openssl req \
  -x509 \
  -nodes \
  -days 730 \
  -newkey rsa:4096 \
  -out /certs/server.crt \
  -keyout /certs/server.key \
  -config /tmp/openssl.cnf \
  -extensions 'v3_req' && \
  rm -rf /tmp/openssl.cnf


FROM ${BUILD_IMAGE}

WORKDIR /

COPY --from=builder /core/packages/api/build /core/packages/api/build
COPY --from=builder /certs /certs

WORKDIR /core/packages/api

COPY --from=builder /core/node_modules/@fastify/swagger-ui/static ./static

WORKDIR /core/packages/api

CMD [ "node", "build/index.js" ]
