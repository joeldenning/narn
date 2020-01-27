const { getNpmArgs } = require("../lib/narn-lib");

describe("narn upgrade-interactive", () => {
  it("Can run npm update", () => {
    expect(getNpmArgs(["upgrade-interactive"])).toEqual(["update"]);
  });

  it("Can run npm-check-updates for --latest behavior", () => {
    expect(getNpmArgs(["upgrade-interactive", "--latest"])).toEqual([
      "ncu",
      "-iu",
      "&&",
      "npm",
      "install"
    ]);
  });
});
