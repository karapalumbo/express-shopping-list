process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("./app");
const items = require("./fakeDb");

let orange = { name: "orange", price: 1.0 };

beforeEach(function () {
  items.push(orange);
});

afterEach(function () {
  items.length = 0;
});

describe("GET /items", function () {
  test("Gets list of items", async function () {
    const res = await request(app).get(`/items`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ items: [orange] });
  });
});

describe("GET /items/:name", function () {
  test("Get single item", async function () {
    const res = await request(app).get(`/items/${orange.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ item: orange });
  });

  test("Respons with 404 if item not found", async function () {
    const res = await request(app).get(`/items/0`);
    expect(res.statusCode).toBe(404);
  });
});

describe("POST /items", function () {
  test("Creates new item", async function () {
    const res = await request(app).post(`/items`).send({
      name: "Banana",
      price: 0.99,
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ added: { name: "Banana", price: 0.99 } });
  });
});

describe("PATCH /items/:name", function () {
  test("Update item", async function () {
    const res = await request(app).patch(`/items/${orange.name}`).send({
      name: "apple",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      updated: { name: "apple", price: 1.0 },
    });
  });
});

describe("DELETE /items/:name", function () {
  test("Deletes an item", async function () {
    const res = await request(app).delete(`/items/${orange.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: "Deleted" });
  });
  test("Respond with 404 for deleting invalid item", async function () {
    const res = await request(app).delete("/items/grapes");
    expect(res.statusCode).toBe(404);
  });
});
