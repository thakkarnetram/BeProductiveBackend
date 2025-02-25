const express = require("express");
const workSpaceController = require("../../../controllers/user-actions/workspace-actions/workSpaceController");
const authController = require("../../../controllers/user-auth/authController");
const workspaceLimit = require('../../../utils/rate-limiting/workSpaceRateLimiter')

const router = express.Router();

// WORK SPACES
router
    .route("/api/v1/workspaces")
    .get(workspaceLimit.workSpaceLimit,
        authController.protect, workSpaceController.getWorkSpaces);
router
    .route("/api/v1/workspace/latest")
    .get(workspaceLimit.workSpaceLimit, authController.protect, workSpaceController.getLatestSpace);
router
    .route("/api/v1/workspace/:_id")
    .get(workspaceLimit.workSpaceLimit, authController.protect, workSpaceController.getWorkSpaceById);
router
    .route("/api/v1/workspace/add")
    .post(workspaceLimit.addWorkspaceLimit, authController.protect, workSpaceController.createWorkSpace);

module.exports = router;
