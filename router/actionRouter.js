const express = require('express');
const actionController = require('../controllers/actionController');
const authController = require('../controllers/authController');

const router = express.Router();

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



module.exports = router;
