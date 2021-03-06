import request from "supertest";
import app from "../src/app";

describe("GET /", () => {
  it("should return hello", async () => {
    const { body } = await request(app).get("/");
    expect(body.body).toEqual("Hello World");
  });
});
