FROM node:10

RUN mkdir -p /usr/src/orig
WORKDIR /usr/src/orig

ADD package.json package-lock.json /usr/src/orig/
RUN npm run --verbose
ADD . /usr/src/orig/

CMD [ "npm", "start" ]
