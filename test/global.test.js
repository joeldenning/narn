const { detectNpm } = require("../lib/narn-lib");
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

  it("supports installing global packages", async () => {
    const isNpm = await detectNpm(["global", "add", "lodash@1.0.0"]);
    expect(isNpm).toBe(false);
  });

  it("supports uninstalling global packages", async () => {
    const isNpm = await detectNpm(["global", "remove", "lodash"]);
    expect(isNpm).toBe(false);
  });

  it("doesn't think everything is global", async () => {
    fs.access.mockImplementationOnce((path, mode, errBack) => {
      errBack(false);
    });
    const isNpm = await detectNpm(["add", "lodash@1.0.0"]);
    expect(isNpm).toBe(true);
  });
});
