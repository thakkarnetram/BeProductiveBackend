const Note = require("../../../models/Notes");
const asyncErrorHandler = require("../../../utils/error-handlers/AsyncErrorHandler");
const NodeCache = require("node-cache");
const noteCache = new NodeCache({
    stdTTL: 3600,
    checkperiod: 1600
});

//  NOTES SECTION
exports.getNotes = asyncErrorHandler(async (req, res, next) => {
    const userEmail = req.user.email;
    try {
        let notes;
        notes = await Note.find({email: userEmail});
        if (!notes) {
            return res.status(404).json({message: "no notes found"});
        }
        if (noteCache.has(`notes:${userEmail}`)) {
            notes = JSON.parse(noteCache.get(`notes:${userEmail}`));
        } else {
            noteCache.set(`notes:${userEmail}`, JSON.stringify(notes));
        }
        return res.status(200).json(notes);
    } catch (error) {
        console.error("Error in getNotes:", error);
        return res.status(500).json({message: "Server error"});
    }
});

exports.getRecentNotes = asyncErrorHandler(async (req, res, next) => {
    const userEmail = req.user.email;
    try {
        let notes;
        notes = await Note.find({email: userEmail})
            .sort({createdAt: -1})
            .limit(1);
        if (!notes) {
            return res.status(404).json({message: "No Todos Found"});
        }
        if (noteCache.has(`recentNotes:${userEmail}`)) {
            notes = JSON.parse(noteCache.get(`recentNotes:${userEmail}`));
        } else {
            noteCache.set(`recentNotes:${userEmail}`, JSON.stringify(notes));
        }
        return res.status(200).json(notes);
    } catch (error) {
        return res.status(500).json({message: 'Internal server error', error})
    }
});

exports.addNotes = asyncErrorHandler(async (req, res, next) => {
    const {title, description} = req.body;
    const email = req.user.email;
    const newNote = new Note({
        title,
        description,
        email,
    });
    noteCache.del(`recentNotes:${email}`);
    noteCache.del(`notes:${email}`);
    if (newNote) {
        newNote
            .save()
            .then(() => res.status(201).json({message: "Note added!", newNote}));
    }
});

exports.updateNotes = asyncErrorHandler(async (req, res, next) => {
    const _id = req.params._id;
    const email = req.user.email;
    const updatedNote = req.body;
    // Check if the note with the given _id and email exists
    const note = await Note.findOne({_id, email});
    if (!note) {
        // If the note does not exist or the email doesn't match, return Unauthorized
        return res.status(401).json({message: "Unauthorized to update this"});
    }
    // If the note exists and the email matches, perform the update
    const options = {new: true};
    const result = await Note.findByIdAndUpdate(_id, updatedNote, options);
    noteCache.del(`recentNotes:${email}`);
    noteCache.del(`notes:${email}`);
    return res.status(200).json({message: `Note updated for ${email}`, result});
});

exports.deleteNotes = asyncErrorHandler(async (req, res, next) => {
    const _id = req.params._id;
    const email = req.user.email;
    // check if note with id and email exists
    const note = await Note.findOne({_id, email});
    if (!note) {
        return res.status(401).json({message: "Unauthorized to delete this"});
    }
    // if note exists and email matches delete it
    const deletedNote = await Note.findByIdAndDelete(_id);
    noteCache.del(`recentNotes:${email}`);
    noteCache.del(`notes:${email}`);
    return res
        .status(200)
        .json({message: `Note deleted for ${email}`, deletedNote});
});
