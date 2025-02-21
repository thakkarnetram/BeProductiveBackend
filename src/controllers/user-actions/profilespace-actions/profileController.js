const User = require("../../../models/User");
const NodeCache = require("node-cache");
const profileCache = new NodeCache({
  stdTTL: 3600,
  checkperiod: 1600
});
const asyncErrorHandler = require("../../../utils/error-handlers/AsyncErrorHandler");

exports.getProfileData = asyncErrorHandler(async (req, res, next) => {
  const _id = req.params._id;
  try {
    // find user with id
    let user ;
    user = await User.find({ _id });
    // if user !found
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    if(profileCache.has(`profile:${_id}`)) {
      user = JSON.parse(profileCache.get(`profile:${_id}`));
    } else {
      profileCache.set(`profile:${_id}`,JSON.stringify(user))
    }
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({message:err})
  }
});
