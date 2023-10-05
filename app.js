require('./src/utils/mongoConnection')
const express = require("express");
const app = express();
app.use(express.json());
const authRoute = require("./src/router/authRoute");
const actionRoute = require("./src/router/actionRouter");
const pingRoute = require("./src/router/pingRoute")
app.use("/auth", authRoute);
app.use("/user", actionRoute);
app.use("/", pingRoute);
module.exports = app;