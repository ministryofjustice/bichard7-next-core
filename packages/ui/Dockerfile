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
COPY packages/ui ./packages/ui
COPY tsconfig*.json ./

RUN npm i -w packages/ui && npm run install:assets -w packages/ui

ENV NEXT_TELEMETRY_DISABLED=1

# Currently configured to run the standalone nextjs build
#
# next.config.js
#   output: standalone
RUN npm run build -w packages/ui

#########################################################
FROM ${BUILD_IMAGE} AS runner

RUN useradd nextjs && \
    groupadd nodejs && \
    usermod -a -G nodejs nextjs && \
    npm config set cache /tmp/npm --global

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV TZ="Europe/London"

WORKDIR /app

COPY --from=builder /core/package*.json ./
COPY --from=builder /core/node_modules ./node_modules

RUN mkdir -p /app/packages/ui

COPY --from=builder /core/packages/ui/package.json ./packages/ui
COPY --from=builder /core/packages/ui/node_modules ./packages/ui/node_modules
COPY --from=builder /core/packages/ui/next.config.js ./packages/ui

# Copy assets from builder
COPY --from=builder /core/packages/ui/public ./packages/ui/public
COPY --from=builder /core/packages/ui/.next/static ./packages/ui/.next/static

RUN chmod -R 755 packages/ui/public

# Extract standalone build to working directory
COPY --from=builder /core/packages/ui/.next/standalone/packages/ui ./packages/ui

# When next shakes the tree during the build, it doesn't find
# a direct require/import for the standing data package that
# core imports dynamically, so it removes the package entirely.
#
# Copy the standing data package back where it belongs
COPY --from=builder \
    /core/packages/ui/.next/standalone/node_modules/@moj-bichard7-developers/bichard7-next-data \
    ./packages/ui/node_modules/@moj-bichard7-developers/bichard7-next-core/node_modules/bichard7-next-data-latest

COPY packages/ui/docker/conf/nginx.conf /etc/nginx/nginx.conf
COPY packages/ui/docker/conf/supervisord.conf /etc/supervisord.conf

EXPOSE 80
EXPOSE 443

CMD [ "supervisord", "-c", "/etc/supervisord.conf" ]
