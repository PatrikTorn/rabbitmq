FROM node:10

RUN mkdir -p /usr/src/api
WORKDIR /usr/src/api

ADD package.json package-lock.json /usr/src/api/
RUN npm install

COPY . .

ADD . /usr/src/api/

EXPOSE 8081

CMD [ "npm", "start" ]

