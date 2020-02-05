const { detectNpm, detectPnpm } = require("../lib/narn-lib");
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
    const args = ["global", "add", "lodash@1.0.0"];
    const [isNpm, isPnpm] = await Promise.all([
      detectNpm(args),
      detectPnpm(args)
    ]);
    const isYarn = !(isNpm || isPnpm);
    expect(isYarn).toBe(true);
  });

  it("supports uninstalling global packages", async () => {
    const args = ["global", "remove", "lodash"];
    const [isNpm, isPnpm] = await Promise.all([
      detectNpm(args),
      detectPnpm(args)
    ]);
    const isYarn = !(isNpm || isPnpm);

    expect(isYarn).toBe(true);
  });

  it("doesn't think everything is global", async () => {
    fs.access
      .mockImplementationOnce((path, mode, errBack) => {
        errBack(false);
      })
      .mockImplementationOnce((path, mode, errBack) => {
        errBack(false);
      });

    const args = ["add", "lodash@1.0.0"];
    const [isNpm, isPnpm] = await Promise.all([
      detectNpm(args),
      detectPnpm(args)
    ]);
    const isYarn = !(isNpm || isPnpm);

    expect(isYarn).toBe(false);
  });
});
