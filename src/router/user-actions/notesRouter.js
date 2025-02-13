const express = require("express");
const noteController = require("../../controllers/user-actions/noteController");
const authController = require("../../controllers/user-auth/authController");

const router = express.Router();

// NOTES
router
    .route("/api/v1/notes")
    .get(authController.protect, noteController.getNotes);
router
    .route("/api/v1/notes/recents")
    .get(authController.protect, noteController.getRecentNotes);
router
    .route("/api/v1/notes/add")
    .post(authController.protect, noteController.addNotes);
router
    .route("/api/v1/notes/update/:_id")
    .put(authController.protect, noteController.updateNotes);
router
    .route("/api/v1/notes/delete/:_id")
    .delete(authController.protect, noteController.deleteNotes);

module.exports = router;
