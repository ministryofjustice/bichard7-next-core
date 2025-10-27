ARG BUILD_IMAGE="nginx-nodejs-20-2023-supervisord"
FROM ${BUILD_IMAGE} AS deps

LABEL maintainer="CJSE"

WORKDIR /core

COPY package*.json ./
COPY tsconfig*.json ./
COPY packages/common/package.json ./packages/common/package.json
COPY packages/api/package.json ./packages/api/package.json

RUN npm ci --ignore-scripts

#########################################################
FROM ${BUILD_IMAGE} AS builder

WORKDIR /core

COPY --from=deps ./core .

COPY packages/common ./packages/common
COPY packages/api ./packages/api

RUN npm run build:api

RUN npm prune --omit=dev --workspaces --include-root

#########################################################
FROM ${BUILD_IMAGE} AS runner

WORKDIR /core

COPY --from=builder /core/node_modules ./node_modules

COPY --from=builder /core/packages/common/package.json ./packages/common/package.json
COPY --from=builder /core/packages/common/dist ./packages/common/dist
COPY --from=builder /core/packages/common/node_modules ./packages/common/node_modules

COPY --from=builder /core/packages/api/dist ./packages/api/dist
COPY --from=builder /core/node_modules/@fastify/swagger-ui/static ./packages/api/static

RUN adduser --system --no-create-home --shell=/sbin/nologin supervisor && \
  usermod -a -G supervisor supervisor && \
  chgrp supervisor -R /core /certs /run /var/log /var/lib/nginx && \
  chmod g+r -R /certs/server.key /var/lib/nginx && \
  chmod g+rw -R /core /run /var/log && \
  npm config set cache /tmp/npm --global

COPY packages/api/docker/conf/nginx.conf /etc/nginx/nginx.conf
COPY packages/api/docker/conf/supervisord.conf /etc/supervisord.conf

EXPOSE 9443

USER supervisor
CMD [ "supervisord", "-c", "/etc/supervisord.conf" ]
