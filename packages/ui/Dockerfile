#########################################################
ARG BUILD_IMAGE="nginx-nodejs-20-2023-supervisord"
FROM ${BUILD_IMAGE} AS builder

LABEL maintainer="CJSE"

WORKDIR /src/ui

# Currently needed for core postinstall script
RUN yum install jq -y

# Copy in package info so we don't have to re-install packages for every code change
COPY package.json .
COPY package-lock.json .
COPY ./scripts/copy-govuk-frontend-assets.sh scripts/copy-govuk-frontend-assets.sh
COPY ./scripts/copy-moj-frontend-assets.sh scripts/copy-moj-frontend-assets.sh

RUN npm ci && \
    npm run install:assets

COPY . ./

ENV NEXT_TELEMETRY_DISABLED=1

# Currently configured to run the standalone nextjs build
#
# next.config.js
#   output: standalone
RUN npm run build

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

COPY --from=builder /src/ui/package*.json ./
COPY --from=builder /src/ui/next.config.js ./

# Copy assets from builder
COPY --from=builder /src/ui/public ./public
COPY --from=builder /src/ui/.next/static ./.next/static

RUN chmod -R 755 public

# Extract standalone build to working directory
COPY --from=builder /src/ui/.next/standalone .

# When next shakes the tree during the build, it doesn't find
# a direct require/import for the standing data package that
# core imports dynamically, so it removes the package entirely.
#
# Copy the standing data package back where it belongs
COPY --from=builder \
    /src/ui/.next/standalone/node_modules/@moj-bichard7-developers/bichard7-next-data \
    ./node_modules/@moj-bichard7-developers/bichard7-next-core/node_modules/bichard7-next-data-latest

COPY docker/conf/nginx.conf /etc/nginx/nginx.conf
COPY docker/conf/supervisord.conf /etc/supervisord.conf

EXPOSE 80
EXPOSE 443

CMD [ "supervisord", "-c", "/etc/supervisord.conf" ]
