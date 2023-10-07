require('./src/utils/mongoConnection')
const express = require("express");
const bodyParser = require('body-parser');
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
const authRoute = require("./src/router/authRoute");
const actionRoute = require("./src/router/actionRouter");
const pingRoute = require("./src/router/pingRoute")
app.use("/auth", authRoute);
app.use("/user", actionRoute);
app.use("/", pingRoute);
module.exports = app;
