FROM node:18-alpine

LABEL maintainer "Sergio Jaime"

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . ./

RUN npm run build

CMD npm run start

EXPOSE 4000