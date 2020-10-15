const app = require("express")();
const fs = require("fs");
const amqp = require("amqplib/callback_api");
const PORT = 8080;
const conString = "amqp://guest:guest@rabbitmq:5672";
amqp.connect(conString, function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel((error1, channel) => {
    const MY_O_TOPIC = "my.o";
    const MY_I_TOPIC = "my.i";

    channel.assertQueue(MY_O_TOPIC, {
      durable: false,
    });

    channel.assertQueue(MY_I_TOPIC, {
      durable: false,
    });

    const consumeChannel = (topic) => {
      channel.consume(
        topic,
        (msg) => {
          const string =
            new Date().toISOString() +
            " Topic " +
            topic +
            ": " +
            msg.content.toString();
          fs.writeFileSync("./file.txt", string);
          console.log(
            " [x] Received %s from %s",
            msg.content.toString(),
            topic
          );
        },
        { noAck: true }
      );
    };

    console.log(
      " [*] Waiting for messages from  %s and %s.",
      MY_O_TOPIC,
      MY_I_TOPIC
    );

    consumeChannel(MY_O_TOPIC);
    consumeChannel(MY_I_TOPIC);
  });
});

app.listen(PORT, () => {
  "HTTPSERV listening on port", PORT;
});

app.get("/", (req, res) => {
  const fileContent = fs.readFileSync("./file.txt", {
    encoding: "utf-8",
    flag: "r",
  });
  console.log(fileContent);
  res.send(fileContent);
});
