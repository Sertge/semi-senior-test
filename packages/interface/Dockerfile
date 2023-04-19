FROM node:18-alpine

LABEL maintainer "Sergio Jaime"

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . .

RUN yarn build 

CMD yarn start

EXPOSE 3000