ARG BUILD_IMAGE="nodejs"
FROM ${BUILD_IMAGE}

RUN echo $NOTIIFCATION
LABEL maintainer="CJSE"

WORKDIR /api

RUN yum install jq -y

COPY scripts ./scripts
COPY api/files/openssl.cnf /tmp/openssl.cnf
COPY api/package.json .
COPY api/package-lock.json .
COPY api/src ./src
COPY api/tsconfig.json .
COPY api/build.js .

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
RUN npm run build

CMD [ "npm", "run", "start" ]
