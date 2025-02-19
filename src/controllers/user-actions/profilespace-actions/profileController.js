const User = require("../../../models/User");
const redis = require('../../../utils/caching-handler/redisClient');
const asyncErrorHandler = require("../../../utils/error-handlers/AsyncErrorHandler");

exports.getProfileData = asyncErrorHandler(async (req, res, next) => {
  const _id = req.params._id;
  const cacheKey = `profile:${_id}`;
  try {
    if(!redis.isReady) {
      console.warn('Redis not open')
    } else {
      const userCache = await redis.get(cacheKey);
      if(userCache) {
        return res.status(200).json(JSON.parse(userCache))
      }
    }
    // find user with id
    const user = await User.find({ _id });
    // if user !found
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    // exists
    if (user) {
      await redis.setEx(cacheKey,3600,JSON.stringify(user))
      return res.status(200).json(user);
    }
  } catch (err) {
    return res.status(500).json({message:err})
  }
});
