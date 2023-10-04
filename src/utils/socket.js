const socketIO = require("socket.io")

const socketConnection = (server) => {
    const io = socketIO(server);
    io.on('connection', (socket) => {
        console.log("User connected",socket.id)
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
