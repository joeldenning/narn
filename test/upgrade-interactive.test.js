const { getNpmArgs } = require("../lib/narn-lib");

describe("narn upgrade-interactive", () => {
  it("Can run npm update", () => {
    expect(getNpmArgs(["upgrade-interactive"])).toEqual(["update"]);
  });

  it("Can run npm-check-updates for --latest behavior", () => {
    const actual = getNpmArgs(["upgrade-interactive", "--latest"]);
    const expected = ["-iu", "&&", "npm", "install"];
    expected.command = "ncu";
    expect(actual).toEqual(expected);
  });
});
