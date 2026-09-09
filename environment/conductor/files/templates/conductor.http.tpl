server {
    listen                4000;

    auth_basic           "Administrator’s Area";
    auth_basic_user_file /etc/nginx/.htpasswd;

    resolver $CJSE_NGINX_DNS_RESOLVER;

    set $conductor "127.0.0.1:8080";

    location / {
        root /usr/share/nginx/html;
        try_files $uri /index.html;
    }

    location ~ ^/(api|health|swagger-ui)(.*)$ {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-NginX-Proxy true;
        proxy_pass http://$conductor;
        proxy_redirect off;
    }
}
