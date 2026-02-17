const ToDo = require("../../../models/Todos");
const asyncErrorHandler = require("../../../utils/error-handlers/AsyncErrorHandler");
const NodeCache = require("node-cache");
const todoCache = new NodeCache({
    stdTTL: 3600,
    checkperiod: 1600
});


//  TODOS SECTION
exports.getTodos = asyncErrorHandler(async (req, res, next) => {
    const userEmail = req.user.email;
    try {
        let todos;
        todos = await ToDo.find({email: userEmail});
        if (!todos) {
            return res.status(404).json({message: "No Todos Found"});
        }
        if (todoCache.has(`todos:${userEmail}`)) {
            todos = JSON.parse(todoCache.get(`todos:${userEmail}`));
        } else {
            todoCache.set(`todos:${userEmail}`, JSON.stringify(todos));
        }
        return res.status(200).json(todos);
    } catch (err) {
        console.error('Error in getTodos', err);
        return res.status(500).json({message: err})
    }
});

exports.getRecentTodos = asyncErrorHandler(async (req, res, next) => {
    const userEmail = req.user.email;
    try {
        let todos;
        todos = await ToDo.find({email: userEmail})
            .sort({createdAt: -1})
            .limit(2);
        if (!todos) {
            return res.status(404).json({message: "No Todos Found"});
        }
        if (todoCache.has(`recentTodos:${userEmail}`)) {
            todos = JSON.parse(todoCache.get(`recentTodos:${userEmail}`));
        } else {
            todoCache.set(`recentTodos:${userEmail}`, JSON.stringify(todos));
        }
        return res.status(200).json(todos);
    } catch (err) {
        console.error('Error in server', err);
        return res.status(500).json({message: err})
    }
});

exports.addTodos = async (req, res, next) => {
    const {todoTitle, todoDescription, todoPriority, todoStatus} = req.body;
    const email = req.user.email;
    const userId = req.user._id;
    if (!todoTitle) {
        return res.status(403).send({message: "Title cant be empty"});
    }
    const newTodo = new ToDo({
        todoTitle,
        todoDescription,
        todoPriority,
        todoStatus,
        email,
        userId
    });
    todoCache.del(`todos:${email}`);
    todoCache.del(`recentTodos:${email}`);
    newTodo
        .save()
        .then(() =>
            res.status(201).json({message: `Todo added for ${email}`, newTodo})
        );
};

exports.updateTodos = asyncErrorHandler(async (req, res, next) => {
    const _id = req.params._id;
    const email = req.user.email;
    // Check if the note with the given _id and email exists
    const todo = await ToDo.findOne({_id, email});
    if (!todo) {
        // If the note does not exist or the email doesn't match, return Unauthorized
        return res.status(401).json({message: "Unauthorized to update this"});
    }
    if(req.body.todoTitle !== undefined) {
        todo.todoTitle = req.body.todoTitle;
    }
    if(req.body.todoDescription !== undefined) {
        todo.todoDescription = req.body.todoDescription;
    }
    if(req.body.todoPriority !== undefined) {
        todo.todoPriority = req.body.todoPriority;
    }
    if(req.body.todoStatus !== undefined) {
        todo.todoStatus = req.body.todoStatus;
    }
    if(req.body.remindAt !== undefined) {
        todo.remindAt = req.body.remindAt;
    }
    if(req.body.repeatFrequency !== undefined) {
        todo.repeatFrequency = req.body.repeatFrequency;
    }
    if(req.body.timezone !== undefined) {
        todo.timezone = req.body.timezone;
    }
    await todo.save();
    todoCache.del(`todos:${email}`);
    todoCache.del(`recentTodos:${email}`);
    return res.status(200).json({message: `Todo updated for ${email}`, todo});
});

exports.deleteTodos = asyncErrorHandler(async (req, res, next) => {
    const _id = req.params._id;
    const email = req.user.email;
    // check if note with id and email exists
    const todo = await ToDo.findOne({_id, email});
    if (!todo) {
        return res
            .status(404)
            .json({message: "No todo found with this Id and Email"});
    }
    // if note exists and email matches delete it
    const deletedTodo = await ToDo.findByIdAndDelete(_id);
    todoCache.del(`todos:${email}`);
    todoCache.del(`recentTodos:${email}`);
    return res
        .status(200)
        .json({message: `Todo deleted for ${email}`, deletedTodo});
});
