#########################################################
ARG BUILD_IMAGE="nginx-nodejs-20-2023-supervisord"
FROM ${BUILD_IMAGE} AS builder

LABEL maintainer="CJSE"

WORKDIR /core

# Currently needed for core postinstall script
RUN yum install jq -y

# Copy in package info so we don't have to re-install packages for every code change
COPY package.json .
COPY package-lock.json .
COPY tsconfig*.json ./
COPY packages/ ./packages/

RUN npm ci --ignore-scripts && npm run build:core

WORKDIR /core/packages/ui

RUN npm run install:assets

ENV NEXT_TELEMETRY_DISABLED=1

# Currently configured to run the standalone nextjs build
#
# next.config.js
#   output: standalone
RUN npm run build

WORKDIR /core

#########################################################
FROM ${BUILD_IMAGE} AS runner
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV TZ="Europe/London"

WORKDIR /app

# Set up a non-root user for supervisor and its child processes - nextjs, nginx
RUN useradd supervisor && \
    npm config set cache /tmp/npm --global  && \
    chown supervisor -R /app /var/log /var/lib/nginx /run  && \
    chown supervisor /certs/server.key

# Extract standalone build to working directory
COPY --from=builder /core/packages/ui/.next/standalone .

# Copy assets from builder
COPY --from=builder /core/packages/ui/public ./packages/ui/public
COPY --from=builder /core/packages/ui/.next/static ./packages/ui/.next/static

RUN chmod -R 755 ./packages/ui/public

COPY packages/ui/docker/conf/nginx.conf /etc/nginx/nginx.conf
COPY packages/ui/docker/conf/supervisord.conf /etc/supervisord.conf

EXPOSE 80
EXPOSE 443

USER supervisor
CMD [ "supervisord", "-c", "/etc/supervisord.conf" ]
