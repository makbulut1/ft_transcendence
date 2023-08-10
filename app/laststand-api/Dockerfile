FROM node:18-alpine
WORKDIR /app

COPY laststand-api ./laststand-api
COPY laststand-shared ./laststand-shared

WORKDIR /app/laststand-api
RUN yarn install
RUN yarn build
RUN npx prisma generate

CMD ["yarn", "start:prod"]