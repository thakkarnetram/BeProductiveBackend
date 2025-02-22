const express = require("express");
const noteController = require("../../../controllers/user-actions/productivespace-actions/noteController");
const authController = require("../../../controllers/user-auth/authController");
const noteLimiter = require('../../../utils/rate-limiting/productiveSpaceRateLimiter')

const router = express.Router();

// NOTES
router
    .route("/api/v1/notes")
    .get(noteLimiter.getNotesLimit, authController.protect, noteController.getNotes);
router
    .route("/api/v1/notes/recents")
    .get(noteLimiter.getRecentNoteLimit, authController.protect, noteController.getRecentNotes);
router
    .route("/api/v1/notes/add")
    .post(noteLimiter.addNoteLimit, authController.protect, noteController.addNotes);
router
    .route("/api/v1/notes/update/:_id")
    .put(noteLimiter.updateNoteLimit, authController.protect, noteController.updateNotes);
router
    .route("/api/v1/notes/delete/:_id")
    .delete(noteLimiter.deleteNoteLimit, authController.protect, noteController.deleteNotes);

module.exports = router;
