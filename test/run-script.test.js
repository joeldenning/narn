const { getNpmArgs } = require("../lib/narn-lib");

describe(`narn <script>`, () => {
  it(`lets you run scripts with the yarn syntax`, () => {
    expect(getNpmArgs(["build"])).toEqual(["run", "build"]);
  });

  it(`lets you run scripts with the yarn syntax and extra flags`, () => {
    expect(getNpmArgs(["test --watch"])).toEqual([
      "run",
      "test",
      "--",
      "--watch"
    ]);
  });

  it(`lets you run scripts with the yarn syntax and extra flags that narn sometimes knows about`, () => {
    expect(getNpmArgs(["test --dev"])).toEqual(["run", "test", "--", "--dev"]);
  });
});
