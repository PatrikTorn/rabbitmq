const { assert } = require("console");
const request = require("supertest");
require("../orig/index.js");
require("../imed/index.js");
const api = require("../api/index.js");

describe("api message tests", () => {
  it("Gets messages after 5 seconds delay", (done) => {
    setTimeout(() => {
      request(api)
        .get("/messages")
        .expect((res) => {
          assert(res.text != "");
          assert(res.text.startsWith(new Date().getFullYear()));
        })
        .expect(200, done);
    }, 5000);
  });
});
