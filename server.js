const app = require("./app");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const { socketLogic } = require("./src/utils/socket");
const { initDBAndSocket } = require("./src/utils/mongoConnection");

// Error handlers
const CustomError = require("./src/utils/customError");
const GlobalError = require("./src/controllers/errorController");

// Socket connection

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Socket logic
socketLogic(io);

// Mongo Connection & Io instance 
initDBAndSocket(io);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Set the views directory and the view engine
app.set("views", path.join(__dirname, "src", "views"));
app.set("view engine", "ejs");

// log routes the user hits

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

app.all("*", (req, res, next) => {
  const err = new CustomError(
    `Can't find ${req.originalUrl} on the server`,
    404
  );
  next(err);
});

// global error handling middleware
app.use(GlobalError);

const PORT = process.env.PORT || 8082;

server.listen(PORT, () => {
  console.log("Server is running on port  " + PORT);
});
