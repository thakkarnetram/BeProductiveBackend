const Message = require("../../models/Message");
const Channel = require("../../models/Channel");
const User = require("../../models/User");
const admin = require("../firebase-admin/admin");

let users = [];

exports.socketLogic = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected: " + socket.id);

    // Join channel
    socket.on("join-channel", (channelId) => {
      socket.join(channelId);
      console.log(`${socket.id} joined the channel ${channelId}`);
    });

    // Chat message received
    socket.on("chat message", async (msg) => {
      try {
        // Save to Message model
        const newMessage = new Message({
          text: msg.text,
          sentBy: msg.sentBy,
          channel: msg.channel,
          sentAt: msg.sentAt,
          sentOn: msg.sentOn,
        });
        await newMessage.save();

        // Add to channel's messages array
        await Channel.findByIdAndUpdate(
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

        // Broadcast message to others in channel
        socket.to(msg.channelID).emit("chat message", { ...msg });

        // Identify the sender using email
        const senderUser = await User.findOne({ email: msg.email });
        const senderId = senderUser?._id?.toString();
        const senderName = senderUser?.name;

        // Get channel members
        const channel = await Channel.findById(msg.channel).populate({
          path: "members",
          model: "users",
          select: "_id fcmTokens"
        });

        // Filter out sender from notification recipients
        const recipients = channel.members.filter(
            (user) => user._id.toString() !== senderId
        );

        // Send FCM notifications
        for (const user of recipients) {
          if (user.fcmTokens && user.fcmTokens.length > 0) {
            for (const token of user.fcmTokens) {
              try {
                await admin.messaging().send({
                  token,
                  notification: {
                    title: `${senderName || 'New Message'}`,
                    body: msg.text,
                  },
                  data: {
                    channelId: msg.channel,
                    sentBy: msg.sentBy,
                  },
                });
              } catch (err) {
                console.log("FCM error for token:", token, err.message);
              }
            }
          }
        }

      } catch (e) {
        console.log("Chat message error:", e);
      }
    });

    // Handle new user
    socket.on("newUser", (user) => {
      users.push(user);
      io.emit("newUserResponse", user);
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log("Disconnected: " + socket.id);
      users = users.filter((user) => user.socketID !== socket.id);
      io.emit("newUserRes", users);
    });
  });
};
