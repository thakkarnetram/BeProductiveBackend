const { Timestamp } = require("mongodb");
let users = [];

exports.socketLogic = (io) => {
  io.on("connection", (socket) => {
    // User Connection
    console.log("User connected " + socket.id);

    // Getting the meessage
    socket.on("chat message", (msg) => {
      io.broadcast.emit("chat message", msg);
      console.log(msg);
    });

    // New User Connection
    socket.on("newUser", (user) => {
      users.push(user);
      io.emit("newUserResponse", user);
    });

    // Disconnection
    socket.on("disconnect", () => {
      console.log("disconnected " + socket.id);
      users = users.filter((user) => user.sockerID !== socket.id);
      io.emit("newUserRes", users);
      socket.disconnect();
    });
  });
};
