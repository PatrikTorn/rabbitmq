const amqp = require("amqplib/callback_api");
const SENDING_INTERVAL_MS = 3000;
const TOPIC = "my.o";
const STATE_TOPIC = "my.s";
const conString = "amqp://localhost" || "amqp://guest:guest@rabbitmq:5672";

let running = true;

module.exports = amqp.connect(conString, function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    channel.assertQueue(TOPIC, {
      durable: false,
    });
    channel.assertQueue(STATE_TOPIC, {
      durable: false,
    });

    let i = 1;
    setInterval(() => {
      if (!running) return;
      if (i > 3) {
        i = 1;
      }
      channel.sendToQueue(TOPIC, Buffer.from(`MSG_${i}`));
      console.log(`[x] ORIG Sent MSG_${i}`);
      i++;
    }, SENDING_INTERVAL_MS);

    channel.consume(
      STATE_TOPIC,
      function (msg) {
        console.log(
          " [x] Received %s from %s",
          msg.content.toString(),
          STATE_TOPIC
        );
        const isRunning = msg.content.toString();
        if (isRunning === "true") {
          running = true;
        } else {
          running = false;
        }
      },
      { noAck: true }
    );
  });
});
