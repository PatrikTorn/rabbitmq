const amqp = require("amqplib/callback_api");
const SENDING_INTERVAL_MS = 3000;
const TOPIC = "my.o";
const conString = "amqp://guest:guest@rabbitmq:5672";

amqp.connect(conString, function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    channel.assertQueue(TOPIC, {
      durable: false,
    });
    let i = 1;
    setInterval(() => {
      if (i > 3) {
        i = 1;
      }
      channel.sendToQueue(TOPIC, Buffer.from(`MSG_${i}`));
      console.log(`[x] ORIG Sent MSG_${i}`);
      i++;
    }, SENDING_INTERVAL_MS);
  });
});
