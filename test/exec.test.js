const { getNpmArgs } = require("../lib/narn-lib");

describe("narn exec", () => {
  it("can exec with narn", () => {
    expect(getNpmArgs(["exec", "changeset", "init"])).toEqual([
      "exec",
      "changeset",
      "init",
    ]);
  });
});
