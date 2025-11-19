const express = require("express");
const { projectController } = require("../controllers");
const authMiddleware = require("../middlewares/auth.middleware");
const rbacMiddleware = require("../middlewares/rbac.middleware");
const optionalAuthMiddleware = require("../middlewares/optionalAuth.middleware");
const router = express.Router();

router.post("/", authMiddleware, projectController.createProject);
router.patch(
  "/:projectId",
  authMiddleware,
  rbacMiddleware.getProjectRole,
  rbacMiddleware.protected("owner"),
  projectController.updateProject
);
router.get("/me", authMiddleware, projectController.getAllUserProjects);
router.get("/", optionalAuthMiddleware, projectController.getAllProjects);
router.get("/:projectId", optionalAuthMiddleware, projectController.getProject);

module.exports = router;
