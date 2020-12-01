const amqp = require("amqplib/callback_api");
const TIMEOUT_MS = 1000;
const ORIG_TOPIC = "my.o";
const TOPIC = "my.i";
const STATE_TOPIC = "my.s";
const conString = "amqp://guest:guest@rabbitmq:5672";
let running = true;
const STATES = {
  PAUSED: "PAUSED",
  RUNNING: "RUNNING",
  INIT: "INIT",
  SHUTDOWN: "SHUTDOWN",
};

amqp.connect(conString, function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    channel.assertQueue(ORIG_TOPIC, {
      durable: false,
    });

    channel.assertQueue(STATE_TOPIC, {
      durable: false,
    });

    console.log(" [*] Waiting for messages in topic %s.", ORIG_TOPIC);
    if (running) {
      channel.consume(
        ORIG_TOPIC,
        function (msg) {
          console.log(
            " [x] Received %s from %s",
            msg.content.toString(),
            ORIG_TOPIC
          );
          setTimeout(() => {
            channel.sendToQueue(
              TOPIC,
              Buffer.from(`Got ${msg.content.toString()}`)
            );
            console.log(" [x] Sent %s to %s", msg.content.toString(), TOPIC);
          }, TIMEOUT_MS);
        },
        { noAck: true }
      );
    }

    channel.consume(
      STATE_TOPIC,
      (msg) => {
        const isRunning = msg.content.toString();
        switch (isRunning) {
          case STATES.INIT:
            running = true;
            break;
          case STATES.SHUTDOWN:
            running = false;
            break;
        }
      },
      { noAck: true }
    );
  });
});
