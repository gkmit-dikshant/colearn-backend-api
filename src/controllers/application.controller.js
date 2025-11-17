const ApplicationService = require("../services/application.service");

const applyToProject = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const projectId = req.params.projectId;
    const { message } = req.body;

    const application = await ApplicationService.applyToProject(userId, projectId, message);

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
    const applications = await ApplicationService.getProjectApplications(projectId);

    return res.json({ success: true, applications });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// 3️⃣ Approve or reject
const updateStatus = async (req, res, next) => {
  try {
    const applicationId = req.params.applicationId;
    const { status } = req.body; // "approved" or "rejected"

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const application = await ApplicationService.updateStatus(applicationId, status);

    return res.json({
      success: true,
      message: `Application ${status}`,
      application,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// 4️⃣ Get my own applications
const getMyApplications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const applications = await ApplicationService.getMyApplications(userId);

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
