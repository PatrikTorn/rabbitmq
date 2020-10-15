# Simple RabbitMQ application

## About the application

Application is created with node.js using RabbitMQ's amqp message breaker -library. The application consists of four different services: HTTPSERV, ORSERVER, INTERMED and ORIG. HTTPSERV and OBSERER are located in same folder.

The idea is that ORIG sends messages every third seconds to first queue. OBSERVER and INTERMED receives the messages from ORIG. INTERMED sends another message with different topic to OBSERVER. Observer dispatches the messages to the HTTPSERV's file.txt. When user requests the HTTPSERV's url (localhost:8080), the output of the newest message, time and topic will be displayed. 

### About Dockerization

The appliation is dockerized, due it has such many different services that using just only one command it works properly. The whole application is compressed to one docker-compose file, which determines the services to start. Docker-compose launches RabbitMQ server and all other services located in each folders' Dockerfile. Becouse staring RabbitMQ takes at least 30 seconds to start, the other servies tries to restart until RabbitMQ is started properly.

## Getting started

### Using Docker

1. Install docker to your computer

Run the application with following scripts to see expected results
```
$ git clone https://github.com/PatrikTorn/rabbitmq.git
$ docker-compose build –-no-cache
$ docker-compose up -d
(Wait for at most 30 seconds...)
$ curl localhost:8080
```

To close the application, run the following scripts:
```
$ docker-compose down
```

### Error situations

There might be issue while starting up the RabbitMQ server. You can check your docker images from command line using script.

```
docker ps -a
```

When you see all 4 images in status "Open", the application should work.

### Running the application without Docker

If you want to test the application without Docker, you should install RabbitMQ server to your computer and start the server on port 5672

Run the following scripts to start each server:
```
cd httpserv && npm install && npm start
cd imed && npm install && npm start
cd orig && npm install && npm start
(Wait for at most 30 seconds...)
$ curl localhost:8080
```

## Learnings

I have used RabbitMQ twice before. First time I used message breaker in my first software job. The case was error reporting, when the application crashed, the RabbitMQ sent the errors to the log. The second time was in school at Web Architectures course. There I realized the first time, how message breakers actually works. I am amazed, how functional and well implemented the protocol really is. I figured out that RabbitMQ is much faster and more reliable in many cases than just plain HTTP. I have been doing Web sockets in many projects, i found a lot similarity in AMQP protocol with Websockets.

After this job, I have deepen my learnings especially with using Docker and Docker-compose. Working with RabbitMQ gave me good new tips to the future!