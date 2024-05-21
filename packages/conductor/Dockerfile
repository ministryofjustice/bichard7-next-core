ARG BUILD_IMAGE="nodejs-20-2023"
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
COPY packages ./packages
COPY tsconfig*.json ./
RUN npm ci
RUN npm run build --workspaces


WORKDIR /core/packages/conductor
CMD ["node", "dist/src/worker.js"]
