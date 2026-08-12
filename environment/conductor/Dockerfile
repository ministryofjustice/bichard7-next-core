ARG BUILD_IMAGE="amazon-linux2023-base"

FROM node:20-alpine AS ui-builder

ARG CONDUCTOR_VERSION

RUN apk add git && \
    git clone --depth=1 -b ${CONDUCTOR_VERSION} https://github.com/conductor-oss/conductor.git /conductor

WORKDIR /conductor/ui

RUN npm install --legacy-peer-deps && \
    npm cache clean --force && \
    npm run build

# ===========================================================================================================
# 0. Builder stage
# ===========================================================================================================
FROM eclipse-temurin:17-jdk-jammy AS builder

ARG CONDUCTOR_VERSION

RUN apt-get update && apt-get install -y --no-install-recommends git && \
    git clone --depth=1 -b ${CONDUCTOR_VERSION} https://github.com/conductor-oss/conductor.git /conductor && \
    rm -rf /var/lib/apt/lists/*

# Build the server

WORKDIR /conductor

RUN sed -i 's/^subprojects {$/ext["tomcat.version"] = "10.1.55"\n\n&/' build.gradle && \
    sed -i "s/revRedisson = '3\.13\.3'/revRedisson = '3.22.0'/" dependencies.gradle

#This will cache the downloaded gradle so repeated runs are faster
RUN ./gradlew --version && \
    ./gradlew build -x test && \
    rm -rf /root/.gradle

# ===========================================================================================================
# 1. Bin stage
# ===========================================================================================================

FROM ${BUILD_IMAGE}

ARG CONDUCTOR_VERSION

LABEL org.opencontainers.image.authors="CJSE"
LABEL conductor_version=$CONDUCTOR_VERSION

USER root

COPY files/openssl.cnf /tmp/openssl.cnf

COPY files/nginx.repo /etc/yum.repos.d/nginx.repo

RUN mkdir -p /certs /var/log/supervisor && \
    yum install -y --setopt=install_weak_deps=False nginx httpd-tools gettext java-17-amazon-corretto && \
    yum clean all && \
    rm -rf /var/cache/yum && \
    pip install --no-cache-dir supervisor && \
    openssl req -x509 -nodes -days 730 -newkey rsa:4096 \
    -out /certs/server.crt -keyout /certs/server.key \
    -config /tmp/openssl.cnf -extensions 'v3_req' && \
    rm -rf /tmp/openssl.cnf

# Make app folders
RUN mkdir -p /app/config /app/logs /app/libs

# Copy the compiled output to new image
COPY --from=builder --chown=appuser:appuser /conductor/server/build/libs/*boot*.jar /app/libs/conductor-server.jar

# Copy the config files
RUN rm /etc/nginx/conf.d/default.conf
COPY files/nginx.conf /etc/nginx/nginx.conf
COPY files/config.properties /app/config/config.properties
COPY files/templates /etc/templates/
COPY files/supervisord.conf /etc/supervisord.conf
COPY files/process_templates.sh /bin/process_templates.sh

# Copy compiled UI assets to nginx www directory
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=ui-builder --chown=appuser:appuser /conductor/ui/build .

# Permissions
RUN chmod 755 /bin/process_templates.sh && \
    chown -R appuser:appuser \
    /app \
    /certs \
    /var/cache/nginx \
    /var/log/nginx \
    /var/log/supervisor \
    /etc/nginx \
    /etc/templates \
    /usr/share/nginx/html

EXPOSE 4000
EXPOSE 5000

USER appuser

CMD ["supervisord", "-c", "/etc/supervisord.conf"]

HEALTHCHECK --interval=60s --timeout=30s --retries=10 CMD curl -I -XGET http://localhost:8080/health || exit 1
