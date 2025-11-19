const express = require("express");
const auth = require("../middlewares/auth.middleware");
const { getProjectRole, protected } = require("../middlewares/rbac.middleware");
const applicationController = require("../controllers/application.controller");

const router = express.Router();

router.use(auth);

router.post(
  "/projects/:projectId",
  getProjectRole,
  protected("viewer", "member", "owner"),
  applicationController.applyToProject
);

router.get("/projects/:projectId", getProjectRole, protected("owner"), applicationController.getProjectApplications);

router.post("/status/:applicationId", getProjectRole, protected("owner"), applicationController.updateStatus);

router.get("/me", applicationController.getMyApplications);

module.exports = router;
