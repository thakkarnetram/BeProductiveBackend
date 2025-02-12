const Feedback = require("../../models/feedback");
const asyncErrorHandler = require("../../utils/AsyncErrorHandler");

// FEEDBACK SECTION
exports.addFeedback = asyncErrorHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { feedbackMessage, sentBy } = req.body;
  if (!feedbackMessage) {
    return res.status(403).json({ message: "Feedback message cant be empty" });
  }

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
