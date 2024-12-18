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
const otpRoute = require('./src/router/otpRouter')
const pingRoute = require("./src/router/pingRoute");
const profileRoute = require("./src/router/profileRouter");
const inviteRoute = require("./src/router/inviteRoute");
const messageRoute = require("./src/router/messageRouter");
const feedBackRoute = require("./src/router/feedBackRouter");
app.use("/", pingRoute);
app.use("/", profileRoute);
app.use("/", feedBackRoute);
app.use("/", messageRoute);
app.use("/",otpRoute);
app.use("/auth", authRoute);
app.use("/user", actionRoute);
app.use("/auth", authRoute);
app.use("/user", actionRoute);
app.use("/invite", inviteRoute);
module.exports = app;
