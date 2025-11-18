const { authService } = require("../src/services");

const {
  signup,
  verifyOtp,
  login,
  sendAccessToken,
  getLoginUserDetails,
} = require("../src/controllers/auth.controller");

const client = require("../src/config/redis");
const emailHelper = require("../src/utils/email.helper");

const { createOtp, createJwtToken, verifyJwtToken } = require("../src/utils/helper");

const { mockRequest, mockResponse } = require("./mocks/mockReqRes");

jest.mock("../src/config/redis", () => ({
  set: jest.fn(),
  get: jest.fn(),
  del: jest.fn(),
}));

jest.mock("../src/utils/email.helper", () => ({
  send: jest.fn(),
}));

jest.mock("../src/services", () => ({
  authService: {
    signup: jest.fn(),
    login: jest.fn(),
    getUserDetails: jest.fn(),
  },
}));

jest.mock("../src/utils/helper", () => ({
  createOtp: jest.fn(),
  createJwtToken: jest.fn(),
  verifyJwtToken: jest.fn(),
}));

describe("signup() Unit Test", () => {
  it("should store OTP in redis and send email", async () => {
    createOtp.mockReturnValue("123456");
    client.set.mockResolvedValue();
    emailHelper.send.mockResolvedValue();

    const req = mockRequest({ name: "John", email: "john@test.com" });
    const res = mockResponse();

    await signup(req, res);

    expect(client.set).toHaveBeenCalled();
    expect(emailHelper.send).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });
});

describe("verifyOtp() Unit Test", () => {
  it("should verify OTP and create user", async () => {
    client.get.mockResolvedValue(
      JSON.stringify({
        otp: "123456",
        name: "John",
        email: "john@test.com",
        password: "pass",
        bio: "bio",
      })
    );

    client.del.mockResolvedValue();
    authService.signup.mockResolvedValue({ id: 1, email: "john@test.com" });
    createJwtToken.mockReturnValue("fake-token");

    const req = mockRequest({ email: "john@test.com", otp: "123456" });
    const res = mockResponse();

    await verifyOtp(req, res);

    expect(authService.signup).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });
});

describe("login() Unit Test", () => {
  it("should login and return tokens", async () => {
    authService.login.mockResolvedValue({ id: 1 });
    createJwtToken.mockReturnValue("token");

    const req = mockRequest({ email: "test@test.com", password: "123" });
    const res = mockResponse();

    await login(req, res);

    expect(authService.login).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });
});

describe("sendAccessToken() Unit Test", () => {
  it("should send new access token", async () => {
    verifyJwtToken.mockReturnValue({ email: "john@test.com" });
    createJwtToken.mockReturnValue("access-token");

    const req = mockRequest({
      email: "john@test.com",
      refreshToken: "xyz",
    });
    const res = mockResponse();

    await sendAccessToken(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });
});

describe("getLoginUserDetails() Unit Test", () => {
  it("should return user details", async () => {
    authService.getUserDetails.mockResolvedValue({ id: 1, name: "John" });

    const req = mockRequest({}, {}, { id: 1 });
    const res = mockResponse();

    await getLoginUserDetails(req, res);

    expect(authService.getUserDetails).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
