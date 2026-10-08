ARG BUILD_IMAGE="nginx-nodejs-24-2023-supervisord"
FROM ${BUILD_IMAGE} as base

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

COPY packages/s3-web-proxy/scripts/run_nginx.sh /bin/run_nginx
COPY packages/s3-web-proxy/scripts/credentials.sh /usr/bin/credentials

WORKDIR /core

COPY --from=deps ./core ./
COPY packages/s3-web-proxy/src ./packages/s3-web-proxy/src

RUN yum install -y --setopt=install_weak_deps=False \
    cronie \
    git && \
    mkdir -p /root/.aws && \
    mkdir -p /nginx_auth && \
    chmod +x /bin/run_nginx && \
    chmod +x /bin/credentials && \
    yum clean all && \
    rm -rf /var/cache/yum && \
    chown -R node /core

#USER root
#RUN npm link

USER node

WORKDIR /core/packages/s3-web-proxy

EXPOSE 8080
EXPOSE 8443

COPY conf/nginx.conf /etc/nginx/nginx.conf
COPY conf/supervisord.conf /etc/supervisord.conf

STOPSIGNAL SIGQUIT
