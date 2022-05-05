const { getNpmArgs } = require("../lib/narn-lib");

describe(`narn <script>`, () => {
  it(`lets you run scripts with the yarn syntax`, () => {
    expect(getNpmArgs(["build"])).toEqual(["run", "build"]);
  });

  it(`lets you run scripts with the yarn syntax and extra flags`, () => {
    expect(getNpmArgs(["test", "--watch"])).toEqual([
      "run",
      "test",
      "--",
      "--watch",
    ]);
  });

  it(`lets you run scripts with the yarn syntax and extra flags that narn sometimes knows about`, () => {
    expect(getNpmArgs(["test", "--dev"])).toEqual([
      "run",
      "test",
      "--",
      "--dev",
    ]);
  });

  // https://github.com/pnpm/pnpm/discussions/4678
  it(`does not add double dashes for pnpm 7`, () => {
    expect(getNpmArgs(["test", "--watch"], true)).toEqual([
      "run",
      "test",
      "--watch",
    ]);
  });
});
