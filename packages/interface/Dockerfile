FROM node:18-alpine

LABEL maintainer "Sergio Jaime"

WORKDIR /usr/src/app

COPY . .

RUN yarn --production

RUN yarn build 

CMD yarn start

EXPOSE 4000