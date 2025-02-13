const User = require("../../../models/User");
const asyncErrorHandler = require("../../../utils/AsyncErrorHandler");

exports.getProfileData = asyncErrorHandler(async (req, res, next) => {
  const _id = req.params._id;
  // find user with id
  const user = await User.find({ _id });
  // if user !found
  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }
  // exists
  if (user) {
    return res.status(200).json(user);
  }
});
