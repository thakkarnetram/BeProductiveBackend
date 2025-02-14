const Message = require("../../models/Message");
const Channel = require("../../models/Channel");
let users = [];

exports.socketLogic = (io) => {
  io.on("connection", (socket) => {
    // User Connection
    console.log("User connected ? " + socket.id);

    // User joins the channel
    socket.on("join-channel", (channelId) => {
      socket.join(channelId);
      console.log(`${socket.id} joined the channel ${channelId}`);
    });
    // Getting the meessage
    socket.on("chat message", async (msg) => {
      try {
        // save message to Message model
        const newMessage = new Message({
          text: msg.text,
          sentBy: msg.sentBy,
          channel: msg.channel,
          sentAt: msg.sentAt,
          sentOn: msg.sentOn,
        });
        await newMessage.save();
        // save message to Channel's message
        const updatedChannel = await Channel.findByIdAndUpdate(
          msg.channel,
          {
            $push: {
              messages: {
                text: msg.text,
                sentBy: msg.sentBy,
                sentAt: msg.sentAt,
                sentOn: msg.sentOn,
              },
            },
          },
          { new: true }
        );
        socket.to(msg.channelID).emit("chat message", { ...msg });
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
