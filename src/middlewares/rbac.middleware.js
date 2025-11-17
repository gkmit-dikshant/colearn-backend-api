const { Role, ProjectUser, ProjectUserRole, Project } = require("../models");

const protected = (...roles) => {
  return (req, res, next) => {
    if (roles.includes(req.user.role)) {
      return next();
    }
    return res.status(403).json({
      success: false,
      message: "You're not allowed to access this service",
    });
  };
};

const getProjectRole = () => {
  return async (req, res, next) => {
    try {
      const userId = parseInt(req.user.id);
      const projectId = parseInt(req.params.projectId);
      const project = await Project.findOne({
        where: { id: projectId },
      });

      if (!project) {
        return res.status(404).json({
          success: false,
          message: "Project not found",
        });
      }

      const projectUser = await ProjectUser.findOne({
        where: { user_id: userId, project_id: projectId },
      });

      if (!projectUser) {
        req.user.role = "viewer";
        return next();
      }

      const projectUserRole = await ProjectUserRole.findOne({
        where: { project_user_id: projectUser.id },
        include: [{ model: Role, as: "role" }],
      });

      req.user.role = projectUserRole?.role?.name || "viewer";

      return next();
    } catch (error) {
      console.error("getProjectRole error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch project role.",
      });
    }
  };
};
module.exports = { getProjectRole, protected };
