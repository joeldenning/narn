const { getNpmArgs } = require("../lib/narn-lib");

describe("narn upgrade-interactive", () => {
  it("Can run npm update", () => {
    const expected = ["-iu", "&&", "narn", "install"];
    expected.command = "ncu";
    expect(getNpmArgs(["upgrade-interactive"])).toEqual(expected);
  });

  it("Can run npm-check-updates for --latest behavior", () => {
    const expected = ["-iu", "&&", "narn", "install"];
    expected.command = "ncu";
    expect(getNpmArgs(["upgrade-interactive", "--latest"])).toEqual(expected);
  });

  it("Detects pnpm update interactive", () => {
    const expected = ["update", "-i", "--latest"];
    expected.command = "pnpm";
    expect(getNpmArgs(["upgrade-interactive", "--latest"], true));
  });
});
