ARG APP_HOME=/home/node/app

# build stage
FROM node:14.17
WORKDIR ${APP_HOME}

COPY . ${APP_HOME}
RUN yarn install

# deploy stage

EXPOSE 80
CMD ["node", "./src/bin/www"]