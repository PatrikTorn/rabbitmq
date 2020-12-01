# Simple RabbitMQ application

## About the application

Application is created with node.js using RabbitMQ's amqp message breaker -library. The application consists of four different services: HTTPSERV, ORSERVER, INTERMED, API and ORIG. HTTPSERV and OBSERER are located in same folder.

The idea is that ORIG sends messages every third seconds to first queue. OBSERVER and INTERMED receives the messages from ORIG. INTERMED sends another message with different topic to OBSERVER. Observer dispatches the messages to the HTTPSERV's file.txt. When user requests the HTTPSERV's url (localhost:8080), the output of the newest message, time and topic will be displayed. API is located in url localhost:80081. 

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
cd api && npm install && npm start
(Wait for at most 30 seconds...)
$ curl localhost:8080
```

## Learnings

I have worked in software development positions for more than half a decade, and I have not yet set up so far, a single pipelineä. This course assignment was very reward-ing for me, even though the work was complex. The level of difficulty of the task in the amount of code was not so much a problem, but mainly learning something new and understanding and applying it. I learned the new AMQP protocol at work because I used the RabbitMQ message breaker to communicate between different servers. In addition, I learned how to use the Docker and Docker-compose tools. I see that in many cases a project is good to implement with a virtual machine if its complexity and package dependencies start to escape. I learned to use Test-driven development for the first time, where tests were performed before the code itself. I did not see this ap-proach very useful for myself, because I'm used to carry out the tests always in arrears. In addition, perhaps most importantly, I learned CI / CD pipeline construction for a ver-sion control service. This is definitely the most important contribution of this exercise work, which I also spent considerably the most time on. I believe that these lessons brought by the course will give me many more skills in my future working life as well.