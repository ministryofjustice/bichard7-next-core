#########################################################
ARG BUILD_IMAGE="nginx-nodejs-20-2023-supervisord"
FROM ${BUILD_IMAGE} AS builder
ENV NEXT_TELEMETRY_DISABLED=1

LABEL maintainer="CJSE"

WORKDIR /core

RUN yum groupinstall -y "Development Tools"

COPY package*.json ./
COPY tsconfig*.json ./
COPY packages/ ./packages

RUN npm ci --ignore-scripts
RUN npm run install:assets -w packages/user-service

RUN npm run build:user-service

RUN npm prune --omit=dev --workspaces --include-root

#########################################################
FROM ${BUILD_IMAGE} AS runner
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

WORKDIR /app

# Set up a non-root user for supervisor and its child processes - nextjs, nginx
RUN adduser --system --no-create-home --shell=/sbin/nologin supervisor && \
    usermod -a -G supervisor supervisor && \
    chgrp supervisor -R /app /certs /run /var/log /var/lib/nginx && \
    chmod g+r -R /certs/server.key /var/lib/nginx && \
    chmod g+rw -R /app /run /var/log && \
    npm config set cache /tmp/npm --global

# Extract standalone build to working directory
COPY --from=builder /core/packages/user-service/.next/standalone .

# Copy assets
COPY --from=builder /core/packages/user-service/public ./packages/user-service/public
COPY --from=builder /core/packages/user-service/.next/static ./packages/user-service/.next/static

RUN chmod -R 755 ./packages/user-service/public

COPY --from=builder /core/packages/user-service/docker/conf/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /core/packages/user-service/docker/conf/supervisord.conf /etc/supervisord.conf

EXPOSE 443
EXPOSE 8080
EXPOSE 9443

CMD [ "supervisord", "-c", "/etc/supervisord.conf" ]
