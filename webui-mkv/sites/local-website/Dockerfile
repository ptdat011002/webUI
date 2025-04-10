FROM nginx:1.13.9-alpine
ARG IMAGE_TAG_ARG='m-default'

WORKDIR /app

COPY ./sites/local-website/dist ./www
COPY ./sites/local-website/etc/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
ENV NODE_ENV=production

CMD ["nginx","-g","daemon off;"]