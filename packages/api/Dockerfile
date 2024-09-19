ARG BUILD_IMAGE="nodejs-20-2023"
FROM ${BUILD_IMAGE} AS builder

RUN echo $NOTIIFCATION
LABEL maintainer="CJSE"

WORKDIR /api

COPY package.json .
COPY package-lock.json .
COPY packages/api ./packages/api
COPY tsconfig*.json ./

RUN npm ci
RUN npm run esbuild -w packages/api

FROM ${BUILD_IMAGE}

WORKDIR /api

COPY packages/api/files/openssl.cnf /tmp/openssl.cnf
RUN mkdir -p /certs && \
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

COPY --from=builder /api/packages/api/build .

CMD [ "node", "index.js" ]
