const { detectNpm, getNpmArgs } = require("../lib/narn-lib");
const fs = require("fs");

jest.mock("fs", () => ({
  access: jest.fn(),
  constants: {
    F_OK: 1,
  },
}));

describe("narn global commands", () => {
  beforeEach(() => {
    fs.access.mockReset();
  });

  it("works for global installations with npm/pnpm", () => {
    expect(getNpmArgs(["global", "add", "create-single-spa"])).toEqual([
      "install",
      "--global",
      "create-single-spa@latest",
    ]);
    expect(getNpmArgs(["global", "remove", "create-single-spa"])).toEqual([
      "uninstall",
      "--global",
      "create-single-spa",
    ]);
  });

  it("doesn't think everything is global", async () => {
    fs.access.mockImplementationOnce((path, mode, errBack) => {
      errBack(false);
    });
    const isNpm = await detectNpm(["add", "lodash@1.0.0"]);
    expect(isNpm).toBe(true);
  });
});
