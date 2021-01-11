const { getNpmArgs } = require("../lib/narn-lib");

describe("narn remove", () => {
  it("removes the -- from --patch", () => {
    expect(getNpmArgs(["version", "--patch"])).toEqual(["version", "patch"]);
  });

  it("removes the -- from --minor", () => {
    expect(getNpmArgs(["version", "--minor"])).toEqual(["version", "minor"]);
  });

  it("removes the -- from --major", () => {
    expect(getNpmArgs(["version", "--major"])).toEqual(["version", "major"]);
  });

  it("removes the -- from --prepatch", () => {
    expect(getNpmArgs(["version", "--prepatch"])).toEqual([
      "version",
      "prepatch",
    ]);
  });

  it("removes the -- from --preminor", () => {
    expect(getNpmArgs(["version", "--preminor"])).toEqual([
      "version",
      "preminor",
    ]);
  });

  it("removes the -- from --prerelease", () => {
    expect(getNpmArgs(["version", "--prerelease"])).toEqual([
      "version",
      "prerelease",
    ]);
  });

  it("adds --preid correctly", () => {
    expect(getNpmArgs(["version", "--prerelease", "--preid", "beta"])).toEqual([
      "version",
      "prerelease",
      "--preid",
      "beta",
    ]);
  });
});
