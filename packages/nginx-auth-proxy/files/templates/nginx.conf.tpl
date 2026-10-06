worker_processes auto;
pid /tmp/nginx.pid;
include /etc/nginx/modules-enabled/*.conf;

events {
    worker_connections 1000;
}

http {
    sendfile                  on;
    tcp_nopush                on;
    tcp_nodelay               on;
    keepalive_timeout         500;
    types_hash_max_size       2048;
    include                   /etc/nginx/mime.types;
    default_type              application/octet-stream;
    ssl_protocols             TLSv1.2; # Dropping SSLv3, ref: POODLE
    ssl_prefer_server_ciphers on;
    error_log                 /dev/stderr;
    access_log                /dev/stdout combined;
    gzip                      on;
    include                   /etc/nginx/conf.d/*.conf;
    include                   /etc/nginx/sites-enabled/*;
    server_tokens             off;

    log_format json escape=json '{'
        '"@timestamp": "$time_iso8601", '
        '"message": "$remote_addr - $remote_user [$time_local] \\\"$request\\\" $status $body_bytes_sent \\\"$http_referer\\\" \\\"$http_user_agent\\\"", '
        '"tags": ["nginx_access"], '
        '"realip": "$remote_addr", '
        '"proxyip": "$http_x_forwarded_for", '
        '"remote_user": "$remote_user", '
        '"contenttype": "$sent_http_content_type", '
        '"bytes": $body_bytes_sent, '
        '"duration": "$request_time", '
        '"status": "$status", '
        '"request": "$request", '
        '"method": "$request_method", '
        '"referrer": "$http_referer", '
        '"useragent": "$http_user_agent"'
    '}';

    map $request_method $auth_content_length {
        default  '0';
        GET      '';
        HEAD     '';
    }

    server {
        listen                          $CJSE_NGINX_PORT_HTTPS ssl;
        ssl_certificate                 /certs/server.crt;
        ssl_certificate_key             /certs/server.key;

        include /etc/nginx/includes/bichard.https.conf;
    }

    server {
        listen        $CJSE_NGINX_PORT_HTTP default_server;
        server_name   _;

        include /etc/nginx/includes/bichard.http.conf;
    }
}
