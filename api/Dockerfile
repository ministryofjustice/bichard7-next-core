ARG BUILD_IMAGE="nodejs"
FROM ${BUILD_IMAGE}

RUN echo $NOTIIFCATION
LABEL maintainer="CJSE"

WORKDIR /api

RUN yum install jq -y

COPY scripts ./scripts
COPY api/package.json .
COPY api/package-lock.json .
COPY api/src ./src
COPY api/tsconfig.json .
COPY api/build.js .

RUN npm ci
RUN npm run build

CMD [ "npm", "run", "start" ]
