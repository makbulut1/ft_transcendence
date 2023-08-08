FROM node:18-alpine
WORKDIR /app

COPY laststand-api ./laststand-api
COPY laststand-shared ./laststand-shared

WORKDIR /app/laststand-api
RUN yarn install
RUN yarn build
RUN npx prisma generate

# Reinstall dependencies without dev dependencies 
RUN rm -rf node_modules
RUN yarn cache clean
RUN yarn install --production

# Delete source code
RUN rm -rf src
RUN rm -rf /app/laststand-shared

CMD ["yarn", "start:prod"]