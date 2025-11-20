const {
  createProject,
  getAllProjects,
  getAllUserProjects,
  getProject,
} = require("../src/controllers/project.controller");

const projectService = require("../src/services/project.service");

const { mockRequest, mockResponse } = require("./mocks/mockReqRes");

//mock
jest.mock("../src/services/project.service", () => ({
  createProject: jest.fn(),
  getAllProjects: jest.fn(),
  getAllUserProjects: jest.fn(),
  getProjectById: jest.fn(),
}));

describe("createProject() Unit Test", () => {
  it("should return 400 if required fields missing", async () => {
    const req = mockRequest({ title: "", description: "", location_id: "" }, {}, { id: 1 });
    const res = mockResponse();

    await createProject(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should create project successfully", async () => {
    projectService.createProject.mockResolvedValue({ id: 1 });

    const req = mockRequest(
      {
        title: "My Project",
        description: "Test description",
        location_id: 2,
        status: "open",
        skill_ids: [1, 2],
      },
      {},
      { id: 5 }
    );
    const res = mockResponse();

    await createProject(req, res);

    expect(projectService.createProject).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });
});

describe("getAllProjects() Unit Test", () => {
  it("should return all projects", async () => {
    projectService.getAllProjects.mockResolvedValue([{ id: 1 }, { id: 2 }]);

    const req = mockRequest();
    const res = mockResponse();

    await getAllProjects(req, res);

    expect(projectService.getAllProjects).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });
});

describe("getAllUserProjects() Unit Test", () => {
  it("should return user projects", async () => {
    projectService.getAllUserProjects.mockResolvedValue([{ id: 1 }]);

    const req = mockRequest({}, {}, { id: 99 });
    const res = mockResponse();

    await getAllUserProjects(req, res);

    expect(projectService.getAllUserProjects).toHaveBeenCalledWith(99);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});

describe("getProject() Unit Test", () => {
  it("should return 400 for invalid project id", async () => {
    const req = mockRequest({}, { projectId: "abc" });
    const res = mockResponse();

    await getProject(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return project successfully", async () => {
    projectService.getProjectById.mockResolvedValue({ id: 1 });

    const req = mockRequest({}, { projectId: "5" });
    const res = mockResponse();

    await getProject(req, res);

    expect(projectService.getProjectById).toHaveBeenCalledWith(5);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should return 404 if service throws not found", async () => {
    projectService.getProjectById.mockRejectedValue({
      statusCode: 404,
      message: "Project not found",
    });

    const req = mockRequest({}, { projectId: "5" });
    const res = mockResponse();

    await getProject(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Project not found",
    });
  });
});
