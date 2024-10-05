require("./src/utils/mongoConnection");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "src", "views"));
app.set("view engine", "ejs");
const authRoute = require("./src/router/authRoute");
const actionRoute = require("./src/router/actionRouter");
const pingRoute = require("./src/router/pingRoute")
const profileRoute = require("./src/router/profileRouter")
app.use("/auth", authRoute);
app.use("/user", actionRoute);
app.use("/",profileRoute)
const pingRoute = require("./src/router/pingRoute");
const inviteRoute = require("./src/router/inviteRoute");
app.use("/auth", authRoute);
app.use("/user", actionRoute);
app.use("/invite", inviteRoute);
app.use("/", pingRoute);
module.exports = app;
