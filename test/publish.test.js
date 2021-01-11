const { getNpmArgs } = require("../lib/narn-lib");

describe("narn publish", () => {
  afterEach(() => {
    delete process.env.NARN_PUBLISH;
  });

  it("runs np", () => {
    const expected = [];
    expected.command = "np";
    expect(getNpmArgs(["publish"])).toEqual(expected);
  });

  it("doesn't run np with correct env set", () => {
    process.env.NARN_PUBLISH = "passthrough";
    expect(getNpmArgs(["publish"])).toEqual(["publish"]);
  });
});
