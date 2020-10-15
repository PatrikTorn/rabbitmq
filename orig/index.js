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
    setInterval(() => {
      channel.sendToQueue(TOPIC, Buffer.from("MSG_1"));
      channel.sendToQueue(TOPIC, Buffer.from("MSG_2"));
      channel.sendToQueue(TOPIC, Buffer.from("MSG_3"));
      console.log(" [x] ORIG Sent 3 messages");
    }, SENDING_INTERVAL_MS);
  });
});
