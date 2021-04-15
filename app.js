const express = require("express");
const app = express();
const routes = require("./routes");
const ExpressError = require("./expressError");

app.use(express.json());
app.use("/items", routes);

app.use(function (req, res, next) {
  return new ExpressError("Item not found", 404);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);

  return res.json({
    err: err.message,
  });
});

module.exports = app;
