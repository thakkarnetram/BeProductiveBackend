const mongoose = require("mongoose");
const User = require("../../models/User");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

let ioInstance;

async function connectToDB() {
  try {
    await mongoose.connect(process.env.ATLAS_URI_LIVE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to DB ");
    updateChannelMessages();
    updateUserSchema();
  } catch (err) {
    console.error("Error connecting to DB:", err);
  }
}

const updateUserSchema =  async () => {
  const result = await User.updateMany(
      {
        $or: [
          { plan: { $exists: false } },
          { subscription: { $exists: false } },
        ],
      },
      {
        $set: {
          plan: "free",
          subscription: {
            entitlement: null,
            productId: null,
            expiry: null,
            lastSynced: null,
          },
        },
      }
  );

  console.log(`✅ Updated ${result.modifiedCount} users`);
  process.exit();
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
