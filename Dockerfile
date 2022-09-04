ARG APP_HOME=/home/node/app

# build stage
FROM node:14.17
WORKDIR ${APP_HOME}


COPY package*.json ./
RUN yarn install
COPY . .

# deploy stage

EXPOSE 80
CMD ["yarn start"]