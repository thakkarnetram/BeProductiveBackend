const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

// Import your routes
const authRoute = require("./router/authRoute");
const actionRoute = require("./router/actionRouter");

// Error handlers
const CustomError = require("./utils/customError");
const GlobalError = require("./controllers/errorController");

require("dotenv").config();
const app = express();

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((error) => console.error("Error connecting to MongoDB Atlas:", error));

// Middleware
app.use(bodyParser.json());
app.use(cors());
// Routes
app.use("/auth", authRoute);
app.use("/user", actionRoute);
app.all("*", (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on the server`,
  // });
  // const err = new Error(`Can't find ${req.originalUrl} on the server`);
  // err.status = 'fail';
  // err.statusCode = 404;
  const err = new CustomError(
    `Can't find ${req.originalUrl} on the server`,
    404
  );
  next(err);
});

// global error handling middleware
app.use(GlobalError);
// port
const PORT = process.env.PORT || 8082;
// Start the server
app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
