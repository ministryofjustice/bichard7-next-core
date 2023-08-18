ARG BUILD_IMAGE="nodejs"
FROM ${BUILD_IMAGE}

LABEL maintainer="CJSE"

WORKDIR /core

RUN yum update -y && \
    yum install -y jq && \
    yum clean all && \
    rm -rf /var/cache/yum

COPY scripts ./scripts

COPY package.json .
COPY package-lock.json .
RUN npm ci
RUN npm run install-standing-data

COPY conductor ./conductor
COPY src ./src
COPY tests ./tests
COPY tsconfig.json .

CMD [ "npm", "run", "conductor-worker-noenv" ]
