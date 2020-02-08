const { getNpmArgs } = require("../lib/narn-lib");

describe("narn create", () => {
  it("can run create-single-spa package with npm", () => {
    expect(getNpmArgs(["create", "single-spa"])).toEqual([
      "init",
      "single-spa"
    ]);
  });

  it("can run a create-thing package with pnpm", () => {
    expect(getNpmArgs(["create", "single-spa"], true)).toEqual([
      "init",
      "single-spa"
    ]);
  });
});
