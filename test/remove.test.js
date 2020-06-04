const { getNpmArgs } = require("../lib/narn-lib");

describe("narn remove", () => {
  it("removes packages", () => {
    expect(getNpmArgs(["remove", "@angular/cli", "@angular/core"])).toEqual([
      "uninstall",
      "@angular/cli",
      "@angular/core",
    ]);
  });
});
