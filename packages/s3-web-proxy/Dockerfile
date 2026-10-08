ARG BUILD_IMAGE="nginx-nodejs-24-2023-supervisord"
FROM ${BUILD_IMAGE} AS base

LABEL org.opencontainers.image.authors="CJSE"

#########################################################
FROM base AS deps

USER root

WORKDIR /core

COPY package*.json ./
COPY packages/s3-web-proxy/package.json ./packages/s3-web-proxy/package.json

RUN npm ci --ignore-scripts --no-audit \
    && npm cache clean --force

#########################################################
FROM base AS runner

USER root

RUN yum install -y --setopt=install_weak_deps=False \
    cronie \
    git && \
    yum clean all && \
    rm -rf /var/cache/yum

COPY --chmod=755 packages/s3-web-proxy/scripts/run_nginx.sh /bin/run_nginx
COPY --chmod=755 packages/s3-web-proxy/scripts/credentials.sh /usr/bin/credentials

RUN mkdir -p /root/.aws /nginx_auth /core && \
    chown -R node:node /core

WORKDIR /core

COPY --chown=node:node --from=deps ./core ./
COPY --chown=node:node packages/s3-web-proxy/src ./packages/s3-web-proxy/src

COPY packages/s3-web-proxy/conf/nginx.conf /etc/nginx/nginx.conf
#COPY packages/s3-web-proxy/conf/supervisord.conf /etc/supervisord.conf

USER node

WORKDIR /core/packages/s3-web-proxy

EXPOSE 8080
EXPOSE 8443

STOPSIGNAL SIGQUIT