const socketIO = require("socket.io");
const Message = require("../models/Message");

let io; // Store the io instance globally

// Initialize socket.io and store the instance in the io variable
exports.socketConnection = (server) => {
    io = socketIO(server);
    io.on("connection", (socket) => {

        console.log("User connected");

// Handle socket events as needed
        socket.on("chat message", async (data) => {
            console.log(`Message received: ${data.message}`);

            try {
                // Create a new Message document
                const newMessage = new Message({
                    text: data.message,
                    sentBy: data.userId, // Replace with the actual user ID
                    channel: data.channelId, // Replace with the actual channel ID
                });

                // Save the message to MongoDB using await
                const savedMessage = await newMessage.save();
                console.log("Message saved:", savedMessage);

                // Broadcast msg to users
                io.emit("chat message", {
                    message: data.message,
                    sentBy: data.userId,
                    channel: data.channelId,
                });
            } catch (err) {
                console.error("Error saving message:", err);
            }
        });
        socket.on("disconnect", () => {
            console.log("User disconnected");
        });
    });
};
