FROM node:10

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ADD package.json package-lock.json /usr/src/app/
RUN yarn --verbose
ADD . /usr/src/app/

EXPOSE 80

CMD [ "npm", "start" ]
