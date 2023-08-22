ARG BUILD_IMAGE="nodejs"
FROM ${BUILD_IMAGE} as builder

WORKDIR /message-forwarder

COPY ./tsconfig.json ./tsconfig.json
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
COPY ./packages ./packages
RUN npm ci --workspaces
RUN npm run build -w packages/message-forwarder

FROM ${BUILD_IMAGE}

WORKDIR /message-forwarder
COPY --from=builder /message-forwarder/packages/message-forwarder/build/server.js ./server.js

CMD [ "node", "server.js" ]
