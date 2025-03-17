ARG BUILD_IMAGE="nginx-nodejs-20-2023-supervisord"
FROM ${BUILD_IMAGE} AS builder

RUN echo $NOTIIFCATION
LABEL maintainer="CJSE"

RUN dnf update -y \
  && dnf install -y findutils \
  && rm -rf /var/log/* \
  && dnf clean all \
  && rm -rf /var/cache/dnf

WORKDIR /core

COPY package*.json ./
COPY tsconfig*.json ./
COPY packages/api ./packages/api
COPY packages/common ./packages/common
COPY packages/core ./packages/core

RUN npm ci --ignore-scripts && npm run build:api

WORKDIR /core/packages/common

RUN ls | grep -v package.json | grep -v dist | xargs rm -rf

WORKDIR /core/packages/core

RUN ls | grep -v package.json | grep -v dist | xargs rm -rf

WORKDIR /core/packages/api

RUN ls | grep -v package.json | grep -v dist | grep -v node_modules | xargs rm -rf

WORKDIR /core

RUN npm prune --omit=dev --workspaces --include-root

FROM ${BUILD_IMAGE}

WORKDIR /

COPY --from=builder /core /core

WORKDIR /app

COPY --from=builder /core/node_modules/@fastify/swagger-ui/static ./static
COPY --from=builder /core/node_modules ./node_modules
COPY --from=builder /core/packages/common ./packages/common
COPY --from=builder /core/packages/core ./packages/core
COPY --from=builder /core/packages/api ./packages/api

RUN adduser --system --no-create-home --shell=/sbin/nologin supervisor && \
    usermod -a -G supervisor supervisor && \
    chgrp supervisor -R /app /certs /run /var/log /var/lib/nginx && \
    chmod g+r -R /certs/server.key /var/lib/nginx && \
    chmod g+rw -R /app /run /var/log && \
    npm config set cache /tmp/npm --global

COPY packages/api/docker/conf/nginx.conf /etc/nginx/nginx.conf
COPY packages/api/docker/conf/supervisord.conf /etc/supervisord.conf

EXPOSE 9443

USER supervisor
CMD [ "supervisord", "-c", "/etc/supervisord.conf" ]
