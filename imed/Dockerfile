FROM node:10

RUN mkdir -p /usr/src/imed
WORKDIR /usr/src/imed

ADD package.json package-lock.json /usr/src/imed/
RUN npm run --verbose
ADD . /usr/src/imed/

# EXPOSE 80

CMD [ "npm", "start" ]
