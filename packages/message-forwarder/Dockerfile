ARG BUILD_IMAGE="nodejs-20-2023"
FROM ${BUILD_IMAGE} as builder

WORKDIR /message-forwarder

COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
COPY ./packages ./packages
RUN npm ci

COPY ./tsconfig.json ./tsconfig.json
COPY ./tsconfig.base.json ./tsconfig.base.json

RUN npm run build
RUN npm run esbuild -w packages/message-forwarder

FROM ${BUILD_IMAGE}

WORKDIR /message-forwarder
COPY --from=builder /message-forwarder/packages/message-forwarder/build/run.js ./run.js

CMD [ "node", "run.js" ]
