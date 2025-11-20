const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const { getProjectRole, protected } = require("../middlewares/rbac.middleware");
const { applicationController } = require("../controllers");

const router = express.Router();

router.use(authMiddleware);
router.post("/projects/:projectId", getProjectRole, protected("viewer"), applicationController.applyToProject);
router.get("/projects/:projectId", getProjectRole, protected("owner"), applicationController.getProjectApplications);
router.post(
  "/projects/:projectId/status/:applicationId",
  getProjectRole,
  protected("owner"),
  applicationController.updateStatus
);

router.get("/me", applicationController.getMyApplications);

module.exports = router;
