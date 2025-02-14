const Note = require("../../../models/Notes");
const redis = require('../../../utils/caching-handler/redisClient');
const asyncErrorHandler = require("../../../utils/error-handlers/AsyncErrorHandler");

//  NOTES SECTION
exports.getNotes = asyncErrorHandler(async (req, res, next) => {
    const userEmail = req.user.email;
    const cacheKey = `notes:${userEmail}`;
    try{

        if(!redis.isReady) {
            console.warn('Redis client is not open')
        } else {
            const cachedNotes = await redis.get(cacheKey);
            if(cachedNotes) {
                return res.status(200).json(JSON.parse(cachedNotes));
            }
        }
        const notes = await Note.find({ email: userEmail });
        if (!notes) {
            return res.status(404).json({ message: "no notes found" });
        }
        await redis.setEx(cacheKey,3600,JSON.stringify(notes));
        return res.status(200).json(notes);
    }catch (error) {
        console.error("Error in getNotes:", error);
        return res.status(500).json({ message: "Server error" });
    }
});

exports.getRecentNotes = asyncErrorHandler(async (req, res, next) => {
    const userEmail = req.user.email;
    const cacheKey = `recentNotes:${userEmail}`;
    try {
        if(redis.isReady) {
            const cachedNotes = await redis.get(cacheKey);
            if(cachedNotes) {
                return res.status(200).json(JSON.parse(cachedNotes));
            }
        } else {
            console.warn('Redis client is not open')
        }
        const notes = await Note.find({ email: userEmail })
            .sort({ createdAt: -1 })
            .limit(1);
        if (!notes) {
            return res.status(404).json({ message: "No Todos Found" });
        }
            await redis.setEx(cacheKey, 3600, JSON.stringify(notes));
            return res.status(200).json(notes);
    }
    catch (error) {
        return res.status(500).json({message:'Internal server error',error})
    }
});

exports.addNotes = asyncErrorHandler(async (req, res, next) => {
    const { title, description } = req.body;
    const email = req.user.email;
    const newNote = new Note({
        title,
        description,
        email,
    });
    await redis.del(`notes:${email}`);
    if (newNote) {
        newNote
            .save()
            .then(() => res.status(201).json({ message: "Note added!", newNote }));
    }
});

exports.updateNotes = asyncErrorHandler(async (req, res, next) => {
    const _id = req.params._id;
    const email = req.user.email;
    const updatedNote = req.body;
    // Check if the note with the given _id and email exists
    const note = await Note.findOne({ _id, email });
    if (!note) {
        // If the note does not exist or the email doesn't match, return Unauthorized
        return res.status(401).json({ message: "Unauthorized to update this" });
    }
    // If the note exists and the email matches, perform the update
    const options = { new: true };
    const result = await Note.findByIdAndUpdate(_id, updatedNote, options);
    await redis.del(`notes:${email}`);
    return res.status(200).json({ message: `Note updated for ${email}`, result });
});

exports.deleteNotes = asyncErrorHandler(async (req, res, next) => {
    const _id = req.params._id;
    const email = req.user.email;
    // check if note with id and email exists
    const note = await Note.findOne({ _id, email });
    if (!note) {
        return res.status(401).json({ message: "Unauthorized to delete this" });
    }
    // if note exists and email matches delete it
    const deletedNote = await Note.findByIdAndDelete(_id);
    await redis.del(`notes:${email}`);
    return res
        .status(200)
        .json({ message: `Note deleted for ${email}`, deletedNote });
});
