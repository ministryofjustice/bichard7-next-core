ARG BUILD_IMAGE="nodejs"
FROM ${BUILD_IMAGE}

RUN echo $NOTIIFCATION
LABEL maintainer="CJSE"

WORKDIR /api

RUN yum install jq -y

COPY scripts ./scripts

COPY package.json .
COPY package-lock.json .

RUN npm ci


COPY api ./api
COPY src ./src
COPY tsconfig.json .


RUN npm run build

CMD [ "npm", "run", "start" ]
