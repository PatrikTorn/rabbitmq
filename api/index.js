const app = require("express")();
const axios = require("axios");
const bodyParser = require("body-parser");
const amqp = require("amqplib/callback_api");
const conString = "amqp://localhost" || "amqp://guest:guest@rabbitmq:5672";

const PORT = 8081;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/messages", async (req, res) => {
  const response = await axios.get("http://localhost:8080/messages");
  const messages = response.data;
  res.json(messages);
});


module.exports = app.listen(PORT, () => {
  console.log("App listening on port", PORT);
});
