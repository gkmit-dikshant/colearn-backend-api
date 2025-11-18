const {
  applyToProject,
  getMyApplications,
  getProjectApplications,
  updateStatus,
} = require("../src/controllers/application.controller");

const ApplicationService = require("../src/services/application.service");

const { mockRequest, mockResponse } = require("./mocks/mockReqRes");

// mock
jest.mock("../src/services/application.service", () => ({
  applyToProject: jest.fn(),
  getProjectApplications: jest.fn(),
  updateStatus: jest.fn(),
  getMyApplications: jest.fn(),
}));

describe("applyToProject() Unit Test", () => {
  it("should apply to project successfully", async () => {
    ApplicationService.applyToProject.mockResolvedValue({ id: 1 });

    const req = mockRequest({ message: "I want to join" }, { projectId: 10 }, { id: 99 });
    const res = mockResponse();

    await applyToProject(req, res);

    expect(ApplicationService.applyToProject).toHaveBeenCalledWith(99, "10", "I want to join");
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("should return 400 on error", async () => {
    ApplicationService.applyToProject.mockRejectedValue(new Error("Already applied"));

    const req = mockRequest({ message: "Hello" }, { projectId: 10 }, { id: 5 });
    const res = mockResponse();

    await applyToProject(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Already applied",
    });
  });
});

describe("getProjectApplications() Unit Test", () => {
  it("should return applications for a project", async () => {
    ApplicationService.getProjectApplications.mockResolvedValue([{ id: 1 }]);

    const req = mockRequest({}, { projectId: 22 });
    const res = mockResponse();

    await getProjectApplications(req, res);

    expect(ApplicationService.getProjectApplications).toHaveBeenCalledWith("22");
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      applications: [{ id: 1 }],
    });
  });

  it("should return 400 if service throws", async () => {
    ApplicationService.getProjectApplications.mockRejectedValue(new Error("Project not found"));

    const req = mockRequest({}, { projectId: 20 });
    const res = mockResponse();

    await getProjectApplications(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe("updateStatus() Unit Test", () => {
  it("should return 400 for invalid status", async () => {
    const req = mockRequest({ status: "pending" }, { applicationId: 10 });
    const res = mockResponse();

    await updateStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should update application status", async () => {
    ApplicationService.updateStatus.mockResolvedValue({ id: 1, status: "approved" });

    const req = mockRequest({ status: "approved" }, { applicationId: 10 });
    const res = mockResponse();

    await updateStatus(req, res);

    expect(ApplicationService.updateStatus).toHaveBeenCalledWith("10", "approved");
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Application approved",
      application: { id: 1, status: "approved" },
    });
  });

  it("should return 400 on service error", async () => {
    ApplicationService.updateStatus.mockRejectedValue(new Error("Not allowed"));

    const req = mockRequest({ status: "approved" }, { applicationId: 10 });
    const res = mockResponse();

    await updateStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe("getMyApplications() Unit Test", () => {
  it("should return the user's applications", async () => {
    ApplicationService.getMyApplications.mockResolvedValue([{ id: 1 }]);

    const req = mockRequest({}, {}, { id: 7 });
    const res = mockResponse();

    await getMyApplications(req, res);

    expect(ApplicationService.getMyApplications).toHaveBeenCalledWith(7);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      applications: [{ id: 1 }],
    });
  });

  it("should return 400 on error", async () => {
    ApplicationService.getMyApplications.mockRejectedValue(new Error("DB error"));

    const req = mockRequest({}, {}, { id: 7 });
    const res = mockResponse();

    await getMyApplications(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});
