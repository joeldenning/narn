const { getNpmArgs } = require("../lib/narn-lib");

describe("narn publish", () => {
  it(`lets you link the current package`, () => {
    expect(getNpmArgs(["link"])).toEqual(["link"]);
  });

  it(`lets you link another package`, () => {
    expect(getNpmArgs(["link", "package-name"])).toEqual([
      "link",
      "package-name",
    ]);
  });

  it(`lets you unlink the current package`, () => {
    expect(getNpmArgs(["unlink"])).toEqual(["unlink"]);
  });

  it(`lets you unlink another package`, () => {
    expect(getNpmArgs(["unlink", "package-name"])).toEqual([
      "unlink",
      "package-name",
    ]);
  });
});
