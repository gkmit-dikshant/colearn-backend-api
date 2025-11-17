const {
  Project,
  Location,
  Skill,
  ProjectSkill,
  ProjectUser,
  Role,
  ProjectUserRole,
  User,
  sequelize,
} = require("../models");

const createProject = async (projectData) => {
  const transaction = await sequelize.transaction();
  try {
    const { owner_id, title, description, location_id, status, skill_ids } = projectData;

    // 1. create
    const project = await Project.create(
      {
        title,
        description,
        location_id,
        status: status || "active",
      },
      { transaction }
    );

    // 2. create project skills
    if (Array.isArray(skill_ids) && skill_ids.length > 0) {
      const projectSkills = skill_ids.map((skill_id) => ({
        project_id: project.id,
        skill_id,
      }));

      await ProjectSkill.bulkCreate(projectSkills, { transaction });
    }

    // 3. add project owner
    const projectUser = await ProjectUser.create(
      {
        user_id: owner_id,
        project_id: project.id,
      },
      { transaction }
    );

    const ownerRole = await Role.findOne({
      where: { name: "owner" },
      transaction,
    });

    if (!ownerRole) {
      throw new Error("Owner role not found. Seed roles first.");
    }

    // 4. create project user role
    await ProjectUserRole.create(
      {
        project_user_id: projectUser.id,
        role_id: ownerRole.id,
      },
      { transaction }
    );

    await transaction.commit();

    return await Project.findByPk(project.id, {
      include: [
        {
          model: Location,
          as: "location",
          attributes: ["id", "descriptions"],
        },
        {
          model: Skill,
          as: "skills",
          attributes: ["id", "name"],
          through: { attributes: [] },
        },
        {
          model: ProjectUser,
          as: "project_users",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "name", "email"],
            },
            {
              model: ProjectUserRole,
              as: "project_user_roles",
              include: [
                {
                  model: Role,
                  as: "role",
                  attributes: ["id", "name"],
                },
              ],
            },
          ],
        },
      ],
    });
  } catch (error) {
    if (!transaction.finished) await transaction.rollback();
    throw error;
  }
};

const getAllUserProjects = async (userId) => {
  if (!userId) {
    throw new Error("userId is not defined in getAllUserProject");
  }
  const projects = await ProjectUser.findAll({
    where: { user_id: parseInt(userId) },
    include: [
      {
        model: Project,
        as: "project",
        attributes: ["id", "title", "description", "location_id", "status"],
      },
      {
        model: ProjectUserRole,
        as: "project_user_roles",
        include: {
          model: Role,
          as: "role",
          attributes: ["id", "name"],
        },
      },
    ],
  });
  return projects;
};

const getProjectById = async (projectId) => {
  const project = await Project.findByPk(projectId, {
    include: [
      {
        model: Location,
        as: "location",
        attributes: ["id", "descriptions"],
      },
      {
        model: Skill,
        as: "skills",
        attributes: ["id", "name"],
        through: { attributes: [] },
      },
    ],
  });

  if (!project) {
    const error = new Error("Project not found");
    error.statusCode = 404;
    throw error;
  }

  return project;
};

module.exports = {
  createProject,
  getAllUserProjects,
  getProjectById,
};
