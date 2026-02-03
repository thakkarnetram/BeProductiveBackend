const mongoose = require('mongoose');
const shortid = require('shortid');
// schema
const todoSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: shortid.generate,
  },
  todoTitle: {
    type: String,
    required: true,
  },
  todoDescription: {
    type: String,
  },
  todoPriority: {
    type: String,
  },
  todoStatus: {
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
  // __v 32 is
  // Object-Document Mapper
  // to keep a track of doc when its updated and saved
},{timestamps:true});

// Creating model
const ToDo = mongoose.model('userToDos', todoSchema);

module.exports = ToDo;
