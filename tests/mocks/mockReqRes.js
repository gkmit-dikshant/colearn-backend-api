function mockResponse() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

function mockRequest(body = {}, params = {}, user = {}) {
  return { body, params, user };
}

module.exports = { mockResponse, mockRequest };
