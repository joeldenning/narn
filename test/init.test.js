const { getNpmArgs } = require("../lib/narn-lib");

describe("narn init", () => {
  it("can init with narn", () => {
    expect(getNpmArgs(["init"])).toEqual(["init"]);
  });
});
