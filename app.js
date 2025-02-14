require("./src/utils/database-handler/mongoConnection");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "src", "views"));
app.set("view engine", "ejs");
// Authentication & Authorization Route
const authRoute = require("./src/router/user-auth/authRoute");
const otpRoute = require('./src/router/user-auth/otpRouter');
// User based action routes
const todoRoute = require("./src/router/user-actions/productivespace-routes/todoRouter");
const notesRoute = require("./src/router/user-actions/productivespace-routes/notesRouter");
const channelRoute = require("./src/router/user-actions/workspace-routes/channelRouter");
const workSpaceRoute = require("./src/router/user-actions/workspace-routes/workSpaceRouter");
const inviteRoute = require("./src/router/user-actions/workspace-routes/inviteRoute");
const messageRoute = require("./src/router/user-actions/workspace-routes/messageRouter");
const profileRoute = require("./src/router/user-actions/profilespace-routes/profileRouter");
// Server ping check route
const pingRoute = require("./src/router/pingRoute");
// Feedback route
const feedBackRoute = require("./src/router/user-actions/profilespace-routes/feedBackRouter");
// Authentication & Authorization endpoints
app.use("/auth", authRoute);
app.use("/",otpRoute);
// User based actions endpoint
app.use("/user", todoRoute);
app.use("/user", notesRoute);
app.use("/user", channelRoute);
app.use("/user", workSpaceRoute);
app.use("/invite", inviteRoute);
app.use("/", profileRoute);
app.use("/", messageRoute);
// Server ping endpoint
app.use("/", pingRoute);
// Feedback endpoint
app.use("/", feedBackRoute);

module.exports = app;
