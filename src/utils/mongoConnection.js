const mongoose = require("mongoose");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

let ioInstance;

async function connectToDB() {
  try {
    await mongoose.connect(process.env.ATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to DB ");
    updateChannelMessages();
  } catch (err) {
    console.error("Error connecting to DB:", err);
  }
}

const updateChannelMessages = () => {
  const messageCollection = mongoose.connection.collection("messages");
  const changeStream = messageCollection.watch();
  
  changeStream.on("change", (change) => {
    if (change.operationType === "insert") {
      const newMessage = change.fullDocument;

      if (ioInstance) {
        ioInstance.to(newMessage.channel).emit("chat message", {
          text: newMessage.text,
          sentBy: newMessage.sentBy,
          sentAt: newMessage.sentAt,
          channel: newMessage.channel,
        });
        console.log("New message detected and emitted:", newMessage);
      }
    }
  });
  console.log("Listening for changes in the 'messages' collection...");
};

// connectToDB();
const initDBAndSocket = (io) => {
  ioInstance = io;
  connectToDB();
};

module.exports = {
  initDBAndSocket,
};
