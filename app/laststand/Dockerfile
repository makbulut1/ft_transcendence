FROM node:18-alpine3.15 AS builder

WORKDIR /app
COPY laststand laststand
COPY laststand-shared ./laststand-shared

WORKDIR /app/laststand
RUN yarn install
RUN yarn build

FROM nginx
WORKDIR /usr/share/nginx
COPY --from=builder /app/laststand/dist /usr/share/nginx/html 
COPY laststand/nginx.conf /etc/nginx/conf.d/default.conf
