const app = require("express")();
const fs = require("fs");
const amqp = require("amqplib/callback_api");
const PORT = 8080;
const conString = "amqp://guest:guest@rabbitmq:5672";
const MESSAGES_FILE = "./messages.txt";
const FILE = "./file.txt";
// Reset the file content to empty
fs.writeFileSync(FILE, "");
fs.writeFileSync(MESSAGES_FILE, "");

function readFile(fileName) {
  return fs.readFileSync(fileName, {
    encoding: "utf-8",
    flag: "r",
  });
}

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
          fs.writeFileSync(FILE, string);
          const newMessages = readFile(MESSAGES_FILE) + "\n" + string;
          fs.writeFileSync(MESSAGES_FILE, newMessages);
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

app.get("/", (req, res) => {
  const fileContent = readFile(FILE);
  console.log(fileContent);
  res.send(fileContent);
});

app.get("/messages", (req, res) => {
  res.json(readFile(MESSAGES_FILE));
});

module.exports = app.listen(PORT, () => {
  "HTTPSERV listening on port", PORT;
});
