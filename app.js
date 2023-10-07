require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const {socketConnection} = require("./utils/socket")
const http = require("http")
// Import your routes
const authRoute = require("./router/authRoute");
const actionRoute = require("./router/actionRouter");
// Error handlers
const CustomError = require("./utils/customError");
const GlobalError = require("./controllers/errorController");
// Socket connection
const server = http.createServer(app);
const io = socketConnection(server)
// Middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());
// Set the views directory and the view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
// log routes the user hits
app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
});
// Connect to MongoDB Atlas
mongoose
    .connect(process.env.ATLAS_URI, {
        useNewUrlParser: true, useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch((error) => console.error("Error connecting to MongoDB Atlas:", error));
// Routes
app.use("/auth", authRoute);
app.use("/user", actionRoute);
app.all("*", (req, res, next) => {
    const err = new CustomError(`Can't find ${req.originalUrl} on the server`, 404);
    next(err);
});

// global error handling middleware
app.use(GlobalError);
const PORT = process.env.PORT || 8082;
// Start the server
// app.listen(PORT, () => {
//     console.log("Server is running on port " + PORT);
// });
server.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});
