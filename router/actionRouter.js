const express = require('express');
const actionController = require('../controllers/actionController');
const authController = require('../controllers/authController');

const router = express.Router();

// NOTES
router
    .route('/api/v1/notes')
    .get(authController.protect, actionController.getNotes);
router
    .route('/api/v1/notes/add')
    .post(authController.protect, actionController.addNotes);
router
    .route('/api/v1/notes/update/:_id')
    .put(authController.protect, actionController.updateNotes);
router
    .route('/api/v1/notes/delete/:_id')
    .delete(authController.protect, actionController.deleteNotes);

// TODOS
router
    .route('/api/v1/todos')
    .get(authController.protect, actionController.getTodos);
router
    .route('/api/v1/todos/add')
    .post(authController.protect, actionController.addTodos);
router
    .route('/api/v1/todos/update/:_id')
    .put(authController.protect, actionController.updateTodos);
router
    .route('/api/v1/todos/delete/:_id')
    .delete(authController.protect, actionController.deleteTodos);

// WORK SPACES
router
    .route("/api/v1/workspaces")
    .get(authController.protect, actionController.getWorkSpaces)
router
    .route("/api/v1/workspace/latest")
    .get(authController.protect,actionController.getLatestSpace)
router
    .route('/api/v1/workspace/add')
    .post(authController.protect, actionController.createWorkSpace)


// CHANNELS
router
    .route("/api/v1/channels")
    .get(authController.protect, actionController.getChannels)
router
    .route("/api/v1/channel")
    .get(authController.protect,actionController.getChannelById)
router
    .route("/api/v1/channel/latest")
    .get(authController.protect,actionController.getLatestChannel)
router
    .route("/api/v1/channel/add/:_id")
    .post(authController.protect, actionController.createChannel)

module.exports = router;
