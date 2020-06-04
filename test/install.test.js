const { getNpmArgs } = require("../lib/narn-lib");

describe("narn install", () => {
  it("defaults to npm install if no args are provided", () => {
    expect(getNpmArgs([])).toEqual(["install"]);
  });

  it("works when install is specified", () => {
    expect(getNpmArgs(["install"])).toEqual(["install"]);
  });

  describe("--frozen-lockfile", () => {
    it("works with npm", () => {
      expect(getNpmArgs(["install", "--frozen-lockfile"])).toEqual(["ci"]);
    });

    it("works with pnpm", () => {
      expect(getNpmArgs(["install", "--frozen-lockfile"], true)).toEqual([
        "install",
        "--frozen-lockfile",
      ]);
    });
  });
});
