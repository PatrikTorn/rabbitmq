const { assert } = require("console");
const request = require("supertest");
require("../orig/index.js");
require("../imed/index.js");
const httpserv = require("../httpserv/index.js");

describe("httpserv message tests", () => {
  it("Gets empty message when server starts", (done) => {
    request(httpserv).get("/").expect(200).expect("", done);
  });
  it("Gets message after 5 seconds interval", (done) => {
    setTimeout(() => {
      request(httpserv)
        .get("/")
        .expect((res) => {
          assert(res.text != "");
        })
        .expect(200, done);
    }, 5000);
  });
});
