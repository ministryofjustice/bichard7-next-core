ARG BUILD_IMAGE="amazon-linux2023-base"
ARG CONDUCTOR_VERSION="v3.32.1"

# ===========================================================================================================
# 0. Source stage
# ===========================================================================================================
FROM alpine/git@sha256:a299a963fbe31628ab481ca42907bcf0691d004f86734c02638abdf513691d42 AS src
ARG CONDUCTOR_VERSION

RUN git clone --depth=1 -b ${CONDUCTOR_VERSION} https://github.com/conductor-oss/conductor.git /conductor

# ===========================================================================================================
# 1. UI Builder stage
# ===========================================================================================================
FROM node:24-alpine@sha256:e67514e5d0f6c46656005e1b693b2ec9d52e80b641307de684d4a015ba7a4eaf AS ui-builder

COPY --from=src /conductor/ui /conductor/ui

WORKDIR /conductor/ui

# Using `npm install` over `npm ci` as Conductors package.json and package-lock.json don't seem to be in sync
RUN npm install --legacy-peer-deps --ignore-scripts --no-audit && \
    npm cache clean --force && \
    npm run build

# ===========================================================================================================
# 2. Java Builder stage
# ===========================================================================================================
FROM eclipse-temurin:21-jdk-jammy@sha256:ce5767b7222312d42395f5bab033cd91f09e44032a2f21bdfd7b5b912dbe1e77 AS builder

COPY --from=src /conductor /conductor

WORKDIR /conductor

RUN printf '%s\n' \
    'ext["tomcat.version"] = "10.1.55"' \
    'subprojects {' \
    '    configurations.all {' \
    '        resolutionStrategy.eachDependency { d ->' \
    '            if (d.requested.group == "org.bouncycastle") {' \
    '                d.useVersion "1.84"' \
    '            }' \
    '        }' \
    '    }' \
    '}' >> build.gradle

RUN ./gradlew --version && \
    ./gradlew build --no-daemon -x test

# ===========================================================================================================
# 3. Runner stage
# ===========================================================================================================
FROM ${BUILD_IMAGE} AS runner
ARG CONDUCTOR_VERSION

LABEL org.opencontainers.image.authors="CJSE"
LABEL conductor_version=$CONDUCTOR_VERSION

USER root

COPY files/openssl.cnf /tmp/openssl.cnf
COPY files/nginx.repo /etc/yum.repos.d/nginx.repo

RUN mkdir -p /certs /var/log/supervisor && \
    yum install -y --setopt=install_weak_deps=False nginx httpd-tools gettext java-21-amazon-corretto && \
    yum clean all && \
    rm -rf /var/cache/yum && \
    pip install --no-cache-dir --only-binary=:all: supervisor==4.3.0 && \
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
