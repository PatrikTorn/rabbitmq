const request = require("supertest");
require("../orig/index.js");
require("../imed/index.js");
const api = require("../api/index.js");

describe("api state tests", () => {
  it("Gets initial state RUNNING", (done) => {
    request(api).get("/state").expect(200).expect("RUNNING", done);
  });

  it("Set state to PAUSED", (done) => {
    request(api).put("/state").send({ payload: "PAUSED" }).expect(200, done);
  });

  it("Gets changed state", (done) => {
    request(api).get("/state").expect(200).expect("PAUSED", done);
  });
});
