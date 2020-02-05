const { getNpmArgs } = require("../lib/narn-lib");

describe("narn install", () => {
  it("detects update/upgrade command", () => {
    expect(getNpmArgs(["update", "lodash"])).toEqual(["update", "lodash"]);
    expect(getNpmArgs(["upgrade", "lodash"])).toEqual(["update", "lodash"]);
  });
});
