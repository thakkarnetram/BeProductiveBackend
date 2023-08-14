const express = require('express');
const actionController = require('../controllers/actionController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/getNotes')
  .get(authController.protect, actionController.getNotes);

router
  .route('/addNotes')
  .post(authController.protect, actionController.addNotes);

router
  .route('/updateNotes/:_id')
  .put(authController.protect, actionController.updateNotes);

router
  .route('/deleteNotes/:_id')
  .delete(authController.protect, actionController.deleteNotes);

router
  .route('/getTodos')
  .get(authController.protect, actionController.getTodos);

router
  .route('/addTodos')
  .post(authController.protect, actionController.addTodos);

router
  .route('/updateTodos/:_id')
  .put(authController.protect, actionController.updateTodos);

router
  .route('/deleteTodos/:_id')
  .delete(authController.protect, actionController.deleteTodos);

module.exports = router;
