FROM nginx

EXPOSE 9010

COPY /dist /usr/share/nginx/html

ENTRYPOINT nginx -g "daemon off;"