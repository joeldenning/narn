const { detectYarn } = require("../lib/narn-lib");
const fs = require("fs");

jest.mock("fs", () => ({
  access: jest.fn(),
  constants: {
    F_OK: 1
  }
}));

describe("narn global commands", () => {
  beforeEach(() => {
    fs.access.mockReset();
  });

  it("supports installing global packages", async () => {
    const isYarn = await detectYarn(["global", "add", "lodash@1.0.0"]);
    expect(isYarn).toBe(true);
  });

  it("supports uninstalling global packages", async () => {
    const isYarn = await detectYarn(["global", "remove", "lodash"]);
    expect(isYarn).toBe(true);
  });

  it("doesn't think everything is global", async () => {
    fs.access.mockImplementationOnce((path, mode, errBack) => {
      errBack(false);
    });
    const isYarn = await detectYarn(["add", "lodash@1.0.0"]);
    expect(isYarn).toBe(false);
  });
});
