ARG BUILD_IMAGE="nodejs-20-2023"
FROM ${BUILD_IMAGE}

RUN echo $NOTIIFCATION
LABEL maintainer="CJSE"

WORKDIR /api

RUN yum install jq -y

COPY packages/api/files/openssl.cnf /tmp/openssl.cnf
COPY package.json .
COPY package-lock.json .
COPY packages/api ./packages/api
COPY tsconfig*.json ./

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

EXPOSE     80
EXPOSE     443

RUN npm ci
RUN npm run build -w packages/api

CMD [ "npm", "run", "start", "-w", "packages/api" ]
