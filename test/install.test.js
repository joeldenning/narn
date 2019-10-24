const { getNpmArgs } = require("../lib/narn-lib");

describe("narn install", () => {
  it("defaults to npm install if no args are provided", () => {
    expect(getNpmArgs([])).toEqual(["install"]);
  });

  it("works when install is specified", () => {
    expect(getNpmArgs(["install"])).toEqual(["install"]);
  });
});
