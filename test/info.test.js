const { getNpmArgs } = require("../lib/narn-lib");

describe("narn info", () => {
  it("can lookup package info", () => {
    expect(getNpmArgs(["info", "single-spa"])).toEqual(["info", "single-spa"]);
  });
});
