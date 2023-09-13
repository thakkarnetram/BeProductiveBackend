const Note = require('../models/Notes');
const ToDo = require('../models/Todos');
const asyncErrorHandler = require('../utils/AsyncErrorHandler');

exports.getNotes = asyncErrorHandler(async (req, res, next) => {
  const userEmail = req.user.email;
  const notes = await Note.find({email: userEmail});
  if (!notes) {
    return res.status(404).json({message: 'no notes found'});
  } else {
    return res.status(200).json(notes);
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
  if (newNote) {
    newNote
      .save()
      .then(() => res.status(201).json({message: 'Note added!', newNote}));
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
    return res.status(401).json({message: 'Unauthorized to update this'});
  }
  // If the note exists and the email matches, perform the update
  const options = {new: true};
  const result = await Note.findByIdAndUpdate(_id, updatedNote, options);
  return res.status(200).json({message: `Note updated for ${email}`, result});
});

exports.deleteNotes = asyncErrorHandler(async (req, res, next) => {
  const _id = req.params._id;
  const email = req.user.email;
  // check if note with id and email exists
  const note = await Note.findOne({_id, email});
  if (!note) {
    return res
      .status(404)
      .json({message: 'No note found with this Id and Email'});
  }
  // if note exists and email matches delete it
  const deletedNote = await Note.findByIdAndDelete(_id);
  return res
    .status(200)
    .json({message: `Note deleted for ${email}`, deletedNote});
});

exports.getTodos = asyncErrorHandler(async (req, res, next) => {
  const userEmail = req.user.email;
  const todos = await ToDo.find({email: userEmail});
  if (!todos) {
    return res.status(404).json({message: 'No Todos Found'});
  } else {
    return res.status(200).json(todos);
  }
});

exports.addTodos = async (req, res, next) => {
  const {todoTitle, todoDescription, todoPriority, todoStatus} = req.body;
  const email = req.user.email;
  if (!(todoTitle)) {
    return res
      .status(403)
      .send({message: 'Title cant be empty'});
  }
  const newTodo = new ToDo({
    todoTitle,
    todoDescription,
    todoPriority,
    todoStatus,
    email,
  });
  newTodo
    .save()
    .then(() =>
      res.status(201).json({message: `Todo added for ${email}`, newTodo}),
    );
};

exports.updateTodos = asyncErrorHandler(async (req, res, next) => {
  const _id = req.params._id;
  const email = req.user.email;
  const updatedTodo = req.body;
  // Check if the note with the given _id and email exists
  const todo = await ToDo.findOne({_id, email});
  if (!todo) {
    // If the note does not exist or the email doesn't match, return Unauthorized
    return res.status(401).json({message: 'Unauthorized to update this'});
  }
  // If the note exists and the email matches, perform the update
  const options = {new: true};
  const result = await ToDo.findByIdAndUpdate(_id, updatedTodo, options);
  return res.status(200).json({message: `Todo updated for ${email}`, result});
});

exports.deleteTodos = asyncErrorHandler(async (req, res, next) => {
  const _id = req.params._id;
  const email = req.user.email;
  // check if note with id and email exists
  const todo = await ToDo.findOne({_id, email});
  if (!todo) {
    return res
      .status(404)
      .json({message: 'No todo found with this Id and Email'});
  }
  // if note exists and email matches delete it
  const deletedTodo = await ToDo.findByIdAndDelete(_id);
  return res
    .status(200)
    .json({message: `Todo deleted for ${email}`, deletedTodo});
});
