ARG BUILD_IMAGE="nginx-nodejs-20-2023-supervisord"
FROM ${BUILD_IMAGE} AS base

LABEL maintainer="CJSE"

#########################################################
FROM base AS deps

WORKDIR /core

# Copy in package info so we don't have to re-install packages for every code change
COPY package*.json ./
COPY packages/core/package.json ./packages/core/package.json
COPY packages/common/package.json ./packages/common/package.json
COPY packages/ui/package.json ./packages/ui/package.json
COPY packages/ui/scripts ./packages/ui/scripts

RUN npm ci --ignore-scripts --no-audit

RUN npm run install:assets -w packages/ui

#########################################################
FROM base AS builder
ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /core

COPY --from=deps ./core ./

COPY tsconfig*.json ./
COPY packages/core ./packages/core
COPY packages/common ./packages/common
COPY packages/ui ./packages/ui

RUN npm run build:ui

#########################################################
FROM base AS runner
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV TZ="Europe/London"

WORKDIR /app

# Set up a non-root user for supervisor and its child processes - nextjs, nginx
RUN adduser --system --no-create-home --shell=/sbin/nologin supervisor && \
    usermod -a -G supervisor supervisor && \
    chgrp supervisor -R /app /certs /run /var/log /var/lib/nginx && \
    chmod g+r -R /certs/server.key /var/lib/nginx && \
    chmod g+rw -R /app /run /var/log && \
    npm config set cache /tmp/npm --global

# Extract standalone build to working directory
COPY --from=builder /core/packages/ui/.next/standalone ./

# Copy assets from builder
COPY --from=builder /core/packages/ui/public ./packages/ui/public
COPY --from=builder /core/packages/ui/.next/static ./packages/ui/.next/static

RUN chmod -R 755 ./packages/ui/public

COPY packages/ui/docker/conf/nginx.conf /etc/nginx/nginx.conf
COPY packages/ui/docker/conf/supervisord.conf /etc/supervisord.conf

EXPOSE 9443

USER supervisor
CMD [ "supervisord", "-c", "/etc/supervisord.conf" ]
