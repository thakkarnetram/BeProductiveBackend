const express = require("express");
const todoController = require("../../../controllers/user-actions/productivespace-actions/todoController");
const authController = require("../../../controllers/user-auth/authController");
const todoLimiter = require('../../../utils/rate-limiting/productiveSpaceRateLimiter')
const router = express.Router();

// TODOS
router
    .route("/api/v1/todos")
    .get(todoLimiter.getTodoLimit, authController.protect, todoController.getTodos);
router
    .route("/api/v1/todos/recents")
    .get(authController.protect, todoController.getRecentTodos);
router
    .route("/api/v1/todos/add")
    .post(todoLimiter.addTodoLimit, authController.protect, todoController.addTodos);
router
    .route("/api/v1/todos/update/:_id")
    .put(todoLimiter.updateTodoLimit, authController.protect, todoController.updateTodos);
router
    .route("/api/v1/todos/delete/:_id")
    .delete(todoLimiter.deleteTodoLimit, authController.protect, todoController.deleteTodos);

module.exports = router;
