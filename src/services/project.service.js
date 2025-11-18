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

    const project = await Project.create(
      {
        title,
        description,
        location_id,
        status: status || "active",
      },
      { transaction }
    );

    if (Array.isArray(skill_ids) && skill_ids.length > 0) {
      const skills = skill_ids.map((skill_id) => ({
        project_id: project.id,
        skill_id,
      }));

      await ProjectSkill.bulkCreate(skills, { transaction });
    }

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

    if (!ownerRole) throw new Error("Owner role not seeded");

    await ProjectUserRole.create(
      {
        project_user_id: projectUser.id,
        role_id: ownerRole.id,
      },
      { transaction }
    );

    await transaction.commit();

    const newProject = await Project.findByPk(project.id, {
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

    return newProject;
  } catch (error) {
    if (!transaction.finished) await transaction.rollback();
    throw error;
  }
};

const getAllUserProjects = async (userId) => {
  userId = Number(userId);
  if (!userId) throw new Error("userId is required");

  const rows = await ProjectUser.findAll({
    where: { user_id: userId },
    attributes: [], // don’t need project_user fields
    include: [
      {
        model: Project,
        as: "project",
        attributes: ["id", "title", "description", "status"],
        include: [
          {
            model: Location,
            as: "location",
            attributes: ["descriptions"],
          },
          {
            model: Skill,
            through: { model: ProjectSkill },
            as: "skills",
            attributes: ["name"],
          },
        ],
      },
    ],
  });

  const projects = rows.map((row) => {
    const p = row.project;
    return {
      id: p.id,
      title: p.title,
      description: p.description,
      status: p.status,
      location: p.location?.descriptions || null,
      skills: p.skills?.map((s) => s.name) || [],
    };
  });

  return projects;
};

const getAllProjects = async () => {
  const projects = await Project.findAll({
    attributes: ["id", "title", "description"],
    include: [
      {
        model: Location,
        as: "location",
        attributes: ["descriptions"],
      },
      {
        model: Skill,
        as: "skills",
        attributes: ["id", "name"],
        through: { attributes: [] },
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
  getAllProjects,
  getProjectById,
};
