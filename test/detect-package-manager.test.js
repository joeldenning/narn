const { detectNpm, detectPnpm } = require("../lib/narn-lib");
const fs = require("fs");

jest.mock("fs", () => ({
  access: jest.fn(),
  constants: {
    F_OK: 1
  }
}));

describe("package manager detection", () => {
  beforeEach(() => {
    fs.access.mockReset();
  });

  it("properly detects pnpm packages", async () => {
    fs.access.mockImplementationOnce((path, mode, errBack) => {
      if (path.includes("pnpm-lock.yaml")) {
        errBack(false);
      } else {
        errBack(true);
      }
    });
    const isPnpm = await detectPnpm(["add", "lodash@1.0.0"]);
    expect(isPnpm).toBe(true);
  });

  it("properly detects pnpm packages", async () => {
    fs.access.mockImplementationOnce((path, mode, errBack) => {
      if (path.includes("package-lock.json")) {
        errBack(false);
      } else {
        errBack(true);
      }
    });
    const isNpm = await detectNpm(["add", "lodash@1.0.0"]);
    expect(isNpm).toBe(true);
  });
});
