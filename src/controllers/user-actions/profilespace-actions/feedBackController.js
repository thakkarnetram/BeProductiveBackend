const Feedback = require("../../../models/feedback");
const asyncErrorHandler = require("../../../utils/error-handlers/AsyncErrorHandler");

// FEEDBACK SECTION
exports.addFeedback = asyncErrorHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { feedbackMessage, sentBy } = req.body;

  if (!feedbackMessage) {
    return res.status(403).json({ message: "Feedback message cant be empty" });
  }
  // Send data to webhook
  sendDataToWebHook(feedbackMessage,sentBy,userId)
  const feedback = new Feedback({
    feedback: feedbackMessage,
    sentBy: sentBy,
    userId,
  });
  try {
    await feedback.save();
    return res.status(200).json({ message: "Feedback sent. Thank you! " });
  } catch (e) {
    return res.status(500).json({ message: e });
  }
});

const sendDataToWebHook = async (msg,sender,userId) => {
  if(!msg || !sender || !userId) {
    return;
  }
  try {
    const res = await fetch(process.env.WEB_HOOK_URL,{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        embeds: [
          {
            title: "📢 New Feedback Received",
            color: 0x00ff00,
            fields: [
              { name: "User Id", value: userId || "Anonymous Id"},
              { name: "User", value: sender || "Anonymous" },
              { name: "Message", value: `${msg || "N/A"}`},
            ],
            timestamp: new Date()
          }
        ]
      })
    })
    if(res.ok) {
      console.log("Data sent to webhook")
    }
  } catch (err) {
    throw new Error(`Internal server error ${err}`);
  }
}
