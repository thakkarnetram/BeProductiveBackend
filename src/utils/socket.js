const {Timestamp} = require("mongodb");
let users = []

exports.socketLogic = (io) => {
    io.on("connection", (socket) => {
        console.log("User connected " + socket.id);

        socket.on("message", (data) => {
            let {message, name,timeStamp, email,userName} = data;

            const newData = {
                text: message,
                userName,
                name,
                email,
                time: timeStamp
            }
            io.emit("messageResponse", newData);
            console.log(newData)
        });

        socket.on("newUser", (user) => {
            users.push(user);
            io.emit("newUserResponse", user);
        })

        socket.on("disconnect", () => {
            console.log("disconnected " + socket.id)
            users = users.filter((user) => user.sockerID !== socket.id);
            io.emit("newUserRes", users);
            socket.disconnect();
        })
    })
}
