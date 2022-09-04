ARG APP_HOME=/home/node/app

# build stage
FROM node:alpine
WORKDIR ${APP_HOME}


COPY . .
RUN yarn install


# deploy stage

EXPOSE 80
CMD "yarn" "start"