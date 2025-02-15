const ToDo = require("../../../models/Todos");
const redis = require('../../../utils/caching-handler/redisClient');
const asyncErrorHandler = require("../../../utils/error-handlers/AsyncErrorHandler");

//  TODOS SECTION
exports.getTodos = asyncErrorHandler(async (req, res, next) => {
    const userEmail = req.user.email;
    const cacheKey = `todos:${userEmail}`;
    try {
        if (!redis.isReady) {
            console.warn('Redis client is not open');
        } else {
            const cachedNotes = await redis.get(cacheKey);
            if (cachedNotes) {
                return res.status(200).json(JSON.parse(cachedNotes));
            }
        }
        const todos = await ToDo.find({email: userEmail});
        if (!todos) {
            return res.status(404).json({message: "No Todos Found"});
        }
        await redis.setEx(cacheKey, 3600, JSON.stringify(todos))
        return res.status(200).json(todos);
    } catch (err) {
        console.error('Error in getTodos', err);
        return res.status(500).json({message: err})
    }
});

exports.getRecentTodos = asyncErrorHandler(async (req, res, next) => {
    const userEmail = req.user.email;
    const cacheKey = `recentTodos:${userEmail}`;
    try {
        if (!redis.isReady) {
            console.warn('Redis client is not ready');
        } else {
            const cachedTodos = await redis.get(cacheKey);
            if (cachedTodos) {
                return res.status(200).json(JSON.parse(cachedTodos));
            }
        }
        const todos = await ToDo.find({email: userEmail})
            .sort({createdAt: -1})
            .limit(2);
        if (!todos) {
            return res.status(404).json({message: "No Todos Found"});
        }
        await redis.setEx(cacheKey,3600,JSON.stringify(todos));
        return res.status(200).json(todos);
    } catch (err) {
        console.error('Error in server', err);
        return res.status(500).json({message: err})
    }
});

exports.addTodos = async (req, res, next) => {
    const {todoTitle, todoDescription, todoPriority, todoStatus} = req.body;
    const email = req.user.email;
    if (!todoTitle) {
        return res.status(403).send({message: "Title cant be empty"});
    }
    const newTodo = new ToDo({
        todoTitle,
        todoDescription,
        todoPriority,
        todoStatus,
        email,
    });
    await redis.del(`todos:${email}`);
    newTodo
        .save()
        .then(() =>
            res.status(201).json({message: `Todo added for ${email}`, newTodo})
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
        return res.status(401).json({message: "Unauthorized to update this"});
    }
    // If the note exists and the email matches, perform the update
    const options = {new: true};
    const result = await ToDo.findByIdAndUpdate(_id, updatedTodo, options);
    await redis.del(`todos:${email}`);
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
            .json({message: "No todo found with this Id and Email"});
    }
    // if note exists and email matches delete it
    const deletedTodo = await ToDo.findByIdAndDelete(_id);
    await redis.del(`todos:${email}`);
    return res
        .status(200)
        .json({message: `Todo deleted for ${email}`, deletedTodo});
});
