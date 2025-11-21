const { projectService } = require("../services");

const createProject = async (req, res, next) => {
  try {
    const { title, description, location_id, status, skills } = req.body;

    const project = await projectService.createProject({
      title,
      owner_id: req.user.id,
      description,
      location_id,
      status,
      skills,
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
      error,
    });
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
    return res.status(statusCode || 500).json({
      success: false,
      message: error.message,
      error,
    });
  }
};

const getAllUserProjects = async (req, res, next) => {
  try {
    const projects = await projectService.getAllUserProjects(req.user.id, req.query.role);

    res.status(200).json({
      success: true,
      message: "Projects retrieved successfully",
      projects,
      count: projects.length,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
      error,
    });
  }
};

const getProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    if (!projectId || isNaN(projectId)) {
      return { statusCode: 400, message: "Valid project ID is required" };
    }

    const project = await projectService.getProjectById(parseInt(projectId), req.user?.id);

    res.status(200).json({
      success: true,
      message: "Project retrieved successfully",
      project,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { title, description, status, skills } = req.body;

    if (!projectId || isNaN(projectId)) {
      return { statusCode: 400, message: "Valid project ID is required" };
    }

    const updatedProject = await projectService.updateProject(parseInt(projectId), {
      title,
      description,
      status,
      skills,
    });

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
      error,
    });
  }
};

const getProjectMembers = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    if (!projectId || isNaN(projectId)) {
      return { statusCode: 400, message: "Valid project ID is required" };
    }

    const members = await projectService.getProjectMembers(parseInt(projectId));

    res.status(200).json({
      success: true,
      message: "Project members retrieved successfully",
      members,
      count: members.length,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
      error,
    });
  }
};

module.exports = {
  createProject,
  getAllProjects,
  getAllUserProjects,
  getProject,
  updateProject,
  getProjectMembers,
};
