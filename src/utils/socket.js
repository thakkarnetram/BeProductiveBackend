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

const socketConnection = (server) => {
    const io = socketIO(server);
    io.on('connection', (socket) => {
        console.log("User connected")
        // Msg from user
        socket.on("chat message", (message) => {
            console.log(`message received  ${message}`)
            // Broadcast msg to users
            io.emit("chat message",message)
        })
        // dc
        socket.on("disconnect",()=>{
            console.log("user disconnected")
        })
    })
}

module.exports=socketConnection
