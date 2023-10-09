const socketIO = require("socket.io");
const Message = require("../models/Message");

let io; // Store the io instance globally

// Initialize socket.io and store the instance in the io variable
const socketConnection = (server) => {
    io = socketIO(server);
    io.on("connection", (socket) => {
        console.log("User connected");

        // Handle socket events as needed
        socket.on("chat message", async (data) => {
            console.log(`Message received: ${data.message}`);
            // Add your logic to handle the received message
        });

        // Add more socket event handlers as needed

        // Disconnect event
        socket.on("disconnect", () => {
            console.log("User disconnected");
        });
    });
}

module.exports = socketConnection;
