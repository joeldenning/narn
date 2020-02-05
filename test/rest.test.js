const { getNpmArgs } = require("../lib/narn-lib");

describe("narn install", () => {
  it("detects when a non-run-script command without further changes needed is recognized", () => {
    expect(getNpmArgs(["list"])).toEqual(["list"]);
    expect(getNpmArgs(["list", "--production"])).toEqual([
      "list",
      "--production"
    ]);
    expect(getNpmArgs(["prune"])).toEqual(["prune"]);
    expect(getNpmArgs(["version"])).toEqual(["version"]);
  });
});
