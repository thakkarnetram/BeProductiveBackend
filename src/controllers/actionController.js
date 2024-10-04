// Imports
const User = require("../models/User");
const Note = require("../models/Notes");
const ToDo = require("../models/Todos");
const Workspace = require("../models/Workspace");
const Channel = require("../models/Channel");
const Message = require("../models/Message");
const asyncErrorHandler = require("../utils/AsyncErrorHandler");
const { use } = require("bcrypt/promises");
const Feedback = require("../models/feedback");
const { io } = require("../utils/socket");

//  NOTES SECTION
exports.getNotes = asyncErrorHandler(async (req, res, next) => {
  const userEmail = req.user.email;
  const notes = await Note.find({ email: userEmail });
  if (!notes) {
    return res.status(404).json({ message: "no notes found" });
  } else {
    return res.status(200).json(notes);
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
  return res
    .status(200)
    .json({ message: `Note deleted for ${email}`, deletedNote });
});

//  TODOS SECTION

exports.getTodos = asyncErrorHandler(async (req, res, next) => {
  const userEmail = req.user.email;
  const todos = await ToDo.find({ email: userEmail });
  if (!todos) {
    return res.status(404).json({ message: "No Todos Found" });
  } else {
    return res.status(200).json(todos);
  }
});

exports.getRecentTodos = asyncErrorHandler(async (req, res, next) => {
  const userEmail = req.user.email;
  const todos = await ToDo.find({ email: userEmail })
    .sort({ createdAt: -1 })
    .limit(2);
  if (!todos) {
    return res.status(404).json({ message: "No Todos Found" });
  } else {
    return res.status(200).json(todos);
  }
});

exports.addTodos = async (req, res, next) => {
  const { todoTitle, todoDescription, todoPriority, todoStatus } = req.body;
  const email = req.user.email;
  if (!todoTitle) {
    return res.status(403).send({ message: "Title cant be empty" });
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
      res.status(201).json({ message: `Todo added for ${email}`, newTodo })
    );
};

exports.updateTodos = asyncErrorHandler(async (req, res, next) => {
  const _id = req.params._id;
  const email = req.user.email;
  const updatedTodo = req.body;
  // Check if the note with the given _id and email exists
  const todo = await ToDo.findOne({ _id, email });
  if (!todo) {
    // If the note does not exist or the email doesn't match, return Unauthorized
    return res.status(401).json({ message: "Unauthorized to update this" });
  }
  // If the note exists and the email matches, perform the update
  const options = { new: true };
  const result = await ToDo.findByIdAndUpdate(_id, updatedTodo, options);
  return res.status(200).json({ message: `Todo updated for ${email}`, result });
});

exports.deleteTodos = asyncErrorHandler(async (req, res, next) => {
  const _id = req.params._id;
  const email = req.user.email;
  // check if note with id and email exists
  const todo = await ToDo.findOne({ _id, email });
  if (!todo) {
    return res
      .status(404)
      .json({ message: "No todo found with this Id and Email" });
  }
  // if note exists and email matches delete it
  const deletedTodo = await ToDo.findByIdAndDelete(_id);
  return res
    .status(200)
    .json({ message: `Todo deleted for ${email}`, deletedTodo });
});

// WORKSPACE SECTION

exports.getWorkSpaces = asyncErrorHandler(async (req, res, next) => {
  const userId = req.user._id;
  // find all workspaces
  try {
    const workspaces = await Workspace.find({
      $or: [
        // space where the user is the admin or user is a member
        { admin: userId },
        { members: userId },
      ],
    });
    if (workspaces.length === 0) {
      return res
        .status(404)
        .json({ message: "No WorkSpaces found ! Create One " });
    }
    if (workspaces) {
      return res.status(200).json(workspaces);
    }
  } catch (e) {
    console.log(e);
    return res.status(501).json({ message: "Internal server error" });
  }
});

exports.getWorkSpaceById = asyncErrorHandler(async (req, res, next) => {
  const userId = req.user._id;
  const spaceId = req.params._id;
  if (!userId) {
    return res.status(400).json({ message: "User ID not found" });
  }
  try {
    const findSpace = await Workspace.findById({ _id: spaceId });
    if (!findSpace) {
      return res.status(404).json({ message: "Workspace not Found" });
    }
    if (findSpace.admin !== userId && !findSpace.members.includes(userId)) {
      return res.status(403).json({ message: "Permission denied " });
    }

    return res.status(200).json(findSpace);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

exports.getLatestSpace = asyncErrorHandler(async (req, res, next) => {
  const userId = req.user._id;
  // Find the latest workspace for the specific user
  try {
    const latestWorkspace = await Workspace.find({ admin: userId })
      .sort({ createdAt: -1 }) // Sort by creation date in descending order to get the latest
      .limit(2); // Limit the result to one workspace (the latest)

    if (!latestWorkspace) {
      return res
        .status(404)
        .json({ message: "No WorkSpace found for this user. Create one." });
    }

    return res.status(200).json(latestWorkspace);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal server error" });
  }
});

exports.createWorkSpace = asyncErrorHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { workspace, projectName } = req.body;

  if (!workspace && !projectName) {
    return res
      .status(400)
      .json({ message: "Workspace & Projectname name cannot be empty" });
  }

  try {
    const existingWorkspace = await Workspace.findOne({
      workspace,
      admin: userId,
    });
    if (existingWorkspace) {
      return res.status(400).json({ message: "Workspace name already exists" });
    }

    // Create a new workspace
    const newWorkspace = new Workspace({
      workspace,
      projectName,
      admin: userId,
      members: [userId],
    });

    // Save the new workspace
    const savedWorkspace = await newWorkspace.save();
    // TODO Before creating channel for the specific space need to make sure we dont save "" , instead create a general channel
    // Create a default channel using the projectName
    const newChannel = new Channel({
      channelName: projectName,
      workspace: {
        _id: savedWorkspace._id,
        workspaceName: savedWorkspace.workspace,
      },
      admin: userId,
    });

    // Save the new channel
    await newChannel.save();

    // Add the channel ID and channelName to the workspace's channels array
    savedWorkspace.channels.push({
      _id: newChannel._id,
      channelName: newChannel.channelName,
    });
    await savedWorkspace.save();

    return res.status(201).json(savedWorkspace);
  } catch (e) {
    console.error(e);
    return res.status(501).json({ message: "Internal server error" });
  }
});

// TODO UPDATE WORKSPACE NAME & DELETE A WORKSPACE

// CHANNEL SECTION
exports.getChannels = asyncErrorHandler(async (req, res, next) => {
  const userId = req.user._id;
  if (!userId) {
    return res.status(400).json({ message: "User ID not found" });
  }
  try {
    const channels = await Channel.find({
      $or: [
        { admin: userId }, // Channels where the user is the admin
        { members: userId }, // Channels where the user is a member
      ],
    });
    if (!channels || channels.length === 0) {
      return res
        .status(404)
        .json({ message: "No channels found! Create one." });
    }
    return res.status(200).json(channels);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

exports.getChannelById = asyncErrorHandler(async (req, res, next) => {
  const userId = req.user._id;
  const channelId = req.params._id;

  if (!userId) {
    return res.status(400).json({ message: "User ID not found" });
  }

  try {
    const findChannel = await Channel.findById(channelId);
    if (!findChannel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    // Check if the user is either the admin or a member of the channel
    if (
      findChannel.admin.toString() !== userId &&
      !findChannel.members.includes(userId)
    ) {
      return res.status(403).json({ message: "Permission denied" });
    }

    return res.status(200).json(findChannel);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

exports.getLatestChannel = asyncErrorHandler(async (req, res, next) => {
  const userId = req.user._id;
  // Find the latest workspace for the specific user
  try {
    const latestChannel = await Channel.find({ admin: userId })
      .sort({ createdAt: -1 }) // Sort by creation date in descending order to get the latest
      .limit(2); // Limit the result to one workspace (the latest)

    if (!latestChannel) {
      return res.status(404).json({ message: "No Channel found" });
    }

    return res.status(200).json(latestChannel);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal server error" });
  }
});

exports.createChannel = asyncErrorHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { channelName } = req.body;

  if (!channelName) {
    return res.status(400).json({ message: "Channel name is required" });
  }
  try {
    const workspace = await Workspace.findById({ _id: req.params._id });
    if (!workspace) {
      return res.status(404).json({ message: "No workspace found with Id" });
    }
    if (findSpace.admin !== userId && !findSpace.members.includes(userId)) {
      return res.status(403).json({ message: "Permission denied " });
    }

    // Create a new channel based on the request body
    const newChannel = new Channel({
      channelName,
      workspace: { _id: workspace._id, workspaceName: workspace.workspace },
      admin: userId,
    });
    await newChannel.save();
    workspace.channels.push({
      _id: newChannel._id,
      channelName: newChannel.channelName,
    });
    await workspace.save();
    return res.status(201).json({ message: "Channel Created", newChannel });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});



// FEEDBACK SECTION
exports.addFeedback = asyncErrorHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { feedbackMessage } = req.body;

  if (!feedbackMessage) {
    return res.status(403).json({ message: "Feedback message cant be empty" });
  }

  const feedback = new Feedback({
    feedback: feedbackMessage,
    userId,
  });

  feedback
    .save()
    .then(() => res.status(201).json({ message: `Feedback added`, feedback }));
});

