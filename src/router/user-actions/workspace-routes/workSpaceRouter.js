const express = require("express");
const workSpaceController = require("../../../controllers/user-actions/workspace-actions/workSpaceController");
const authController = require("../../../controllers/user-auth/authController");

const router = express.Router();

// WORK SPACES
router
    .route("/api/v1/workspaces")
    .get(authController.protect, workSpaceController.getWorkSpaces);
router
    .route("/api/v1/workspace/latest")
    .get(authController.protect, workSpaceController.getLatestSpace);
router
    .route("/api/v1/workspace/:_id")
    .get(authController.protect, workSpaceController.getWorkSpaceById);
router
    .route("/api/v1/workspace/add")
    .post(authController.protect, workSpaceController.createWorkSpace);

module.exports = router;
