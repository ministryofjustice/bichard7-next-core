ARG BUILD_IMAGE="nodejs-20-2023"
FROM ${BUILD_IMAGE}

RUN echo $NOTIIFCATION
LABEL maintainer="CJSE"

RUN dnf update -y \
  && dnf install -y findutils \
  && rm -rf /var/log/* \
  && dnf clean all \
  && rm -rf /var/cache/dnf

WORKDIR /core

COPY package.json .
COPY package-lock.json .
COPY packages/api ./packages/api
COPY packages/common ./packages/common
COPY tsconfig*.json ./

WORKDIR /core/packages/common

RUN npm i --ignore-scripts && npm run build:api \
  && ls | grep -v package.json | grep -v dist | xargs rm -rf

WORKDIR /core/packages/api

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

RUN npm i --ignore-scripts && npm run build \
  && npm run esbuild \
  && cp -r build/static . \
  && ls | grep -v package.json | grep -v dist | grep -v static | xargs rm -rf

CMD [ "node", "dist/src/index.js" ]
