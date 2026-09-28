ARG BUILD_IMAGE="nodejs-24-2023"
FROM ${BUILD_IMAGE}

USER root

WORKDIR /app

COPY package.json *.tgz /app/
RUN npm i

COPY * /app/

USER node

CMD npm t
