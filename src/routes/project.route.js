const express = require("express");
const { projectController } = require("../controllers");
const authMiddleware = require("../middlewares/auth.middleware");
const rbacMiddleware = require("../middlewares/rbac.middleware");
const router = express.Router();

router.use(authMiddleware);
router.post("/", authMiddleware, projectController.createProject);
router.get("/me", projectController.getAllUserProjects);
router.get("/", projectController.getAllProjects);
router.get(
  "/:projectId",
  rbacMiddleware.getProjectRole,
  rbacMiddleware.protected("member", "owner"),
  projectController.getProject
);
module.exports = router;
