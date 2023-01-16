ARG BUILD_IMAGE="nodejs"
FROM ${BUILD_IMAGE}

LABEL maintainer="CJSE"

WORKDIR /core

RUN yum update && \
    yum install -y jq && \
    yum clean all && \
    rm -rf /var/cache/yum

COPY scripts ./scripts

COPY package.json .
RUN npm i

COPY conductor ./conductor
COPY src ./src
COPY tests ./tests
COPY tsconfig.json .

CMD [ "npm", "run", "conductor-worker" ]
