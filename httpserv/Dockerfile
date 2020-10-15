FROM node:10

RUN mkdir -p /usr/src/httpserv
WORKDIR /usr/src/httpserv

ADD package.json package-lock.json /usr/src/httpserv/
RUN npm install

COPY . .

ADD . /usr/src/httpserv/

EXPOSE 8080

CMD [ "npm", "start" ]

