const { Application, ProjectUser, ProjectUserRole, Project, Role, User } = require("../models");

const applyToProject = async (userId, projectId, message) => {
  const existing = await Application.findOne({
    where: { user_id: userId, project_id: projectId },
  });

  if (existing) {
    throw new Error("You have already applied to this project");
  }

  const application = await Application.create({
    user_id: userId,
    project_id: projectId,
    message,
    status: "pending",
  });

  return application;
};

const getProjectApplications = async (projectId) => {
  return await Application.findAll({
    where: { project_id: projectId },
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "name", "email"],
      },
    ],
  });
};

const updateStatus = async (applicationId, status) => {
  const application = await Application.findByPk(applicationId);

  if (!application) {
    throw new Error("Application not found");
  }

  application.status = status;
  await application.save();

  if (status === "accepted") {
    let projectUser = await ProjectUser.findOne({
      where: {
        user_id: application.user_id,
        project_id: application.project_id,
      },
    });

    if (!projectUser) {
      projectUser = await ProjectUser.create({
        user_id: application.user_id,
        project_id: application.project_id,
      });
    }

    const memberRole = await Role.findOne({
      where: { name: "member" },
    });

    const existingRole = await ProjectUserRole.findOne({
      where: {
        project_user_id: projectUser.id,
        role_id: memberRole.id,
      },
    });

    if (!existingRole) {
      await ProjectUserRole.create({
        project_user_id: projectUser.id,
        role_id: memberRole.id,
      });
    }
  }

  return application;
};

const getMyApplications = async (userId) => {
  return await Application.findAll({
    where: { user_id: userId },
    include: [
      {
        model: Project,
        as: "project",
        attributes: ["id", "title", "status"],
      },
    ],
    order: [["created_at", "DESC"]],
  });
};

module.exports = {
  applyToProject,
  getProjectApplications,
  updateStatus,
  getMyApplications,
};
