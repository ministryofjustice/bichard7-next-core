ARG BUILD_IMAGE="nodejs"
FROM ${BUILD_IMAGE}

LABEL maintainer="CJSE"

WORKDIR /api

RUN yum install jq -y

COPY package.json .
COPY package-lock.json .

RUN npm ci

COPY . ./

COPY api ./api

RUN npm run build

CMD [ "npm", "run", "start" ]
