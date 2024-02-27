let users = []

exports.socketLogic = (io) => {
    io.on("connection",(socket)=>{
        console.log("User connected " + socket.id);

        socket.on("message",(message) => {
            console.log(message)
            io.emit("messageResponse",message);
        });

        socket.on("newUser",(user)=>{
            users.push(user);
            io.emit("newUserResponse",user);
        })

        socket.on("disconnect",()=>{
            console.log("disconnected " + socket.id)
            users = users.filter((user) => user.sockerID !== socket.id);
            io.emit("newUserRes",users);
            socket.disconnect();
        })
    })
}
