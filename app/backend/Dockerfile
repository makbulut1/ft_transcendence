FROM node:16.17.0-bullseye-slim

WORKDIR /backend-app

COPY . .

RUN yarn install

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start:prod"]