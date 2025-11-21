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
    const { owner_id, title, description, location_id, status, skills } = projectData;

    const project = await Project.create(
      {
        title,
        description,
        location_id,
        status: status || "active",
      },
      { transaction }
    );

    if (Array.isArray(skills) && skills.length > 0) {
      const p_skills = skills.map((skill_id) => ({
        project_id: project.id,
        skill_id,
      }));

      await ProjectSkill.bulkCreate(p_skills, { transaction });
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

    if (!ownerRole) throw { statusCode: 500, message: "owner role not found" };

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

const getAllUserProjects = async (userId, role = "owner") => {
  userId = Number(userId);
  if (!userId) throw { statusCode: 400, message: "userId is required" };

  let roleRecord = await Role.findOne({ where: { name: role } });
  if (!roleRecord) {
    throw { statusCode: 400, message: `role ${role} not found` };
  }
  const rows = await ProjectUser.findAll({
    where: { user_id: userId },
    attributes: [],
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
      {
        model: ProjectUserRole,
        as: "project_user_roles",
        where: { role_id: roleRecord.id },
        attributes: ["id"],
      },
    ],
  });

  const projects = rows?.map((row) => {
    const p = row.project;
    return {
      id: p.id,
      title: p.title,
      description: p.description,
      status: p.status,
      location: p.location?.descriptions || null,
      skills: p.skills?.map((s) => s.name) || [],
      role,
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

const getProjectById = async (projectId, userId = null) => {
  let role = "viewer";

  if (userId) {
    const record = await ProjectUser.findOne({
      where: { project_id: projectId, user_id: userId },
      include: {
        model: ProjectUserRole,
        as: "project_user_roles",
        attributes: ["id"],
        include: {
          model: Role,
          as: "role",
          attributes: ["name"],
        },
      },
    });
    if (record) role = record.project_user_roles[0].role.name;
  }
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
    throw { statusCode: 404, message: "Project not found" };
  }

  return { ...project.toJSON(), role };
};

const getProjectOwner = async (projectId) => {
  if (!projectId) {
    throw { statusCode: 400, message: "projectId is required" };
  }

  const ownerRole = await Role.findOne({
    where: { name: "owner" },
    attributes: ["id"],
  });

  if (!ownerRole) {
    throw { statusCode: 500, message: "owner role not found" };
  }

  const owner = await ProjectUser.findOne({
    attributes: [],
    where: { project_id: projectId },
    include: [
      {
        model: ProjectUserRole,
        as: "project_user_roles",
        where: { role_id: ownerRole.id },
        attributes: [],
      },
      {
        model: User,
        as: "user",
        attributes: ["id", "name", "email"],
      },
    ],
  });

  if (!owner) {
    throw { statusCode: 404, message: "Owner not found for the project" };
  }

  return owner ? owner.user : null;
};

const updateProject = async (projectId, updateData) => {
  const project = await Project.findByPk(projectId);
  if (!project) {
    throw { statusCode: 404, message: "Project not found" };
  }

  await project.update(updateData);
  return project;
};

module.exports = {
  createProject,
  getAllUserProjects,
  getAllProjects,
  getProjectById,
  getProjectOwner,
  updateProject,
};
