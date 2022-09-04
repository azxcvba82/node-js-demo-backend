ARG APP_HOME=/home/node/app

# build stage
FROM node:alpine
WORKDIR ${APP_HOME}


COPY package*.json ./
RUN yarn install
COPY . .

# deploy stage

EXPOSE 80
WORKDIR /src
CMD ["node", "app.js"]