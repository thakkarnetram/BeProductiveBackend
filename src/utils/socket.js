const { Timestamp } = require("mongodb");
const Message = require("../models/Message");
let users = [];

exports.socketLogic = (io) => {
  io.on("connection", (socket) => {
    // User Connection
    console.log("User connected " + socket.id);

    // User joins the channel
    socket.on("join-channel", (channelId) => {
      socket.join(channelId);
      console.log(`${socket.id} joined the channel ${channelId}`);
    });

    // Getting the meessage
    socket.on("chat message", async (msg) => {  
      try {
        // save message
        const newMessage = new Message({
          text: msg.message,
          sentBy: msg.name,
          sentAt: msg.timeStamp,
          channel: msg.channelID,
          sentOn: msg.date,
        });

        await newMessage.save();

        socket.to(msg.channelID).emit("chat message", msg);
        console.log(msg);
      } catch (e) {
        console.log("error ", e);
      }
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
