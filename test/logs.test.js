const { assert } = require("console");
const request = require("supertest");
require("../orig/index.js");
require("../imed/index.js");
const api = require("../api/index.js");

describe("api logs tests", () => {
  it("Gets logs after putting the status", (done) => {
    setTimeout(() => {
      request(api)
        .get("/run-log")
        .expect((res) => {
          assert(res.text != "");
          assert(res.text.startsWith(new Date().getFullYear()));
        })
        .expect(200, done);
    }, 5000);
  });
});
