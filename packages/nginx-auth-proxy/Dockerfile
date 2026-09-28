ARG BUILD_IMAGE="amazon-linux2023-base"
FROM ${BUILD_IMAGE}

LABEL org.opencontainers.image.authors="CJSE"

WORKDIR /

COPY files/openssl.cnf /tmp/openssl.cnf

USER root

RUN mkdir -p /certs /var/log/supervisor && \
    yum update -y && \
    yum install -y --setopt=install_weak_deps=False nginx httpd-tools gettext && \
    yum clean all && \
    rm -rf /var/cache/yum && \
    openssl req -x509 -nodes -days 730 -newkey rsa:4096 -out /certs/server.crt \
    -keyout /certs/server.key -config /tmp/openssl.cnf -extensions 'v3_req' && \
    rm -rf /tmp/openssl.cnf && \
    pip install --no-cache-dir supervisor

RUN rm /etc/nginx/conf.d/default.conf
COPY files/templates /etc/templates/
COPY files/supervisord.conf /etc/supervisord.conf
COPY files/includes /etc/nginx/includes/
COPY files/process_templates.sh /bin/process_templates.sh

RUN chmod 755 /bin/process_templates.sh && \
    chown -R appuser:appuser \
    /etc/templates \
    /etc/nginx \
    /certs \
    /var/log/supervisor \
    /var/log/nginx \
    /var/cache/nginx

EXPOSE 8080
EXPOSE 8443

WORKDIR /etc/nginx

USER appuser

CMD ["supervisord", "-c", "/etc/supervisord.conf"]
