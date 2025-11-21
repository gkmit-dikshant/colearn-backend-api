const express = require("express");
const { projectController } = require("../controllers");
const authMiddleware = require("../middlewares/auth.middleware");
const rbacMiddleware = require("../middlewares/rbac.middleware");
const optionalAuthMiddleware = require("../middlewares/optionalAuth.middleware");
const { createProjectValidation, updateProjectValidation } = require("../validators/project.validation");
const router = express.Router();

router.post("/", authMiddleware, createProjectValidation, projectController.createProject);
router.patch(
  "/:projectId",
  authMiddleware,
  rbacMiddleware.getProjectRole,
  rbacMiddleware.protected("owner"),
  createProjectValidation,
  projectController.updateProject
);
router.get(
  "/:projectId/members",
  authMiddleware,
  rbacMiddleware.getProjectRole,
  rbacMiddleware.protected("owner", "member"),
  projectController.getProjectMembers
);
router.get("/me", authMiddleware, projectController.getAllUserProjects);
router.get("/", optionalAuthMiddleware, projectController.getAllProjects);
router.get("/:projectId", optionalAuthMiddleware, projectController.getProject);

module.exports = router;
