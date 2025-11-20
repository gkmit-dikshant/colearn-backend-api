const { applicationService, projectService, authService } = require("../services");
const emailHelper = require("../utils/email.helper");

const applyToProject = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const projectId = req.params.projectId;
    const { message } = req.body;
    const application = await applicationService.applyToProject(userId, projectId, message);
    const projectOwner = await projectService.getProjectOwner(projectId);
    const project = await projectService.getProjectById(projectId);
    const applicant = await authService.getUserDetails(userId);

    emailHelper.send(projectOwner.email, "New Application", "projectApplicationEmail", {
      projectOwner,
      project,
      applicant,
      message,
    });

    return res.status(201).json({
      success: true,
      application,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const getProjectApplications = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    const applications = await applicationService.getProjectApplications(projectId);

    return res.json({ success: true, applications });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const applicationId = req.params.applicationId;
    const { status } = req.body; // "accepted" or "rejected"

    if (!["accepted", "rejected"].includes(status)) {
      throw { statusCode: 400, message: "Invalid status value" };
    }

    const application = await applicationService.updateStatus(applicationId, status);
    const project = await projectService.getProjectById(application.project_id);
    const user = await authService.getUserDetails(application.user_id);

    emailHelper.send(user.email, "Application Accepted! ", "applicationStatusUpdateEmail", {
      user: user,
      project: project,
    });

    return res.json({
      success: true,
      message: `Application ${status}`,
      project,
      user,
      // application,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const getMyApplications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const applications = await applicationService.getMyApplications(userId);

    return res.json({ success: true, applications });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  applyToProject,
  getMyApplications,
  getProjectApplications,
  updateStatus,
};
