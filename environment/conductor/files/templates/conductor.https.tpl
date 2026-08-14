server {
    listen                5000   ssl;
    ssl_certificate       /certs/server.crt;
    ssl_certificate_key   /certs/server.key;
    ssl_protocols         TLSv1.2;
    ssl_ciphers           HIGH:!aNULL:!MD5;

    auth_basic           "Administrator’s Area";
    auth_basic_user_file /etc/nginx/.htpasswd;

    resolver $CJSE_NGINX_DNS_RESOLVER;

    set $conductor "127.0.0.1:8080";

    location / {
        root /usr/share/nginx/html;
        try_files $uri /index.html;
    }

    location ~ ^/api(.*)$ {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-NginX-Proxy true;
        proxy_pass http://$conductor;
        proxy_ssl_session_reuse off;
        proxy_set_header Host $http_host;
        proxy_cache_bypass $http_upgrade;
        proxy_redirect off;
    }

    location ~ ^/metrics$ {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-NginX-Proxy true;
        proxy_pass http://$conductor/actuator/prometheus;
        proxy_ssl_session_reuse off;
        proxy_set_header Host $http_host;
        proxy_cache_bypass $http_upgrade;
        proxy_redirect off;
        auth_basic off;
    }

    location ~ ^/health(.*)$ {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-NginX-Proxy true;
        proxy_pass http://$conductor;
        proxy_ssl_session_reuse off;
        proxy_set_header Host $http_host;
        proxy_cache_bypass $http_upgrade;
        proxy_redirect off;
        auth_basic off;
    }
}
