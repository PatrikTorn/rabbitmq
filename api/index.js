const app = require("express")();
const axios = require("axios");
const bodyParser = require("body-parser");
const amqp = require("amqplib/callback_api");
const conString = "amqp://localhost" || "amqp://guest:guest@rabbitmq:5672";

const PORT = 8081;

const STATE_TOPIC = "my.s";

const STATES = {
  PAUSED: "PAUSED",
  RUNNING: "RUNNING",
  INIT: "INIT",
  SHUTDOWN: "SHUTDOWN",
};

let state = STATES.RUNNING;
const logs = [];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/messages", async (req, res) => {
  const response = await axios.get("http://localhost:8080/messages");
  const messages = response.data;
  res.json(messages);
});

app.put("/state", (req, res) => {
  const newState = req.body.payload;
  if (!(newState in STATES) || newState === state) {
    return res.sendStatus(400);
  }
  switchState(newState);
  logs.push({
    time: new Date(),
    state: newState,
  });
  state = newState;
  res.sendStatus(200);
});

app.get("/state", (req, res) => {
  res.send(state);
});

app.get("/run-log", (req, res) => {
  res.send(
    logs.map((log) => `${log.time.toISOString()}: ${log.state}`).join("\n")
  );
});

function switchState(newState) {
  switch (newState) {
    case STATES.RUNNING:
      amqp.connect(conString, function (error0, connection) {
        if (error0) throw error0;
        connection.createChannel(function (error1, channel) {
          channel.sendToQueue(STATE_TOPIC, Buffer.from("true"));
        });
      });
      break;
    case STATES.PAUSED:
      amqp.connect(conString, function (error0, connection) {
        if (error0) throw error0;
        connection.createChannel(function (error1, channel) {
          channel.sendToQueue(STATE_TOPIC, Buffer.from("false"));
        });
      });
      break;
  }
  console.log(`[x] API Sent ${newState}`);
}

module.exports = app.listen(PORT, () => {
  console.log("App listening on port", PORT);
});
