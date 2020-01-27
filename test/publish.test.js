const { getNpmArgs } = require("../lib/narn-lib");

describe("narn publish", () => {
  it("runs np", () => {
    const expected = [];
    expected.command = "np";
    expect(getNpmArgs(["publish"])).toEqual(expected);
  });
});
