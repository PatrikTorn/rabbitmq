const app = require("express")();
const fs = require("fs");
const amqp = require("amqplib/callback_api");
const PORT = 8080;
const conString = "amqp://guest:guest@rabbitmq:5672";
amqp.connect(conString, function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    const MY_O_TOPIC = "my.o";
    const MY_I_TOPIC = "my.i";

    channel.assertQueue(MY_O_TOPIC, {
      durable: false,
    });

    channel.assertQueue(MY_I_TOPIC, {
      durable: false,
    });

    console.log(
      " [*] Waiting for messages in %s and %s. To exit press CTRL+C",
      MY_O_TOPIC,
      MY_I_TOPIC
    );
    channel.consume(
      MY_O_TOPIC,
      function (msg) {
        const string =
          new Date().toISOString() +
          " Topic " +
          MY_O_TOPIC +
          ": " +
          msg.content.toString();
        fs.writeFileSync("./file.txt", string);
        console.log(" [x] Received %s", msg.content.toString());
        console.log("received my.o");
      },
      { noAck: true }
    );

    channel.consume(
      MY_I_TOPIC,
      function (msg) {
        const string =
          new Date().toISOString() +
          " Topic " +
          MY_I_TOPIC +
          ": " +
          msg.content.toString();
        fs.writeFileSync("./file.txt", string);
        console.log(" [x] Received %s", msg.content.toString());
        console.log("received my.i");
      },
      { noAck: true }
    );
  });
});

app.listen(PORT, () => {
  "HTTPSERV listening on port", PORT;
});

app.get("/", (req, res) => {
  console.log("HEre");
  const fileContent = fs.readFileSync("./file.txt", {
    encoding: "utf-8",
    flag: "r",
  });
  console.log(fileContent);
  res.send(fileContent);
});
