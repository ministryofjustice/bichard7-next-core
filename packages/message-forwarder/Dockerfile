ARG BUILD_IMAGE="nodejs"
FROM ${BUILD_IMAGE}

WORKDIR /message-forwarder

COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm ci

COPY . ./

CMD [ "npm", "run", "start" ]
