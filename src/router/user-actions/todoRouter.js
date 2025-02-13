const express = require("express");
const todoController = require("../../controllers/user-actions/todoController");
const authController = require("../../controllers/user-auth/authController");

const router = express.Router();

// TODOS
router
    .route("/api/v1/todos")
    .get(authController.protect, todoController.getTodos);
router
    .route("/api/v1/todos/recents")
    .get(authController.protect, todoController.getRecentTodos);
router
    .route("/api/v1/todos/add")
    .post(authController.protect, todoController.addTodos);
router
    .route("/api/v1/todos/update/:_id")
    .put(authController.protect, todoController.updateTodos);
router
    .route("/api/v1/todos/delete/:_id")
    .delete(authController.protect, todoController.deleteTodos);

module.exports =router;
