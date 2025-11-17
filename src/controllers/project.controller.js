const projectService = require("../services/project.service");

const createProject = async (req, res, next) => {
  try {
    const { title, description, location_id, status, skill_ids } = req.body;

    if (!title || !description || !location_id) {
      return res.status(400).json({
        success: false,
        message: "Title, description, and location_id are required",
      });
    }

    const project = await projectService.createProject({
      title,
      owner_id: req.user.id,
      description,
      location_id,
      status,
      skill_ids,
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    next(error);
  }
};

const getAllProjects = async (req, res, next) => {
  try {
    const projects = await projectService.getAllProjects();

    res.status(200).json({
      success: true,
      message: "Projects retrieved successfully",
      projects,
      count: projects.length,
    });
  } catch (error) {
    next(error);
  }
};

const getAllUserProjects = async (req, res, next) => {
  try {
    const projects = await projectService.getAllUserProjects(req.user.id);

    res.status(200).json({
      success: true,
      message: "Projects retrieved successfully",
      projects,
      count: projects.length,
    });
  } catch (error) {
    next(error);
  }
};

const getProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    if (!projectId || isNaN(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Valid project ID is required",
      });
    }

    const project = await projectService.getProjectById(parseInt(projectId));

    res.status(200).json({
      success: true,
      message: "Project retrieved successfully",
      project,
    });
  } catch (error) {
    if (error.statusCode === 404) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

module.exports = {
  createProject,
  getAllProjects,
  getAllUserProjects,
  getProject,
};
