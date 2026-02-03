const mongoose = require('mongoose');
const shortid = require('shortid');
// Define the Note schema
const noteSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: shortid.generate,
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  email: {
    type: String,
    required: true,
  },
},{timestamps:true});

// Create the Note model
const Note = mongoose.model('userNotes', noteSchema);

module.exports = Note;
